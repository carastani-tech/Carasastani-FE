import React, { useState, useEffect } from 'react';
import { Search, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchAllMasterData } from '../../services/masterDataService';
import { getSelectedCity, setSelectedCity } from '../../utils/cityStorage';

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-6 border-b border-gray-100 pb-4 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-3 group"
            >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-primary transition-colors">{title}</h3>
                {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {isOpen && <div className="animate-scale-in origin-top">{children}</div>}
        </div>
    );
};

const CheckboxFilter = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer group py-1">
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
            {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
        <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={(e) => onChange(label, e.target.checked)}
        />
        <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
    </label>
);

const SidebarFilters = ({ filters, onFilterChange, mobile = false }) => {
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
    const [brandSearch, setBrandSearch] = useState('');

    useEffect(() => {
        const loadMasterData = async () => {
            const data = await fetchAllMasterData();
            setMasterData(data);
            setLoading(false);
        };
        loadMasterData();
    }, []);

    const handleCheckboxChange = (category, value, isChecked) => {
        const currentValues = filters[category] || [];
        let newValues;
        if (isChecked) {
            newValues = [...currentValues, value];
        } else {
            newValues = currentValues.filter(item => item !== value);
        }
        onFilterChange(category, newValues);
    };

    const handleSingleChange = (category, value) => {
        if (category === 'location' && value) {
            setSelectedCity(value);
        }
        onFilterChange(category, value);
    };

    // Filter manufacturers based on search
    const filteredManufacturers = masterData.manufacturers.filter(m =>
        m.key.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const popularBrands = ['Maruti', 'Hyundai', 'Tata', 'Honda', 'Mahindra', 'Toyota'];
    const sortedManufacturers = [...filteredManufacturers].sort((a, b) => {
        const aPopular = popularBrands.includes(a.key);
        const bPopular = popularBrands.includes(b.key);
        if (aPopular && !bPopular) return -1;
        if (!aPopular && bPopular) return 1;
        return a.key.localeCompare(b.key);
    });

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full md:w-64 flex-shrink-0">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
            </div>
        );
    }

    // Base classes for container
    const containerClasses = mobile
        ? "w-full" // Mobile: just width full, no borders/shadows as parent handles it
        : "bg-white p-4 rounded-sm shadow-sm border border-gray-200 w-full md:w-72 flex-shrink-0 md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto";

    return (
        <div className={containerClasses}>
            {!mobile && (
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                    {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v) && (
                        <button
                            onClick={() => onFilterChange('clearAll')}
                            className="text-xs text-blue-600 font-bold uppercase hover:underline"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Manufacturer Filter */}
            <FilterSection title="BRAND">
                <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search Brand"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-200 p-2 pl-8 text-sm focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {sortedManufacturers.slice(0, 15).map(brand => (
                        <CheckboxFilter
                            key={brand.key}
                            label={brand.key}
                            checked={(filters.brands || []).includes(brand.key)}
                            onChange={(val, checked) => handleCheckboxChange('brands', val, checked)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Build Year */}
            <FilterSection title="MODEL YEAR">
                {masterData.buildYears.map(year => (
                    <CheckboxFilter
                        key={year.key}
                        label={year.key}
                        checked={(filters.years || []).includes(year.key)}
                        onChange={(val, checked) => handleCheckboxChange('years', val, checked)}
                    />
                ))}
            </FilterSection>

            {/* Kilometer Driven */}
            <FilterSection title="KM DRIVEN">
                <div className="space-y-2">
                    {masterData.kmsDriven.map(km => (
                        <label key={km.key} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="kms"
                                checked={filters.kilometer === km.value}
                                onChange={() => handleSingleChange('kilometer', km.value)}
                                className="text-primary focus:ring-primary"
                            />
                            <span className="text-xs text-gray-700 group-hover:text-black">{km.key}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Body Type */}
            <FilterSection title="BODY TYPE">
                <div className="space-y-2">
                    {masterData.bodyTypes.slice(0, 8).map(type => (
                        <CheckboxFilter
                            key={type.key}
                            label={type.key}
                            checked={(filters.bodyTypes || []).includes(type.key)}
                            onChange={(val, checked) => handleCheckboxChange('bodyTypes', val, checked)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Fuel Type */}
            <FilterSection title="FUEL TYPE">
                {masterData.fuelTypes.map(fuel => (
                    <CheckboxFilter
                        key={fuel.key}
                        label={fuel.key}
                        checked={(filters.fuelTypes || []).includes(fuel.key)}
                        onChange={(val, checked) => handleCheckboxChange('fuelTypes', val, checked)}
                    />
                ))}
            </FilterSection>

            {/* Transmission */}
            <FilterSection title="TRANSMISSION">
                {masterData.transmissions.map(trans => (
                    <CheckboxFilter
                        key={trans.key}
                        label={trans.key}
                        checked={(filters.transmissions || []).includes(trans.key)}
                        onChange={(val, checked) => handleCheckboxChange('transmissions', val, checked)}
                    />
                ))}
            </FilterSection>

            {/* Location */}
            <FilterSection title="LOCATION">
                <select
                    value={filters.location || getSelectedCity()}
                    onChange={(e) => handleSingleChange('location', e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs text-gray-600 focus:outline-none focus:border-primary"
                >
                    <option value="">All Cities</option>
                    {masterData.cities.map(city => (
                        <option key={city.key} value={city.key}>
                            {city.key}
                        </option>
                    ))}
                </select>
            </FilterSection>
        </div>
    );
};

export default SidebarFilters;
