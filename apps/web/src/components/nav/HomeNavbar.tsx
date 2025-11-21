'use client';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Image from 'next/image';
import ProfileMenu from '../utility/ProfileMenu';
import { useState } from 'react';
import { LiaServicestack } from 'react-icons/lia';
import { IoIosCreate } from 'react-icons/io';

export default function HomeNavbar() {
    const [showLogoutDropdown, setShowLogoutDropdown] = useState<boolean>(false);
    const { session } = useUserSessionStore();

    return (
        <div className="w-full min-h-14 text-light/70 px-6 select-none relative flex justify-between items-center z-10">
            <div className="text-[#C3C3C3] text-[17px] tracking-[0.5rem] flex justify-start items-center gap-x-3 cursor-pointer group">
                <LiaServicestack size={28} className="text-primary" />
                WINTERFELL
            </div>
            <div className="flex items-center justify-center gap-x-6 text-sm">
                <div className="font-semibold cursor-pointer flex items-center justify-center gap-x-2 hover:text-primary text-light/70 transition-transform hover:-translate-y-0.5">
                    <IoIosCreate className="hover:bg-neutral-700/70 hidden md:block rounded-sm p-[4px] h-7 w-7 select-none cursor-pointer" />
                    <span className="">Playgroud</span>
                </div>
                <div className="font-semibold cursor-pointer transition-transform hover:-translate-y-0.5 hover:text-primary text-light/70">
                    Docs
                </div>
                <div className="">
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
                        <div className="absolute top-full right-2 mt-2 z-9999">
                            <ProfileMenu setOpenProfleMenu={setShowLogoutDropdown} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
