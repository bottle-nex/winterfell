import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';  
import { Terminal, ArrowRight, FileCode } from 'lucide-react';  
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DashboardTextAreaComponent() {
    const [inputValue, setInputValue] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="relative group"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-600/20 via-neutral-500/20 to-neutral-600/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50 bg-neutral-900/50">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                            <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                        </div>
                        <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono h-full">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>shark.ai</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-1.5 justify-center">
                        <div
                            className={cn(
                                'w-1.5 h-1.5 rounded-full transition-colors duration-300 mb-0.5',
                                isTyping
                                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                    : 'bg-neutral-700',
                            )}
                        />
                        <span className="text-xs text-neutral-600 font-mono">
                            {isTyping ? 'active' : 'idle'}
                        </span>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute left-4 top-5 text-neutral-600 font-mono text-sm select-none">
                        &gt;
                    </div>
                    <Textarea
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsTyping(e.target.value.length > 0);
                        }}
                        placeholder="create a counter program..."
                        className={cn(
                            'w-full h-28 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0',
                            'placeholder:text-neutral-800 placeholder:font-mono placeholder:text-sm resize-none',
                            'focus:outline-none transition-all duration-200',
                            'text-md tracking-wider',
                            'caret-[#e6e0d4]',
                        )}
                        rows={3}
                    />
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-800/50 bg-neutral-900/30">
                    <div className="flex items-center gap-3">
                        <Button className="group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                            <FileCode className="w-3.5 h-3.5 mb-0.5" />
                            <span className="font-mono">templates</span>
                        </Button>
                        <div className="w-px h-3 bg-neutral-800" />
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono">
                            <span className={cn(inputValue.length > 200 && 'text-red-500')}>
                                {inputValue.length}
                            </span>
                            <span className="text-neutral-800">/</span>
                            <span className="text-neutral-700">200</span>
                        </div>
                    </div>

                    <Button
                        disabled={!inputValue.trim()}
                        className={cn(
                            'group/submit flex items-center gap-2 h-8 w-9 px-2 py-1 rounded-[4px] font-mono text-xs duration-200',
                            'transition-all duration-200',
                            inputValue.trim()
                                ? 'bg-neutral-800 text-neutral-300 hover:text-neutral-200'
                                : 'bg-neutral-900 text-neutral-700 cursor-not-allowed',
                        )}
                    >
                        <ArrowRight
                            className={cn(
                                'w-3 h-3 transition-transform',
                                inputValue.trim() &&
                                    'group-hover/submit:translate-x-0.5 duration-200',
                            )}
                        />
                    </Button>
                </div>
            </div>

            <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-50" />
        </motion.div>
    );
}
