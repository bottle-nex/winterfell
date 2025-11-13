'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getSession, signIn } from 'next-auth/react';
import { IoIosPaperPlane, IoLogoGithub } from 'react-icons/io';
import { FaGithub } from 'react-icons/fa';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { WalletPanel } from '../base/WalletPanel';
import ProfileMenu from '../utility/ProfileMenu';
import { useChatStore } from '@/src/store/user/useChatStore';
import { toast } from 'sonner';
import { EXPORT_CONTRACT_URL } from '@/routes/api_routes';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { cn } from '@/src/lib/utils';
import ExportPanel from './ExportPanel.';

export default function BuilderNavbarRightSection() {
    const { contractId } = useChatStore();
    const { session, setSession } = useUserSessionStore();
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
        if (showRepoPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showRepoPanel]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('githubLinked') === 'true') {
            toast.success('GitHub connected successfully!');

            getSession().then((newSession) => {
                if (newSession) {
                    setSession(newSession as any);
                }
            });

            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [setSession]);

    async function handleConnectGitHub() {
        try {
            setIsConnectingGithub(true);
            await signIn('github', {
                callbackUrl: `${window.location.pathname}?githubLinked=true`,
                redirect: true,
            });
        } catch (error) {
            toast.error('Failed to connect GitHub');
            console.error('GitHub connection error:', error);
            setIsConnectingGithub(false);
        }
    }

    async function handleCodePushToGithub() {
        if (!repoName.trim()) {
            return toast.error('Please enter a repository name');
        }
        if (!contractId) {
            return toast.error('No contract found');
        }

        setIsExporting(true);
        try {
            const response = await axios.post(
                EXPORT_CONTRACT_URL,
                {
                    repo_name: repoName,
                    contract_id: contractId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success('Code exported to GitHub successfully!');
                setShowRepoPanel(false);
                setRepoName('');
            } else {
                toast.error(response.data.message || 'Failed to export');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to export to GitHub';
            toast.error(errorMessage);
            console.error('Export error:', error);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <div className="flex items-center justify-between gap-x-3 relative">
            <ToolTipComponent content="deploy your contract" side="bottom">
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
                        onClick={handleConnectGitHub}
                        disabled={isConnectingGithub}
                        size="xs"
                        className="bg-[#24292e] text-white hover:bg-[#1a1e22] gap-1.5 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
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
                            size="xs"
                            className={cn(
                                'bg-dark text-light hover:bg-dark/90 hover:text-light/90',
                                'tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px] text-xs',
                            )}
                        >
                            <IoLogoGithub className="size-4.5" />
                        </Button>
                    </ToolTipComponent>

                    {showRepoPanel && (
                        <ExportPanel
                            handleCodePushToGithub={handleCodePushToGithub}
                            isExporting={isExporting}
                        />
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
                    className="rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition"
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
