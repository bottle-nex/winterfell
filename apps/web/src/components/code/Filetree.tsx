'use client';
import React, { useMemo } from 'react';
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FileNode, NODE } from '@/src/types/prisma-types';
import { AiFillFolder } from 'react-icons/ai';
import { AiFillFolderOpen } from 'react-icons/ai';
import FileIcon from '../tickers/FileIcon';

interface TreeItem {
    index: string;
    children?: string[];
    data: string;
    isFolder: boolean;
}

interface TreeData {
    [key: string]: TreeItem;
}

export default function Filetree() {
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
        <div className="h-full bg-[#16171a] text-neutral-200 border-r border-neutral-800 w-[24rem]">
            <div className="p-3 border-b border-neutral-800">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Project Files
                </h2>
            </div>

            <div className="p-2 w-full">
                <UncontrolledTreeEnvironment
                    dataProvider={dataProvider}
                    getItemTitle={(item) => item.data}
                    viewState={{}}
                    canDragAndDrop={false}
                    canDropOnFolder={false}
                    canReorderItems={false}
                    onSelectItems={(items) => {
                        console.log('Selected items:', items);
                        const itemId = items[0];
                        console.log('Selected item ID:', itemId);
                        console.log('Current fileTree:', fileTree);

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
                            console.log('Found node:', node);

                            if (node && node.type === NODE.FILE) {
                                selectFile(node);
                            }
                        }
                    }}
                    renderItemTitle={({ item, context }) => (
                        <div className="flex items-center gap-2">
                            {item.isFolder ? (
                                context.isExpanded ? (
                                    <AiFillFolderOpen size={16} className="text-blue-500" />
                                ) : (
                                    <AiFillFolder size={16} className="text-blue-500" />
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
            </div>
        </div>
    );
}
