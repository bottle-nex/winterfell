import { FileContent } from '../types/content_types';

export const ANCHOR_BASE_TEMPLATE: FileContent[] = [
    // ============================================
    // ROOT CONFIGURATION FILES
    // ============================================

    // Workspace Cargo.toml
    {
        path: 'Cargo.toml',
        content: `[workspace]
members = [
    "programs/*"
]
resolver = "2"

[profile.release]
overflow-checks = true
lto = "fat"
codegen-units = 1

[profile.release.build-override]
opt-level = 3
incremental = false
codegen-units = 1`,
    },

    // Anchor.toml
    {
        path: 'Anchor.toml',
        content: `[features]
seeds = false
skip-lint = false

[programs.localnet]
<PROJECT_NAME> = "<PROGRAM_ID>"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"`,
    },

    // package.json
    {
        path: 'package.json',
        content: `{
  "name": "<PROJECT_NAME>",
  "version": "0.1.0",
  "license": "MIT",
  "scripts": {
    "lint:fix": "prettier */*.js \\"*/**/*{.js,.ts}\\" -w",
    "lint": "prettier */*.js \\"*/**/*{.js,.ts}\\" --check"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.30.1"
  },
  "devDependencies": {
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "ts-mocha": "^10.0.0",
    "typescript": "^4.3.5",
    "prettier": "^2.6.2"
  }
}`,
    },

    // tsconfig.json
    {
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "types": ["mocha", "chai"],
    "typeRoots": ["./node_modules/@types"],
    "lib": ["es2015"],
    "module": "commonjs",
    "target": "es6",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": false
  }
}`,
    },

    // .gitignore
    {
        path: '.gitignore',
        content: `.anchor
.DS_Store
target
**/*.rs.bk
node_modules
test-ledger
.yarn`,
    },

    // .prettierignore
    {
        path: '.prettierignore',
        content: `.anchor
.DS_Store
target
node_modules
dist
build
test-ledger`,
    },

    // ============================================
    // PROGRAM CONFIGURATION
    // ============================================

    // Program Cargo.toml
    {
        path: 'programs/<PROJECT_NAME>/Cargo.toml',
        content: `[package]
name = "<PROJECT_NAME>"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "<PROJECT_NAME>"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.30.1"`,
    },

    // ============================================
    // PROGRAM SOURCE (PLACEHOLDER - LLM OVERWRITES)
    // ============================================

    // lib.rs - Minimal placeholder
    {
        path: 'programs/<PROJECT_NAME>/src/lib.rs',
        content: `use anchor_lang::prelude::*;

declare_id!("<PROGRAM_ID>");

#[program]
pub mod <PROJECT_NAME> {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}`,
    },

    // ============================================
    // MIGRATIONS
    // ============================================

    {
        path: 'migrations/deploy.ts',
        content: `// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

const anchor = require("@coral-xyz/anchor");

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  // Add your deploy script here.
};`,
    },

    // ============================================
    // TESTS (PLACEHOLDER - LLM OVERWRITES)
    // ============================================

    {
        path: 'tests/<PROJECT_NAME>.ts',
        content: `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { <PROJECT_NAME_PASCAL> } from "../target/types/<PROJECT_NAME>";

describe("<PROJECT_NAME>", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.<PROJECT_NAME_PASCAL> as Program<<PROJECT_NAME_PASCAL>>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});`,
    },
];

export function generateProgramId(): string {
    return 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS';
}

export function toPascalCase(projectName: string): string {
    return projectName
        .split(/[-_]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

export function prepareBaseTemplate(projectName: string, programId?: string): FileContent[] {
    const finalProgramId = programId || generateProgramId();
    const pascalCaseName = toPascalCase(projectName);

    return ANCHOR_BASE_TEMPLATE.map((file) => ({
        path: file.path.replace(/<PROJECT_NAME>/g, projectName),
        content: file.content
            .replace(/<PROJECT_NAME>/g, projectName)
            .replace(/<PROJECT_NAME_PASCAL>/g, pascalCaseName)
            .replace(/<PROGRAM_ID>/g, finalProgramId),
    }));
}

export function mergeWithLLMFiles(
    baseFiles: FileContent[],
    llmFiles: FileContent[],
): FileContent[] {
    const llmPathSet = new Set(llmFiles.map((f) => f.path));

    const filteredBase = baseFiles.filter((f) => !llmPathSet.has(f.path));

    return [...filteredBase, ...llmFiles];
}
