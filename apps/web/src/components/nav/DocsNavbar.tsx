'use client';
import { cn } from '@/src/lib/utils';
import { TabType, useDocsTabStore } from '@/src/store/user/useDocsTabStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppLogo from '../tickers/AppLogo';

export default function DocsNavbar() {
    const { tab, setActiveTab } = useDocsTabStore();
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        if (pathName.includes('/docs/client')) {
            setActiveTab(TabType.CLIENT);
        } else if (pathName.includes('/docs/dev')) {
            setActiveTab(TabType.DEV);
        }
    }, [pathName, setActiveTab]);

    return (
        <div className="flex items-center justify-between w-full px-4 py-2 fixed z-[99999] top-0">
            <AppLogo />
            <div
                className={cn(
                    `relative w-full max-w-fit z-100 flex items-center justify-between mt-4`,
                    'px-1 py-1 rounded-xl transition-all duration-500 ease-in-out gap-x-1',
                    'text-sm tracking-wide bg-dark border border-neutral-800',
                )}
            >
                <div
                    className={`absolute transition-all duration-500 ease-in-out -top-[3px] left-0 h-[1.5px] w-5 rounded-t-full bg-primary shadow-[0_1px_8px_2px_rgba(108,68,252,0.8)] z-10
          ${tab === TabType.DEV ? 'translate-x-[545%]' : 'translate-x-[165%]'}
        `}
                />

                <div
                    onClick={() => {
                        setActiveTab(TabType.CLIENT);
                        router.push('/docs/client');
                    }}
                    className={`px-5 py-2 rounded-lg cursor-pointer transition-all duration-300 relative
            ${tab === TabType.CLIENT
                            ? 'bg-neutral-800 text-white'
                            : 'bg-transparent text-neutral-300 hover:bg-neutral-800/50'
                        }
          `}
                >
                    Client
                </div>

                <div
                    onClick={() => {
                        setActiveTab(TabType.DEV);
                        router.push('/docs/dev');
                    }}
                    className={`px-5 py-2 rounded-[4px] cursor-pointer transition-all duration-300 relative
          ${tab === TabType.DEV
                            ? 'bg-neutral-800 text-white'
                            : 'bg-transparent text-neutral-300 hover:bg-neutral-800/50'
                        }
        `}
                >
                    Dev
                </div>
            </div>
            <div />
        </div>
    );
}
