import React, { useState, useEffect } from 'react';
import { Car, Calendar, IndianRupee, Tag, Loader2, Zap, ArrowRight } from 'lucide-react';
import { fetchBodyTypes, fetchManufacturers, fetchBuildYears } from '../../services/masterDataService';
import {
    bodyTypeImages,
    brandImages,
    budgetData,
    yearImages,
    engineData,
    defaultImage
} from '../../config/browseImages';

const BrowseByType = () => {
    const [activeTab, setActiveTab] = useState('type');
    const [isExpanded, setIsExpanded] = useState(false);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [buildYears, setBuildYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);
    const sectionRef = React.useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [types, brands, years] = await Promise.all([
                fetchBodyTypes(),
                fetchManufacturers(),
                fetchBuildYears()
            ]);
            setBodyTypes(types);
            setManufacturers(brands);
            setBuildYears(years);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleItemClick = (type, value) => {
        const params = new URLSearchParams();
        if (type === 'bodyType') params.set('bodyType', value);
        if (type === 'brand') params.set('manufacturer', value);
        if (type === 'year') params.set('buildYear', value);
        if (type === 'budget') params.set('priceRange', value);
        if (type === 'engine') params.set('engine', value);
        window.location.href = `/used?${params.toString()}`;
    };

    const handleToggleExpand = () => {
        if (isExpanded) {
            // If collapsing, scroll back to top
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsExpanded(!isExpanded);
    };

    const getActiveData = () => {
        const limit = isExpanded ? undefined : 8;
        switch (activeTab) {
            case 'type':
                return bodyTypes.slice(0, limit).map(t => ({
                    key: t.key,
                    image: bodyTypeImages[t.key] || defaultImage,
                    onClick: () => handleItemClick('bodyType', t.key)
                }));
            case 'brand':
                return manufacturers.slice(0, limit).map(m => ({
                    key: m.key,
                    image: brandImages[m.key] || defaultImage,
                    onClick: () => handleItemClick('brand', m.key)
                }));
            case 'budget':
                return budgetData.slice(0, limit).map(b => ({
                    key: b.key,
                    image: b.image,
                    onClick: () => handleItemClick('budget', b.value)
                }));
            case 'year':
                return buildYears.slice(0, limit).map(y => ({
                    key: y.key,
                    image: yearImages[y.key] || defaultImage,
                    onClick: () => handleItemClick('year', y.key)
                }));
            case 'engine':
                return engineData.slice(0, limit).map(e => ({
                    key: e.key,
                    specs: e.specs,
                    description: e.description,
                    image: e.image,
                    onClick: () => handleItemClick('engine', e.key)
                }));
            default:
                return [];
        }
    };

    const tabs = [
        { id: 'type', label: 'BODY TYPE', icon: Tag },
        { id: 'brand', label: 'BRAND', icon: Car },
        { id: 'budget', label: 'BUDGET', icon: IndianRupee },
        { id: 'year', label: 'YEAR', icon: Calendar },
        { id: 'engine', label: 'ENGINE', icon: Zap },
    ];

    const data = getActiveData();

    return (
        <div ref={sectionRef} className="bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-6 md:px-12 scroll-mt-20">
            {/* Section Header */}
            <div className="text-center mb-12">
                <span className="text-accent text-sm font-semibold uppercase tracking-widest">Discover Your Perfect Match</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
                    Browse
                </h2>
                <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                    Find your ideal car by body type, brand, budget, year, or engine configuration
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12 flex-wrap gap-2">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsExpanded(false);
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${isActive
                                ? 'bg-accent text-black shadow-lg shadow-accent/30'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-accent" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                    {data.map((item, index) => (
                        <div
                            key={item.key}
                            onClick={item.onClick}
                            onMouseEnter={() => setHoveredItem(item.key)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/3] transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.key}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 transition-all duration-500 ${hoveredItem === item.key
                                ? 'bg-gradient-to-t from-black via-black/60 to-transparent'
                                : 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
                                }`}></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                                <h3 className={`font-bold text-lg md:text-xl transition-all duration-300 ${hoveredItem === item.key ? 'translate-y-0' : 'translate-y-2'
                                    }`}>
                                    {item.key}
                                </h3>

                                {/* Engine specific specs */}
                                {activeTab === 'engine' && item.specs && (
                                    <div className={`transition-all duration-300 ${hoveredItem === item.key ? 'opacity-100 max-h-20' : 'opacity-70 max-h-10'
                                        } overflow-hidden`}>
                                        <p className="text-accent text-sm font-medium">{item.specs}</p>
                                        <p className="text-gray-300 text-xs mt-1">{item.description}</p>
                                    </div>
                                )}

                                {/* Hover Arrow */}
                                <div className={`flex items-center gap-2 text-accent text-sm font-medium mt-2 transition-all duration-300 ${hoveredItem === item.key ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                    }`}>
                                    Explore <ArrowRight size={16} />
                                </div>
                            </div>

                            {/* Accent Border on Hover */}
                            <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${hoveredItem === item.key ? 'border-accent' : 'border-transparent'
                                }`}></div>
                        </div>
                    ))}
                </div>
            )}

            {/* View All Button - Only show if there are more than 8 items */}
            {!loading && (
                <div className="text-center mt-12">
                    {/* Logic to determine if we need a button */}
                    {(
                        (activeTab === 'type' && bodyTypes.length > 8) ||
                        (activeTab === 'brand' && manufacturers.length > 8) ||
                        (activeTab === 'budget' && budgetData.length > 8) ||
                        (activeTab === 'year' && buildYears.length > 8) ||
                        (activeTab === 'engine' && engineData.length > 8)
                    ) && (
                            <button
                                onClick={handleToggleExpand}
                                className="inline-flex items-center gap-2 bg-white text-secondary font-bold px-8 py-4 rounded-full transition-all duration-300 hover:gap-4 hover:shadow-xl hover:bg-accent hover:text-black"
                            >
                                {isExpanded ? 'Show Less' : 'View All Options'}
                                <ArrowRight size={18} className={`transition-transform ${isExpanded ? '-rotate-90' : 'rotate-0'}`} />
                            </button>
                        )}
                </div>
            )}
        </div>
    );
};

export default BrowseByType;
