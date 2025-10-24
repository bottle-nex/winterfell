'use client';
import { TbSettings2 } from 'react-icons/tb';
import { IoMdLogOut } from 'react-icons/io';
import Card from '../ui/Card';
import LogoutModal from './LogoutModal';
import { useState } from 'react';

export default function ProfileMenu() {
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    function handleLogoutClick() {
        setOpenLogoutModal(true);
    }

    return (
        <div className="w-[10rem] bg-[#141414] border border-neutral-700 shadow-lg rounded-lg overflow-hidden">
            <Card className="p-0 bg-transparent border-0 shadow-none">
                <div>
                    <div className="px-4 py-[11px] text-xs font-light text-light hover:bg-dark border-b border-neutral-700 cursor-pointer tracking-wide">
                        Docs
                    </div>
                    <div className="px-4 py-[11px] text-xs font-light text-light hover:bg-dark dark:text-light-base border-b border-neutral-700 flex justify-between cursor-pointer tracking-wide">
                        Settings
                        <TbSettings2 size={14} />
                    </div>
                    <div
                        className="px-4 py-[11px] text-xs font-normal text-red-500 hover:bg-dark flex justify-between cursor-pointer"
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
