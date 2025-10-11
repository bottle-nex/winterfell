'use client';
import { LiaServicestack } from 'react-icons/lia';
import { IoIosCreate } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import NavItems from './NavItems';
import NavbarSigninAction from './NavSigninAction';
import { useEffect, useState } from 'react';

const navItems = [
    { name: 'Features', link: '#features' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'Contact', link: '#contact' },
    { name: 'About', link: '#about' },
];

export default function Navbar() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full z-[100] flex items-center justify-between px-5 py-2 transition-all duration-500">
            <NavItems items={navItems} />

            <div className="flex items-center justify-between gap-x-2">
                <LiaServicestack className="text-light/70 h-10 w-10 transition-all duration-500" />
            </div>

            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500">
                <div
                    className={`
            py-1 px-2 rounded-[8px] flex items-center justify-center
            transition-all duration-500
            ${
                scrolled
                    ? 'bg-dark border border-neutral-800 shadow-lg max-w-fit w-full'
                    : 'bg-transparent border-none shadow-none'
            }
          `}
                >
                    <NavItems items={navItems} />
                </div>
            </div>

            <div className=" flex items-center gap-x-4">
                <IoIosCreate
                    onClick={() => router.push('/make')}
                    className="hover:bg-neutral-700/70 rounded-sm p-[4px] h-7 w-7 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
                />
                <NavbarSigninAction />
            </div>
        </div>
    );
}
