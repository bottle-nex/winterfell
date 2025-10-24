import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ArrowRight, FileCode } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useRouter } from 'next/navigation';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { v4 as uuid } from 'uuid';
import LoginModal from '../utility/LoginModal';
import ModelSelect from '../base/ModelSelect';
import { ChatRole } from '@/src/types/prisma-types';
import { useModelStore } from '@/src/store/model/useModelStore';

export default function BuilderChatInput() {
    const [inputValue, setInputValue] = useState<string>('');
    const { selectedModel, setSelectedModel } = useModelStore();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const { setMessage } = useBuilderChatStore();
    const router = useRouter();

    function handleSubmit() {
        if (inputValue.trim() === '') return;

        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }

        const newContractId = uuid();

        setMessage({
            id: uuid(),
            contractId: newContractId,
            role: ChatRole.USER,
            content: inputValue,
            planning: false,
            generatingCode: false,
            building: false,
            creatingFiles: false,
            finalzing: false,
            error: false,
            createdAt: new Date(),
        });

        router.push(`/playground/${newContractId}`);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <>
            <div className="relative group w-full">
                <div className="relative rounded-lg border border-neutral-800 overflow-hidden">
                    <div className="relative bg-[#0c0d0e]">
                        <div className="absolute left-4 top-5 text-neutral-600 font-mono text-sm select-none">
                            &gt;
                        </div>
                        <Textarea
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="create a counter program..."
                            className={cn(
                                'w-full focus:h-28 h-15 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0',
                                'placeholder:text-neutral-800 placeholder:font-mono placeholder:text-sm resize-none',
                                'focus:outline-none transition-all duration-200',
                                'text-md tracking-wider',
                                'caret-[#e6e0d4]',
                            )}
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-800/50 bg-[#101114]">
                        <div className="flex items-center gap-x-1">
                            <ModelSelect value={selectedModel} onChange={setSelectedModel} />
                            <Button
                                type="button"
                                className="group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                            >
                                <FileCode className="w-3.5 h-3.5 mb-0.5" />
                                <span className="font-mono">templates</span>
                            </Button>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono">
                                <span className={cn(inputValue.length > 200 && 'text-red-500')}>
                                    {inputValue.length}
                                </span>
                                <span className="text-neutral-800">/</span>
                                <span className="text-neutral-700">200</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            disabled={!inputValue.trim()}
                            onClick={handleSubmit}
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
            </div>

            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
