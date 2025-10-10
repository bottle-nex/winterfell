import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function Hero() {
    return (
        <div className="flex flex-col gap-y-3 pl-10 select-none relative">

            <span className="tracking-wide drop-shadow-2xl">THE EASIEST WAY</span>

            <span>
                <span className="tracking-wide">TO BUILD</span>
                <span className="tracking-wide">{" "}SMART</span>
                <span className="tracking-wide drop-shadow-2xl">{" "}CONTRACTS</span>
            </span>

            <span className="tracking-wide">DEPLOY SMARTER</span>

            <div className="flex gap-x-4 items-center">
                <span className="tracking-wide text-stroke">NOT HARDER</span>

                <div className="relative overflow-hidden rounded-full bg-[#7A78FF] text-dark-base px-7 h-12 flex items-center w-40">
                    <div className="flex animate-marquee gap-x-4 whitespace-nowrap">
                        {[...Array(14)].map((_, i) => (
                            <ChevronRight key={i} />
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 5s linear infinite;
        }
      `}</style>
        </div>
    );
}
