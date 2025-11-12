"use client";

import { useState } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";

export default function GithubPanel() {
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const handleGithubConnect = async () => {
        try {
            setIsConnecting(true);
            await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay

            setIsConnected(true);
        } catch (err) {
            console.error("GitHub connection failed", err);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-light/90">
            <div className="flex flex-col items-center gap-y-4 px-5 py-6">
                <PiGithubLogoFill size={48} />
                <h2 className="text-lg font-semibold">Connect your GitHub</h2>
                <p className="text-[13px] text-light/60 text-center tracking-wide">
                    Connect your GitHub account to automatically push your generated
                    contract to your repository.
                </p>

                {!isConnected ? (
                    <Button
                        disabled={isConnecting}
                        size="xs"
                        className="bg-[#24292e] text-light hover:bg-[#24292e] gap-2.5 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-[4px] w-full"
                    >
                        <FaGithub className="size-3.5 text-light" />
                        <span className="text-[11px]">
                            {isConnecting ? 'Connecting...' : 'Connect GitHub'}
                        </span>
                    </Button>
                ) : (
                    <Button
                        onClick={handleGithubConnect}
                        disabled={true}
                        className="mt-2 bg-light/10 hover:bg-light/20 text-primary rounded-xl px-6 py-2"
                    >
                        <PiGithubLogoFill size={20} />
                        connected to github
                    </Button>
                )}
            </div>
        </div>
    );
}
