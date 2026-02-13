import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Heart, Eye, X, ChevronLeft, ChevronRight, Check, Scale, Fuel, Gauge, Calendar, Star, Sparkles } from 'lucide-react';
import { CarScoreBar } from '../common/CarScore';

// Reliable car images with fallbacks
const FEATURED_CARS = [
    {
        id: 1,
        make: 'Maruti Suzuki',
        model: 'Swift',
        variant: 'ZXi AMT',
        year: 2023,
        price: '6.5 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg?isig=0&q=80',
        transmission: 'AMT',
        fuelType: 'Petrol',
        kms_driven: 15000,
        seller: 'Cars24'
    },
    {
        id: 2,
        make: 'Hyundai',
        model: 'Creta',
        variant: 'SX(O)',
        year: 2024,
        price: '18.2 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
        transmission: 'Automatic',
        fuelType: 'Diesel',
        kms_driven: 8000,
        seller: 'Spinny'
    },
    {
        id: 3,
        make: 'Tata',
        model: 'Nexon',
        variant: 'XZ+ Dark',
        year: 2023,
        price: '14.5 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/157265/nexon-exterior-right-front-three-quarter-75.jpeg?isig=0&q=80',
        transmission: 'Manual',
        fuelType: 'Diesel',
        kms_driven: 22000,
        seller: 'CarWale'
    },
    {
        id: 4,
        make: 'Mahindra',
        model: 'XUV700',
        variant: 'AX7 L',
        year: 2024,
        price: '24.8 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
        transmission: 'Automatic',
        fuelType: 'Diesel',
        kms_driven: 5000,
        seller: 'OLX'
    },
    {
        id: 5,
        make: 'Kia',
        model: 'Seltos',
        variant: 'GTX+',
        year: 2023,
        price: '19.8 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/seltos-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
        transmission: 'DCT',
        fuelType: 'Petrol',
        kms_driven: 12000,
        seller: 'Cars24'
    },
    {
        id: 6,
        make: 'Honda',
        model: 'City',
        variant: 'ZX CVT',
        year: 2023,
        price: '16.5 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/121943/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80',
        transmission: 'CVT',
        fuelType: 'Petrol',
        kms_driven: 18000,
        seller: 'Spinny'
    },
    {
        id: 7,
        make: 'Toyota',
        model: 'Fortuner',
        variant: 'Legender 4x4',
        year: 2024,
        price: '45.5 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg?isig=0&q=80',
        transmission: 'Automatic',
        fuelType: 'Diesel',
        kms_driven: 3000,
        seller: 'CarWale'
    },
    {
        id: 8,
        make: 'MG',
        model: 'Hector',
        variant: 'Sharp Pro',
        year: 2023,
        price: '22.8 Lakh',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/hector-exterior-right-front-three-quarter-73.jpeg?isig=0&q=80',
        transmission: 'CVT',
        fuelType: 'Petrol',
        kms_driven: 16000,
        seller: 'OLX'
    },
];

// Seller brand colors
const SELLER_COLORS = {
    'Cars24': { bg: 'bg-orange-500', text: 'text-white' },
    'Spinny': { bg: 'bg-purple-600', text: 'text-white' },
    'CarWale': { bg: 'bg-blue-600', text: 'text-white' },
    'OLX': { bg: 'bg-yellow-500', text: 'text-black' },
};

