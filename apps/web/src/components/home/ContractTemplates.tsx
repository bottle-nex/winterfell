import { anchorContractTemplates } from '@/src/templates/contract_templates.const';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';

export default function ContractTemplates() {
    return (
        <div className="w-full h-full flex flex-col px-2 tracking-wider">
            <div className="w-full flex justify-between py-1 text-sm px-1">
                <span className="text-light">Featured Templates</span>
            </div>

            <div className="h-full flex gap-x-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2">
                {anchorContractTemplates.map((contract) => (
                    <div
                        key={contract.id}
                        className="h-full min-w-[calc(30%-12px)] grid grid-rows-[85%_15%] overflow-hidden group"
                    >
                        <div className="bg-[#0A0C0D70] overflow-hidden shadow-sm border border-neutral-800 rounded-[8px] relative">
                            <Image
                                src={'/Images/template/image.png'}
                                alt=""
                                fill
                                className="object-cover opacity-90"
                            />
                        </div>

                        <div className="text-light/40 h-full w-full flex items-center justify-between px-1">
                            <div className="text-sm">{contract.title}</div>

                            <div className="flex gap-x-2.5 justify-center items-center h-full">
                                <div className="flex space-x-1">
                                    <FaUser className="size-3" />
                                    <span className="text-xs">1.4k</span>
                                </div>

                                <div className="flex space-x-1">
                                    <FaHeart className="size-3 hover:text-red-500 " />
                                    <span className="text-xs">32</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
