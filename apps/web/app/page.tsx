import Features from '@/src/components/base/Features';
import Footer from '@/src/components/base/Footer';
import Hero from '@/src/components/base/Hero';
import WhoWeAre from '@/src/components/base/WhoWeAre';
import { GoArrowUpRight } from 'react-icons/go';

export default function Page() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-dark relative ">
            <div className="absolute top-2 left-5 text-[#C3C3C3] text-[17px] tracking-[0.5rem] cursor-pointer z-20 select-none">
                STAIR
            </div>

            <div className="absolute top-2 right-5 text-[#8A8784] text-[17px] tracking-wider hover:tracking-widest flex items-center gap-x-1 cursor-pointer group z-20 select-none">
                DOCS
                <GoArrowUpRight
                    className="group-hover:brightness-150 transition-all duration-300 h-5 w-5"
                    strokeWidth={1}
                />
            </div>

            <div className="flex-1 flex justify-center items-center px-4">
                <Hero />
            </div>

            <Features />
            <WhoWeAre />
            <Footer />
        </div>
    );
}
