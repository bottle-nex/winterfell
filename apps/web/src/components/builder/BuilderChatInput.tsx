import { Textarea } from '../ui/textarea';
import { FaChevronUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { MdNotStarted } from 'react-icons/md';

interface TextEditorProps {}

export default function BuilderChatInput({}: TextEditorProps) {
    const [inputValue, setInputValue] = useState<string>('');

    return (
        <motion.div
            layout
            initial={false}
            animate={{
                maxWidth: 'calc(100% - 48px)',
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
            }}
            className="flex items-center justify-center w-full"
        >
            <div className="relative z-10 h-full w-full flex items-center justify-center">
                <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Create a todo application.."
                    className={cn(
                        'h-[2rem] w-full border-neutral-800 border rounded-[4px] py-4 px-4 shadow-xl',
                        'bg-dark',
                        'focus-visible:border-neutral-800/50 focus-visible:ring-0 focus:h-[8rem]',
                        'outline-none transition-all duration-200',
                        'text-light tracking-wider resize-none placeholder:text-md',
                    )}
                />
                <MdNotStarted
                    className={cn(
                        'absolute bottom-2 right-2 rounded-full w-8 h-8 flex items-center justify-center p-1 text-light',
                        inputValue === '' ? 'text-light/50' : 'bg-dark',
                    )}
                />
            </div>
        </motion.div>
    );
}
