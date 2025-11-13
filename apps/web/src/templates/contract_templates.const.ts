export const anchorContractTemplates = [
    {
        id: 'ckv9q1g0x0004ab12cdef3456',
        title: 'Staking Rewards Contract',
        image: '/templates/contract-1.jpg',
        description:
            'A contract that allows users to stake their tokens and earn periodic rewards based on APY.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['stake', 'unstake', 'claimRewards', 'getUserInfo'] },
        summary: 'Manages user staking pools, reward distribution, and balance tracking.',
        deployed: true,
        createdAt: new Date('2025-09-10T14:45:00Z'),
    },
    {
        id: 'ckv9q1g0x0005ab12cdef3456',
        title: 'Liquidity Pool',
        image: '/templates/contract-2.jpg',
        description:
            'An AMM-style contract that enables token swaps and provides liquidity incentives for users.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['addLiquidity', 'removeLiquidity', 'swapTokens', 'getPoolInfo'] },
        summary: 'Facilitates decentralized trading and liquidity provision like Uniswap.',
        deployed: false,
        createdAt: new Date('2025-09-25T09:30:00Z'),
    },
    {
        id: 'ckv9q1g0x0006ab12cdef3456',
        title: 'Token Airdrop Distributor',
        image: '/templates/contract-3.jpg',
        description:
            'A utility contract for distributing tokens to multiple users efficiently and securely.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['createAirdrop', 'claimTokens', 'checkEligibility'] },
        summary: 'Automates token distribution events for community incentives or marketing.',
        deployed: true,
        createdAt: new Date('2025-09-18T08:10:00Z'),
    },
    {
        id: 'ckv9q1g0x0007ab12cdef3456',
        title: 'Escrow Payment Contract',
        image: '/templates/contract-4.jpg',
        description:
            'A decentralized escrow contract that holds funds until conditions are met between buyer and seller.',
        contractType: 'PROGRAM',
        clientSdk: {
            functions: ['createEscrow', 'releasePayment', 'cancelEscrow', 'getEscrowStatus'],
        },
        summary: 'Ensures secure and trustless transactions in peer-to-peer or freelance deals.',
        deployed: true,
        createdAt: new Date('2025-08-30T16:00:00Z'),
    },
    {
        id: 'ckv9q1g0x0008ab12cdef3456',
        title: 'Oracle Price Feed',
        image: '/templates/contract-5.jpg',
        description:
            'A contract that fetches and stores off-chain price data from trusted oracle networks.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['updatePrice', 'getLatestPrice', 'setOracleAuthority'] },
        summary: 'Bridges off-chain market data (like ETH/USD) to on-chain smart contracts.',
        deployed: false,
        createdAt: new Date('2025-10-01T12:20:00Z'),
    },
    {
        id: 'ckv9q1g0x0009ab12cdef3456',
        title: 'Crowdfunding Contract',
        image: '/templates/contract-6.jpg',
        description:
            'A decentralized fundraising contract where users can create campaigns and receive contributions.',
        contractType: 'PROGRAM',
        clientSdk: {
            functions: ['createCampaign', 'contribute', 'withdrawFunds', 'getCampaignInfo'],
        },
        summary:
            'Supports transparent and decentralized fundraising with milestone-based withdrawals.',
        deployed: true,
        createdAt: new Date('2025-09-05T07:50:00Z'),
    },
];
