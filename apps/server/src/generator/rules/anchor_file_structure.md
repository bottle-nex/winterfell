## FOLDER STRUCTURE TO FOLLOW

/migrations └── deploy.ts /programs └── [program_name] └── src ├── lib.rs ├── constants.rs (if
needed) ├── errors │ ├── mod.rs │ └── error_codes.rs ├── state │ ├── mod.rs │ └── [state_name].rs
├── instructions │ ├── mod.rs │ └── [instruction_name].rs └── utils (if needed) ├── mod.rs └──
[utility_name].rs /tests └── [program_name].ts .gitignore .prettierignore Anchor.toml Cargo.toml
package.json tsconfig.json

## CRITICAL FILE PATHS TO GENERATE

-   Main program: `programs/[program_name]/src/lib.rs`
-   State module: `programs/[program_name]/src/state/mod.rs`
-   State files: `programs/[program_name]/src/state/[state_name].rs`
-   Instructions module: `programs/[program_name]/src/instructions/mod.rs`
-   Instruction files: `programs/[program_name]/src/instructions/[instruction_name].rs`
-   Errors module: `programs/[program_name]/src/errors/mod.rs`
-   Errors file: `programs/[program_name]/src/errors/error_codes.rs`
-   Tests: `tests/[program_name].ts`

## DO NOT GENERATE

-   Cargo.toml (root)
-   Anchor.toml
-   package.json
-   tsconfig.json
-   rust-toolchain.toml
-   .gitignore
-   .prettierignore
-   migrations/deploy.ts
-   programs/[program_name]/Cargo.toml
-   programs/[program_name]/Xargo.toml
