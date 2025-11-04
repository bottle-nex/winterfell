'use client';
import { useState } from 'react';
import { BiUpvote } from 'react-icons/bi';
import { BiSolidUpvote } from 'react-icons/bi';

const mostRecentTemplates = [
    {
        id: 'ckv9q1g0x0004ab12cdef3456',
        title: 'Staking Rewards Contract',
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

export default function MostRecentTemplates() {
    const [upvoted, setUpvoted] = useState<boolean>(false);

    return (
        <div className="w-full h-full flex flex-col px-2 tracking-wider">
            <div className="w-full flex justify-between py-1 text-sm px-1">
                <span className="text-light">Most Recent Builds</span>
            </div>

            <div className="h-full flex gap-x-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2">
                {mostRecentTemplates.map((contract) => (
                    <div
                        key={contract.id}
                        className="h-full min-w-[calc(30%-12px)] grid grid-rows-[85%_15%] overflow-hidden group"
                    >
                        <div className="bg-[#0A0C0D70]  shadow-sm border border-neutral-800 rounded-[8px]">
                            {/* image */}
                        </div>

                        <div className="text-light/40 h-full w-full flex items-center justify-between px-1">
                            <div className="text-sm">{contract.title}</div>

                            <div className="flex gap-x-2.5 justify-center items-center h-full">
                                <div className="flex space-x-1">
                                    <BiUpvote
                                        onClick={() => setUpvoted(true)}
                                        className={`size-3.5 cursor-pointer hover:text-primary hover:fill-primary transition-all duration-150 ${
                                            upvoted ? 'hidden' : 'block'
                                        }`}
                                    />

                                    <BiSolidUpvote
                                        onClick={() => setUpvoted(false)}
                                        className={`size-3.5 cursor-pointer text-primary fill-primary transition-all duration-150 ${
                                            upvoted ? 'block' : 'hidden'
                                        }`}
                                    />
                                    <span className="text-xs">1.4k</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