const FeaturedCars = () => {
    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate cars for seamless infinite scroll
    const duplicatedCars = [...FEATURED_CARS, ...FEATURED_CARS];

    const handleViewDetails = (car) => {
        setSelectedCar(car);
    };

    const handleSelectForCompare = (car) => {
        setSelectedForCompare(prev => {
            if (prev.find(c => c.id === car.id)) {
                return prev.filter(c => c.id !== car.id);
            }
            if (prev.length >= 2) {
                return [...prev.slice(1), car];
            }
            return [...prev, car];
        });
    };

    const isSelected = (carId) => selectedForCompare.some(c => c.id === carId);

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            {/* Header */}
            <div className="container mx-auto px-6 md:px-12 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-accent md:w-5 md:h-5" />
                            <span className="text-accent text-xs md:text-sm font-semibold uppercase tracking-widest">Expert's Pick</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">Handpicked for You</h2>
                        <p className="text-gray-500 mt-2 text-sm md:text-base">Premium verified cars from trusted sellers</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/used'}
                        className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold text-sm md:text-base px-5 py-2.5 md:px-6 md:py-3 rounded-full transition-all hover:gap-4"
                    >
                        View All
                        <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                </div>
            </div>

            {/* Infinite Marquee Carousel */}
            <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    className="flex gap-6 animate-marquee"
                    style={{
                        animationPlayState: isPaused ? 'paused' : 'running',
                        width: 'fit-content'
                    }}
                >
                    {duplicatedCars.map((car, index) => (
                        <div
                            key={`${car.id}-${index}`}
                            className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[340px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                        >
                            {/* Image Section */}
                            <div className="relative h-40 sm:h-44 md:h-52 bg-gray-100 overflow-hidden">
                                <img
                                    src={car.image}
                                    alt={car.model}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>



                                {/* Year badge */}
                                <span className="absolute top-3 right-3 bg-accent text-black text-xs font-bold px-3 py-1 rounded-full">
                                    {car.year}
                                </span>

                                {/* Seller badge */}
                                <span className={`absolute bottom-3 right-3 ${SELLER_COLORS[car.seller]?.bg} ${SELLER_COLORS[car.seller]?.text} text-xs font-bold px-3 py-1 rounded-full`}>
                                    {car.seller}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4 md:p-5">
                                <div className="mb-2">
                                    <h3 className="text-base md:text-lg font-bold text-gray-900 truncate" title={`${car.year} ${car.make} ${car.model}`}>
                                        {car.year} {car.make} {car.model}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-500 truncate">{car.variant}</p>
                                </div>

                                {/* Quick specs */}
                                <div className="flex gap-3 mb-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Gauge size={12} /> {car.transmission}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Fuel size={12} /> {car.fuelType}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} /> {car.kms_driven?.toLocaleString()} km
                                    </span>
                                </div>

                                {/* Carastani Score */}
                                <div className="mb-4">
                                    <CarScoreBar car={car} showLabel={false} />
                                </div>

                                {/* Price & CTA */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div>
                                        <span className="text-2xl font-bold text-primary">₹{car.price}</span>
                                        <span className="text-xs text-gray-400 ml-1">onwards</span>
                                    </div>
                                    <button
                                        onClick={() => handleViewDetails(car)}
                                        className="flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2 transition-all"
                                    >
                                        Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Car Details Modal */}
            {selectedCar && (
                <CarDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} />
            )}

            {/* Marquee animation styles */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

// Simple Details Modal
const CarDetailsModal = ({ car, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white"
                >
                    <X size={20} />
                </button>

                <div className="h-64 bg-gray-100">
                    <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                </div>

                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500">{car.make}</p>
                            <h2 className="text-2xl font-bold">{car.model} {car.variant}</h2>
                        </div>
                        <span className={`${SELLER_COLORS[car.seller]?.bg} ${SELLER_COLORS[car.seller]?.text} text-sm font-bold px-4 py-2 rounded-full`}>
                            {car.seller}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <Calendar size={20} className="mx-auto text-primary mb-1" />
                            <p className="text-sm text-gray-500">Year</p>
                            <p className="font-bold">{car.year}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <Gauge size={20} className="mx-auto text-primary mb-1" />
                            <p className="text-sm text-gray-500">KMs</p>
                            <p className="font-bold">{car.kms_driven?.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <Fuel size={20} className="mx-auto text-primary mb-1" />
                            <p className="text-sm text-gray-500">Fuel</p>
                            <p className="font-bold">{car.fuelType}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <CarScoreBar car={car} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-3xl font-bold text-primary">₹{car.price}</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/used'}
                            className="bg-accent hover:bg-red-600 text-white font-bold px-8 py-3 rounded-full transition-colors"
                        >
                            View on {car.seller}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCars;
