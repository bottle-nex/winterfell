import { cn } from '@/src/lib/utils';

export default function DeployedTicker({ isDeployed }: { isDeployed: boolean }) {
    return (
        <div
            className={cn(
                isDeployed
                    ? 'bg-green-700/30 border-[0.5px] border-green-600'
                    : 'bg-orange-600/30 border-[0.5px] border-orange-700',
                'w-fit h-fit text-xs text-light/90 px-1.5 py-0.5 tracking-wider rounded-[1.5px]',
            )}
        >
            {isDeployed ? 'deployed' : 'not deployed'}
        </div>
    );
}
