import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Search, X, User, LogOut, Menu } from 'lucide-react';
import { isLoggedIn, getLoggedInUser, logoutUser } from '../../services/authService';
import { getSelectedCity, setSelectedCity } from '../../utils/cityStorage';

const Navbar = () => {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCityState] = useState(getSelectedCity());
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const userMenuRef = useRef(null);

    // Popular cities to highlight
    const popularCityNames = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/master-data/city`);
                const data = await response.json();
                if (data && data.length > 0 && data[0].metadata) {
                    setCities(data[0].metadata);
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    // Check if user is logged in and listen for auth changes
    useEffect(() => {
        const checkAuth = () => {
            if (isLoggedIn()) {
                setUser(getLoggedInUser());
            } else {
                setUser(null);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        window.addEventListener('authChange', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    // Listen for external city changes (e.g. from the city selection popup)
    useEffect(() => {
        const handleCityChange = (event) => {
            if (event.detail) {
                setSelectedCityState(event.detail);
            }
        };

        window.addEventListener('cityChange', handleCityChange);
        return () => window.removeEventListener('cityChange', handleCityChange);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setSearchQuery('');
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isDropdownOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isDropdownOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [navigate]);

    const handleCitySelect = (city) => {
        setSelectedCityState(city.value);
        setSelectedCity(city.value);
        setIsDropdownOpen(false);
        setSearchQuery('');

        // Dispatch custom event so other pages (e.g. UsedCars) can react
        window.dispatchEvent(new CustomEvent('cityChange', { detail: city.value }));
    };

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const filteredCities = cities.filter(city =>
        city.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const popularCities = cities.filter(city => popularCityNames.includes(city.value));
    const otherCities = filteredCities.filter(city => !popularCityNames.includes(city.value));

    // Navigation links
    const navLinks = [
        { to: '/home', label: 'Home' },
        { to: '/used', label: 'Used Cars' },
        { to: '/dealers', label: 'Dealership' },
        { to: '/ads', label: 'Ads' },
        { to: '/reviews', label: 'Reviews' },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-black text-white py-3 px-4 sm:py-4 sm:px-6 md:px-12 flex items-center justify-between z-50">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {/* Left Links - Desktop */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-wider">
                    {navLinks.slice(0, 4).map(link => (
                        <Link key={link.to} to={link.to} className="hover:text-accent transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Center Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tighter">
                        <span className="text-accent">Car</span>astani
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 text-xs uppercase tracking-wider">
                    {/* Reviews - Desktop */}
                    <Link to="/reviews" className="hidden md:block hover:text-accent transition-colors">Reviews</Link>

                    {/* City Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            disabled={loading}
                            className={`
                                flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-full
                                border border-accent/30 bg-accent/10
                                hover:bg-accent/20 hover:border-accent/50
                                transition-all duration-300 ease-out
                                ${isDropdownOpen ? 'bg-accent/20 border-accent/50' : ''}
                                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <MapPin size={14} className="text-accent sm:w-[14px] sm:h-[14px]" />
                            <span className="hidden sm:block text-white text-[10px] sm:text-xs font-medium normal-case tracking-normal max-w-[60px] sm:max-w-none truncate">
                                {loading ? '...' : selectedCity || 'City'}
                            </span>
                            <ChevronDown
                                size={12}
                                className={`text-accent transition-transform duration-300 sm:w-[14px] sm:h-[14px] ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Panel */}
                        {isDropdownOpen && !loading && (
                            <div
                                className="
                                    absolute right-0 top-full mt-3 w-72 sm:w-80
                                    bg-zinc-900 border border-zinc-700 rounded-2xl
                                    shadow-2xl shadow-black/80
                                    overflow-hidden
                                "
                                style={{ animation: 'fadeInDown 0.2s ease-out forwards' }}
                            >
                                {/* Search Bar */}
                                <div className="p-3 sm:p-4 border-b border-white/10">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 sm:w-4 sm:h-4" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search city..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="
                                                w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5
                                                bg-white/5 border border-white/10 rounded-xl
                                                text-xs sm:text-sm text-white placeholder-white/40
                                                focus:outline-none focus:border-accent/50 focus:bg-white/10
                                                transition-all duration-200
                                                normal-case tracking-normal
                                            "
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                            >
                                                <X size={12} className="sm:w-[14px] sm:h-[14px]" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Cities List */}
                                <div className="max-h-64 sm:max-h-80 overflow-y-auto custom-scrollbar">
                                    {/* Popular Cities Section */}
                                    {!searchQuery && popularCities.length > 0 && (
                                        <div className="p-2 sm:p-3">
                                            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-accent/70 font-semibold px-2 mb-2">
                                                Popular Cities
                                            </p>
                                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                                {popularCities.map((city) => (
                                                    <button
                                                        key={city.key}
                                                        onClick={() => handleCitySelect(city)}
                                                        className={`
                                                            flex items-center gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl
                                                            text-xs sm:text-sm font-medium normal-case tracking-normal
                                                            transition-all duration-200
                                                            ${selectedCity === city.value
                                                                ? 'bg-accent text-black'
                                                                : 'bg-white/5 text-white hover:bg-accent/20 hover:text-accent'
                                                            }
                                                        `}
                                                    >
                                                        <MapPin size={10} className={`sm:w-3 sm:h-3 ${selectedCity === city.value ? 'text-black' : 'text-accent'}`} />
                                                        {city.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Divider */}
                                    {!searchQuery && popularCities.length > 0 && otherCities.length > 0 && (
                                        <div className="h-px bg-white/5 mx-2 sm:mx-3 my-1"></div>
                                    )}

                                    {/* All Cities Section */}
                                    {otherCities.length > 0 && (
                                        <div className="p-2 sm:p-3">
                                            {!searchQuery && (
                                                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-accent/70 font-semibold px-2 mb-2">
                                                    All Cities
                                                </p>
                                            )}
                                            <div className="grid grid-cols-1 gap-0.5">
                                                {otherCities.map((city) => (
                                                    <button
                                                        key={city.key}
                                                        onClick={() => handleCitySelect(city)}
                                                        className={`
                                                            flex items-center gap-3 px-3 py-2 rounded-lg
                                                            text-xs sm:text-sm font-medium normal-case tracking-normal
                                                            text-left w-full
                                                            transition-all duration-200
                                                            ${selectedCity === city.value
                                                                ? 'bg-accent text-black'
                                                                : 'text-white/80 hover:bg-white/5 hover:text-white'
                                                            }
                                                        `}
                                                    >
                                                        {selectedCity === city.value && <MapPin size={10} className="sm:w-3 sm:h-3" />}
                                                        {city.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {filteredCities.length === 0 && (
                                        <div className="p-8 text-center text-white/40">
                                            <MapPin size={24} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-xs">No cities found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile / Login */}
                    {user ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 hover:text-accent transition-colors"
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent text-black flex items-center justify-center font-bold text-xs">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} className="sm:w-4 sm:h-4" />}
                                </div>
                            </button>

                            {/* User Menu Dropdown */}
                            {isUserMenuOpen && (
                                <div
                                    className="
                                        absolute right-0 top-full mt-3 w-48
                                        bg-zinc-900 border border-zinc-700 rounded-xl
                                        shadow-xl shadow-black/80
                                        overflow-hidden
                                        z-50
                                    "
                                    style={{ animation: 'fadeInDown 0.2s ease-out forwards' }}
                                >
                                    <div className="p-3 border-b border-white/10">
                                        <p className="text-white font-bold text-sm truncate">{user.name}</p>
                                        <p className="text-white/50 text-xs truncate">{user.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors text-left"
                                        >
                                            <LogOut size={14} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="
                                border border-white/20 hover:border-accent hover:text-accent
                                px-3 py-1.5 sm:px-5 sm:py-2 rounded-full transition-all duration-300
                                text-[10px] sm:text-xs font-bold
                            "
                        >
                            LOGIN
                        </Link>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/95 md:hidden pt-[52px] sm:pt-[60px]" style={{ animation: 'fadeIn 0.2s ease-out' }}>
                    <div className="pt-4 px-6 pb-6">
                        <div className="space-y-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-4 text-lg font-medium text-white hover:text-accent transition-colors border-b border-white/10"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Login/User */}
                        <div className="mt-8">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                                            <User size={20} className="text-black" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{user.email.split('@')[0]}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 font-medium"
                                    >
                                        <LogOut size={18} />
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center py-3 bg-accent text-black font-bold rounded-xl"
                                >
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Dropdown Animation Styles */}
            <style>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </>
    );
};

export default Navbar;
