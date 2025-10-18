import { anchor_toml, cargo_toml, lib_rs, my_program_ts } from '@/src/lib/code/default_codes';
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
                                                        content: lib_rs,
                                                    },
                                                ],
                                            },
                                            {
                                                id: 'cargo_toml',
                                                name: 'Cargo.toml',
                                                type: NODE.FILE,
                                                content: cargo_toml,
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
                                        content: my_program_ts,
                                    },
                                ],
                            },
                            {
                                id: 'anchor_toml',
                                name: 'Anchor.toml',
                                type: NODE.FILE,
                                content: anchor_toml,
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
            if (updatedFile) debouncedSync([updatedFile]);
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
