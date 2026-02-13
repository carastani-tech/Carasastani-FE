import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, X, Car, Calculator, Sparkles, CreditCard, Shield, ChevronRight, Check, Scale, Star } from 'lucide-react';
import { fetchAllMasterData } from '../../services/masterDataService';
import { getSelectedCity, setSelectedCity } from '../../utils/cityStorage';

// Brand logos with actual SVG/image URLs
const brandLogos = [
    { name: 'Maruti Suzuki', logo: 'https://www.carlogos.org/car-logos/maruti-suzuki-logo.png' },
    { name: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
    { name: 'Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png' },
    { name: 'Tata', logo: 'https://www.carlogos.org/car-logos/tata-logo.png' },
    { name: 'Mahindra', logo: 'https://www.carlogos.org/car-logos/mahindra-logo.png' },
    { name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
    { name: 'Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png' },
    { name: 'MG', logo: 'https://www.carlogos.org/car-logos/mg-logo.png' }
];

// Service tabs
const serviceTabs = [
    { id: 'buy', label: 'Buy', fullLabel: 'Buy Used Car', icon: Car, active: true },
    { id: 'value', label: 'Valuation', fullLabel: 'Car Valuation', icon: Calculator, comingSoon: true },
    { id: 'loan', label: 'Loan', fullLabel: 'Car Loan', icon: CreditCard, comingSoon: true },
    { id: 'insurance', label: 'Insurance', fullLabel: 'Insurance', icon: Shield, comingSoon: true }
];

// Simple animated brand word with brand styling for Carastani
const AnimatedBrand = () => {
    const words = ['Carastani', 'Clarity', 'Choice'];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const renderWord = (word) => {
        if (word === 'Carastani') {
            return (
                <>
                    <span className="text-accent font-extrabold">car</span>
                    <span className="text-primary">astani</span>
                </>
            );
        }
        return <span className="text-primary">{word}</span>;
    };

    return (
        <span className="relative inline-block min-w-[140px] sm:min-w-[180px] md:min-w-[240px]">
            {words.map((word, index) => (
                <span
                    key={word}
                    className={`absolute left-0 transition-all duration-700 ease-out
                        ${index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                >
                    {renderWord(word)}
                </span>
            ))}
            <span className="invisible">{words[0]}</span>
        </span>
    );
};

// Subtle tagline animation
const AnimatedTagline = () => {
    const phrases = ['Dream it.', 'Find it.', 'Drive it.'];
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % 3);
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-semibold mt-2 sm:mt-3">
            {phrases.map((phrase, index) => (
                <span
                    key={phrase}
                    className={`transition-all duration-500 ${index === activeIndex
                        ? 'text-accent scale-105 sm:scale-110 opacity-100'
                        : 'text-white/50 scale-100 opacity-60'
                        }`}
                >
                    {phrase}
                </span>
            ))}
        </div>
    );
};

const Hero = () => {
    const [masterData, setMasterData] = useState({
        manufacturers: [],
        bodyTypes: [],
        fuelTypes: [],
        buildYears: [],
        kmsDriven: [],
        transmissions: [],
        cities: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buy');

    const [searchForm, setSearchForm] = useState({
        manufacturer: '',
        bodyType: '',
        maxPrice: '',
        fuelType: '',
        buildYear: '',
        kmsDriven: '',
        transmission: '',
        city: getSelectedCity()
    });

    useEffect(() => {
        const loadMasterData = async () => {
            const data = await fetchAllMasterData();
            setMasterData(data);
            setLoading(false);
        };
        loadMasterData();
    }, []);

    const handleInputChange = (field, value) => {
        if (field === 'city' && value) {
            setSelectedCity(value);
        }
        setSearchForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        Object.entries(searchForm).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        window.location.href = `/used?${params.toString()}`;
    };

    const handleBrandClick = (brandName) => {
        const searchName = brandName.split(' ')[0];
        const params = new URLSearchParams();
        params.append('manufacturer', searchName);
        if (searchForm.city) params.append('city', searchForm.city);
        window.location.href = `/used?${params.toString()}`;
    };

    const SelectDropdown = ({ value, onChange, placeholder, options, disabled }) => (
        <div className="relative">
            <select
                className="w-full appearance-none bg-gray-50 text-gray-700 px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:text-gray-400 transition-all font-medium text-xs sm:text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            >
                <option value="">{disabled ? 'Loading...' : placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                        {opt.key}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
        </div>
    );

    return (
        <div className="relative min-h-[100svh] sm:min-h-[85vh] overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070"
                    alt="Happy couple in car"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black/85 via-black/70 to-black/50 sm:to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10 md:py-16">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                    {/* Left Section - Text with Animations */}
                    <div className="text-white text-center lg:text-left order-1 lg:order-1">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 mb-3 sm:mb-4">
                            <Sparkles size={12} className="text-accent sm:w-[14px] sm:h-[14px]" />
                            <span className="text-[10px] sm:text-xs font-medium">India's #1 Car Comparison Platform</span>
                        </div>

                        {/* Main Heading with Animation */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-1 sm:mb-2">
                            Compare Confidently
                            <br />
                            with <AnimatedBrand />
                        </h1>

                        {/* Animated Tagline */}
                        <div className="flex justify-center lg:justify-start">
                            <AnimatedTagline />
                        </div>

                        {/* Description - Hidden on very small screens, shown on sm+ */}
                        <p className="hidden sm:block text-white/80 text-sm md:text-base mt-3 md:mt-4 mb-3 md:mb-4 max-w-md mx-auto lg:mx-0">
                            Compare prices from{' '}
                            <span className="font-semibold text-orange-400">Cars24</span>,{' '}
                            <span className="font-semibold text-purple-400">Spinny</span>,{' '}
                            <span className="font-semibold text-blue-400">CarWale</span>,{' '}
                            <span className="font-semibold text-yellow-400">OLX</span>{' '}
                            & more in one place
                        </p>

                        {/* Stats Row - Compact on mobile */}
                        <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-4 md:gap-6 mt-3 sm:mt-4 mb-4 sm:mb-6 justify-center lg:justify-start">
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                                    <Car size={14} className="text-accent sm:w-4 sm:h-4" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-base sm:text-xl font-bold text-white">1M+</p>
                                    <p className="text-white/50 text-[9px] sm:text-xs">Cars</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Scale size={14} className="text-blue-400 sm:w-4 sm:h-4" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-base sm:text-xl font-bold text-white">6</p>
                                    <p className="text-white/50 text-[9px] sm:text-xs">Platforms</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Check size={14} className="text-green-400 sm:w-4 sm:h-4" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-base sm:text-xl font-bold text-white">100%</p>
                                    <p className="text-white/50 text-[9px] sm:text-xs">Free</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                                    <Star size={14} className="text-accent sm:w-4 sm:h-4" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-base sm:text-xl font-bold text-white">Trusted</p>
                                    <p className="text-white/50 text-[9px] sm:text-xs">Users</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Search Card */}
                    <div className="w-full max-w-lg mx-auto lg:ml-auto order-2 lg:order-2">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                            {/* Service Tabs - Mobile Optimized */}
                            <div className="flex border-b border-gray-100 bg-gray-50/50 pt-3 sm:pt-4">
                                {serviceTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
                                        disabled={tab.comingSoon}
                                        className={`flex-1 flex flex-col items-center gap-0.5 sm:gap-1 px-1 sm:px-3 py-2 sm:py-3 transition-all relative ${activeTab === tab.id
                                            ? 'text-primary bg-white'
                                            : tab.comingSoon
                                                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                            }`}
                                    >
                                        {tab.comingSoon && (
                                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] sm:text-[8px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap z-10">
                                                Coming Soon
                                            </span>
                                        )}
                                        <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        <span className="text-[8px] sm:text-[10px] font-medium whitespace-nowrap">
                                            <span className="sm:hidden">{tab.label}</span>
                                            <span className="hidden sm:inline">{tab.fullLabel}</span>
                                        </span>
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Search Form - Mobile Optimized */}
                            <div className="p-3 sm:p-4 md:p-5">

                                {/* Quick Filters - 2x2 Grid */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <SelectDropdown
                                        value={searchForm.manufacturer}
                                        onChange={(v) => handleInputChange('manufacturer', v)}
                                        placeholder="Brand"
                                        options={masterData.manufacturers}
                                        disabled={loading}
                                    />
                                    <SelectDropdown
                                        value={searchForm.city}
                                        onChange={(v) => handleInputChange('city', v)}
                                        placeholder="City"
                                        options={masterData.cities}
                                        disabled={loading}
                                    />
                                    <SelectDropdown
                                        value={searchForm.bodyType}
                                        onChange={(v) => handleInputChange('bodyType', v)}
                                        placeholder="Body Type"
                                        options={masterData.bodyTypes}
                                        disabled={loading}
                                    />
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none bg-gray-50 text-gray-700 px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-all font-medium text-xs sm:text-sm"
                                            value={searchForm.maxPrice}
                                            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                                        >
                                            <option value="">Budget</option>
                                            <option value="300000">Under ₹3L</option>
                                            <option value="500000">Under ₹5L</option>
                                            <option value="1000000">Under ₹10L</option>
                                            <option value="1500000">Under ₹15L</option>
                                            <option value="2500000">Under ₹25L</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Search Button */}
                                <button
                                    onClick={handleSearch}
                                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                                >
                                    <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    Search Cars
                                </button>

                                {/* Brand Logos - Mobile: 4 cols, Desktop: 4 cols with 2 rows */}
                                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 text-center">Popular Brands</p>
                                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                                        {brandLogos.map((brand) => (
                                            <button
                                                key={brand.name}
                                                onClick={() => handleBrandClick(brand.name)}
                                                className="group flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                                                title={brand.name}
                                            >
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center p-1 sm:p-1.5 group-hover:scale-110 transition-transform shadow-sm">
                                                    <img
                                                        src={brand.logo}
                                                        alt={brand.name}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <span className="hidden text-[10px] sm:text-xs font-bold text-gray-600">{brand.name.charAt(0)}</span>
                                                </div>
                                                <span className="text-[8px] sm:text-[9px] text-gray-500 group-hover:text-primary font-medium truncate w-full text-center">{brand.name.split(' ')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/used'}
                                        className="w-full mt-2 sm:mt-3 text-primary hover:text-secondary text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 py-1.5 sm:py-2"
                                    >
                                        View All Cars
                                        <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
