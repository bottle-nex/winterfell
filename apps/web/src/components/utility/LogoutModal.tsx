import { signOut } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import OpacityBackground from './OpacityBackground';
import { Button } from '../ui/button';
import Card from '../ui/Card';

interface LogoutModalProps {
    openLogoutModal: boolean;
    setOpenLogoutModal: Dispatch<SetStateAction<boolean>>;
}

export default function LogoutModal({ openLogoutModal, setOpenLogoutModal }: LogoutModalProps) {
    async function LogoutHandler() {
        alert("sign out");
        await signOut({
            callbackUrl: '/',
            redirect: true,
        });
    }

    return (
        <div>
            {openLogoutModal && (
                <OpacityBackground>
                    <Card className="max-w-md px-8 py-6 flex flex-col items-center justify-center space-y-6 bg-neutral-950 relative z-[999999]">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-light">Log out ?</h2>
                            <p className="text-sm text-neutral-400 font-normal tracking-wide">
                                You will be logged out of your session and redirected to the Sign in
                                Page.
                            </p>
                        </div>

                        <div className="flex gap-4 w-full">
                            <Button
                                onClick={() => setOpenLogoutModal(false)}
                                className="w-1/2 px-4 py-2 text-sm bg-neutral-900 cursor-pointer tracking-wide hover:bg-neutral-900/70"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={LogoutHandler}
                                className="w-1/2 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-light-base cursor-pointer tracking-wide"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </Card>
                </OpacityBackground>
            )}
        </div>
    );
}
