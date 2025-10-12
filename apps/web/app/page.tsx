'use client';
import { useRef } from 'react';
import Features from '@/src/components/base/Features';
import Footer from '@/src/components/base/Footer';
import Hero from '@/src/components/base/Hero';
import WhoWeAre from '@/src/components/base/WhoWeAre';
import LenisProvider from '@/src/providers/LenisProvider';
import Navbar from '@/src/components/nav/Navbar';
import WhatWeDo from '@/src/components/base/WhatWeDo';

export default function Page() {
    const parallaxContainerRef = useRef<HTMLDivElement>(null);
    
    return (
        <LenisProvider>
            <div className="min-h-screen w-full flex flex-col bg-dark relative">
                <Navbar />
                <Hero />
                <Features />
                <WhoWeAre />
                
                <div ref={parallaxContainerRef} className="relative h-[200vh]">
                    <div className="sticky top-0 h-screen overflow-hidden">
                        <Footer containerRef={parallaxContainerRef} />
                    </div>
                </div>
            </div>
        </LenisProvider>
    );
}