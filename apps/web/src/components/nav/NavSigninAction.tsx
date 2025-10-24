'use client';
import { MdChevronRight } from 'react-icons/md';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useState, useEffect, useRef } from 'react';
import LoginModal from '../utility/LoginModal';
import ProfileMenu from '../utility/LogoutMenu';

export default function NavbarSigninAction() {
    const { session } = useUserSessionStore();
    const router = useRouter();
    const [opensignInModal, setOpenSignInModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function handler() {
        if (!session?.user || !session?.user.token) {
            setOpenSignInModal(true);
        } else {
            router.push('/home');
        }
    }

    return (
        <div className="relative">
            {!session?.user ? (
                <Button
                    onClick={handler}
                    className={cn(
                        'text-[13px] font-semibold tracking-wide flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer z-[10] pr-1 rounded-lg',
                        'bg-primary',
                    )}
                >
                    <span>Sign in</span>
                    <MdChevronRight className="text-light" />
                </Button>
            ) : (
                <div ref={dropdownRef} className="relative">
                    <div
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="flex items-center justify-center gap-x-3 hover:bg-neutral-700/70 py-1.5 px-3 rounded-lg cursor-pointer select-none"
                    >
                        <span className="text-light text-sm tracking-wider font-semibold">
                            {`${session?.user?.name?.split(' ')[0]}'s Winterfell`}
                        </span>
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

                    {showDropdown && (
                        <div className="absolute top-full right-0 mt-2 z-[9999]">
                            <ProfileMenu />
                        </div>
                    )}
                </div>
            )}
            <LoginModal opensignInModal={opensignInModal} setOpenSignInModal={setOpenSignInModal} />
        </div>
    );
}
