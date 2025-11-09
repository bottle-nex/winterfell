'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@/src/lib/utils';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { flattenFileTree, searchFiles } from '@/src/lib/file_tree_helper';
import { FlatFile, FileNode } from '@/src/types/prisma-types';
import useShortcuts from '@/src/hooks/useShortcut';

export default function BuilderNavbarSearchComponent() {
    const { fileTree, selectFile } = useCodeEditor();
    const [inputValue, setInputValue] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [searchResults, setSearchResults] = useState<FlatFile[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const flatFiles = useMemo(() => {
        if (!fileTree || fileTree.length === 0) return [];
        return flattenFileTree(fileTree[0]);
    }, [fileTree]);

    useShortcuts({
        'meta+k': () => inputRef.current?.focus(),
        'ctrl+k': () => inputRef.current?.focus(),
    });

    useEffect(() => {
        if (inputValue.trim()) {
            const results = searchFiles(flatFiles, inputValue);
            setSearchResults(results);
            setShowDropdown(results.length > 0);
            setSelectedIndex(0);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [inputValue, flatFiles]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    function handleFileSelect(file: FlatFile) {
        const fileNode = findFileInTree(fileTree, file.id);
        if (fileNode) selectFile(fileNode);
        setInputValue('');
        setShowDropdown(false);
        setSelectedIndex(0);
    }

    function findFileInTree(nodes: FileNode[], id: string): FileNode | null {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findFileInTree(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!showDropdown || searchResults.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (searchResults[selectedIndex]) handleFileSelect(searchResults[selectedIndex]);
                break;
            case 'Escape':
                e.preventDefault();
                setShowDropdown(false);
                setInputValue('');
                break;
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">
                /
            </span>
            <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => inputValue && setShowDropdown(true)}
                className={cn(
                    'border border-neutral-700 pl-4 p-0 px-4 h-7 !text-xs tracking-wide min-w-[20rem] text-light/80',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0px]',
                    'tracking-wider',
                )}
                placeholder="search for files (e.g. lib.rs)"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 text-xs cursor-pointer">
                <ChevronRight className="size-3" />
            </span>

            {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full mt-1 bg-dark-base border border-neutral-800 rounded-md shadow-lg max-h-[300px] w-full min-w-[20rem] overflow-y-auto z-50">
                    {searchResults.map((file, index) => (
                        <div
                            key={file.id}
                            onClick={() => handleFileSelect(file)}
                            className={cn(
                                'px-3 py-2 cursor-pointer text-xs hover:bg-dark transition-colors flex items-center justify-between',
                                index === selectedIndex && 'bg-dark',
                            )}
                        >
                            <div className="font-medium text-light">{file.name}</div>
                            <div className="text-light/50 text-[10px] mt-0.5 text-right">
                                {file.path}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
