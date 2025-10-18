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
