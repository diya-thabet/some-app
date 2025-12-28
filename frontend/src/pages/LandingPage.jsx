import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Categories from '../components/Categories';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function LandingPage() {
    return (
        <>
            <Hero />
            <Features />
            <HowItWorks />
            <Categories />
            <Testimonials />
            <CTA />
        </>
    );
}
