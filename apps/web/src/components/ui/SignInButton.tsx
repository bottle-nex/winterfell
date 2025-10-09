'use client';
import { MdChevronRight } from 'react-icons/md';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import LoginModal from '../utility/LoginModal';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useRouter } from 'next/navigation';

export default function NavbarSigninAction() {
    const { session } = useUserSessionStore();
    const router = useRouter();
    const [opensignInModal, setOpenSignInModal] = useState<boolean>(false);

    function handler() {
        if (!session?.user|| !session?.user.token) {
            setOpenSignInModal(true);
        } else {
            router.push('/home');
        }
    }

    return (
        <div className="">
            <Button
                onClick={handler}
                className={cn(
                    '!rounded-[2rem] hover:!rounded-[0.50rem]',
                    'font-seminold text-[13px] text-dark-primary !bg-[#ffcc00] tracking-wide flex items-center justify-center hover:-translate-y-0.5 cursor-pointer z-[10] py-[19px] !px-5',
                    '!transition-all !duration-200 !ease-[cubic-bezier(0.4,0,0.2,1)]',
                    'shadow-[inset_0_2px_4px_rgba(255,255,255,0.25)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)]',
                )}
            >
                <span>{session?.user ? 'Go to app' : 'Sign in'}</span>
                <MdChevronRight />
            </Button>
            <LoginModal opensignInModal={opensignInModal} setOpenSignInModal={setOpenSignInModal} />
        </div>
    );
}
