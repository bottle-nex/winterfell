import { FileNode, FlatFile } from '../types/prisma-types';

export function flattenFileTree(node: FileNode, path: string = ''): FlatFile[] {
    const results: FlatFile[] = [];

    if (node.type === 'FILE') {
        results.push({
            id: node.id,
            name: node.name,
            path: path ? `${path}/${node.name}` : node.name,
            type: node.type,
        });
    }

    if (node.children) {
        node.children.forEach((child) => {
            const newPath = path ? `${path}/${node.name}` : node.name;
            results.push(...flattenFileTree(child, node.type === 'FOLDER' ? newPath : path));
        });
    }

    return results;
}

export function searchFiles(flatFiles: FlatFile[], query: string) {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return flatFiles
        .filter(
            (file) =>
                file.name.toLowerCase().includes(lowerQuery) ||
                file.path.toLowerCase().includes(lowerQuery),
        )
        .sort((a, b) => {
            const aStartsWith = a.name.toLowerCase().startsWith(lowerQuery);
            const bStartsWith = b.name.toLowerCase().startsWith(lowerQuery);
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return a.name.localeCompare(b.name);
        })
        .slice(0, 5);
}
