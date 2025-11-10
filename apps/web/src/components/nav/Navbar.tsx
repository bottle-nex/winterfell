'use client';
import { LiaServicestack } from 'react-icons/lia';
import { IoIosCreate } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import NavItems, { NavItemsType } from './NavItems';
import NavbarSigninAction from './NavSigninAction';
import { cn } from '@/src/lib/utils';
import { v4 as uuid } from 'uuid';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useEffect, useState } from 'react';
import LoginModal from '../utility/LoginModal';
import { MdHomeFilled } from 'react-icons/md';

const navItems: NavItemsType[] = [
    { name: 'Features', link: '#feature' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'Faq', link: '#faq' },
    { name: 'About', link: '#about' },
];

export default function Navbar() {
    const router = useRouter();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(true);
    const [lastScrollY, setLastScrollY] = useState<number>(0);
    const { session } = useUserSessionStore();

    function handleSubmit() {
        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }

        const newContractId = uuid();
        router.push(`/playground/${newContractId}`);
    }

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                // Scrolling up - show navbar
                setIsNavbarVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navbar (only after 100px)
                setIsNavbarVisible(false);
            }

            setLastScrollY(currentScrollY);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            <div
                className={cn(
                    'fixed w-full z-[100] flex items-center justify-between px-6 top-4 transition-all duration-500 ease-in-out',
                    isNavbarVisible
                        ? 'translate-y-0'
                        : '-translate-y-[calc(100%+2rem)] pointer-events-none',
                )}
            >
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
                    <MdHomeFilled
                        onClick={() => router.push("/home")}
                        className="hover:bg-neutral-700/70 hidden md:block rounded-sm p-[4px] h-7 w-7 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
                    />
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
