'use client';

import { RxCross2 } from 'react-icons/rx';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Roboto } from 'next/font/google';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';
import { ConnectedWalletInfoCard } from './ConnectedWalletInfoCard';

const roboto = Roboto({
    subsets: ['latin'],
});

interface WalletPanelProps {
    close: () => void;
}

export const WalletPanel = ({ close }: WalletPanelProps) => {
    const [mounted, setMounted] = useState(false);
    const walletPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true); // Ensure DOM is ready
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (walletPanelRef.current && !walletPanelRef.current.contains(event.target as Node)) {
                close(); // Call the close function when clicked outside
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [close]);

    useEffect(() => {
        if (!mounted || !walletPanelRef.current) return;

        const el = walletPanelRef.current;

        // Initial animation setup
        gsap.set(el, {
            y: 50,
            opacity: 0,
        });

        // Trigger entrance animation after next frame
        requestAnimationFrame(() => {
            gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
            });
        });

        // Close on outside click
        const handleOutsideClick = (event: MouseEvent) => {
            if (el && !el.contains(event.target as Node)) {
                close();
            }
        };

        // Close on Esc key press
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [mounted, close]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-black/40 text-light select-none',
                roboto.className,
            )}
        >
            <div
                ref={walletPanelRef}
                className="w-[700px] h-[500px] bg-[#101114] rounded-[4px] overflow-hidden shadow-2xl flex border border-neutral-800 opacity-0 "
            >
                <div className="w-[240px] h-full border-r border-neutral-800 p-5 flex flex-col gap-4">
                    <div className="w-full text-left px-3 flex justify-start items-start text-lg font-semibold ">
                        Connect a Wallet
                    </div>
                    <WalletOptions />
                </div>

                <div className="flex-1 h-full p-5 relative">
                    <div className="absolute top-5 right-5">
                        <RxCross2
                            onClick={close}
                            className="size-5 cursor-pointer bg-dark p-1 rounded-full hover:bg-dark-base transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    {/* right content of wallet panel */}
                    {<ConnectedWalletInfoCard />}
                </div>
            </div>
        </div>,
        document.body,
    );
};

function WalletOptions() {
    const { wallets, select, connect, wallet } = useWallet();

    return (
        <>
            {wallets.map((w, index) => (
                <button
                    key={index}
                    onClick={() => {
                        select(w.adapter.name);
                        connect();
                    }}
                    className={cn(
                        'w-full text-left py-2 px-3 rounded-[4px] hover:bg-dark transition duration-200 ease-in-out cursor-pointer',
                        'flex justify-start items-center gap-x-2 ',
                        w.adapter.name === wallet?.adapter.name ? 'bg-[#2c2c2c] ' : '',
                    )}
                >
                    <Image src={w.adapter.icon} alt={w.adapter.name} width={20} height={20} />
                    <span>{w.adapter.name}</span>
                </button>
            ))}
        </>
    );
}
