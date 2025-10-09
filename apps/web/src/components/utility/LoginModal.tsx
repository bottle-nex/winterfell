'use client';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import OpacityBackground from '../utility/OpacityBackground';
import UtilityCard from '../utility/UtilityCard';
import { Button } from '../ui/button';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';

interface LoginModalProps {
    opensignInModal: boolean;
    setOpenSignInModal: Dispatch<SetStateAction<boolean>>;
}

export default function LoginModal({ opensignInModal, setOpenSignInModal }: LoginModalProps) {
    async function signinHandler(type: 'GOOGLE' | 'GITHUB') {
        signIn(type === 'GOOGLE' ? 'google' : 'github', {
            redirect: false,
            callbackUrl: '/',
        });
    }

    return (
        <div>
            {opensignInModal && (
                <OpacityBackground onBackgroundClick={() => setOpenSignInModal(false)}>
                    <UtilityCard className="max-w-md px-8 py-6 flex flex-col items-center justify-center space-y-6 z-50">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                Sign in to continue
                            </h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                                Log in to access your personalized dashboard, track your quiz
                                performance, and compete with others.
                            </p>
                        </div>

                        {/* Google Sign-in Button */}
                        <Button
                            onClick={() => signinHandler('GOOGLE')}
                            className="w-full flex items-center justify-center gap-3 px-6 py-[22px] text-sm font-medium bg-neutral-200 hover:bg-neutral-200/70 dark:bg-dark-primary/30 hover:dark:bg-dark-primary/40 rounded-md border-[1px] border-neutral-300 dark:border-neutral-700 cursor-pointer"
                        >
                            <Image
                                src="/images/google.png"
                                height={24}
                                width={24}
                                alt="Google"
                                priority
                                unoptimized
                            />
                            <span className="text-neutral-900 dark:text-white text-xs">
                                Sign in with Google
                            </span>
                        </Button>

                        <Button
                            onClick={() => signinHandler('GITHUB')}
                            className="w-full flex items-center justify-center gap-3 px-6 py-[22px] text-sm font-medium bg-neutral-200 hover:bg-neutral-200/70 dark:bg-dark-primary/30 hover:dark:bg-dark-primary/40 rounded-md border-[1px] border-neutral-300 dark:border-neutral-700 cursor-pointer"
                        >
                            <FaGithub className="dark:text-light-base text-dark-primary text-[28px]" />
                            <span className="text-white text-xs">Sign in with GitHub</span>
                        </Button>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center leading-relaxed">
                            By signing in, you agree to our
                            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                {' '}
                                Terms of Service
                            </span>{' '}
                            and
                            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                {' '}
                                Privacy Policy
                            </span>
                        </p>
                    </UtilityCard>
                </OpacityBackground>
            )}
        </div>
    );
}
