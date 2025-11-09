'use client';
import { cn } from '@/src/lib/utils';
import { TabType, useDocsTabStore } from '@/src/store/user/useDocsTabStore';
import { useRouter } from 'next/navigation';

export default function DocsNavbar() {
    const { tab, setActiveTab } = useDocsTabStore();
    const router = useRouter();

    return (
        <div
            className={cn(
                `relative w-full max-w-fit z-[100] flex items-center justify-between`,
                'px-1 py-1 rounded-[8px] top-6 transition-all duration-500 ease-in-out gap-x-1',
                'text-sm tracking-wide bg-dark border border-neutral-800',
            )}
        >
            <div
                className={`absolute transition-all duration-500 ease-in-out -top-[3px] left-0 h-[1.5px] w-5 rounded-t-full bg-white shadow-[0_1px_8px_2px_rgba(255,255,255,0.8)] z-10
          ${tab === TabType.DEV ? 'translate-x-[545%]' : 'translate-x-[165%]'}
        `}
            />

            <div
                onClick={() => {
                    setActiveTab(TabType.CLIENT);
                    router.push('/docs/client');
                }}
                className={`px-5 py-2 rounded-[4px] cursor-pointer transition-all duration-300 relative
            ${
                tab === TabType.CLIENT
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
          ${
              tab === TabType.DEV
                  ? 'bg-neutral-800 text-white'
                  : 'bg-transparent text-neutral-300 hover:bg-neutral-800/50'
          }
        `}
            >
                Dev
            </div>
        </div>
    );
}
