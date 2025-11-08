export enum PlanType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM',
    PREMIUM_PLUS = 'PREMIUM_PLUS',
}

export enum NODE {
    FILE = 'FILE',
    FOLDER = 'FOLDER',
}

export interface FlatFile {
    id: string;
    name: string;
    path: string;
    type: NODE;
}

export interface FileNode {
    id: string;
    name: string;
    type: NODE;
    content?: string;
    language?: string;
    children?: FileNode[];
}

export interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    password?: string | null;
    provider?: string | null;
    githubAccessToken?: string | null;
    createdAt: string;
    updatedAt: string;

    subscription?: Subscription | null;
    contracts?: Contract[];
    messages?: Message[];
}

export interface Contract {
    id: string;
    title: string;
    description?: string | null;
    contractType: ContractType;
    code: string;
    idl?: JSON;
    clientSdk?: JSON;
    summary?: string | null;
    deployed: boolean;
    programId?: string | null;
    version: number;
    userId: string;
    user?: User;
    createdAt: string;
    updatedAt: string;
    deployments?: Deployment[];
    messages: Message[];
}

export interface Deployment {
    id: string;
    contractId: string;
    contract?: Contract;
    network: string;
    deployedAt: string;
    txSignature?: string | null;
    status: string;
}

export interface Message {
    id: string;
    contractId: string;
    contract?: Contract;
    role: ChatRole;
    content: string;
    planning: boolean;
    generatingCode: boolean;
    building: boolean;
    creatingFiles: boolean;
    finalzing: boolean;
    error: boolean;
    createdAt: Date;
}

export interface Subscription {
    id: string;
    userId: string;
    user?: User;
    plan: PlanType;
    status: SubscriptionStatus;
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    razorpaySignature?: string | null;
    start: string;
    end?: string | null;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
}

/* =========================
   ENUMS
   ========================= */

export enum ContractType {
    TOKEN = 'TOKEN',
    NFT = 'NFT',
    STAKING = 'STAKING',
    DAO = 'DAO',
    DEFI = 'DEFI',
    MARKETPLACE = 'MARKETPLACE',
    CUSTOM = 'CUSTOM',
}

export enum Network {
    DEVNET = 'DEVNET',
    TESTNET = 'TESTNET',
    MAINNET_BETA = 'MAINNET_BETA',
}

export enum DeploymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum ChatRole {
    USER = 'USER',
    AI = 'AI',
    SYSTEM = 'SYSTEM',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
}

export enum SystemMessageType {
    BUILD_START = 'BUILD_START',
    BUILD_PROGRESS = 'BUILD_PROGRESS',
    BUILD_COMPLETE = 'BUILD_COMPLETE',
    BUILD_ERROR = 'BUILD_ERROR',
}
