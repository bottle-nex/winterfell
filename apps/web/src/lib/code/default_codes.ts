// lib.rs file data
export const lib_rs = `use anchor_lang::prelude::*;

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
`;

// test file data
export const my_program_ts = `import * as anchor from "@coral-xyz/anchor";
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
`;

// cargo.toml file data
export const cargo_toml = `[package]
name = "my_program"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "my_program"

[dependencies]
anchor-lang = "0.29.0"
`;

// anchor.toml file data
export const anchor_toml = `[programs.localnet]
my_program = "YourProgramID1111111111111111111111111111111"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "npm run test"
`;
