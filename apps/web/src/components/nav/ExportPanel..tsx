import { cn } from '@/src/lib/utils';
import GitCloneCard from './GitCloneCard';
import { AiFillFileZip } from 'react-icons/ai';

export default function ExportPanel() {
    return (
        <div
            className={cn(
                'absolute top-11 right-0 bg-dark-base border border-neutral-800 rounded-md shadow-lg z-20',
                'flex flex-col min-w-[20rem] w-full pb-2',
            )}
        >
            <div className="text-xs tracking-wide p-4 pb-0">
                <GitCloneCard />
            </div>

            <div className="px-4 py-2 text-[12.5px] text-light/70">
                <div className="flex justify-between items-center w-full bg-dark/50 border border-neutral-800 p-1.5 px-2 rounded-[4px] tracking-wide cursor-pointer">
                    Download ZIP
                    <AiFillFileZip className="size-4" />
                </div>
            </div>
        </div>
    );
}
