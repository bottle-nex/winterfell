import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface UtilitySideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    content: React.ReactNode;
    bottomLogo?: boolean;
    blob?: boolean;
}

export default function SideBar({
    open,
    setOpen,
    content,
    bottomLogo,
    blob,
}: UtilitySideBarProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, setOpen]);

    return (
        <>
            <div
                ref={ref}
                className={`fixed top-0 right-0 h-screen bg-dark-base px-6 py-5 w-[24rem] border-l-[1px] border-neutral-800 shadow-xl z-50 rounded-[8px] transform transition-transform ease-in-out duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} overflow-hidden flex flex-col`}
            >
                {blob && (
                    <div className="absolute right-0 pointer-events-none w-full h-full">
                        <div className="gooey-blob"></div>
                    </div>
                )}

                <div className={`flex-1 overflow-hidden ${bottomLogo ? 'pb-2' : ''}`}>
                    {content}
                </div>
            </div>
        </>
    );
}
