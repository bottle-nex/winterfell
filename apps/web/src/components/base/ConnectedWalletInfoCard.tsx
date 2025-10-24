'use client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { LiaServicestack } from 'react-icons/lia';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { cn } from '@/src/lib/utils';

export function ConnectedWalletInfoCard() {
    const { publicKey, wallet, connected, disconnect } = useWallet();
    const { connection } = useConnection();

    const ContainerRef = useRef<HTMLDivElement>(null);
    const TransitionWrapperRef = useRef<HTMLDivElement>(null);
    const AccountInfoRef = useRef<HTMLDivElement>(null);
    const ConnectingRef = useRef<HTMLDivElement>(null);

    const [showAccountInfo, setShowAccountInfo] = useState<boolean>(false);
    const [prevShowAccountInfo, setPrevShowAccountInfo] = useState<boolean>(false);
    const [_isAnimating, setIsAnimating] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | null>(null);

    // Fetch SOL balance
    useEffect(() => {
        if (publicKey) {
            connection.getBalance(publicKey).then((lamports: number) => {
                setBalance(lamports / 1e9); // lamports → SOL
            });
        }
    }, [publicKey, connection]);

    // Animation logic (keep your GSAP transitions)
    useLayoutEffect(() => {
        const container = ContainerRef.current;
        const wrapper = TransitionWrapperRef.current;

        if (!container || !wrapper) return;
        if (showAccountInfo === prevShowAccountInfo) return;

        const ctx = gsap.context(() => {
            if (showAccountInfo) {
                setIsAnimating(true);
                requestAnimationFrame(() => {
                    const accountInfo = AccountInfoRef.current;
                    if (!accountInfo) return;

                    const targetHeight = accountInfo.scrollHeight + 40;

                    const tl = gsap.timeline({
                        onComplete: () => {
                            gsap.set(container, { height: 'auto' });
                            setIsAnimating(false);
                        },
                    });

                    gsap.set(accountInfo, { opacity: 0, y: 20 });
                    gsap.set(container, { height: container.offsetHeight });

                    tl.to(container, { height: targetHeight, duration: 0.4, ease: 'power2.out' });
                    tl.to(
                        accountInfo,
                        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
                        '-=0.2',
                    );
                });
            } else {
                setIsAnimating(true);
                requestAnimationFrame(() => {
                    const connecting = ConnectingRef.current;
                    if (!connecting) return;

                    const targetHeight = connecting.scrollHeight + 40;

                    const tl = gsap.timeline({
                        onComplete: () => {
                            gsap.set(container, { height: 'auto' });
                            setIsAnimating(false);
                        },
                    });

                    gsap.set(connecting, { opacity: 0, scale: 0.8 });
                    tl.fromTo(
                        container,
                        { height: container.offsetHeight },
                        { height: targetHeight, duration: 0.4, ease: 'power2.out' },
                    );
                    tl.to(
                        connecting,
                        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' },
                        '-=0.2',
                    );
                });
            }
        }, ContainerRef);

        return () => ctx.revert();
    }, [showAccountInfo, prevShowAccountInfo]);

    useEffect(() => {
        const newShowAccountInfo = !!(publicKey && connected && balance !== null);
        setPrevShowAccountInfo(showAccountInfo);
        setShowAccountInfo(newShowAccountInfo);
    }, [publicKey, connected, balance, showAccountInfo]);

    const deployContract = async () => {
        if (!publicKey) return alert('Wallet not connected!');

        try {

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center gap-y-2">
            {wallet && publicKey ? (
                <>
                    <div className="w-full flex flex-col justify-center items-center">
                        <div>
                            {wallet && (
                                <Image
                                    src={wallet.adapter.icon}
                                    alt={wallet.adapter.name}
                                    width={36}
                                    height={36}
                                />
                            )}
                        </div>
                        <div className="text-sm tracking-wider">{wallet?.adapter.name}</div>
                    </div>
                    <div
                        ref={ContainerRef}
                        className="w-full rounded-2xl bg-dark border border-neutral-800 overflow-hidden"
                    >
                        <div
                            ref={TransitionWrapperRef}
                            className="p-5 flex justify-center items-center relative"
                        >
                            {showAccountInfo ? (
                                <AccountInfo
                                    onClick={deployContract}
                                    ref={AccountInfoRef}
                                    address={publicKey!.toBase58()}
                                    balance={balance || 0}
                                    walletName={wallet?.adapter.name || ''}
                                    walletIcon={wallet?.adapter.icon}
                                    disconnect={disconnect}
                                />
                            ) : (
                                <Connecting ref={ConnectingRef} />
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full flex flex-col justify-center items-center">
                    <LiaServicestack className="text-primary h-18 w-18 transition-all duration-500" />
                    <span className="text-sm tracking-[0.1rem] ">WINTERFELL</span>
                </div>
            )}
        </div>
    );
}

const color = 'bg-dark-base border border-neutral-800 text-light';

interface AccountInfoProps {
    onClick: () => void;
    ref?: React.Ref<HTMLDivElement>;
    address: string;
    balance: number;
    walletName: string;
    walletIcon?: string;
    disconnect: () => void;
}

const AccountInfo = ({
    ref,
    address,
    balance,
    walletName,
    walletIcon,
    disconnect,
}: AccountInfoProps) => {
    const { session } = useUserSessionStore();

    return (
        <div ref={ref} className="w-full flex flex-col justify-center items-center gap-y-3">
            <div className="flex justify-center items-center gap-x-3 overflow-hidden">
                {walletIcon && session?.user.image && (
                    <Image
                        src={session?.user.image}
                        alt={walletName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border border-neutral-800"
                    />
                )}
                <div
                    className={cn(
                        'max-w-xs px-3 py-1 rounded-md text-sm font-mono truncate',
                        color,
                    )}
                    title={address}
                >
                    {address}
                </div>
            </div>

            <div className="w-full flex justify-start items-center gap-x-3">
                <div
                    className={cn(
                        'flex items-center justify-center px-3 py-1 rounded-md text-sm font-mono',
                        color,
                    )}
                >
                    Chain:
                </div>
                <div className={cn("w-full flex items-center justify-center px-3 py-1 rounded-md text-sm font-mono", color)}>
                    Mainnet
                </div>
            </div>

            <div className="w-full flex justify-start items-center gap-x-3">
                <div className={cn("flex items-center justify-center px-3 py-1 rounded-md text-sm font-mono", color)}>
                    Balance:
                </div>
                <div className={cn("w-full flex items-center justify-center px-3 py-1 rounded-md text-sm font-mono", color)}>
                    {balance.toFixed(4)} SOL
                </div>
            </div>

            <div className="w-full flex justify-center items-center gap-x-3 mt-6">
                {/* <div
                    className="flex items-center justify-center px-5 py-1.5 rounded-md bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors duration-200 ease-in-out border border-[#D8CFBC] text-[#D8CFBC] text-sm font-mono cursor-pointer"
                    onClick={onClick}
                >
                    Deploy contract
                </div> */}
                <div
                    className="flex items-center justify-center px-5 py-1.5 rounded-md bg-[#fb2c3656] hover:bg-[#fb2c3675] transition-colors duration-200 ease-in-out border border-red-400 text-[#D8CFBC] text-sm font-mono cursor-pointer"
                    onClick={disconnect}
                >
                    Disconnect
                </div>
            </div>
        </div>
    );
};

interface ConnectingProps {
    ref?: React.Ref<HTMLDivElement>;
}

export const Connecting = ({ ref }: ConnectingProps) => {
    return (
        <div ref={ref} className="flex justify-center items-center py-4">
            <svg
                className="animate-spin h-6 w-6 text-[#D8CFBC]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
            </svg>
        </div>
    );
};
