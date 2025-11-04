'use client';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import DeployedTicker from '../tickers/DeployedTicket';
import { formatDistance, subDays } from 'date-fns';
import { FaCalendar } from 'react-icons/fa';
import { Button } from '../ui/button';

const userContracts = [
    {
        id: 'ckv9q1g0x0001ab12cdef3456',
        title: 'Token Vault',
        description:
            'A smart contract that manages secure token deposits and withdrawals for DeFi apps.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['deposit', 'withdraw', 'check_balance'] },
        summary: 'Handles token storage and transfers with vault-like security features.',
        deployed: true,
        createdAt: new Date('2025-09-14T10:23:00Z'),
    },
    {
        id: 'ckv9q1g0x0002ab12cdef3456',
        title: 'NFT Marketplace',
        description:
            'A contract that facilitates minting, listing, and buying NFTs using SPL tokens.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['mintNFT', 'listNFT', 'buyNFT'] },
        summary: 'Manages NFT minting and transactions on Solana.',
        deployed: false,
        createdAt: new Date('2025-09-20T11:15:00Z'),
    },
    {
        id: 'ckv9q1g0x0003ab12cdef3456',
        title: 'DAO Voting Contract',
        description: 'A governance contract that enables token-weighted voting for DAOs.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['createProposal', 'vote', 'finalize'] },
        summary: 'Enables decentralized decision-making through proposal creation and voting.',
        deployed: true,
        createdAt: new Date('2025-08-10T09:00:00Z'),
    },
    {
        id: 'ckv9q1g0x0003ab12cdef34345',
        title: 'DAO Voting Contract',
        description: 'A governance contract that enables token-weighted voting for DAOs.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['createProposal', 'vote', 'finalize'] },
        summary: 'Enables decentralized decision-making through proposal creation and voting.',
        deployed: true,
        createdAt: new Date('2025-08-10T09:00:00Z'),
    },
    {
        id: 'ckv9q1g0x0003ab12cdef3456a',
        title: 'DAO Voting Contract',
        description: 'A governance contract that enables token-weighted voting for DAOs.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['createProposal', 'vote', 'finalize'] },
        summary: 'Enables decentralized decision-making through proposal creation and voting.',
        deployed: true,
        createdAt: new Date('2025-08-10T09:00:00Z'),
    },
    {
        id: 'ckv9q1g0x0003ab12cdef34345b',
        title: 'DAO Voting Contract',
        description: 'A governance contract that enables token-weighted voting for DAOs.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['createProposal', 'vote', 'finalize'] },
        summary: 'Enables decentralized decision-making through proposal creation and voting.',
        deployed: true,
        createdAt: new Date('2025-08-10T09:00:00Z'),
    },
];

export default function UserContracts() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    function scroll(direction: 'left' | 'right') {
        if (scrollContainerRef.current) {
            const scrollAmount: number = scrollContainerRef.current.offsetWidth * 0.8;
            const newScrollLeft: number =
                direction === 'right'
                    ? scrollContainerRef.current.scrollLeft + scrollAmount
                    : scrollContainerRef.current.scrollLeft - scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        }
    }

    function handleScroll() {
        if (scrollContainerRef.current) {
            const {
                scrollLeft,
                scrollWidth,
                clientWidth,
            }: {
                scrollLeft: number;
                scrollWidth: number;
                clientWidth: number;
            } = scrollContainerRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
        }
    }

    return (
        <div className="w-full h-full tracking-wider flex flex-col px-2">
            <div className="w-full flex justify-between py-1 text-sm px-1">
                <span className="text-light">User contracts</span>
                <span className="text-light/60 flex items-center gap-x-1 cursor-pointer group">
                    view all
                    <ChevronRight className="size-3.5 group-hover:translate-x-0.5 ease-in duration-100 transform" />
                </span>
            </div>
            <div className="relative h-full">
                {showLeftButton && (
                    <Button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#0A0C0D] hover:bg-[#0c0e0f] rounded-full p-2 transition-all shadow-2xl"
                    >
                        <ChevronLeft className="size-4 text-light" />
                    </Button>
                )}

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="h-full flex gap-x-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 shadow-inset-right"
                >
                    {userContracts.map((contract) => (
                        <div
                            key={contract.id}
                            className="h-full border border-neutral-800 bg-[#0A0C0D70] min-w-[calc(25%-12px)] rounded-[4px] grid grid-rows-[78%_22%] overflow-hidden group shadow-sm"
                        >
                            <div className="bg-gradient-to-br from-dark-base via-dark to-dark-base p-3 flex flex-col rounded-b-[4px]">
                                <div className="flex justify-between h-fit items-center">
                                    <DeployedTicker isDeployed={contract.deployed} />
                                    <div className="text-xs text-light/60 tracking-wide flex gap-x-1.5">
                                        <FaCalendar className="size-3" />
                                        <span>
                                            {formatDistance(
                                                subDays(contract.createdAt, 3),
                                                contract.createdAt,
                                                { addSuffix: true },
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 text-left flex items-end text-[12px] tracking-wider text-light/80">
                                    {contract.description}
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-3 text-[13px] tracking-wider bg-[#0A0C0D70]">
                                {contract.title}
                                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 group-hover:transition-transform group-hover:translate-x-1 duration-200" />
                            </div>
                        </div>
                    ))}
                </div>

                {showRightButton && (
                    <Button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#0A0C0D] hover:bg-[#0c0e0f] rounded-full p-2 transition-all shadow-2xl h-6 w-6"
                    >
                        <ChevronRight className=" text-light" />
                    </Button>
                )}
            </div>
        </div>
    );
}
