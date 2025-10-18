import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import { FaCode, FaPlay } from 'react-icons/fa';
import { IoIosPaperPlane, IoMdOptions } from 'react-icons/io';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useState } from 'react';
import BuilderSettingsPanel from '../builder/BuilderSettingsPanel';
import NetworkTicker from '../tickers/NetworkTicker';
import { LiaServicestack } from 'react-icons/lia';

export default function BuilderNavbar() {
    const { session } = useUserSessionStore();
    const [openSettingsPanel, setOpenSettingsPanel] = useState<boolean>(false);
    return (
        <div className="min-h-[3.5rem] bg-dark-base grid grid-cols-[30%_70%] text-light/70 px-6 select-none">
            <div className=" text-[#C3C3C3] text-[17px] tracking-[0.5rem] flex justify-start items-center gap-x-3 cursor-pointer group">
                <LiaServicestack size={28} className="text-primary" />
                WINTERFELL
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start bg-dark rounded-[4px] p-[3px] border border-neutral-800">
                    <ToolTipComponent side="bottom" content="Preview your project in real-time">
                        <FaPlay
                            size={24}
                            className={cn('py-2 rounded-[4px] cursor-pointer transition w-8')}
                        />
                    </ToolTipComponent>
                    <ToolTipComponent side="bottom" content="View and edit the source code">
                        <FaCode
                            size={24}
                            className={cn('py-2 rounded-[4px] cursor-pointer transition w-8')}
                        />
                    </ToolTipComponent>
                </div>

                <div className="flex items-center justify-between gap-x-5">
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
                            size={'sm'}
                            className="bg-light text-dark-base hover:bg-light hover:text-dark-base tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px]"
                        >
                            <IoIosPaperPlane />
                            <span className="text-xs">Deploy</span>
                        </Button>
                    </ToolTipComponent>
                    {session?.user.image && (
                        <Image
                            src={session?.user.image}
                            alt="user"
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
