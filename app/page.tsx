'use client'
import Head from 'next/head';
import FinalCTA from './components/FinalCTA';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import PopularCourses from './components/PopularCourse';
import StatsSection from './components/StatsSection';
import TestimonialsSection from './components/TestimonialSection';
import WhyChooseUs from './components/WhyUs';

export default function Home() {
  return (
    <>
      <Head>
        <title>NKBIINFINITY - Industry-Ready Training Programs</title>
        <meta name="description" content="Comprehensive training programs in IT, finance, healthcare, and engineering. Bridge the gap between academic learning and industry demands." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HeroSection />
        <WhyChooseUs />
        <StatsSection />
        <PopularCourses />
        <MissionSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
    </>
  );
}