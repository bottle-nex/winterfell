'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { IoIosPaperPlane } from 'react-icons/io';
import { FaGithub } from 'react-icons/fa';
import { ArrowUp } from 'lucide-react';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { WalletPanel } from '../base/WalletPanel';
import ProfileMenu from '../utility/ProfileMenu';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useChatStore } from '@/src/store/user/useChatStore';
import { toast } from 'sonner';
import { EXPORT_CONTRACT_URL, GITHUB_CONNECT_URL } from '@/routes/api_routes';

export default function BuilderNavbarRightSection() {
    const { session, setSession } = useUserSessionStore();
    const { contractId } = useChatStore();
    const [openWalletPanel, setOpenWalletPanel] = useState<boolean>(false);
    const [showRepoPanel, setShowRepoPanel] = useState<boolean>(false);
    const [repoName, setRepoName] = useState<string>('');

    const [openProfileMenu, setOpenProfleMenu] = useState<boolean>(false);
    const [isConnectingGithub, setIsConnectingGithub] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);

    const hasGithub = session?.user?.hasGithub;
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowRepoPanel(false);
            }
        }
        if (showRepoPanel) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showRepoPanel]);

    useEffect(() => {
        const handleGithubCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');

            if (code && state === 'github-connect') {
                setIsConnectingGithub(true);
                try {
                    const response = await axios.post(
                        `${GITHUB_CONNECT_URL}`,
                        { code },
                        { headers: { Authorization: `Bearer ${session?.user?.token}` } },
                    );
                    if (response.data.success) {
                        setSession({
                            ...session!,
                            user: {
                                ...session?.user,
                                token: response.data.token,
                                hasGithub: true,
                                githubUsername: response.data.githubUsername,
                            },
                        });
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                } catch (error) {
                    console.error('Failed to connect GitHub:', error);
                } finally {
                    setIsConnectingGithub(false);
                }
            }
        };
        handleGithubCallback();
    }, [session, setSession]);

    async function handleCodePushToGithub() {
        if (!repoName.trim()) return toast.error('Please enter a repository name');
        if (!contractId) return toast.error('No contract found');

        setIsExporting(true);
        try {
            const response = await axios.post(
                EXPORT_CONTRACT_URL,
                { repo_name: repoName, contract_id: contractId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                },
            );
            if (response.data.success) {
                toast.success('Pushed successfully!');
                setShowRepoPanel(false);
                setRepoName('');
            }
        } catch (error) {
            toast.error('Failed to export to GitHub');
            console.error(error);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <div className="flex items-center justify-between gap-x-3 relative">
            <ToolTipComponent content="Deploy your contract to the solana blockchain" side="bottom">
                <Button
                    onClick={() => setOpenWalletPanel(true)}
                    size="xs"
                    className="bg-light text-dark-base hover:bg-light hover:text-dark-base tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 duration-300 font-semibold rounded-[4px]"
                >
                    <IoIosPaperPlane className="size-3.5" />
                    <span className="text-[11px]">Deploy</span>
                </Button>
            </ToolTipComponent>

            {!hasGithub ? (
                <ToolTipComponent content="Connect GitHub to export code" side="bottom">
                    <Button
                        disabled={isConnectingGithub}
                        size="xs"
                        className="bg-[#24292e] text-white hover:bg-[#24292e] gap-1.5 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px]"
                    >
                        <FaGithub className="size-3.5" />
                        <span className="text-[11px]">
                            {isConnectingGithub ? 'Connecting...' : 'Connect GitHub'}
                        </span>
                    </Button>
                </ToolTipComponent>
            ) : (
                <div className="relative" ref={panelRef}>
                    <ToolTipComponent content="Export codebase to GitHub" side="bottom">
                        <Button
                            onClick={() => setShowRepoPanel((prev) => !prev)}
                            disabled={isExporting}
                            size="sm"
                            className="bg-primary text-light hover:bg-primary/90 hover:text-light/90 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px]"
                        >
                            <span className="text-xs">Export</span>
                        </Button>
                    </ToolTipComponent>

                    {showRepoPanel && (
                        <div className="absolute top-full mt-3 right-0 border border-neutral-800 rounded-md shadow-lg p-3 flex gap-2 w-[200px] z-20">
                            <Input
                                type="text"
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                                placeholder="Enter repo name"
                                className="w-full border border-neutral-800 text-light text-sm px-3 py-1 rounded-sm"
                            />
                            <Button
                                onClick={handleCodePushToGithub}
                                disabled={isExporting}
                                size="sm"
                                className="bg-primary text-light hover:bg-primary/90 text-xs font-semibold rounded-[4px]"
                            >
                                {isExporting ? 'Exporting...' : <ArrowUp />}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {session?.user?.image && (
                <Image
                    onClick={() => setOpenProfleMenu((prev) => !prev)}
                    src={session.user.image}
                    alt="user"
                    width={28}
                    height={28}
                    className="rounded-full cursor-pointer"
                />
            )}
            {openProfileMenu && (
                <div className="absolute top-full right-2 mt-2 z-[9999]">
                    <ProfileMenu setOpenProfleMenu={setOpenProfleMenu} />
                </div>
            )}

            {openWalletPanel && <WalletPanel close={() => setOpenWalletPanel(false)} />}
        </div>
    );
}
