import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Fuel, ChevronRight, Gauge, ExternalLink, Calendar, ArrowUpDown, X, Check, Scale, ChevronLeft, Star, Settings, Car } from 'lucide-react';
import { searchCars } from '../../services/masterDataService';
import { CarScoreBar } from '../common/CarScore';
import CarDetailPopup from '../common/CarDetailPopup';
import { calculateCarastaniScore } from '../../utils/carastaniScore';
import { getSelectedCity } from '../../utils/cityStorage';
import CompareModal from '../compare/CompareModal';

// Seller platforms with brand colors
const SELLERS = ['Cars24', 'Spinny', 'CarWale', 'OLX', 'CarDekho', 'Droom'];
const SELLER_STYLES = {
    'Cars24': { bg: 'bg-orange-500', text: 'text-white' },
    'Spinny': { bg: 'bg-purple-600', text: 'text-white' },
    'CarWale': { bg: 'bg-blue-600', text: 'text-white' },
    'OLX': { bg: 'bg-yellow-500', text: 'text-black' },
    'CarDekho': { bg: 'bg-red-600', text: 'text-white' },
    'Droom': { bg: 'bg-green-600', text: 'text-white' },
};

// Fallback images
const FALLBACK_IMAGES = [
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/157265/nexon-exterior-right-front-three-quarter-75.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/seltos-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80',
    'https://imgd.aeplcdn.com/664x374/n/cw/ec/121943/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80',
];

const CITIES = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
const currentYear = new Date().getFullYear();


