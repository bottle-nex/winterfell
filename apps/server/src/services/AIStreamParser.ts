import { Response } from "express";
import { CodeBlock, ContextData, FileNode, FileStructure, StatusUpdate, StreamEvent, StreamEventType } from "../types/streamTypes";
import { lowercase } from "zod";

export class AIStreamParser {
    private buffer: string = '';
    private contextSent: boolean = false;
    private codeBlocksSent: Set<string> = new Set();
    private lastMessageLength: number = 0;

    private readonly PATTERNS = {
        context: /\/:\s*~\s*([^~]+)\s*~:\//g,
        codeBlock: /```(\w+)?\n([\s\S]*?)```/g,
        incompleteCodeBlock: /```(\w+)?\n([\s\S]*?)$/,
    };

    constructor() { };

    public process_chunk(chunk: string, res: Response) {
        this.buffer += chunk;

        try {
            if (!this.contextSent) {
                this.extract_and_send_context(res);
            }

            this.extract_and_send_code_blocks(res);
            this.send_message_chunk(res);
            this.send_status(res);
        } catch (error) {
            console.error('Error in processding chunk', error);
            // add nocturn err msg here
        }
    }

    public finalize_and_send_file_structure(res: Response, fullResponse: string): void {
        try {
            const fileStructure = this.build_file_structure(fullResponse);
            if (fileStructure && fileStructure.root.children && fileStructure.root.children.length > 0) {
                this.send_event(res, 'file_structure', fileStructure);
            }

            this.send_event(res, 'complete', {
                fullResponse,
                totalCodeBlocks: this.codeBlocksSent.size,
            });

        } catch (error) {
            console.error('Error in sending file structure', error);
        }
    }

    public extract_and_send_context(res: Response) {
        const match = this.buffer.match(this.PATTERNS.context);

        if (match && match.length > 0) {
            const rawContext = match[0]
                .replace(/\/:\s*~\s*/, '')
                .replace(/\s*~:\//, '')
                .trim();

            const context: ContextData = {
                content: rawContext,
                action: this.decide_action_from_context(rawContext),
            };

            try {
                this.send_event(res, 'context', context);
                this.contextSent = true;
            } catch (error) {
                console.error('Error in sending context', error);
            }
        }
    }

    public extract_and_send_code_blocks(res: Response) {
        this.PATTERNS.codeBlock.lastIndex = 0;
        let match;


        while ((match = this.PATTERNS.codeBlock.exec(this.buffer)) !== null) {
            // to avoid duplicates
            const blockKey = `${match.index}-${match[0].length}`;

            if (!this.codeBlocksSent.has(blockKey)) {
                const language = match[1] || 'text';
                const code = match[2].trim();

                const filename = this.decide_file_name(this.buffer, match.index, language, code);

                const codeBlock: CodeBlock = {
                    language,
                    code,
                    filename,
                    startIndex: match.index,
                    endIndex: match.index + match[0].length,
                };

                this.send_event(res, 'code_block', codeBlock);
                this.codeBlocksSent.add(blockKey);
            }

        }
    }

    private send_message_chunk(res: Response) {
        let cleanText = this.buffer;

        cleanText = cleanText.replace(this.PATTERNS.context, '');

        // Remove complete code blocks
        cleanText = cleanText.replace(this.PATTERNS.codeBlock, '');

        // Remove incomplete code blocks from the end
        cleanText = cleanText.replace(this.PATTERNS.incompleteCodeBlock, '');

        cleanText = cleanText.trim();

        // Only send if there's new content
        if (cleanText.length > this.lastMessageLength) {
            this.send_event(res, 'message_chunk', {
                content: cleanText,
                isPartial: true
            });
            this.lastMessageLength = cleanText.length;
        }
    }

    private send_status(res: Response) {
        const lower = this.buffer.toLowerCase();
        let status: StatusUpdate | null = null;

        if (lower.includes('analyzing') || lower.includes('analyse')) {
            status = {
                stage: 'analyzing',
                message: 'Analyzing your requirements'
            };
        } else if (lower.includes('generating') || lower.includes('creating')) {
            status = {
                stage: 'generating',
                message: 'Generating smart contract code'
            };
        } else if (lower.includes('building') || lower.includes('structur')) {
            status = {
                stage: 'building',
                message: 'Building project structure'
            };
        }

        if (status) {
            this.send_event(res, 'status', status);
        }
    }

    private build_file_structure(fullResponse: string): FileStructure | null {
        const codeBlocks = this.extract_all_code_blocks(fullResponse);

        if (codeBlocks.length == 0) {
            return null;
        }

        const projectName = this.decide_project_name(fullResponse);

        const root: FileNode = {
            name: projectName,
            type: 'folder',
            path: '/',
            children: [],
        };

        const files: Record<string, string> = {};

        codeBlocks.forEach((block) => {
            const path = block.filename || this.decide_file_path(block, projectName);
            files[path] = block.code;
            this.add_file_to_tree(root, path, block);
        });

        this.add_standard_anchor_files(root, files, projectName);
        return { root, files };
    }

    private send_event(res: Response, type: StreamEvent['type'], data: any) {
        const event: StreamEvent = {
            type,
            data,
            timestamp: Date.now(),
        }

        res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    private extract_all_code_blocks(text: string): CodeBlock[] {
        const blocks: CodeBlock[] = [];
        this.PATTERNS.codeBlock.lastIndex = 0;
        let match;

        while ((match = this.PATTERNS.codeBlock.exec(text)) !== null) {
            const language = match[1] || 'text';
            const code = match[2].trim();
            const filename = this.decide_file_name(text, match.index, language, code);

            blocks.push({
                language,
                code,
                filename,
                startIndex: match.index,
                endIndex: match.index + match[0].length,
            });
        }

        return blocks;
    }

    private decide_file_name(text: string, blockIndex: number, language: string, code: string): string | undefined {
        const beforeBlock = text.substring(Math.max(0, blockIndex - 200), blockIndex);
        const fileMatch = beforeBlock.match(/File:\s*([^\n]+)/i);

        if (fileMatch) {
            return fileMatch[1].trim();
        }

        if (language == 'rust' && code.includes('#[program]')) {
            return 'lib.rs';
        }

        return undefined;
    }

    private decide_project_name(text: string): string {
        const declareMatch = text.match(/declare_id!\s*\(\s*"([^"]+)"\s*\)/);
        if (declareMatch) {
            return 'my_program';
        }

        const programMatch = text.match(/pub mod\s+(\w+)/);
        if (programMatch) {
            return programMatch[1];
        }

        return 'my_program';
    }

    private decide_file_path(block: CodeBlock, projectName: string): string {
        if (block.language === 'rust') {
            if (block.code.includes('#[program]')) {
                return `programs/${projectName}/src/lib.rs`;
            }
        }

        if (block.language === 'toml') {
            if (block.code.includes('[workspace]')) {
                return 'Cargo.toml';
            }
            if (block.code.includes('[package]')) {
                return `programs/${projectName}/Cargo.toml`;
            }
            return 'Anchor.toml';
        }

        if (block.language === 'typescript' || block.language === 'javascript') {
            return `tests/${projectName}.ts`;
        }

        return `file.${this.get_extension(block.language)}`;
    }

    private get_extension(language: string): string {
        const extensions: Record<string, string> = {
            'rust': 'rs',
            'typescript': 'ts',
            'javascript': 'js',
            'json': 'json',
            'toml': 'toml',
            'yaml': 'yml'
        }

        return extensions[language] || 'txt';
    }

    private add_file_to_tree(root: FileNode, path: string, block: CodeBlock): void {
        const parts = path.split('/').filter(p => p);
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;

            if (!current.children) {
                current.children = [];
            }

            let child = current.children.find(c => c.name === part);

            if (!child) {
                child = {
                    name: part,
                    type: isLast ? 'file' : 'folder',
                    path: parts.slice(0, i + 1).join('/'),
                    children: isLast ? undefined : [],
                };

                if (isLast) {
                    child.content = block.code;
                    child.language = block.language;
                }

                current.children.push(child);
            }

            current = child;
        }
    }

    private add_standard_anchor_files(root: FileNode, files: Record<string, string>, projectName: string): void {
        if (!files['Anchor.toml']) {
            const anchorToml = this.generate_anchor_toml(projectName);
            files['Anchor.toml'] = anchorToml;
            this.add_file_to_tree(
                root, 'Anchor.toml',
                {
                    language: 'toml',
                    code: anchorToml,
                    startIndex: 0,
                    endIndex: 0,
                });
        }

        if (!files['Cargo.toml']) {
            const cargoToml = this.generate_root_cargo_toml();
            files['Cargo.toml'] = cargoToml;
            this.add_file_to_tree(root, 'Cargo.toml', { language: 'toml', code: cargoToml, startIndex: 0, endIndex: 0 });
        }

        const programCargoPath = `programs/${projectName}/Cargo.toml`;
        if (!files[programCargoPath]) {
            const programCargo = this.generate_program_cargo_toml(projectName);
            files[programCargoPath] = programCargo;
            this.add_file_to_tree(root, programCargoPath, { language: 'toml', code: programCargo, startIndex: 0, endIndex: 0 });
        }
    }

    private decide_action_from_context(content: string): string {
        const lower = content.toLowerCase();

        if (lower.includes('analyz')) return 'Analyzing requirements';
        if (lower.includes('generat')) return 'Generating contract';
        if (lower.includes('build')) return 'Building project';
        if (lower.includes('creat')) return 'Creating files';
        if (lower.includes('deploy')) return 'Preparing deployment';
        if (lower.includes('test')) return 'Setting up tests';

        return 'Processing';
    }

    private generate_anchor_toml(programName: string): string {
        return `[features]
        seeds = false
        skip-lint = false

        [programs.localnet]
        ${programName} = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

        [registry]
        url = "https://api.apr.dev"

        [provider]
        cluster = "Localnet"
        wallet = "~/.config/solana/id.json"

        [scripts]
        test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
        `;
    }

    private generate_root_cargo_toml(): string {
        return `[workspace]
        members = [
            "programs/*"
        ]

        [profile.release]
        overflow-checks = true
        lto = "fat"
        codegen-units = 1

        [profile.release.build-override]
        opt-level = 3
        incremental = false
        codegen-units = 1
        `;
    }

    private generate_program_cargo_toml(programName: string): string {
        return `[package]
        name = "${programName}"
        version = "0.1.0"
        description = "Created with shark for Anchor"
        edition = "2021"

        [lib]
        crate-type = ["cdylib", "lib"]
        name = "${programName}"

        [features]
        no-entrypoint = []
        no-idl = []
        no-log-ix-name = []
        cpi = ["no-entrypoint"]
        default = []

        [dependencies]
        anchor-lang = "0.29.0"
`;
    }

    public reset(): void {
        this.buffer = '';
        this.contextSent = false;
        this.codeBlocksSent.clear();
        this.lastMessageLength = 0;
    }

}







