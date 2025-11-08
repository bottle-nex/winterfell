
## EXAMPLE FLOW

<name>token_escrow</name>

<context>
Building a token escrow contract with initialize_escrow and complete_escrow instructions.
</context>

<stage>Planning</stage>
I will create a token escrow contract with two main instructions...

<stage>Generating Code</stage>
<phase>thinking</phase>
<phase>generating</phase>

<file>programs/token_escrow/src/lib.rs</file>
\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("${programId}");

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod token_escrow {
    use super::*;

    pub fn initialize_escrow(ctx: Context<initialize_escrow::InitializeEscrow>, amount: u64) -> Result<()> {
        instructions::initialize_escrow::handler(ctx, amount)
    }
    
    pub fn complete_escrow(ctx: Context<complete_escrow::CompleteEscrow>) -> Result<()> {
        instructions::complete_escrow::handler(ctx)
    }
}
\`\`\`

<file>programs/token_escrow/src/state/mod.rs</file>
\`\`\`rust
pub mod escrow;
pub use escrow::*;
\`\`\`

<file>programs/token_escrow/src/state/escrow.rs</file>
\`\`\`rust
use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub amount: u64,
}
\`\`\`

<file>programs/token_escrow/src/instructions/mod.rs</file>
\`\`\`rust
pub mod initialize_escrow;
pub mod complete_escrow;
\`\`\`

<file>programs/token_escrow/src/instructions/initialize_escrow.rs</file>
\`\`\`rust
use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeEscrow>, amount: u64) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    escrow.amount = amount;
    Ok(())
}
\`\`\`

<file>programs/token_escrow/src/instructions/complete_escrow.rs</file>
\`\`\`rust
use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct CompleteEscrow<'info> {
    #[account(mut, close = user)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub user: Signer<'info>,
}

pub fn handler(ctx: Context<CompleteEscrow>) -> Result<()> {
    Ok(())
}
\`\`\`

<file>programs/token_escrow/src/errors/mod.rs</file>
\`\`\`rust
use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowError {
    #[msg("Invalid amount")]
    InvalidAmount,
}
\`\`\`

<file>tests/token_escrow.ts</file>
\`\`\`typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TokenEscrow } from "../target/types/token_escrow";

describe("token_escrow", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.TokenEscrow as Program<TokenEscrow>;

  it("Initializes escrow", async () => {
    // test code
  });
});
\`\`\`

<phase>complete</phase>

<stage>Building</stage>

Compiling the program...

<stage>Creating Files</stage>

Writing files to disk...

<stage>Finalizing</stage>

All files created successfully.

<context>
Successfully created token_escrow contract with modular structure and complete implementation.
</context>

Now generate the complete Anchor project based on the user's request.`;
