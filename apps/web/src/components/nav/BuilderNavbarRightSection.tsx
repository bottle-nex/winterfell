'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getSession, signIn } from 'next-auth/react';
import { IoIosPaperPlane } from 'react-icons/io';
import { FaGithub } from 'react-icons/fa';
import { ArrowUp } from 'lucide-react';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { WalletPanel } from '../base/WalletPanel';
import ProfileMenu from '../utility/ProfileMenu';
import { useChatStore } from '@/src/store/user/useChatStore';
import { toast } from 'sonner';
import { EXPORT_CONTRACT_URL } from '@/routes/api_routes';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';

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

        console.log({session});
        console.log('token is ----------------------> ', session?.user.token);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showRepoPanel]);

    async function handleConnectGitHub() {
        try {
            setIsConnectingGithub(true);
            console.log('inside connect github 1');
            const result = await signIn('github', {
                redirect: false,
            });
            console.log({ result });

            if (result?.ok) {
                const updatedSession = await getSession();
                console.log({ updatedSession });

                if (updatedSession?.user) {
                    setSession(updatedSession);
                    toast.success('Github connected successfully.');
                } else {
                    toast.error('failed to update session');
                }
            } else if (result?.error) {
                toast.error('Failed to connect GitHub');
            }
        } catch (error) {
            toast.error('Failed to connect GitHub');
            console.error('GitHub connection error:', error);
        } finally {
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
                    contract_id: contractId 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                }
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
            <ToolTipComponent 
                content="Deploy your contract to the solana blockchain" 
                side="bottom"
            >
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
                            size="sm"
                            className="bg-primary text-light hover:bg-primary/90 hover:text-light/90 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px]"
                        >
                            <span className="text-xs">Export</span>
                        </Button>
                    </ToolTipComponent>

                    {showRepoPanel && (
                        <div className="absolute top-full mt-3 right-0 bg-dark-base border border-neutral-800 rounded-md shadow-lg p-3 flex gap-2 w-[200px] z-20">
                            <Input
                                type="text"
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && repoName.trim()) {
                                        handleCodePushToGithub();
                                    }
                                }}
                                placeholder="Enter repo name"
                                className="w-full border border-neutral-800 text-light text-sm px-3 py-1 rounded-sm"
                                autoFocus
                            />
                            <Button
                                onClick={handleCodePushToGithub}
                                disabled={isExporting || !repoName.trim()}
                                size="sm"
                                className="bg-primary text-light hover:bg-primary/90 text-xs font-semibold rounded-[4px] disabled:opacity-50"
                            >
                                {isExporting ? '...' : <ArrowUp className="size-4" />}
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