const UsedCarsPreview = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCars, setSelectedCars] = useState([]);
    const [showCompare, setShowCompare] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null); // For car details popup
    const [masterData, setMasterData] = useState({
        manufacturers: [],
        fuelTypes: [],
        transmissions: [],
        cities: []
    });

    // Default filters - sync city with navbar selection
    const [filters, setFilters] = useState({
        location: getSelectedCity() || '',
        brand: '',
        fuelType: '',
        transmission: '',
        minYear: currentYear - 5,
        sortBy: 'price-asc'
    });

    // Listen for city changes from navbar
    useEffect(() => {
        const handleCityChange = () => {
            const newCity = getSelectedCity();
            if (newCity && newCity !== filters.location) {
                setFilters(prev => ({ ...prev, location: newCity }));
            }
        };

        // Check city on mount and listen for storage changes
        handleCityChange();
        window.addEventListener('storage', handleCityChange);
        window.addEventListener('cityChange', handleCityChange);

        return () => {
            window.removeEventListener('storage', handleCityChange);
            window.removeEventListener('cityChange', handleCityChange);
        };
    }, []);

    // Load master data on mount
    useEffect(() => {
        const loadMasterData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/master-data/manufacturer`);
                const manufacturersData = await response.json();
                const manufacturers = manufacturersData[0]?.metadata || [];

                const fuelResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/master-data/fuel`);
                const fuelData = await fuelResponse.json();
                const fuelTypes = fuelData[0]?.metadata || [];

                const transResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/master-data/transmission`);
                const transData = await transResponse.json();
                const transmissions = transData[0]?.metadata || [];

                const cityResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/master-data/city`);
                const cityData = await cityResponse.json();
                const cities = cityData[0]?.metadata || [];

                setMasterData({
                    manufacturers,
                    fuelTypes,
                    transmissions,
                    cities
                });
            } catch (error) {
                console.error('Error loading master data:', error);
                // Set fallback options
                setMasterData({
                    manufacturers: [
                        { key: 'Maruti Suzuki' }, { key: 'Hyundai' }, { key: 'Tata' },
                        { key: 'Mahindra' }, { key: 'Honda' }, { key: 'Toyota' },
                        { key: 'Kia' }, { key: 'MG' }, { key: 'Ford' }
                    ],
                    fuelTypes: [
                        { key: 'Petrol' }, { key: 'Diesel' }, { key: 'CNG' }, { key: 'Electric' }
                    ],
                    transmissions: [
                        { key: 'Manual' }, { key: 'Automatic' }, { key: 'AMT' }, { key: 'CVT' }
                    ],
                    cities: CITIES.map(c => ({ key: c }))
                });
            }
        };
        loadMasterData();
    }, []);

    useEffect(() => {
        loadCars();
    }, [filters]);

    const loadCars = async () => {
        setLoading(true);
        try {
            const searchFilters = {};
            if (filters.location) searchFilters.location = filters.location;
            if (filters.brand) searchFilters.brands = [filters.brand];
            if (filters.fuelType) searchFilters.fuelTypes = [filters.fuelType];
            if (filters.transmission) searchFilters.transmissions = [filters.transmission];

            const data = await searchCars(searchFilters, 1);
            let carsData = data.cars || [];

            // Filter by year
            carsData = carsData.filter(car => car.year >= filters.minYear);

            // Add seller info and fallback images
            carsData = carsData.map((car, index) => ({
                ...car,
                seller: car.source || SELLERS[index % SELLERS.length],
                image: car.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
            }));

            // Sort
            if (filters.sortBy === 'price-asc') {
                carsData.sort((a, b) => a.price - b.price);
            } else if (filters.sortBy === 'price-desc') {
                carsData.sort((a, b) => b.price - a.price);
            } else if (filters.sortBy === 'year-desc') {
                carsData.sort((a, b) => b.year - a.year);
            }

            setCars(carsData.slice(0, 20));
        } catch (error) {
            console.error('Error loading preview cars:', error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleCarSelection = (car) => {
        setSelectedCars(prev => {
            const isSelected = prev.find(c => c.id === car.id);
            if (isSelected) {
                return prev.filter(c => c.id !== car.id);
            } else if (prev.length < 4) {
                return [...prev, car];
            }
            return prev;
        });
    };

    const isCarSelected = (carId) => selectedCars.find(c => c.id === carId);

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8">
                    <div>
                        <span className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-widest">Fresh Arrivals</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-1 sm:mt-2">Latest Used Cars</h2>
                        <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3">Aggregated from top platforms across India</p>
                    </div>
                    <button
                        onClick={() => navigate('/used')}
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold px-5 sm:px-8 py-3 sm:py-4 rounded-full transition-all hover:gap-4 hover:shadow-lg text-sm sm:text-base"
                    >
                        View All Cars
                        <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Filters Bar */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 mb-6 sm:mb-8 border border-gray-100">
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1 scrollbar-hide">
                        {/* City Filter */}
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-primary" />
                            <select
                                value={filters.location}
                                onChange={(e) => updateFilter('location', e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[120px]"
                            >
                                <option value="">All Cities</option>
                                {(masterData.cities.length > 0 ? masterData.cities : CITIES.map(c => ({ key: c }))).map(city => (
                                    <option key={city.key} value={city.key}>{city.key}</option>
                                ))}
                            </select>
                        </div>

                        {/* Brand Filter */}
                        <div className="flex items-center gap-2">
                            <Car size={16} className="text-primary" />
                            <select
                                value={filters.brand}
                                onChange={(e) => updateFilter('brand', e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[130px]"
                            >
                                <option value="">All Brands</option>
                                {masterData.manufacturers.map(brand => (
                                    <option key={brand.key} value={brand.key}>{brand.key}</option>
                                ))}
                            </select>
                        </div>

                        {/* Fuel Type Filter */}
                        <div className="flex items-center gap-2">
                            <Fuel size={16} className="text-primary" />
                            <select
                                value={filters.fuelType}
                                onChange={(e) => updateFilter('fuelType', e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[100px]"
                            >
                                <option value="">All Fuel</option>
                                {masterData.fuelTypes.map(fuel => (
                                    <option key={fuel.key} value={fuel.key}>{fuel.key}</option>
                                ))}
                            </select>
                        </div>

                        {/* Transmission Filter */}
                        <div className="flex items-center gap-2">
                            <Settings size={16} className="text-primary" />
                            <select
                                value={filters.transmission}
                                onChange={(e) => updateFilter('transmission', e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[110px]"
                            >
                                <option value="">All Trans.</option>
                                {masterData.transmissions.map(trans => (
                                    <option key={trans.key} value={trans.key}>{trans.key}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <select
                                value={filters.minYear}
                                onChange={(e) => updateFilter('minYear', parseInt(e.target.value))}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[110px]"
                            >
                                <option value={currentYear - 1}>Last 1 Year</option>
                                <option value={currentYear - 3}>Last 3 Years</option>
                                <option value={currentYear - 5}>Last 5 Years</option>
                                <option value={currentYear - 10}>Last 10 Years</option>
                                <option value={2000}>All Years</option>
                            </select>
                        </div>

                        {/* Sort Filter */}
                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={16} className="text-primary" />
                            <select
                                value={filters.sortBy}
                                onChange={(e) => updateFilter('sortBy', e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[140px]"
                            >
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="year-desc">Year: Newest First</option>
                            </select>
                        </div>

                        {/* Compare indicator */}
                        {selectedCars.length > 0 && (
                            <div className="flex-1 flex justify-end">
                                <div className="flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-full">
                                    <Scale size={18} />
                                    <span className="font-semibold">{selectedCars.length} selected</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cars Grid - 20 Results */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-xl sm:rounded-2xl h-56 sm:h-64 md:h-72 animate-pulse"></div>
                        ))}
                    </div>
                ) : cars.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                        {cars.map((car, index) => {
                            const sellerStyle = SELLER_STYLES[car.seller] || SELLER_STYLES['Cars24'];
                            const isSelected = isCarSelected(car.id);
                            return (
                                <div
                                    key={car.id || index}
                                    className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-1 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                                    onClick={() => setSelectedCar(car)}
                                >
                                    {/* Image */}
                                    <div className="relative h-36 bg-gray-100 overflow-hidden">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        {/* Selection checkbox */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleCarSelection(car); }}
                                            className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-white/90 border-gray-300 hover:border-primary'}`}
                                        >
                                            {isSelected && <Check size={12} />}
                                        </button>

                                        {/* Seller Badge */}
                                        <span className={`absolute top-2 right-2 ${sellerStyle.bg} ${sellerStyle.text} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                                            {car.seller}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3">
                                        <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-primary transition-colors">
                                            {car.name}
                                        </h3>

                                        {/* Quick Specs */}
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                                            <span>{car.year}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                                <Fuel size={10} />
                                                {car.fuel_type || 'Petrol'}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                                <Gauge size={10} />
                                                {car.kms_driven ? `${(car.kms_driven / 1000).toFixed(0)}K` : 'N/A'}
                                            </span>
                                        </div>

                                        {/* Mini Score Bar */}
                                        <div className="mt-2">
                                            <CarScoreBar car={car} showLabel={false} />
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                            <span className="text-sm font-bold text-primary">
                                                {formatPrice(car.price)}
                                            </span>
                                            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${sellerStyle.bg} ${sellerStyle.text} px-2 py-0.5 rounded-full`}>
                                                <ExternalLink size={8} />
                                                View
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No cars found</h3>
                        <p className="text-gray-500 mb-4">Try changing your filters to see more results</p>
                        <button
                            onClick={() => setFilters({ location: 'New Delhi', minYear: currentYear - 5, sortBy: 'price-asc' })}
                            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Compare Floating Action Bar */}
                {selectedCars.length >= 2 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
                        <div className="bg-secondary text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {selectedCars.slice(0, 3).map((car, i) => (
                                    <img
                                        key={car.id}
                                        src={car.image}
                                        alt={car.name}
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                        onError={(e) => { e.target.src = FALLBACK_IMAGES[i]; }}
                                    />
                                ))}
                                {selectedCars.length > 3 && (
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                                        +{selectedCars.length - 3}
                                    </div>
                                )}
                            </div>
                            <span className="font-semibold">{selectedCars.length} cars selected</span>
                            <button
                                onClick={() => setShowCompare(true)}
                                className="bg-accent hover:bg-accent/90 text-black font-bold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all hover:scale-105"
                            >
                                <Scale size={18} />
                                Compare Now
                            </button>
                            <button
                                onClick={() => setSelectedCars([])}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Bar - Slim Horizontal Design */}
                <div className="mt-16 bg-gradient-to-r from-secondary via-primary to-teal-600 rounded-2xl p-4 md:p-5 relative overflow-hidden">
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 md:gap-0 md:justify-between">
                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                            <Link to="/used" className="group flex items-center gap-2 hover:scale-105 transition-transform">
                                <Car size={18} className="text-accent" />
                                <span className="text-white font-bold">10K+</span>
                                <span className="text-white/60 text-sm hidden sm:inline">Cars</span>
                            </Link>

                            <span className="hidden md:block w-1 h-1 rounded-full bg-white/30"></span>

                            <div className="flex items-center gap-2">
                                <Scale size={18} className="text-blue-300" />
                                <span className="text-white font-bold">6</span>
                                <span className="text-white/60 text-sm hidden sm:inline">Platforms</span>
                            </div>

                            <span className="hidden md:block w-1 h-1 rounded-full bg-white/30"></span>

                            <div className="flex items-center gap-2">
                                <Check size={18} className="text-green-400" />
                                <span className="text-white font-bold">100%</span>
                                <span className="text-white/60 text-sm hidden sm:inline">Transparent</span>
                            </div>

                            <span className="hidden md:block w-1 h-1 rounded-full bg-white/30"></span>

                            <div className="flex items-center gap-2">
                                <Star size={18} className="text-accent" />
                                <span className="text-white font-bold">Free</span>
                                <span className="text-white/60 text-sm hidden sm:inline">Forever</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/used"
                            className="bg-white hover:bg-accent text-secondary hover:text-black font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-accent/20"
                        >
                            Compare Now
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Compare Modal */}
            {showCompare && (
                <CompareModal
                    cars={selectedCars}
                    onClose={() => setShowCompare(false)}
                />
            )}

            {/* Car Details Modal */}
            {selectedCar && (
                <CarDetailPopup
                    car={selectedCar}
                    onClose={() => setSelectedCar(null)}
                />
            )}

            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UsedCarsPreview;

