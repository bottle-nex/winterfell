'use client';
import { LiaServicestack } from 'react-icons/lia';
import NavbarSearch from './NavbarSearch';
import NavbarRightSection from './NavbarRightSection';
import NavbarSidebarToggle from './NavbarSidebarToggle';

export default function BuilderNavbar() {
    return (
        <div className="min-h-[3.5rem] bg-dark-base grid grid-cols-[30%_70%] text-light/70 px-6 select-none relative">
            <div className="text-[#C3C3C3] text-sm tracking-[0.5rem] flex justify-start items-center gap-x-3 cursor-pointer group">
                <LiaServicestack size={25} className="text-primary" />
                WINTERFELL
            </div>

            <div className="flex items-center justify-between">
                <NavbarSidebarToggle />
                <NavbarSearch />
                <NavbarRightSection />
            </div>
        </div>
    );
}
