"use client"
import Navbar from "@/src/components/nav/Navbar";
import { GoArrowUpRight } from "react-icons/go";

export default function Page() {
    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-dark justify-center items-center pt-10 px-4 relative">

            <div className="absolute top-2.5 left-10 text-[#C3C3C3] text-[17px] tracking-[0.5rem] transition-all transform duration-300 flex justify-start items-center gap-x-1 cursor-pointer group">
                STAIR
            </div>

            <div className="absolute top-2.5 right-10 text-[#8A8784] text-[17px] tracking-wider hover:tracking-widest transition-all transform duration-300 flex justify-start items-center gap-x-1 cursor-pointer group">
                DOCS
                <GoArrowUpRight className=" group-hover:brightness-150 transform ease-in-out duration-300 h-5 w-5" strokeWidth={1} />
            </div>

            <div className="h-full w-full rounded-t-[8px] bg-dark-base relative overflow-hidden py-4 px-3">
                <Navbar />
                {/* 
                <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <ParticleSphere />
                    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas> */}
            </div>

        </div>
    );
}