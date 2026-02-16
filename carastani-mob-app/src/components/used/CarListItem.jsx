import React, { useState, useMemo } from 'react';
import { Fuel, Armchair, Gauge, Settings, Calendar, MapPin, ExternalLink, Star, Shield, ChevronRight, Heart, Share2, Scale, Check } from 'lucide-react';
import { CarScoreBar } from '../common/CarScore';

// Seller platform configurations
const SELLERS = ['Cars24', 'Spinny', 'CarWale', 'OLX', 'CarDekho', 'Droom'];
const SELLER_STYLES = {
    'Cars24': {
        bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
        text: 'text-white',
        border: 'border-orange-500',
        light: 'bg-orange-50 text-orange-600'
    },
    'Spinny': {
        bg: 'bg-gradient-to-r from-purple-600 to-purple-700',
        text: 'text-white',
        border: 'border-purple-600',
        light: 'bg-purple-50 text-purple-600'
    },
    'CarWale': {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        text: 'text-white',
        border: 'border-blue-600',
        light: 'bg-blue-50 text-blue-600'
    },
    'OLX': {
        bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
        text: 'text-black',
        border: 'border-yellow-500',
        light: 'bg-yellow-50 text-yellow-600'
    },
    'CarDekho': {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        text: 'text-white',
        border: 'border-red-500',
        light: 'bg-red-50 text-red-600'
    },
    'Droom': {
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        text: 'text-white',
        border: 'border-green-500',
        light: 'bg-green-50 text-green-600'
    },
};

