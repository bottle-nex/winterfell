import CodeEditorServer from '@/src/lib/server/code-editor-server';
import { FileNode, NODE } from '@/src/types/prisma-types';
import { FileContent } from '@/src/types/stream_event_types';
import { create } from 'zustand';

interface CodeEditorState {
    currentCode: string;
    currentFile: FileNode | null;
    fileTree: FileNode[];
    editedFiles: Record<string, FileNode>;
    collapseFileTree: boolean;

    setCollapseFileTree: (collapse: boolean) => void;
    setCurrentCode: (code: string) => void;
    updateFileContent: (fileId: string, content: string) => void;
    selectFile: (node: FileNode) => void;
    parseFileStructure: (files: FileContent[]) => FileNode;
    syncFiles: () => Promise<void>;
    reset: () => void;
}

export const useCodeEditor = create<CodeEditorState>((set, get) => {
    return {
        currentCode: '',
        currentFile: null,
        fileTree: [],
        editedFiles: {},
        collapseFileTree: false,

        setCollapseFileTree: (collapse: boolean) => set({ collapseFileTree: collapse }),
        setCurrentCode: (code: string) => {
            set({ currentCode: code });
        },

        updateFileContent: (fileId: string, content: string) => {
            const state = get();

            const updateNode = (nodes: FileNode[]): FileNode[] =>
                nodes.map((n) =>
                    n.id === fileId
                        ? { ...n, content }
                        : n.children
                            ? { ...n, children: updateNode(n.children) }
                            : n,
                );

            const newTree = updateNode(state.fileTree);

            const file = findFileById(newTree, fileId);
            if (!file) {
                console.warn(`File with id: ${fileId} not found`);
                set({ fileTree: newTree });
                return;
            }
            const editedFiles = { ...state.editedFiles, [fileId]: file };

            set({
                fileTree: newTree,
                editedFiles,
                currentCode: content,
            });
        },

        selectFile: (node: FileNode) => {
            if (node.type === NODE.FILE) {
                set({
                    currentFile: node,
                    currentCode: node.content ?? '',
                });
            }
        },

        parseFileStructure: (files: FileContent[]) => {
            const root: FileNode = {
                id: 'root',
                name: 'root',
                type: NODE.FOLDER,
                children: [],
            };

            // Build full paths as IDs to ensure uniqueness
            for (const { path, content } of files) {
                const parts = path.split('/').filter(Boolean);
                let current = root;

                let currentPath = '';

                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    const isFile = i === parts.length - 1;

                    // Build unique path-based ID
                    currentPath = currentPath ? `${currentPath}/${part}` : part;

                    let existing = current.children?.find((child) => child.name === part);

                    if (!existing) {
                        existing = {
                            id: currentPath, // Use full path as unique ID
                            name: part,
                            type: isFile ? NODE.FILE : NODE.FOLDER,
                            ...(isFile ? { content } : { children: [] }),
                        };
                        current.children!.push(existing);
                    } else if (isFile && content) {
                        // Update content if re-parsed
                        existing.content = content;
                    }

                    current = existing;
                }
            }

            set({
                fileTree: [root],
                currentFile: null,
                currentCode: '',
                editedFiles: {},
            });

            return root;
        },

        syncFiles: async () => {
            const { editedFiles } = get();
            const files = Object.values(editedFiles);

            if (files.length === 0) {
                return;
            }

            try {
                await CodeEditorServer.syncFiles(files, 'pass-the-token-here');
                set({ editedFiles: {} });
            } catch (error) {
                console.error('Failed to sync files:', error);
            }
        },

        reset: () => {
            set({
                fileTree: [],
                currentFile: null,
                currentCode: '',
                editedFiles: {},
            });
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
