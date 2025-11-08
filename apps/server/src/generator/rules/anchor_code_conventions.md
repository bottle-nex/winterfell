
## CODE CONVENTION TO MUST FOLLOW FOR [lib.rs]
- `declare_id!()` with provided programId
- `#[program]` functions only delegate to instruction handlers
- NO account definitions
- NO business logic
- Imports instruction contexts

## EXAMPLE PATTERN FOR [lib.rs]
```rust
use anchor_lang::prelude::*;

declare_id!("${programId}");

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod [program_name] {
    use super::*;

    pub fn instruction_name(ctx: Context<InstructionContextName>, params...) -> Result<()> {
        instructions::instruction_name::handler(ctx, params...)
    }
}
```rust

## CODE CONVENTION TO MUST FOLLOW FOR [instructions/[instruction].rs]
- One file per instruction
- Each must contain [derive(Accounts)] Context struct
- Context must be uniquely named
- Handler must accept Context<ContextStruct>

## EXAMPLE PATTER FOR [instructions/[instruction].rs]
```rust
use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub fn handler(ctx: Context<UniqueContextName>, params...) -> Result<()> {
    // logic
}

pub struct UniqueContextName<'info> {
    // accounts
}
```rust

## CODE CONVENTION TO MUST FOLLOW FOR [states/[state].rs]
- only structs annotated with #[account]
- Each struct in separate file
