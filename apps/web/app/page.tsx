"use client";
import AnimatedCircleText from "@/src/components/base/AnimatedCircleText";
import Hero from "@/src/components/base/Hero";
import Navbar from "@/src/components/nav/Navbar";
import { Button } from "@/src/components/ui/button";
import { ChevronRight } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";

export default function Page() {

    return (
        <div className="h-screen overflow-y-auto w-screen flex flex-col bg-[#080808] justify-center items-center pt-10 px-4 relative">

            <div className="absolute top-2.5 left-10 text-[#C3C3C3] text-[17px] tracking-[0.5rem] flex justify-start items-center gap-x-1 cursor-pointer group">
                STAIR
            </div>
            <div className="absolute top-2.5 right-10 text-[#8A8784] text-[17px] tracking-wider hover:tracking-widest flex justify-start items-center gap-x-1 cursor-pointer group">
                DOCS
                <GoArrowUpRight className="group-hover:brightness-150 transform ease-in-out duration-300 h-5 w-5" strokeWidth={1} />
            </div>

            <div className="h-full w-full rounded-t-[8px] bg-dark-base relative overflow-hidden py-3 px-2 flex flex-col items-center">
                <Navbar />

                <div className="flex h-full w-full relative">
                    <div className="w-[80%] h-full flex justify-start items-center font-extrabold text-[#FDF9EF] text-7xl pb-20 z-10">
                        <Hero />
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 font-extrabold text-[#FDF9EF] text-[80px] tracking-wide flex justify-center items-center z-10">
                    <Button className="flex items-center bg-light text-dark-base hover:bg-[#FDF9EF] transition-colors duration-300 group">
                        Redefine smart contracts
                        <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                            <ChevronRight />
                        </span>
                    </Button>
                </div>

                <AnimatedCircleText />
            </div>
        </div>
    );
}
