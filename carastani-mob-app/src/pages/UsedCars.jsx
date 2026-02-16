import React, { useState, useEffect } from 'react';
import SidebarFilters from '../components/used/SidebarFilters';
import CarListItem from '../components/used/CarListItem';
import { LayoutGrid, List, ChevronLeft, ChevronRight, MapPin, X, Check, Scale, Filter } from 'lucide-react';
import { searchCars, fetchCities } from '../services/masterDataService';
import { useLocation } from 'react-router-dom';
import { getSelectedCity, setSelectedCity } from '../utils/cityStorage';
import FunLoader from '../components/common/FunLoader';
import CompareModal from '../components/compare/CompareModal';
import { CarScoreBar } from '../components/common/CarScore';

const UsedCars = () => {
    // State for cars and loading
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // View type: 'list' or 'grid'
    // Default to 'list' for the new e-commerce design
    const [viewType, setViewType] = useState('list');

    // Mobile filter state
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Location popup
    const [showLocationPopup, setShowLocationPopup] = useState(false);
    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(true);

    // Comparison feature
    const [compareMode, setCompareMode] = useState(false);
    const [selectedCars, setSelectedCars] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const toggleCompareMode = () => {
        if (compareMode) {
            // Exiting compare mode — clear selections
            setSelectedCars([]);
        }
        setCompareMode(prev => !prev);
    };

    // Initial Filter State - Load city from localStorage
    const [filters, setFilters] = useState({
        brands: [],
        years: [],
        kilometer: '',
        bodyTypes: [],
        fuelTypes: [],
        transmissions: [],
        location: getSelectedCity(),
        colors: []
    });

    // Handle URL parameters for initial load
    const routerLocation = useLocation();

    // Check if city is selected on mount
    useEffect(() => {
        const loadCities = async () => {
            setCitiesLoading(true);
            const cityData = await fetchCities();
            setCities(cityData);
            setCitiesLoading(false);
        };
        loadCities();

        // Show location popup if no city selected
        const savedCity = getSelectedCity();
        if (!savedCity) {
            setShowLocationPopup(true);
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(routerLocation.search);

        const manufacturerParam = params.get('manufacturer');
        const bodyTypeParam = params.get('bodyType');
        const buildYearParam = params.get('buildYear');
        const cityParam = params.get('city');

        // Only update if there are URL params
        if (manufacturerParam || bodyTypeParam || buildYearParam || cityParam) {
            setFilters(prev => {
                const newFilters = { ...prev };

                if (manufacturerParam) {
                    newFilters.brands = [manufacturerParam];
                }
                if (bodyTypeParam) {
                    newFilters.bodyTypes = [bodyTypeParam];
                }
                if (buildYearParam) {
                    newFilters.years = [buildYearParam];
                }
                if (cityParam) {
                    newFilters.location = cityParam;
                    setSelectedCity(cityParam);
                }

                return newFilters;
            });
        }
    }, [routerLocation.search]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [page]);

    // Fetch Cars Effect
    useEffect(() => {
        setLoading(true);

        const fetchCarsData = async () => {
            try {
                const data = await searchCars(filters, page);
                setCars(data.cars);
                setHasMore(data.hasMore);
            } catch (error) {
                console.error("Error loading cars:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchCarsData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters, page]);

    const handleFilterChange = (category, value) => {
        if (category === 'location' && value) {
            setSelectedCity(value);
        }
        setFilters(prev => ({
            ...prev,
            [category]: value
        }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters(prev => ({
            brands: [],
            years: [],
            kilometer: '',
            bodyTypes: [],
            fuelTypes: [],
            transmissions: [],
            location: prev.location,
            colors: []
        }));
        setPage(1);
    };

    const handleLocationSelect = (city) => {
        setSelectedCity(city);
        setFilters(prev => ({ ...prev, location: city }));
        setShowLocationPopup(false);
        setPage(1);
    };

    // Get active filters as an array of { key, label, value, displayValue } objects
    const getActiveFilters = () => {
        const active = [];

        // Brands
        filters.brands.forEach(brand => {
            active.push({ key: 'brands', value: brand, label: 'Brand', displayValue: brand });
        });

        // Body Types
        filters.bodyTypes.forEach(type => {
            active.push({ key: 'bodyTypes', value: type, label: 'Body', displayValue: type });
        });

        // Fuel Types
        filters.fuelTypes.forEach(fuel => {
            active.push({ key: 'fuelTypes', value: fuel, label: 'Fuel', displayValue: fuel });
        });

        // Transmissions
        filters.transmissions.forEach(trans => {
            active.push({ key: 'transmissions', value: trans, label: 'Transmission', displayValue: trans });
        });

        // Years
        filters.years.forEach(year => {
            active.push({ key: 'years', value: year, label: 'Year', displayValue: year });
        });

        // Colors
        filters.colors.forEach(color => {
            active.push({ key: 'colors', value: color, label: 'Color', displayValue: color });
        });

        // Price (only if changed from default)
        // Removed price filter as requested

        // Kilometer
        if (filters.kilometer) {
            active.push({ key: 'kilometer', value: filters.kilometer, label: 'KM', displayValue: filters.kilometer });
        }

        return active;
    };

    // Remove a specific filter
    const removeFilter = (filterKey, filterValue) => {
        setFilters(prev => {
            const newFilters = { ...prev };

            if (Array.isArray(prev[filterKey])) {
                // For array filters (brands, bodyTypes, etc.)
                newFilters[filterKey] = prev[filterKey].filter(v => v !== filterValue);
            } else if (filterKey === 'kilometer') {
                newFilters.kilometer = '';
            }
            // Removed price filter handling as requested

            return newFilters;
        });
        setPage(1);
    };

    const toggleCarSelection = (car) => {
        if (!compareMode) {
            setCompareMode(true);
        }
        setSelectedCars(prev => {
            const isSelected = prev.some(c => c.id === car.id);
            if (isSelected) {
                return prev.filter(c => c.id !== car.id);
            } else if (prev.length < 5) {
                return [...prev, car];
            } else {
                alert("You can compare up to 5 cars at a time.");
                return prev;
            }
            return prev;
        });
    };

    const isCarSelected = (carId) => selectedCars.some(c => c.id === carId);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    };

    const popularCities = cities.filter(c => ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'].includes(c.key));

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-12 relative reverted-state-verified">
            {/* Location Popup */}
            {showLocationPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLocationPopup(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
                        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <MapPin size={24} />
                                <h2 className="text-2xl font-bold">Choose Your City</h2>
                            </div>
                            <p className="text-white/70 text-sm">Select your location to see cars available near you</p>
                        </div>

                        <div className="p-6">
                            {citiesLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Popular Cities</p>
                                    <div className="grid grid-cols-4 gap-3 mb-6">
                                        {popularCities.map(city => (
                                            <button
                                                key={city.key}
                                                onClick={() => handleLocationSelect(city.key)}
                                                className="p-3 text-center border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
                                            >
                                                {city.key}
                                            </button>
                                        ))}
                                    </div>

                                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">All Cities</p>
                                    <div className="max-h-40 overflow-y-auto space-y-2">
                                        {cities.map(city => (
                                            <button
                                                key={city.key}
                                                onClick={() => handleLocationSelect(city.key)}
                                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                                            >
                                                {city.key}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Global Full Screen Loader */}
            {loading && <FunLoader message="Finding your perfect ride..." />}

            {/* Compare Mode Floating Bar */}
            {compareMode && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-slide-up">
                    <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-4">
                        {/* Mobile: Compact View */}
                        <div className="flex md:hidden items-center gap-3 flex-grow overflow-x-auto no-scrollbar scroll-smooth">
                            {selectedCars.length === 0 ? (
                                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Select cars to compare</span>
                            ) : (
                                <div className="flex -space-x-3">
                                    {selectedCars.map((car) => (
                                        <div key={car.id} className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {/* Slot placeholders */}
                                    {Array.from({ length: Math.max(0, 2 - selectedCars.length) }).map((_, i) => (
                                        <div key={`empty-${i}`} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center flex-shrink-0 z-0">
                                            <span className="text-gray-300 text-lg">+</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop: Full Info */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Scale size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Compare Mode</p>
                                <p className="text-xs text-gray-500">
                                    {selectedCars.length === 0
                                        ? 'Select 2-5 cars to compare'
                                        : `${selectedCars.length} car${selectedCars.length > 1 ? 's' : ''} selected`
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Center: Selected car avatars (Desktop) */}
                        <div className="hidden md:flex items-center gap-2">
                            {selectedCars.map((car, i) => (
                                <div key={car.id} className="relative group">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-primary shadow-md">
                                        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        onClick={() => toggleCarSelection(car)}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <X size={12} />
                                    </button>
                                    <p className="text-[9px] text-center text-gray-600 mt-0.5 truncate w-12">{car.name?.split(' ').slice(0, 2).join(' ')}</p>
                                </div>
                            ))}
                            {/* Empty slots */}
                            {Array.from({ length: Math.max(0, 2 - selectedCars.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <span className="text-gray-300 text-lg">+</span>
                                </div>
                            ))}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            <button
                                onClick={toggleCompareMode}
                                className="w-9 h-9 md:w-auto md:h-auto md:px-4 md:py-2 flex items-center justify-center text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full md:rounded-lg transition-colors"
                                title="Cancel"
                            >
                                <X size={18} className="md:hidden" />
                                <span className="hidden md:inline">Cancel</span>
                            </button>
                            <button
                                onClick={() => setShowCompareModal(true)}
                                disabled={selectedCars.length < 2}
                                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-full transition-all ${selectedCars.length >= 2
                                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Scale size={16} />
                                <span className="uppercase tracking-wider">Compare</span>
                                {selectedCars.length > 0 && (
                                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] md:text-xs">
                                        {selectedCars.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Compare Modal */}
            {showCompareModal && (
                <CompareModal cars={selectedCars} onClose={() => setShowCompareModal(false)} />
            )}

            {/* Mobile Filter Toggle - Floating Bottom Center - Only show when not loading AND not in compare mode */}
            {!loading && !compareMode && (
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl border border-gray-700 font-bold tracking-wide hover:scale-105 transition-transform"
                    >
                        <Filter size={18} className="text-accent" />
                        FILTERS
                        {getActiveFilters().length > 0 && (
                            <span className="bg-accent text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                {getActiveFilters().length}
                            </span>
                        )}
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Desktop: Always visible, Mobile: Overlay */}
                <div className="hidden lg:block">
                    <SidebarFilters filters={filters} onFilterChange={handleFilterChange} />
                </div>

                {/* Mobile Filter Overlay - Centered Popup with Expand Animation */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileFilters(false)}></div>

                        <div className="bg-white w-full max-w-md h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 origin-bottom animate-expand-from-button">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between z-20">
                                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-gray-50"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-5 overflow-y-auto flex-grow">
                                <SidebarFilters filters={filters} onFilterChange={handleFilterChange} mobile={true} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-grow w-full">
                    {/* Header / Controls */}
                    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 mb-4 md:mb-6">
                        <div className="flex flex-col gap-3 md:gap-4">
                            {/* Top row - Title and location */}
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-base md:text-lg font-bold text-gray-800 mr-2">
                                    {loading ? (
                                        <span className="text-gray-400">Searching...</span>
                                    ) : (
                                        <>
                                            <span className="text-accent">{cars.length}</span> Cars found
                                        </>
                                    )}
                                </h2>
                                {filters.location && (
                                    <button
                                        onClick={() => setShowLocationPopup(true)}
                                        className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1.5 rounded-full hover:bg-primary/20 transition-colors font-medium"
                                    >
                                        <MapPin size={12} />
                                        {filters.location}
                                    </button>
                                )}
                            </div>

                            {/* Bottom row - Actions */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    {/* Active filters count indicator */}
                                    {getActiveFilters().length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <span>{getActiveFilters().length} filter{getActiveFilters().length > 1 ? 's' : ''} applied</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Compare Mode Toggle Button */}
                                    <button
                                        onClick={toggleCompareMode}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${compareMode
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary'
                                            }`}
                                    >
                                        <Scale size={16} />
                                        {compareMode ? 'Comparing...' : 'Compare'}
                                    </button>

                                    {/* View Toggle */}
                                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewType('grid')}
                                            className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <LayoutGrid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewType('list')}
                                            className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Car List/Grid */}
                    {loading ? (
                        <div className="min-h-[400px]"></div>
                    ) : cars.length > 0 ? (
                        <div className={viewType === 'grid'
                            ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6'
                            : 'space-y-4 md:space-y-6'
                        }>
                            {cars.map(car => (
                                <div key={car.id} className="relative">

                                    {viewType === 'grid' ? (() => {
                                        const sellers = ['Cars24', 'Spinny', 'CarWale', 'OLX'];
                                        const sellerColors = { Cars24: 'bg-orange-500', Spinny: 'bg-purple-600', CarWale: 'bg-blue-600', OLX: 'bg-yellow-500 text-black' };
                                        const seller = sellers[car.id % sellers.length];
                                        return (
                                            <div
                                                className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-1 ${compareMode && isCarSelected(car.id) ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-gray-100'} ${compareMode ? 'cursor-pointer' : ''}`}
                                                onClick={() => compareMode && toggleCarSelection(car)}
                                            >
                                                <div className="relative h-32 md:h-48 bg-gray-100">
                                                    <img
                                                        src={car.image}
                                                        alt={car.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(e) => { e.target.src = 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80'; }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                    {/* Compare Selection Indicator - only in compare mode */}
                                                    {compareMode && (
                                                        <label className="absolute top-3 left-3 z-10 cursor-pointer group" onClick={(e) => e.stopPropagation()}>
                                                            <div className={`relative w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 transform ${isCarSelected(car.id)
                                                                ? 'border-primary bg-primary text-white shadow-lg scale-105 rotate-0'
                                                                : 'border-white bg-white/90 text-gray-400 hover:border-primary hover:bg-white'
                                                                }`}>
                                                                {/* Inner circle for unselected state */}
                                                                {!isCarSelected(car.id) && selectedCars.length < 5 && (
                                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-primary transition-colors"></div>
                                                                )}

                                                                {/* Checkmark for selected state */}
                                                                {isCarSelected(car.id) && (
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
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

                                                                {/* Plus sign for available slots */}
                                                                {!isCarSelected(car.id) && selectedCars.length < 5 && (
                                                                    <span className="absolute text-xs font-bold text-gray-400 group-hover:text-primary transition-colors">+</span>
                                                                )}

                                                                {/* Glow effect for selected state */}
                                                                {isCarSelected(car.id) && (
                                                                    <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse"></div>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={isCarSelected(car.id)}
                                                                onChange={() => toggleCarSelection(car)}
                                                            />
                                                        </label>
                                                    )}

                                                    <span className={`absolute top-2 right-2 ${sellerColors[seller]} text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full`}>{seller}</span>
                                                </div>
                                                <div className="p-3 md:p-4">
                                                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors truncate text-sm md:text-base" title={car.name}>{car.name}</h3>
                                                    <p className="text-xs md:text-sm text-gray-500 mb-2 truncate">{car.year} • {car.fuel_type} • {car.kms_driven?.toLocaleString()} km</p>
                                                    <div className="mb-2 md:mb-3">
                                                        <CarScoreBar car={car} showLabel={false} size="small" />
                                                    </div>
                                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                                        <span className="text-base md:text-lg font-bold text-primary">{formatPrice(car.price)}</span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleCarSelection(car);
                                                                }}
                                                                className={`p-1.5 rounded-full border transition-all ${isCarSelected(car.id)
                                                                    ? 'bg-primary/10 text-primary border-primary'
                                                                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-primary hover:border-primary'}`}
                                                                title={isCarSelected(car.id) ? 'Remove from compare' : 'Add to compare'}
                                                                aria-label={isCarSelected(car.id) ? `Remove ${car.name} from comparison` : `Add ${car.name} to comparison`}
                                                            >
                                                                {isCarSelected(car.id) ? <Check size={16} /> : <Scale size={16} />}
                                                            </button>
                                                            <button className={`hidden md:block text-xs ${sellerColors[seller]} text-white px-3 py-1.5 rounded-full transition-all hover:scale-105`}>
                                                                View on {seller}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })() : (
                                        <CarListItem
                                            car={car}
                                            isSelected={isCarSelected(car.id)}
                                            onToggleCompare={toggleCarSelection}
                                            compareMode={compareMode}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
                            <h3 className="text-lg font-bold mb-2">No cars found</h3>
                            <p>Try adjusting your filters to find what you're looking for.</p>
                            <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-accent text-white rounded-full text-sm hover:bg-red-600 transition-colors">
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {cars.length > 0 && (
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className={`p-3 rounded-xl border-2 transition-all ${page === 1 ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-300 hover:border-primary hover:text-primary'}`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <span className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">Page {page}</span>

                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!hasMore || loading}
                                className={`p-3 rounded-xl border-2 transition-all ${!hasMore ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-300 hover:border-primary hover:text-primary'}`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }
                @keyframes bounce-in {
                    0% { opacity: 0; transform: translate(-50%, 20px); }
                    60% { transform: translate(-50%, -5px); }
                    100% { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.4s ease-out forwards;
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(100%); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
                @keyframes expand-from-button {
                    from { opacity: 0; transform: scale(0.8) translateY(20%); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-expand-from-button {
                    animation: expand-from-button 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default UsedCars;
