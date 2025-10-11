import { Request, Response } from "express";
import { prisma } from "@repo/database";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert Solana Anchor framework developer.

When a user asks for a smart contract, generate complete, production-ready Rust code using Anchor.

Rules:
- Always wrap code in \`\`\`rust ... \`\`\`
- Include all necessary imports
- Add clear comments
- Follow Anchor best practices
- Include error handling
- Use proper Anchor macros: #[program], #[derive(Accounts)], etc.

Example output format:
\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod my_contract {
    use super::*;
    // ... contract code
}
\`\`\`

Always explain what the contract does before showing the code.`;

export default async function startChatController(req: Request, res: Response) {
  // Auth check
  if (!req.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const chatId = req.query.chatId as string;
  const userMessage = req.body.message as string;

  // Validation
  if (!chatId || typeof chatId !== "string") {
    return res.status(400).json({ error: "Invalid chatId" });
  }

  if (
    !userMessage ||
    typeof userMessage !== "string" ||
    userMessage.trim().length === 0
  ) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // 1. Find the chat and verify ownership
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 20, // Last 20 messages for context
        },
        contract: true,
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.userId !== String(req.user.id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 2. Save user's message
    const savedUserMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "USER",
        content: userMessage,
      },
    });

    // 3. Setup SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Send initial confirmation
    res.write(
      `data: ${JSON.stringify({ type: "start", messageId: savedUserMessage.id })}\n\n`,
    );

    // 4. Build conversation history for Claude
    const messages: Anthropic.MessageParam[] = chat.messages.map((msg) => ({
      role: msg.role === "USER" ? "user" : "assistant",
      content: msg.content,
    }));

    // Add current message
    messages.push({
      role: "user",
      content: userMessage,
    });

    // 5. Stream from Claude
    let fullResponse = "";
    let hasError = false;

    try {
      const stream = await anthropic.messages.stream({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: messages,
      });

      // Stream chunks to frontend
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          const content = chunk.delta.text;
          fullResponse += content;

          // Send chunk to frontend
          res.write(
            `data: ${JSON.stringify({
              type: "chunk",
              content: content,
            })}\n\n`,
          );
        }
      }
    } catch (llmError: any) {
      console.error("LLM Error:", llmError);
      hasError = true;

      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message: "Failed to generate response from AI",
        })}\n\n`,
      );
    }

    if (hasError) {
      res.end();
      return;
    }

    // 6. Save AI response
    const aiMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "AI",
        content: fullResponse,
      },
    });

    // 7. Extract Rust code
    const rustCode = extractRustCode(fullResponse);

    if (rustCode) {
      // 8. Update or create contract
      const updatedContract = await prisma.contract.update({
        where: { id: chat.contractId },
        data: {
          code: rustCode,
          summary: generateSummary(fullResponse, rustCode),
          version: { increment: 1 },
          updatedAt: new Date(),
        },
      });

      // 9. Send completion event
      res.write(
        `data: ${JSON.stringify({
          type: "complete",
          contractId: updatedContract.id,
          messageId: aiMessage.id,
          hasCode: true,
          version: updatedContract.version,
        })}\n\n`,
      );
    } else {
      // No code found, just complete the message
      res.write(
        `data: ${JSON.stringify({
          type: "complete",
          messageId: aiMessage.id,
          hasCode: false,
        })}\n\n`,
      );
    }

    res.end();
  } catch (error: any) {
    console.error("Chat controller error:", error);

    // Try to send error via SSE if headers already sent
    if (res.headersSent) {
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message: error.message || "An error occurred",
        })}\n\n`,
      );
      res.end();
    } else {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
}

// Helper: Extract Rust code from markdown
function extractRustCode(text: string): string | null {
  // Match ```rust ... ``` code blocks
  const rustMatch = text.match(/```rust\n([\s\S]*?)```/);
  if (rustMatch) {
    return rustMatch[1].trim();
  }

  // Fallback: try any code block
  const codeMatch = text.match(/```\n([\s\S]*?)```/);
  if (codeMatch) {
    return codeMatch[1].trim();
  }

  return null;
}

// Helper: Generate a summary from AI response
function generateSummary(fullResponse: string, code: string): string {
  // Extract first paragraph before code block
  const beforeCode = fullResponse.split("```")[0].trim();
  const lines = beforeCode.split("\n").filter((line) => line.trim().length > 0);

  // Take first 2-3 sentences
  const summary = lines.slice(0, 3).join(" ");

  return summary.length > 200 ? summary.slice(0, 200) + "..." : summary;
}
