import { defaultImage } from '../config/browseImages';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/api/master-data`;
const SEARCH_API = `${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/carastani`;

const normalizeMetadata = (apiResponse) => {
    // API returns: [{id: "...", datatype: "...", metadata: [...]}]
    // We need to extract the metadata array from the first item
    if (!apiResponse || !Array.isArray(apiResponse) || apiResponse.length === 0) {
        return [];
    }

    // Check if it's the wrapped format with metadata property
    if (apiResponse[0]?.metadata) {
        const metadata = apiResponse[0].metadata;

        // If metadata is an array with objects that have 'key' property, return as-is
        if (Array.isArray(metadata) && metadata.length > 0) {
            // Check if it's already in {key, value} format
            if (metadata[0]?.key !== undefined) {
                return metadata;
            }

            // Handle buildyear format: [{key1: val1, key2: val2, ...}] - single object with multiple properties
            if (typeof metadata[0] === 'object' && !Array.isArray(metadata[0])) {
                // Check if this is a key-value pair object (like buildyear)
                const firstItem = metadata[0];
                const keys = Object.keys(firstItem);

                // If keys don't include 'key' or 'value', it's the object format
                if (!keys.includes('key') && !keys.includes('value') && keys.length > 1) {
                    return keys.map(k => ({ key: k, value: firstItem[k] }));
                }
            }
        }

        return metadata;
    }

    // Fallback: If it's already an array of {key, value} objects
    if (apiResponse[0]?.key !== undefined) {
        return apiResponse;
    }

    // Fallback: Handle array of strings/numbers
    if (typeof apiResponse[0] === 'string' || typeof apiResponse[0] === 'number') {
        return apiResponse.map(item => ({ key: String(item), value: String(item) }));
    }

    return [];
};

// Helper for generic fetch
const fetchMasterData = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE}/${endpoint}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const data = await response.json();
        return normalizeMetadata(data);
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
};

export const fetchManufacturers = () => fetchMasterData('manufacturer');
export const fetchBodyTypes = () => fetchMasterData('bodytype');
export const fetchFuelTypes = () => fetchMasterData('fuel');
export const fetchBuildYears = () => fetchMasterData('buildyear');
export const fetchKmsDriven = () => fetchMasterData('kmsdriven');
export const fetchTransmissions = () => fetchMasterData('transmission');
export const fetchCities = () => fetchMasterData('city');

export const fetchAllMasterData = async () => {
    const [
        manufacturers,
        bodyTypes,
        fuelTypes,
        buildYears,
        kmsDriven,
        transmissions,
        cities
    ] = await Promise.all([
        fetchManufacturers(),
        fetchBodyTypes(),
        fetchFuelTypes(),
        fetchBuildYears(),
        fetchKmsDriven(),
        fetchTransmissions(),
        fetchCities()
    ]);

    return {
        manufacturers,
        bodyTypes,
        fuelTypes,
        buildYears,
        kmsDriven,
        transmissions,
        cities
    };
};

// --- SEARCH API INTEGRATION ---

const normalizeSpinnyCar = (car) => ({
    id: car.appointment_id || Math.random().toString(36).substr(2, 9),
    name: car.car_name,
    price: car.listing_price,
    year: car.year,
    bodyType: car.body_type,
    fuelType: car.fuel_type,
    mileage: car.odometer,
    transmission: car.transmission,
    image: car.image_url ? `https:${car.image_url}` : defaultImage,
    brand: car.make,
    color: car.color,
    location: car.city_code,
    source: 'Spinny'
});

const normalizeCarWaleCar = (car) => ({
    id: car.stockId || Math.random().toString(36).substr(2, 9),
    name: car.carName,
    price: parseInt(car.priceNumeric),
    year: car.makeYear,
    bodyType: car.bodyStyleId === "6" ? "SUV" : (car.bodyStyleId === "1" ? "Sedan" : "Car"),
    fuelType: car.fuel,
    mileage: car.kmNumeric,
    transmission: car.transmission ? car.transmission.split(' ')[0] : 'Manual',
    image: car.imageUrl || defaultImage,
    brand: car.makeName,
    color: '',
    location: car.cityName,
    source: 'CarWale'
});

export const searchCars = async (filters, page = 1) => {
    try {
        const params = new URLSearchParams();

        if (filters.location) params.append('cityName', filters.location);
        if (filters.brands && filters.brands.length > 0) params.append('manufacturer', filters.brands.join(','));
        if (filters.bodyTypes && filters.bodyTypes.length > 0) params.append('bodyType', filters.bodyTypes.join(','));
        if (filters.transmissions && filters.transmissions.length > 0) params.append('transmission', filters.transmissions.join(','));
        if (filters.fuelTypes && filters.fuelTypes.length > 0) params.append('fuel', filters.fuelTypes.join(','));
        if (filters.years && filters.years.length > 0) params.append('buildYear', filters.years.join(','));
        if (filters.kilometer) params.append('kmsDriven', filters.kilometer);

        params.append('pageNumber', page);
        params.append('cars24SearchAfter', (page - 1) * 20);

        const response = await fetch(`${SEARCH_API}?${params.toString()}`);
        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();

        let allCars = [];

        if (data.spinny && data.spinny.cars) {
            allCars = [...allCars, ...data.spinny.cars.map(normalizeSpinnyCar)];
        }

        if (data.carWale && data.carWale.stocks) {
            allCars = [...allCars, ...data.carWale.stocks.map(normalizeCarWaleCar)];
        }

        if (data.carAndBike && Array.isArray(data.carAndBike)) {
            // Implementation deferred
        }

        return {
            cars: allCars,
            total: allCars.length,
            hasMore: allCars.length > 0
        };

    } catch (error) {
        console.error("Search API Error:", error);
        return { cars: [], total: 0, hasMore: false };
    }
};
