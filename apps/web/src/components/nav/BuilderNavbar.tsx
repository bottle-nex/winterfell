import Image from 'next/image';
import { IoIosPaperPlane, IoMdOptions } from 'react-icons/io';
import { FaGithub } from 'react-icons/fa';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useEffect, useRef, useState } from 'react';
import BuilderSettingsPanel from '../builder/BuilderSettingsPanel';
import NetworkTicker from '../tickers/NetworkTicker';
import { LiaServicestack } from 'react-icons/lia';
import {
    TbLayoutSidebarRightCollapseFilled,
    TbLayoutSidebarLeftCollapseFilled,
} from 'react-icons/tb';
import { cn } from '@/src/lib/utils';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { WalletPanel } from '../base/WalletPanel';
import axios from 'axios';
import { EXPORT_CONTRACT_URL, GITHUB_CONNECT_URL } from '@/routes/api_routes';
import { useChatStore } from '@/src/store/user/useChatStore';
import ProfileMenu from '../utility/LogoutMenu';
import { Input } from '../ui/input';
import { ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

export default function BuilderNavbar() {
    const { session, setSession } = useUserSessionStore();
    const { collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const [openSettingsPanel, setOpenSettingsPanel] = useState<boolean>(false);
    const [isMac, setIsMac] = useState<boolean>(false);
    const [openWalletPanel, setOpenWalletPanel] = useState<boolean>(false);
    const { contractId } = useChatStore();
    const [showLogoutDropdown, setShowLogoutDropdown] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isConnectingGithub, setIsConnectingGithub] = useState<boolean>(false);
    const [repoName, setRepoName] = useState<string>('');
    const [showRepoPanel, setShowRepoPanel] = useState<boolean>(false);

    const hasGithub = session?.user?.hasGithub;
    const panelRef = useRef<HTMLDivElement | null>(null);

    // Detect platform
    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, []);

    // Handle outside click to close the repo panel
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowRepoPanel(false);
            }
        }

        if (showRepoPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRepoPanel]);

    // Handle GitHub OAuth callback
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
                        {
                            headers: {
                                Authorization: `Bearer ${session?.user?.token}`,
                            },
                        },
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

    const handleConnectGithub = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

        const currentUrl = window.location.origin + window.location.pathname;
        const redirectUrl = encodeURIComponent(currentUrl);
        const scope = encodeURIComponent('repo user');
        const state = 'github-connect';

        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&state=${state}`;
        window.location.href = githubAuthUrl;
    };

    async function handleCodePushToGithub() {
        if (!repoName.trim()) {
            toast.error('Please enter a repository name');
            return;
        }

        if (!contractId) {
            toast.error('No contract found');
            return;
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
                toast.success(`Export to "${repoName}" queued!`);
                setShowRepoPanel(false);
                setRepoName('');
            }
        } catch (error: unknown) {
            console.error('Failed to push to github:', error);

            if (error instanceof Error) {
                toast.error('Please connect your GitHub first');
            } else {
                toast.error('Failed to export to GitHub');
            }
        } finally {
            setIsExporting(false);
        }
    }

    const shortcutKey = isMac ? 'Cmd' : 'Ctrl';

    return (
        <div className="min-h-[3.5rem] bg-dark-base grid grid-cols-[30%_70%] text-light/70 px-6 select-none relative">
            <div className="text-[#C3C3C3] text-[17px] tracking-[0.5rem] flex justify-start items-center gap-x-3 cursor-pointer group">
                <LiaServicestack size={28} className="text-primary" />
                WINTERFELL
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <ToolTipComponent duration={300} content={`collapse | ${shortcutKey} + E`}>
                        <TbLayoutSidebarLeftCollapseFilled
                            size={22}
                            onClick={() => setCollapseFileTree(false)}
                            className={cn(
                                'text-light/70 cursor-pointer hover:-translate-y-[0.5px] transition-transform',
                                !collapseFileTree && 'text-primary',
                            )}
                        />
                    </ToolTipComponent>
                    <ToolTipComponent duration={300} content={`expand | ${shortcutKey} + E`}>
                        <TbLayoutSidebarRightCollapseFilled
                            size={22}
                            onClick={() => setCollapseFileTree(true)}
                            className={cn(
                                'text-light/70 cursor-pointer hover:-translate-y-[0.5px] transition-transform',
                                collapseFileTree && 'text-primary',
                            )}
                        />
                    </ToolTipComponent>
                </div>

                <div className="flex items-center justify-between gap-x-5 relative">
                    <NetworkTicker />

                    <div className="relative">
                        <ToolTipComponent content="Settings" side="bottom">
                            <IoMdOptions
                                onClick={() => setOpenSettingsPanel(true)}
                                className="hover:bg-neutral-700/70 rounded-[4px] p-[4px] h-6 w-6 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
                            />
                        </ToolTipComponent>
                        <BuilderSettingsPanel
                            openSettingsPanel={openSettingsPanel}
                            setOpenSettingsPanel={setOpenSettingsPanel}
                        />
                    </div>

                    <ToolTipComponent
                        content="deploy your contract to the solana blockchain"
                        side="bottom"
                    >
                        <Button
                            onClick={() => setOpenWalletPanel(true)}
                            size={'sm'}
                            className="bg-light text-dark-base hover:bg-light hover:text-dark-base tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px]"
                        >
                            <IoIosPaperPlane />
                            <span className="text-xs">Deploy</span>
                        </Button>
                    </ToolTipComponent>

                    {!hasGithub ? (
                        <ToolTipComponent content="Connect GitHub to export code" side="bottom">
                            <Button
                                onClick={handleConnectGithub}
                                disabled={isConnectingGithub}
                                size={'sm'}
                                className="bg-[#24292e] text-white hover:bg-[#1b1f23] tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px]"
                            >
                                <FaGithub />
                                <span className="text-xs">
                                    {isConnectingGithub ? 'Connecting...' : 'Connect GitHub'}
                                </span>
                            </Button>
                        </ToolTipComponent>
                    ) : (
                        <div className="relative" ref={panelRef}>
                            <ToolTipComponent content="export the codebase to GitHub" side="bottom">
                                <Button
                                    onClick={() => setShowRepoPanel((prev) => !prev)}
                                    disabled={isExporting}
                                    size={'sm'}
                                    className="bg-primary text-light hover:bg-primary/90 hover:text-light/90 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px]"
                                >
                                    <span className="text-xs">Export</span>
                                </Button>
                            </ToolTipComponent>

                            {showRepoPanel && (
                                <div className="absolute top-full mt-3 right-0 bg-dark-base border border-neutral-800 rounded-md shadow-lg p-3 flex gap-2 w-[200px] z-20">
                                    <div className='flex'>
                                        <Input
                                            type="text"
                                            value={repoName}
                                            onChange={(e) => setRepoName(e.target.value)}
                                            placeholder="Enter repo name"
                                            className="w-full rounded-sm border border-neutral-800 text-light text-sm px-3 py-1 focus:outline-none focus:border-primary"
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
                                </div>
                            )}
                        </div>
                    )}

                    {session?.user?.image && (
                        <Image
                            onClick={() => setShowLogoutDropdown((prev) => !prev)}
                            src={session.user.image}
                            alt="user"
                            width={28}
                            height={28}
                            className="rounded-full cursor-pointer"
                        />
                    )}
                    {showLogoutDropdown && (
                        <div className="absolute top-full right-2 mt-2 z-[9999]">
                            <ProfileMenu />
                        </div>
                    )}
                </div>
            </div>

            {openWalletPanel && <WalletPanel close={() => setOpenWalletPanel(false)} />}
        </div>
    );
}