const CarListItem = ({ car, isSelected, onToggleCompare, compareMode }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Memoize seller - use car.seller if available, otherwise assign based on car.id for consistency
    const seller = useMemo(() => {
        if (car.seller) return car.seller;
        // Use car.id or name to generate a consistent seller
        const index = (car.id || car.name?.length || 0) % SELLERS.length;
        return SELLERS[index];
    }, [car.id, car.seller, car.name]);

    const sellerStyle = SELLER_STYLES[seller] || SELLER_STYLES['Cars24'];

    // Prepare car data for score calculation
    const carForScore = {
        ...car,
        manufacturer: car.manufacturer || car.make || car.name?.split(' ')[0],
        fuel_type: car.fuel_type || car.fuelType,
        kms_driven: car.kms_driven || car.mileage || 50000,
    };

    // Memoize rating - generate consistent rating based on car properties
    const rating = useMemo(() => {
        // Generate a pseudo-random but consistent rating based on car.id or name
        const seed = (car.id || car.name?.length || 0) * 17;
        const base = 4 + (seed % 10) / 10;
        return base.toFixed(1);
    }, [car.id, car.name]);

    // Format price
    const formattedPrice = useMemo(() => {
        if (typeof car.price === 'string') return car.price;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(car.price);
    }, [car.price]);

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border transition-all duration-500 overflow-hidden group ${isHovered ? 'shadow-xl border-primary/30 transform -translate-y-1' : 'border-gray-100'
                } ${compareMode && isSelected ? 'ring-2 ring-primary bg-primary/5' : ''} ${compareMode ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => compareMode && onToggleCompare && onToggleCompare(car)}
        >
            <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="w-full lg:w-80 h-56 lg:h-auto flex-shrink-0 relative overflow-hidden">
                    <img
                        src={car.image}
                        alt={car.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        onError={(e) => {
                            e.target.src = 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80';
                        }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}></div>

                    {/* Compare Selection Indicator - Only show when compare mode is active */}
                    {compareMode && (
                        <label
                            className="absolute top-3 left-3 z-10 flex items-center gap-2 cursor-pointer group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`relative w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 transform ${isSelected
                                ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg scale-105 rotate-0'
                                : 'bg-white/95 backdrop-blur-md border-2 border-gray-200 text-gray-400 hover:border-primary hover:scale-110 hover:rotate-6'
                                }`}>
                                {/* Inner circle for unselected state */}
                                {!isSelected && (
                                    <div className="w-3 h-3 rounded-full border-2 border-gray-300 group-hover:border-primary transition-colors"></div>
                                )}

                                {/* Checkmark for selected state */}
                                {isSelected && (
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="animate-bounce-in"
                                    >
                                        <path
                                            d="M5 13l4 4L19 7"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}

                                {/* Glow effect for selected state */}
                                {isSelected && (
                                    <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse"></div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected || false}
                                onChange={() => onToggleCompare && onToggleCompare(car)}
                            />
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all duration-300 ${isSelected
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-black/20 backdrop-blur-sm text-white shadow-sm'
                                }`}>
                                Compare
                            </span>
                        </label>
                    )}

                    {/* Badges */}
                    <div className="absolute top-12 left-3 flex gap-2 transition-all">
                        <span className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {car.year}
                        </span>
                        <span className={`${sellerStyle.bg} ${sellerStyle.text} text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                            {seller}
                        </span>
                    </div>

                    {/* Favorite button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:text-red-500'
                            }`}
                    >
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    {/* Price tag */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-xl font-bold text-primary">{formattedPrice}</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-grow p-4 lg:p-6 flex flex-col justify-between">
                    {/* Header */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{car.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-semibold text-gray-700">{rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">|</span>
                                    <span className="text-sm text-gray-500">{car.bodyType}</span>
                                </div>
                            </div>

                            {/* Verified badge */}
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                <Shield size={12} />
                                Verified
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mt-4">
                            <div className="bg-gray-50 rounded-xl p-2 lg:p-3 text-center transition-colors group-hover:bg-gray-100">
                                <Gauge size={16} className="mx-auto text-primary mb-1" />
                                <p className="text-xs text-gray-500">Mileage</p>
                                <p className="text-xs lg:text-sm font-semibold">{car.kms_driven ? car.kms_driven.toLocaleString() : '50,000'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2 lg:p-3 text-center transition-colors group-hover:bg-gray-100">
                                <Fuel size={16} className="mx-auto text-primary mb-1" />
                                <p className="text-xs text-gray-500">Fuel</p>
                                <p className="text-xs lg:text-sm font-semibold">{car.fuelType || car.fuel_type}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2 lg:p-3 text-center transition-colors group-hover:bg-gray-100">
                                <Settings size={16} className="mx-auto text-primary mb-1" />
                                <p className="text-xs text-gray-500">Transmission</p>
                                <p className="text-xs lg:text-sm font-semibold">{car.transmission || 'Manual'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2 lg:p-3 text-center transition-colors group-hover:bg-gray-100">
                                <MapPin size={16} className="mx-auto text-primary mb-1" />
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-xs lg:text-sm font-semibold truncate">{car.location || 'India'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Carastani Score */}
                    <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-100">
                        <CarScoreBar car={carForScore} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-100">
                        <div className="flex gap-2 lg:gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleCompare && onToggleCompare(car);
                                }}
                                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all border ${isSelected
                                    ? 'bg-primary/10 text-primary border-primary font-bold shadow-inner'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-transparent font-medium'}`}
                                aria-label={isSelected ? `Remove ${car.name} from comparison` : `Add ${car.name} to comparison`}
                                title={isSelected ? "Remove from comparison" : "Add to comparison"}
                            >
                                {isSelected ? <Check size={16} /> : <Scale size={16} />}
                                <span className="hidden sm:inline">{isSelected ? 'Added' : 'Compare'}</span>
                            </button>
                            <button className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center text-gray-500 hover:text-primary bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" title="Share">
                                <Share2 size={18} />
                            </button>
                        </div>

                        {/* Seller button with brand colors */}
                        <button
                            className={`flex items-center gap-2 ${sellerStyle.bg} ${sellerStyle.text} font-bold px-4 lg:px-6 py-2 lg:py-2.5 rounded-full transition-all hover:shadow-lg hover:scale-105 text-xs lg:text-sm`}
                        >
                            <ExternalLink size={16} />
                            View on {seller}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarListItem;
