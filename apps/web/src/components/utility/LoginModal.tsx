'use client';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import OpacityBackground from '../utility/OpacityBackground';
import { Button } from '../ui/button';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import Card from '../ui/Card';
import { Input } from '../ui/input';
import { GoArrowRight } from 'react-icons/go';

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
                    <Card className="w-full max-w-[420px] px-10 py-8 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-[#150e2e] via-[#0a0a0a] to-[#0a0a0a] text-white rounded-[8px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-50 h-20 bg-gradient-to-r from-[#6640EF] to-transparent blur-xl opacity-30 pointer-events-none" />

                        <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-5">
                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-bold tracking-widest bg-gradient-to-br from-[#e9e9e9] to-[#575757] bg-clip-text text-transparent">
                                    Welcome to WINTERFELL
                                </h2>
                                <p className="text-[13px] text-light/80 tracking-wide">
                                    Sign in to your account
                                </p>
                            </div>
                            <div className="relative w-full">
                                <Input
                                    type="email"
                                    placeholder="username@gmail.com"
                                    className="w-full bg-[#0a0a0a] text-[#d4d8de] placeholder:text-neutral-500 border border-neutral-800 rounded-full px-5 py-5.5 pr-12 focus:outline-none placeholder:tracking-wider"
                                />
                                <Button className="absolute h-7 w-7 right-2 top-1/2 -translate-y-1/2 bg-[#6640EF] hover:translate-x-0.5 text-black rounded-full py-2 transition-transform">
                                    <GoArrowRight className="text-dark-base" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-center w-full text-[#6b7177] text-xs">
                                <div className="flex-grow h-px bg-[#2a2d31]" />
                                <span className="mx-3">OR</span>
                                <div className="flex-grow h-px bg-[#2a2d31]" />
                            </div>

                            <Button
                                onClick={() => signinHandler('GOOGLE')}
                                className="w-full flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium bg-[#0f0f0f] hover:bg-[#141414] border border-neutral-800 rounded-full transition-all"
                            >
                                <Image
                                    src="/Images/google.png"
                                    height={20}
                                    width={20}
                                    alt="G"
                                    priority
                                    unoptimized
                                />
                                <span className="text-[#d4d8de] text-sm tracking-wide">
                                    Continue with Google
                                </span>
                            </Button>

                            <Button
                                onClick={() => signinHandler('GITHUB')}
                                className="w-full flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium bg-[#0f0f0f] hover:bg-[#141414] border border-neutral-800 rounded-full transition-all"
                            >
                                <FaGithub className="text-[#d4d8de] size-5" />
                                <span className="text-[#d4d8de] text-sm tracking-wide">
                                    Continue with GitHub
                                </span>
                            </Button>

                            <div>
                                <span className="text-xs text-neutral-300 tracking-wider ">
                                    By signing in, you agree to our <br />
                                    <span className="text-[#9e83ff] hover:underline cursor-pointer">
                                        {' '}
                                        Terms & Service
                                    </span>{' '}
                                    and
                                    <span className="text-[#9e83ff] hover:underline cursor-pointer">
                                        {' '}
                                        Privacy Policy
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Card>
                </OpacityBackground>
            )}
        </div>
    );
}
