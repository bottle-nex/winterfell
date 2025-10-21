import { v4 as uuidv4 } from 'uuid';

export enum NODE {
    FILE = 'FILE',
    FOLDER = 'FOLDER',
}

export interface FileNode {
    id: string;
    name: string;
    type: NODE;
    content?: string;
    language?: string;
    children?: FileNode[];
}

export interface CloudfrontFileProps {
    fileList: string[];
    getFileContent: (fileKey: string) => Promise<string>;
    rootName?: string;
}

export class CloudfrontFileParser {
    private root: FileNode;
    private file_list: string[];
    private get_file_content: (file_key: string) => Promise<string>;

    constructor(options: CloudfrontFileProps) {
        this.file_list = options.fileList;
        this.get_file_content = options.getFileContent;
        this.root = this.create_folder_node(options.rootName || 'root');
    }

    private create_file_node(name: string, content?: string, language?: string): FileNode {
        return {
            id: uuidv4(),
            name,
            type: NODE.FILE,
            content,
            language,
        };
    }

    private create_folder_node(name: string, children: FileNode[] = []): FileNode {
        return {
            id: uuidv4(),
            name,
            type: NODE.FOLDER,
            children,
        };
    }

    private get_language_from_file(fileName: string) {
        const extratc = fileName.split('.').pop()?.toLowerCase();
        const map: Record<string, string> = {
            rs: 'rust',
            ts: 'typescript',
            js: 'javascript',
            json: 'json',
            toml: 'toml',
        };
        return extratc ? map[extratc] : undefined;
    }

    private insert_into_filetree(root: FileNode, path_parts: string[], content?: string) {
        if (path_parts.length == 0) {
            return;
        }

        const [current, ...rest] = path_parts;
        let node = root.children?.find((c) => c.name === current);

        if (!node) {
            node =
                rest.length === 0
                    ? this.create_file_node(current, content, this.get_language_from_file(current))
                    : this.create_folder_node(current, []);
            root.children?.push(node);
        }

        if (rest.length > 0) {
            if (!node.children) {
                node.children = [];
            }
            this.insert_into_filetree(node, rest, content);
        }
    }

    public async build_tree() {
        for (const fileKey of this.file_list) {
            const content = await this.get_file_content(fileKey);
            const path_parts = fileKey.split('/');
            this.insert_into_filetree(this.root, path_parts, content);
        }

        return this.root;
    }

    public append_files(newFiles: Record<string, string>) {
        for (const [key, content] of Object.entries(newFiles)) {
            const path_parts = key.split('/');
            this.insert_into_filetree(this.root, path_parts, content);
        }
    }

    public get_tree() {
        return this.root;
    }
}
