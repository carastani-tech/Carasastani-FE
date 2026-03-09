import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { setSelectedCity } from '../../utils/cityStorage';

const CitySelectionPopup = ({ onCitySelected }) => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCityLocal] = useState(null);
    const searchInputRef = useRef(null);

    const popularCityNames = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/master-data/city`
                );
                const data = await response.json();
                if (data && data.length > 0 && data[0].metadata) {
                    setCities(data[0].metadata);
                }
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    // Auto-focus search when cities load
    useEffect(() => {
        if (!loading && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [loading]);

    const handleCitySelect = (city) => {
        setSelectedCityLocal(city.value);
        setSelectedCity(city.value);

        // Dispatch custom event so Navbar picks up the change
        window.dispatchEvent(new CustomEvent('cityChange', { detail: city.value }));

        if (onCitySelected) {
            onCitySelected(city.value);
        }
    };

    const filteredCities = cities.filter((city) =>
        city.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const popularCities = cities.filter((city) => popularCityNames.includes(city.value));
    const otherCities = filteredCities.filter((city) => !popularCityNames.includes(city.value));

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Card */}
            <div
                className="relative w-[92vw] max-w-md mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden"
                style={{ animation: 'cityPopupIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                {/* Header */}
                <div className="px-5 pt-6 pb-4 text-center border-b border-white/10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 mb-4">
                        <MapPin size={28} className="text-accent" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Select Your City</h2>
                    <p className="text-white/50 text-sm">Choose your city to see relevant cars near you</p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
                        <p className="text-white/50 text-sm">Loading cities...</p>
                    </div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <div className="px-4 pt-4 pb-2">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search city..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="
                                        w-full pl-10 pr-10 py-2.5
                                        bg-white/5 border border-white/10 rounded-xl
                                        text-sm text-white placeholder-white/40
                                        focus:outline-none focus:border-accent/50 focus:bg-white/10
                                        transition-all duration-200
                                    "
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Cities List */}
                        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar-popup">
                            {/* Popular Cities */}
                            {!searchQuery && popularCities.length > 0 && (
                                <div className="px-4 pt-2 pb-1">
                                    <p className="text-[10px] uppercase tracking-widest text-accent/70 font-semibold px-1 mb-2">
                                        Popular Cities
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {popularCities.map((city) => (
                                            <button
                                                key={city.key}
                                                onClick={() => handleCitySelect(city)}
                                                className={`
                                                    flex items-center gap-2 px-3 py-3 rounded-xl
                                                    text-sm font-medium transition-all duration-200
                                                    ${
                                                        selectedCity === city.value
                                                            ? 'bg-accent text-black scale-[0.97]'
                                                            : 'bg-white/5 text-white hover:bg-accent/20 hover:text-accent active:scale-[0.97]'
                                                    }
                                                `}
                                            >
                                                <MapPin
                                                    size={14}
                                                    className={
                                                        selectedCity === city.value
                                                            ? 'text-black'
                                                            : 'text-accent'
                                                    }
                                                />
                                                {city.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            {!searchQuery && popularCities.length > 0 && otherCities.length > 0 && (
                                <div className="h-px bg-white/5 mx-4 my-2" />
                            )}

                            {/* All Other Cities */}
                            {otherCities.length > 0 && (
                                <div className="px-4 pb-4">
                                    {!searchQuery && (
                                        <p className="text-[10px] uppercase tracking-widest text-accent/70 font-semibold px-1 mb-2">
                                            All Cities
                                        </p>
                                    )}
                                    <div className="grid grid-cols-1 gap-0.5">
                                        {otherCities.map((city) => (
                                            <button
                                                key={city.key}
                                                onClick={() => handleCitySelect(city)}
                                                className={`
                                                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                                                    text-sm font-medium text-left w-full
                                                    transition-all duration-200
                                                    ${
                                                        selectedCity === city.value
                                                            ? 'bg-accent text-black'
                                                            : 'text-white/80 hover:bg-white/5 hover:text-white'
                                                    }
                                                `}
                                            >
                                                {selectedCity === city.value && (
                                                    <MapPin size={12} />
                                                )}
                                                {city.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {filteredCities.length === 0 && (
                                <div className="py-12 text-center text-white/40">
                                    <MapPin size={28} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No cities found</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Animations & Scrollbar Styles */}
            <style>{`
                @keyframes cityPopupIn {
                    from {
                        opacity: 0;
                        transform: scale(0.92) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .custom-scrollbar-popup::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar-popup::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-popup::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar-popup::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default CitySelectionPopup;
