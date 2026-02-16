import React from 'react';
import AdsHero from '../components/ads/AdsHero';
import WhatsNew from '../components/ads/WhatsNew';
import TechSpecs from '../components/ads/TechSpecs';
import Features from '../components/ads/Features';
import DesignInfo from '../components/ads/DesignInfo';

const Ads = () => {
    return (
        <main>
            <AdsHero />
            <WhatsNew />
            <TechSpecs />
            <Features />
            <DesignInfo />
        </main>
    );
};

export default Ads;
