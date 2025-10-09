import { cn } from "@/lib/utils";
import Image from "next/image";
import { FaCode, FaPlay } from "react-icons/fa";
import { IoIosPaperPlane } from "react-icons/io";
import ToolTipComponent from "../ui/TooltipComponent";
import { Button } from "../ui/button";

export default function BuilderNavbar() {
    return (
        <div className="h-[3.5rem] bg-dark-base grid grid-cols-[30%_70%] text-light/70 px-6 select-none">
            <div></div>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start bg-neutral-800 rounded-lg p-[3px] border border-neutral-600">
                    <ToolTipComponent
                        side="bottom"
                        content="Preview your project in real-time"
                    >
                        <FaPlay
                            size={24}
                            className={cn(
                                "py-2 rounded-md cursor-pointer transition w-8",
                            )}
                        />
                    </ToolTipComponent>
                    <ToolTipComponent
                        side="bottom"
                        content="View and edit the source code"
                    >
                        <FaCode
                            size={24}
                            className={cn(
                                "py-2 rounded-md cursor-pointer transition w-8",
                            )}
                        />
                    </ToolTipComponent>
                </div>

                <div className="max-w-[20rem] w-full flex items-center justify-end border border-neutral-600 rounded-full p-[14px]"></div>

                <div className="flex items-center justify-between gap-x-5">
                    <Button
                        size={"sm"}
                        className="bg-light text-dark-base hover:bg-light hover:text-dark-base tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold"
                    >
                        <IoIosPaperPlane />
                        <span>publish</span>
                    </Button>
                    {session?.user.image && (
                        <Image
                            src={session?.user.image}
                            alt="user"
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
