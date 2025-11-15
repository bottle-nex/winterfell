import { cn } from '@/src/lib/utils';
import { FaArrowRightLong } from 'react-icons/fa6';
import SafariBrowser from '../../ui/SafariBrowser';

interface WorkSpaceCardProps {
    title: string;
    description: string;
    redirectLink: string;
    imageUrl: string;
    className?: string;
}

export default function ClientWorkspaceCard({
    title,
    description,
    redirectLink,
    imageUrl,
    className,
}: WorkSpaceCardProps) {
    return (
        <div
            style={{
                maskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.84) 50%, rgba(0,0,0,0) 100%)',
            }}
            className={cn(
                'h-[60vh] w-full rounded-[14px] overflow-hidden p-3 min-h-[96%]',
                'border border-neutral-800 bg-neutral-900 relative',
                'shadow-2xl',
                className,
            )}
        >
            <div className="absolute top-0 left-2 h-px bg-linear-to-r from-transparent via-light/50 to-transparent w-full" />
            <div
                className={cn(
                    'h-full w-full rounded-lg border border-neutral-800 group-hover:border-neutral-700 overflow-hidden',
                    'p-8 flex flex-col gap-y-10 relative items-center',
                    'bg-linear-to-br from-neutral-900 via-neutral-800/40 to-neutral-900',
                    'group tracking-wide',
                )}
            >
                <div className="absolute top-0 left-2 h-px bg-linear-to-r from-transparent via-light/20 group-hover:via-light/70 to-transparent w-full transition-colors duration-300" />
                <div
                    className={cn(
                        'absolute inset-0 opacity-0 group-hover:opacity-100',
                        'transition-all duration-500 pointer-events-none',
                    )}
                    style={{
                        background:
                            'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,255,255,0.2), transparent 70%)',
                    }}
                />

                <div
                    className={cn(
                        'flex justify-between items-start w-full text-light/90',
                        'relative hover:z-30',
                    )}
                >
                    <div className={cn('flex flex-col items-start gap-y-1')}>
                        <div className={cn('text-xl font-semibold group-hover:text-white')}>
                            {title}
                        </div>
                        <div className={cn('text-sm')}>
                            <span
                                className={cn(
                                    'cursor-pointer text-light/70 transition-all',
                                    'transform duration-200 group-hover:underline',
                                )}
                            >
                                {redirectLink}
                            </span>
                            <span className={cn('text-light/60')}> - {description}</span>
                        </div>
                    </div>

                    <div>
                        <FaArrowRightLong
                            className={cn(
                                'size-6 group-hover:translate-x-2 group-hover:text-white',
                                'group-hover:brightness-150 transition-all transform duration-300',
                            )}
                            strokeWidth="0.1"
                        />
                    </div>
                </div>

                <div
                    className={cn(
                        'absolute w-full max-w-[90%] h-full -bottom-32',
                        'group-hover:-translate-y-4 transition-all transform duration-400 opacity-90',
                    )}
                >
                    <SafariBrowser
                        url="winterfell.dev"
                        className={cn('group-hover:shadow-xl')}
                        imageSrc={imageUrl}
                    />
                </div>
            </div>
        </div>
    );
}
