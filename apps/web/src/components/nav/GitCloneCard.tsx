'use client';
import { IoCheckmark, IoCopyOutline } from 'react-icons/io5';
import { Button } from '../ui/button';
import { useState } from 'react';
import ToolTipComponent from '../ui/TooltipComponent';
import { cn } from '@/src/lib/utils';
import { HiPencil } from 'react-icons/hi2';
import { FiInfo } from 'react-icons/fi';
import { Input } from '../ui/input';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { IoIosSend } from 'react-icons/io';
import axios from 'axios';
import { EXPORT_CONTRACT_URL } from '@/routes/api_routes';
import { toast } from 'sonner';
import { useChatStore } from '@/src/store/user/useChatStore';

enum CloneOptions {
    HTTPS = 'HTTPS',
    SSH = 'SSH',
}

export default function GitCloneCard() {
    const [activeTab, setActiveTab] = useState<CloneOptions>(CloneOptions.HTTPS);
    const [repoName, setRepoName] = useState<string>('winterfell');
    const [editingRepo, setEditingRepo] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const { contractId } = useChatStore();

    const httpsURL = `https://github.com/${session?.user.githubUsername}/${repoName}.git`;
    const sshURL = `git@github.com:${session?.user.githubUsername}/${repoName}.git`;

    const finalURL = activeTab === CloneOptions.HTTPS ? httpsURL : sshURL;

    async function handleCodePushToGithub() {
        if (!repoName.trim()) {
            return toast.error('Please enter a repository name');
        }
        if (!contractId) {
            return toast.error('No contract found');
        }

        try {
            const response = await axios.post(
                EXPORT_CONTRACT_URL,
                {
                    repo_name: repoName,
                    contract_id: contractId,
                    hasGithub: session?.user.token,
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
                setRepoName('');
            } else {
                toast.error(response.data.message || 'Failed to export');
            }
        } catch (error) {
            console.error('Export error:', error);
        }
    }

    return (
        <div className="flex flex-col gap-y-2 rounded-[8px] overflow-hidden">
            <div className="flex justify-between items-center text-sm pb-1">
                <span>Clone using the web URL</span>
                <ToolTipComponent content="Which remote URL should I use?">
                    <FiInfo className="size-4 text-light/60" />
                </ToolTipComponent>
            </div>

            <div className="flex gap-x-2">
                <Button
                    onClick={() => setActiveTab(CloneOptions.HTTPS)}
                    size="xs"
                    className={cn(
                        'text-[11px] tracking-wider font-semibold !bg-dark text-light border border-transparent',
                        activeTab === CloneOptions.HTTPS
                            ? 'border text-dark !bg-light'
                            : 'hover:brightness-125',
                    )}
                >
                    HTTPS
                </Button>

                <Button
                    onClick={() => setActiveTab(CloneOptions.SSH)}
                    size="xs"
                    className={cn(
                        'text-[11px] tracking-wider font-semibold !bg-dark text-light border border-transparent',
                        activeTab === CloneOptions.SSH
                            ? 'border text-dark !bg-light'
                            : 'hover:brightness-125',
                    )}
                >
                    SSH
                </Button>
            </div>

            <div className="flex items-center gap-2 w-full">
                <div className="relative group flex-1 bg-dark/50 border border-neutral-800 px-3 py-2 rounded-[4px] flex items-center truncate">
                    <span className="text-[13px] tracking-wider truncate select-none pr-12">
                        {finalURL}
                    </span>

                    <div className="absolute right-3 inset-y-0 flex items-center gap-2.5">
                        <ToolTipComponent content="Copy">
                            <IoCopyOutline
                                className="size-3.5 cursor-pointer text-light/80 hover:-translate-y-[1px] transition-transform"
                                onClick={() => navigator.clipboard.writeText(finalURL)}
                            />
                        </ToolTipComponent>

                        <ToolTipComponent content="Edit repo name">
                            <HiPencil
                                className="size-3.5 cursor-pointer hover:-translate-y-[1px] transition-transform"
                                onClick={() => setEditingRepo((prev) => !prev)}
                            />
                        </ToolTipComponent>
                    </div>
                </div>

                <Button
                    size="icon"
                    className="h-8 w-8 flex items-center justify-center"
                    onClick={handleCodePushToGithub}
                >
                    <IoIosSend className="size-5" />
                </Button>
            </div>

            {editingRepo && (
                <div className="flex items-center gap-2 mt-1">
                    <Input
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        placeholder="e.g. counter-program"
                        autoFocus
                        className="bg-dark/50 border border-neutral-700 p-1 h-7 !text-[12px] placeholder:text-[12px] rounded-[4px] w-36"
                    />
                    <Button
                        size="xs"
                        className="px-2 py-1 h-7 text-xs bg-light/90 text-dark-base"
                        onClick={() => setEditingRepo(false)}
                    >
                        <IoCheckmark />
                    </Button>
                </div>
            )}
        </div>
    );
}
