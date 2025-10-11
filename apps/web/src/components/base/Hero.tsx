"use client";
import { useState, useEffect } from "react";
import AnimatedCircleText from "@/src/components/base/AnimatedCircleText";
import Navbar from "@/src/components/nav/Navbar";
import { Button } from "@/src/components/ui/button";
import { ChevronRight } from "lucide-react";
import CircularDotsCanvas from "./CircularDotCanvas";

export default function Hero() {
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="relative flex flex-col justify-between items-center h-screen w-full bg-black rounded-[8px] overflow-hidden mt-9 shadow-[0_-2px_30px_rgba(0,0,0,0.5)]">

            <CircularDotsCanvas />

            <div className="absolute h-[900px] w-[900px] rounded-full -top-80 -right-40 flex justify-center items-center">
                <div className="h-[700px] w-[700px] rounded-full" />
            </div>

            <div
                className={`w-full flex fixed justify-center items-start pt-2 z-10 px-5 transition-all duration-300 ${scrolled ? "backdrop-blur-xs -translate-y-10" : ""
                    }`}
            >
                <Navbar />
            </div>

            <div className="flex-1 w-full flex justify-center items-center z-10"></div>

            <div className="absolute bottom-12 right-5 z-1">
                <Button className="flex items-center bg-[#FDF9EF] text-[#080808] hover:bg-[#eae6db] transition-all duration-300 group rounded-full px-6 py-3">
                    Redefine smart contracts
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                        <ChevronRight />
                    </span>
                </Button>
            </div>

            <div className="absolute inset-0 bottom-7 flex justify-center items-center z-0 pointer-events-none">
                <AnimatedCircleText />
            </div>
        </main>
    );
}
