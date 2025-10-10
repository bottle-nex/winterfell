"use client";
import PocketCard from "@/src/components/base/PocketCard";
import { GoArrowUpRight } from "react-icons/go";

export default function Page() {

    return (
        <div className="h-screen overflow-y-auto w-screen flex flex-col bg-dark justify-center items-center pt-10 px-4 relative">

            <div className="absolute top-2.5 left-10 text-[#C3C3C3] text-[17px] tracking-[0.5rem] flex justify-start items-center gap-x-1 cursor-pointer group">
                STAIR
            </div>
            <div className="absolute top-2.5 right-10 text-[#8A8784] text-[17px] tracking-wider hover:tracking-widest flex justify-start items-center gap-x-1 cursor-pointer group">
                DOCS
                <GoArrowUpRight className="group-hover:brightness-150 transform ease-in-out duration-300 h-5 w-5" strokeWidth={1} />
            </div>

            <PocketCard/>
        </div>
    );
}
