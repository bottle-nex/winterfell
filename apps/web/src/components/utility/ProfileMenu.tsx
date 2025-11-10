'use client';
import { SlDocs } from 'react-icons/sl';
import { TbSettings2 } from 'react-icons/tb';
import { IoMdLogOut } from 'react-icons/io';
import Card from '../ui/Card';
import LogoutModal from './LogoutModal';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';

interface ProfileMenuProps {
    setOpenProfleMenu: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileMenu({ setOpenProfleMenu }: ProfileMenuProps ) {
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    function handleLogoutClick() {
        setOpenLogoutModal(true);
    }
    useHandleClickOutside([profileMenuRef], setOpenProfleMenu)

    return (
        <div ref={profileMenuRef} className="w-[9rem] bg-dark-base border border-neutral-800 shadow-lg rounded-[4px] overflow-hidden">
            <Card className="p-0 bg-transparent border-0 shadow-none font-semibold">
                <div>
                    <div className="px-4 py-[11px] text-xs text-light hover:bg-dark/30 dark:text-light-base border-b border-neutral-800 flex justify-between cursor-pointer tracking-wide">
                        Docs
                        <SlDocs />
                    </div>
                    <div className="px-4 py-[11px] text-xs text-light hover:bg-dark/30 dark:text-light-base border-b border-neutral-800 flex justify-between cursor-pointer tracking-wide">
                        Settings
                        <TbSettings2 size={14} />
                    </div>
                    <div
                        className="px-4 py-[11px] text-xs text-red-500 hover:bg-dark/30 flex justify-between cursor-pointer"
                        onClick={handleLogoutClick}
                    >
                        Sign Out
                        <IoMdLogOut size={14} />
                    </div>
                </div>
            </Card>

            <LogoutModal
                openLogoutModal={openLogoutModal}
                setOpenLogoutModal={setOpenLogoutModal}
            />
        </div>
    );
}
