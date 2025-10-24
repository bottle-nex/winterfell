'use client';
import { LiaServicestack } from 'react-icons/lia';
import { IoIosCreate } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import NavItems, { NavItemsType } from './NavItems';
import NavbarSigninAction from './NavSigninAction';
import { cn } from '@/src/lib/utils';
import { v4 as uuid } from 'uuid';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useState } from 'react';
import LoginModal from '../utility/LoginModal';

const navItems: NavItemsType[] = [
    { name: 'Features', link: '#feature' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'Contact', link: '#contact' },
    { name: 'About', link: '#about' },
];

export default function Navbar() {
    const router = useRouter();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    function handleSubmit() {
        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }

        const newChatId = uuid();
        router.push(`/playground/${newChatId}`);
    }

    return (
        <>
            <div className="absolute w-full z-[100] flex items-center justify-between px-6 transition-all duration-500 top-4">
                <div className="flex items-center justify-between gap-x-2">
                    <LiaServicestack className="text-primary h-10 w-10 transition-all duration-500" />
                    <span className="tracking-[0.1rem] font-semibold">WINTERFELL</span>
                </div>

                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500">
                    <div
                        className={cn(
                            'py-1 px-2 rounded-[8px] flex items-center justify-center transition-all duration-500',
                        )}
                    >
                        <NavItems items={navItems} />
                    </div>
                </div>

                <div className="flex items-center gap-x-4">
                    <IoIosCreate
                        onClick={handleSubmit}
                        className="hover:bg-neutral-700/70 hidden md:block rounded-sm p-[4px] h-7 w-7 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
                    />
                    <NavbarSigninAction />
                </div>
            </div>
            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
