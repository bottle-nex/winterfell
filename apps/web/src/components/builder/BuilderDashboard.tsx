'use client';
import { motion, AnimatePresence } from 'framer-motion';
import BuilderChats from './BuilderChats';
import CodeEditor from '../code/CodeEditor';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import BuilderLoader from './BuilderLoader';
import { JSX } from 'react';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';

export default function BuilderDashboard(): JSX.Element {
    const { loading } = useBuilderChatStore();
    const { collapseChat } = useCodeEditor();

    return (
        <div className="w-full h-full flex flex-row bg-dark-base z-0 overflow-hidden">
            <AnimatePresence mode="wait">
                {!collapseChat && (
                    <motion.div
                        key="builder-chats"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                    >
                        <BuilderChats />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                }}
                className="pb-4 px-4 h-full flex-1 min-w-0"
            >
                <div className="w-full h-full z-10 border-neutral-800 border rounded-[4px] relative overflow-hidden">
                    {loading ? <BuilderLoader /> : <CodeEditor />}
                </div>
            </motion.div>
        </div>
    );
}