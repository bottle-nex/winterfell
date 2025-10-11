import { cn } from '@/src/lib/utils';
import BuilderChatInput from './BuilderChatInput';

export const dummyMessages = [
    {
        id: 'msg2',
        chatId: 'chat1',
        role: 'USER',
        content: 'Hey, can you generate a token contract for me?',
        createdAt: new Date('2025-10-10T10:01:00Z'),
    },
    {
        id: 'msg3',
        chatId: 'chat1',
        role: 'AI',
        content: 'Sure! Do you want it to be mintable or fixed supply?',
        createdAt: new Date('2025-10-10T10:01:30Z'),
    },
    {
        id: 'msg4',
        chatId: 'chat1',
        role: 'USER',
        content: 'Fixed supply of 1,000,000 tokens.',
        createdAt: new Date('2025-10-10T10:02:00Z'),
    },
    {
        id: 'msg5',
        chatId: 'chat1',
        role: 'AI',
        content: 'Understood. Generating contract…',
        createdAt: new Date('2025-10-10T10:02:30Z'),
    },
];

export default function BuilderChats() {
    return (
        <div className="w-full flex flex-col justify-between h-full pt-4">
            <div className="flex flex-col w-full gap-y-3 text-light text-sm px-6 overflow-y-auto flex-1">
                {dummyMessages.map((message) => (
                    <div key={message.id} className="">
                        {/* { message.role === 'USER' && <Image src={"/user.png"} alt="user" width={40} height={40} /> } */}
                        <div
                            key={message.id}
                            className={cn(
                                'flex w-full',
                                message.role === 'USER' ? 'justify-end' : 'justify-start',
                            )}
                        >
                            <div
                                className={cn(
                                    'max-w-[70%] px-4 py-2 rounded-[4px] text-sm',
                                    message.role === 'USER' && 'bg-dark text-light font-semibold',
                                )}
                            >
                                {message.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center w-full py-4">
                <BuilderChatInput />
            </div>
        </div>
    );
}
