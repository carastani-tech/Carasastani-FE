import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCars from '../components/home/FeaturedCars';
import TrendingSearch from '../components/home/TrendingSearch';
import BrowseByType from '../components/home/BrowseByType';
import UsedCarsPreview from '../components/home/UsedCarsPreview';
import ContactForm from '../components/home/ContactForm';
import Brands from '../components/home/Brands';

const Home = () => {
    return (
        <main>
            <Hero />
            <FeaturedCars />
            <UsedCarsPreview />
            <TrendingSearch />
            <BrowseByType />
            <ContactForm />
            <Brands />
        </main>
    );
};

export default Home;
