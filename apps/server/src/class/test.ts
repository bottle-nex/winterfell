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

    // Anchor.toml - FIXED: Proper key-value format
    {
        path: 'Anchor.toml',
        content: `[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.localnet]
<PROJECT_NAME> = "<PROGRAM_ID>"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"`,
    },

    // package.json
    {
        path: 'package.json',
        content: `{
  "license": "ISC",
  "scripts": {
    "lint:fix": "prettier */*.js \\"*/**/*{.js,.ts}\\" -w",
    "lint": "prettier */*.js \\"*/**/*{.js,.ts}\\" --check"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.32.1"
  },
  "devDependencies": {
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "ts-mocha": "^10.0.0",
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "typescript": "^5.7.3",
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
    "esModuleInterop": true
  }
}`,
    },

    // rust-toolchain.toml
    {
        path: 'rust-toolchain.toml',
        content: `[toolchain]
channel = "1.89.0"
components = ["rustfmt","clippy"]
profile = "minimal"`,
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
default = []
cpi = ["no-entrypoint"]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
idl-build = ["anchor-lang/idl-build"]
anchor-debug = []
custom-heap = []
custom-panic = []

[dependencies]
anchor-lang = "0.32.1"

[lints.rust]
unexpected_cfgs = { level = "warn", check-cfg = ['cfg(target_os, values("solana"))'] }`,
    },

    // ============================================
    // PROGRAM SOURCE (PLACEHOLDER - LLM OVERWRITES)
    // ============================================

    // lib.rs
    {
        path: 'programs/<PROJECT_NAME>/src/lib.rs',
        content: `use anchor_lang::prelude::*;

declare_id!("<PROGRAM_ID>");

#[program]
pub mod <PROJECT_NAME> {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}`,
    },

    // ============================================
    // MIGRATIONS
    // ============================================

    // migrations/deploy.ts
    {
        path: 'migrations/deploy.ts',
        content: `// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import * as anchor from "@coral-xyz/anchor";

module.exports = async function (provider: anchor.AnchorProvider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  // Add your deploy script here.
};`,
    },

    // ============================================
    // TESTS (PLACEHOLDER - LLM OVERWRITES)
    // ============================================

    // tests/<PROJECT_NAME>.ts
    {
        path: 'tests/<PROJECT_NAME>.ts',
        content: `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { <PROJECT_NAME_PASCAL> } from "../target/types/<PROJECT_NAME>";

describe("<PROJECT_NAME>", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.<PROJECT_NAME_CAMEL> as Program<<PROJECT_NAME_PASCAL>>;

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

export function toCamelCase(projectName: string): string {
    const pascal = toPascalCase(projectName);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// FIXED: Added validation and better error handling
export function prepareBaseTemplate(projectName: string, programId?: string): FileContent[] {
    // Validate project name
    if (!projectName || projectName.trim() === '') {
        throw new Error('Project name cannot be empty');
    }

    // Clean project name (remove special chars, spaces)
    const cleanProjectName = projectName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_');

    const finalProgramId = programId || generateProgramId();
    const pascalCaseName = toPascalCase(cleanProjectName);
    const camelCaseName = toCamelCase(cleanProjectName);

    return ANCHOR_BASE_TEMPLATE.map((file) => {
        const updatedPath = file.path.replace(/<PROJECT_NAME>/g, cleanProjectName);
        const updatedContent = file.content
            .replace(/<PROJECT_NAME>/g, cleanProjectName)
            .replace(/<PROJECT_NAME_PASCAL>/g, pascalCaseName)
            .replace(/<PROJECT_NAME_CAMEL>/g, camelCaseName)
            .replace(/<PROGRAM_ID>/g, finalProgramId);

        return {
            path: updatedPath,
            content: updatedContent,
        };
    });
}

// FIXED: Better merging logic with path normalization
export function mergeWithLLMFiles(
    baseFiles: FileContent[],
    llmFiles: FileContent[],
): FileContent[] {
    // Normalize paths (remove leading/trailing slashes, normalize separators)
    const normalizePath = (path: string) => {
        return path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    };

    // Create a map of normalized LLM file paths
    const llmPathMap = new Map(llmFiles.map((f) => [normalizePath(f.path), f]));

    // Filter base files, excluding those that LLM has generated
    const filteredBase = baseFiles.filter((f) => {
        const normalizedPath = normalizePath(f.path);
        return !llmPathMap.has(normalizedPath);
    });

    // Combine: base files (without duplicates) + all LLM files
    return [...filteredBase, ...llmFiles];
}

// OPTIONAL: Add a debug function to help troubleshoot
export function debugFileStructure(files: FileContent[]): void {
    console.log('=== File Structure ===');
    const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));
    sorted.forEach((f) => {
        console.log(`📄 ${f.path}`);
    });
    console.log('=====================');
}
