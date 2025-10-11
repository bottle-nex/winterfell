'use client';
import Features from '@/src/components/base/Features';
import Footer from '@/src/components/base/Footer';
import Hero from '@/src/components/base/Hero';
import WhoWeAre from '@/src/components/base/WhoWeAre';
import LenisProvider from '@/src/providers/LenisProvider';
import Navbar from '@/src/components/nav/Navbar';

export default function Page() {
    return (
        <LenisProvider>
            <div className="min-h-screen w-full flex flex-col bg-dark relative">
                <Navbar />
                <Hero />
                <Features />
                <div className="relative h-[200vh]">
                    <div className="sticky top-0 h-screen overflow-hidden">
                        <Footer />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-screen">
                        <WhoWeAre />
                    </div>
                </div>
            </div>
        </LenisProvider>
    );
}
