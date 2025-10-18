export enum PlanType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM',
    PREMIUM_PLUS = 'PREMIUM_PLUS',
}

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
