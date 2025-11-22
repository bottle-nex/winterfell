'use client';
import { useRef } from 'react';
import Features from '@/src/components/base/Features';
import Footer from '@/src/components/base/Footer';
import Hero from '@/src/components/base/Hero';
import WhoWeAre from '@/src/components/base/WhoWeAre';
import LenisProvider from '@/src/providers/LenisProvider';
import Navbar from '@/src/components/nav/Navbar';
import SubscriptionPlans from '@/src/components/utility/SubscriptionCard';
import Faq from '@/src/components/base/Faq';
import ReviewsSection from '@/src/components/utility/ReviewsSection';

export default function Page() {
    const parallaxContainerRef = useRef<HTMLDivElement>(null);

    return (
        <LenisProvider>
            <div className="min-h-screen w-full flex flex-col bg-dark relative">
                <Navbar />
                <Hero />
                <Features />
                <WhoWeAre />
                <SubscriptionPlans />
                <ReviewsSection />
                <Faq />
                <Footer />
            </div>
        </LenisProvider>
    );
}
