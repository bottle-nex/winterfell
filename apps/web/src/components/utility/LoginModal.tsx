'use client';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import OpacityBackground from '../utility/OpacityBackground';
import { Button } from '../ui/button';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import Card from '../ui/Card';

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
                    <Card className="max-w-md px-8 py-6 flex flex-col items-center justify-center space-y-6 z-50 bg-dark-base text-light">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-light">
                                Sign in to continue
                            </h2>
                            <p className="text-sm text-neutral-400 font-normal">
                                Log in to access your personalized dashboard, track your quiz
                                performance, and compete with others.
                            </p>
                        </div>

                        {/* Google Sign-in Button */}
                        <Button
                            onClick={() => signinHandler('GOOGLE')}
                            className="w-full flex items-center justify-center gap-3 px-6 py-[22px] text-sm font-medium bg-dark-base hover:bg-neutral-900 rounded-md border border-neutral-800 cursor-pointer"
                        >
                            <Image
                                src="/images/google.png"
                                height={24}
                                width={24}
                                alt="Google"
                                priority
                                unoptimized
                            />
                            <span className="text-light text-xs">
                                Sign in with Google
                            </span>
                        </Button>

                        {/* GitHub Sign-in Button */}
                        <Button
                            onClick={() => signinHandler('GITHUB')}
                            className="w-full flex items-center justify-center gap-3 px-6 py-[22px] text-sm font-medium bg-dark-base hover:bg-neutral-900 rounded-md border border-neutral-800 cursor-pointer"
                        >
                            <FaGithub className="text-light text-[28px]" />
                            <span className="text-light text-xs">Sign in with GitHub</span>
                        </Button>

                        <p className="text-xs text-neutral-400 text-center leading-relaxed">
                            By signing in, you agree to our
                            <span className="text-blue-400 hover:underline cursor-pointer">
                                {' '}
                                Terms of Service
                            </span>{' '}
                            and
                            <span className="text-blue-400 hover:underline cursor-pointer">
                                {' '}
                                Privacy Policy
                            </span>
                        </p>
                    </Card>
                </OpacityBackground>
            )}
        </div>
    );
}
