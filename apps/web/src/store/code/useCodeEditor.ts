import debounce from '@/src/lib/debounce';
import CodeEditorServer from '@/src/lib/server/code-editor-server';
import { FileNode, NODE } from '@/src/types/prisma-types';
import { create } from 'zustand';

interface CodeEditorState {
    currentCode: string;
    currentFile: FileNode | null;
    fileTree: FileNode[];

    setCurrentCode: (code: string) => void;
    updateFileContent: (fileId: string, content: string) => void;
    selectFile: (node: FileNode) => void;
}

export const useCodeEditor = create<CodeEditorState>((set, get) => {
    const debouncedSync = debounce(async (files: FileNode[]) => {
        await CodeEditorServer.syncFiles(files, 'pass-the-token-here');
        console.log(
            'Logging the files',
            files.map((f) => f.name),
        );
    }, 1500);

    return {
        currentCode: '',
        currentFile: null,
        fileTree: [
            {
                id: 'root',
                name: 'root',
                type: NODE.FOLDER,
                children: [
                    {
                        id: 'root',
                        name: 'my-anchor-project',
                        type: NODE.FOLDER,
                        children: [
                            {
                                id: 'programs',
                                name: 'programs',
                                type: NODE.FOLDER,
                                children: [
                                    {
                                        id: 'my_program',
                                        name: 'my_program',
                                        type: NODE.FOLDER,
                                        children: [
                                            {
                                                id: 'src',
                                                name: 'src',
                                                type: NODE.FOLDER,
                                                children: [
                                                    {
                                                        id: 'lib_rs',
                                                        name: 'lib.rs',
                                                        type: NODE.FILE,
                                                        content: `use anchor_lang::prelude::*;

declare_id!("YourProgramID1111111111111111111111111111111");

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BaseAccount {
    pub data: u64,
}
`,
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'cargo_toml',
                                                name: 'Cargo.toml',
                                                type: NODE.FILE,
                                                content: `[package]
name = "my_program"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "my_program"

[dependencies]
anchor-lang = "0.29.0"
`,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: 'tests',
                                name: 'tests',
                                type: NODE.FOLDER,
                                children: [
                                    {
                                        id: 'my_program_test',
                                        name: 'my_program.ts',
                                        type: NODE.FILE,
                                        content: `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProgram } from "../target/types/my_program";

describe("my_program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MyProgram as Program<MyProgram>;

  it("Initialize!", async () => {
    const baseAccount = anchor.web3.Keypair.generate();

    const tx = await program.methods.initialize(new anchor.BN(1234))
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([baseAccount])
      .rpc();

    
  });
});
`,
                                    },
                                ],
                            },
                            {
                                id: 'anchor_toml',
                                name: 'Anchor.toml',
                                type: NODE.FILE,
                                content: `[programs.localnet]
my_program = "YourProgramID1111111111111111111111111111111"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "npm run test"
`,
                            },
                        ],
                    },
                ],
            },
        ],

        setCurrentCode: (code: string) => {
            set({ currentCode: code });
        },

        updateFileContent: (fileId: string, content: string) => {
            const { fileTree } = get();

            const updateTree = (nodes: FileNode[]): FileNode[] =>
                nodes.map((n) =>
                    n.id === fileId
                        ? { ...n, content }
                        : n.children
                            ? { ...n, children: updateTree(n.children) }
                            : n,
                );
            
            const updatedTree = updateTree(fileTree);
            set({ fileTree: updatedTree });

            const updatedFile = findFileById(updatedTree, fileId);
            if(updatedFile) debouncedSync([updatedFile]);
        },

        selectFile: (node: FileNode) => {
            if (node.type === NODE.FILE) {
                set({
                    currentFile: node,
                    currentCode: node.content,
                });
            }
        },
    };
});

function findFileById(nodes: FileNode[], id: string): FileNode | null {
    for (const node of nodes) {
        if (node.id === id) return node;

        if (node.children) {
            const found = findFileById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}
