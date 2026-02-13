import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Search, ArrowRight } from 'lucide-react';

// Trending searches with seller platform links
const TRENDING_SEARCHES = [
    {
        id: 1,
        name: 'Maruti Swift',
        searchCount: '45K+ searches',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg?isig=0&q=80',
        seller: 'Cars24',
        sellerColor: 'bg-orange-500'
    },
    {
        id: 2,
        name: 'Hyundai Creta',
        searchCount: '38K+ searches',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
        seller: 'Spinny',
        sellerColor: 'bg-purple-600'
    },
    {
        id: 3,
        name: 'Tata Nexon',
        searchCount: '32K+ searches',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/157265/nexon-exterior-right-front-three-quarter-75.jpeg?isig=0&q=80',
        seller: 'CarWale',
        sellerColor: 'bg-blue-600'
    },
    {
        id: 4,
        name: 'Honda City',
        searchCount: '28K+ searches',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121943/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80',
        seller: 'OLX',
        sellerColor: 'bg-yellow-500'
    },
    {
        id: 5,
        name: 'Mahindra XUV700',
        searchCount: '25K+ searches',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
        seller: 'CarDekho',
        sellerColor: 'bg-red-600'
    },
    {
        id: 6,
        name: 'Kia Seltos',
        searchCount: '22K+ searches',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/seltos-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
        seller: 'Droom',
        sellerColor: 'bg-green-600'
    },
];

const TrendingSearch = () => {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 4;

    const handlePrev = () => {
        setStartIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setStartIndex(prev => Math.min(TRENDING_SEARCHES.length - visibleCount, prev + 1));
    };

    const visibleSearches = TRENDING_SEARCHES.slice(startIndex, startIndex + visibleCount);

    return (
        <div className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={20} className="text-accent" />
                            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Hot Right Now</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trending Searches</h2>
                        <p className="text-gray-500 mt-2">Most searched cars from across platforms</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrev}
                            disabled={startIndex === 0}
                            className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={startIndex >= TRENDING_SEARCHES.length - visibleCount}
                            className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {visibleSearches.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={() => window.location.href = `/used?search=${encodeURIComponent(item.name)}`}
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-black/90 transition-all"></div>



                            {/* Trending badge */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                <TrendingUp size={12} className="text-accent" />
                                {item.searchCount}
                            </div>

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                <h3 className="text-xl font-bold mb-2">{item.name}</h3>

                                {/* Search button */}
                                <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-accent text-white text-sm font-semibold px-4 py-2 rounded-full transition-all group-hover:bg-accent">
                                    <Search size={14} />
                                    Search Cars
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Platform badges */}
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    <p className="w-full text-center text-gray-500 text-sm mb-4">Aggregating results from</p>
                    {[
                        { name: 'Cars24', color: 'bg-orange-500' },
                        { name: 'Spinny', color: 'bg-purple-600' },
                        { name: 'CarWale', color: 'bg-blue-600' },
                        { name: 'OLX', color: 'bg-yellow-500 !text-black' },
                        { name: 'CarDekho', color: 'bg-red-600' },
                        { name: 'Droom', color: 'bg-green-600' },
                    ].map(platform => (
                        <span
                            key={platform.name}
                            className={`${platform.color} text-white text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform cursor-pointer`}
                        >
                            {platform.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingSearch;
