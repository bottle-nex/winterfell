'use client';
import React, { useMemo } from 'react';
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItem } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FileNode, NODE } from '@/src/types/prisma-types';
import { AiFillFolder } from 'react-icons/ai';
import { AiFillFolderOpen } from 'react-icons/ai';
import FileIcon from '../tickers/FileIcon';

interface TreeData {
    [key: string]: TreeItem;
}


export default function FileTree() {
    const { fileTree, selectFile } = useCodeEditor();

    const treeData = useMemo(() => {
        const flattened: TreeData = {};

        function flattenNode(node: FileNode): void {
            const isFolder = node.type === NODE.FOLDER;

            flattened[node.id] = {
                index: node.id,
                data: node.name,
                isFolder: isFolder,
                children:
                    isFolder && node.children ? node.children.map((child) => child.id) : undefined,
            };

            if (isFolder && node.children) {
                node.children.forEach((child) => flattenNode(child));
            }
        }

        fileTree.forEach((node) => flattenNode(node));

        return flattened;
    }, [fileTree]);

    const dataProvider = new StaticTreeDataProvider(treeData, (item, data) => ({
        ...item,
        data,
    }));

    return (
        <UncontrolledTreeEnvironment
            dataProvider={dataProvider}
            getItemTitle={(item) => item.data}
            viewState={{}}
            canDragAndDrop={false}
            canDropOnFolder={false}
            canReorderItems={false}
            onSelectItems={(items) => {
                const itemId = items[0];

                if (itemId && itemId !== 'root') {
                    const findNode = (nodes: FileNode[], id: string): FileNode | null => {
                        for (const node of nodes) {
                            if (node.id === id) return node;
                            if (node.children) {
                                const found = findNode(node.children, id);
                                if (found) return found;
                            }
                        }
                        return null;
                    };
                    const node = findNode(fileTree, itemId as string);

                    if (node && node.type === NODE.FILE) {
                        selectFile(node);
                    }
                }
            }}
            renderItemTitle={({ item, context }) => (
                <div className="flex items-center gap-2">
                    {item.isFolder ? (
                        context.isExpanded ? (
                            <AiFillFolderOpen size={16} className="text-[#317FFF]" />
                        ) : (
                            <AiFillFolder size={16} className="text-[#317FFF]" />
                        )
                    ) : (
                        <FileIcon
                            filename={item.data}
                            size={14}
                            className="text-neutral-400"
                        />
                    )}
                    <span className="text-sm">{item.data}</span>
                </div>
            )}
        >
            <Tree treeId="file-tree" rootItem="root" treeLabel="Project Files" />
        </UncontrolledTreeEnvironment>
    )
}