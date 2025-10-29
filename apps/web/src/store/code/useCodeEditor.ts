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
    deleteFile: (path: string) => void;
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

        deleteFile: (path: string) => {
            
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
            const state = get();
            const existingTree = state.fileTree.length ? state.fileTree[0] : {
                id: 'root',
                name: 'root',
                type: NODE.FOLDER,
                children: [],
            };

            // Helper: recursively find folder by path
            function findOrCreateFolder(root: FileNode, parts: string[]): FileNode {
                let current = root;
                let currentPath = '';

                for (const part of parts) {
                    currentPath = currentPath ? `${currentPath}/${part}` : part;
                    let child = current.children?.find((c) => c.name === part && c.type === NODE.FOLDER);
                    if (!child) {
                        child = {
                            id: currentPath,
                            name: part,
                            type: NODE.FOLDER,
                            children: [],
                        };
                        current.children!.push(child);
                    }
                    current = child;
                }
                return current;
            }

            // Helper: recursively remove node by id
            function removeNodeById(nodes: FileNode[], id: string): FileNode[] {
                return nodes
                    .filter((n) => n.id !== id)
                    .map((n) => ({
                        ...n,
                        children: n.children ? removeNodeById(n.children, id) : undefined,
                    }));
            }

            // Append or replace files
            for (const { path, content } of files) {
                const parts = path.split('/').filter(Boolean);
                const fileName = parts.pop();
                if (!fileName) continue;

                const parentFolder = findOrCreateFolder(existingTree, parts);
                const fileId = parts.length ? `${parts.join('/')}/${fileName}` : fileName;

                // Remove any existing file with same id before adding
                parentFolder.children = removeNodeById(parentFolder.children || [], fileId);

                parentFolder.children!.push({
                    id: fileId,
                    name: fileName,
                    type: NODE.FILE,
                    content,
                });
            }

            set({
                fileTree: [existingTree],
                currentFile: null,
                currentCode: '',
            });

            return existingTree;
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
