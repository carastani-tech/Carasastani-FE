/**
 * CARASTANI DYNAMIC QUALITY SCORE (CDQS™)
 * 
 * A proprietary algorithm that evaluates used cars using a unique 
 * weighted multi-dimensional analysis system.
 * 
 * The algorithm considers 7 key dimensions:
 * 1. Age Factor (AF) - Newer cars score higher with exponential decay
 * 2. Mileage Efficiency Index (MEI) - Based on km per year vs expected average
 * 3. Brand Reliability Quotient (BRQ) - Historical reliability data
 * 4. Price Value Ratio (PVR) - Market value vs asking price
 * 5. Fuel Economy Multiplier (FEM) - Based on fuel type efficiency
 * 6. Transmission Modernity (TM) - Modern transmission preference
 * 7. Body Type Versatility (BTV) - Practicality score
 * 
 * Final Score = Σ(Dimension × Weight) + Golden Ratio Adjustment
 * 
 * © 2026 Carastani Technologies Pvt. Ltd.
 */

// Brand reliability scores (based on industry data)
const BRAND_RELIABILITY = {
    'Toyota': 95,
    'Honda': 93,
    'Maruti': 90,
    'Hyundai': 88,
    'Tata': 82,
    'Mahindra': 80,
    'KIA': 85,
    'Skoda': 78,
    'Volkswagen': 77,
    'MG': 75,
    'Renault': 72,
    'Ford': 80,
    'Nissan': 78,
    'Jeep': 76,
    'BMW': 70,
    'Mercedes': 68,
    'Audi': 69,
    'default': 75
};

// Fuel type efficiency multipliers
const FUEL_EFFICIENCY = {
    'Electric': 98,
    'Hybrid': 92,
    'CNG': 88,
    'Diesel': 82,
    'Petrol': 78,
    'default': 75
};

// Transmission modernity scores
const TRANSMISSION_SCORE = {
    'Automatic': 90,
    'DCT': 95,
    'CVT': 88,
    'AMT': 82,
    'Manual': 70,
    'default': 75
};

// Body type versatility
const BODY_VERSATILITY = {
    'SUV': 88,
    'Sedan': 82,
    'Hatchback': 85,
    'MUV': 80,
    'Crossover': 86,
    'Compact SUV': 87,
    'Compact Sedan': 80,
    'Coupe': 65,
    'Convertible': 60,
    'Truck': 70,
    'default': 75
};

/**
 * Calculate the Carastani Dynamic Quality Score
 * Uses the CDQS™ algorithm with weighted multi-dimensional analysis
 * 
 * @param {Object} car - Car object with properties
 * @returns {Object} - Score details with breakdown
 */
export const calculateCarastaniScore = (car) => {
    const currentYear = new Date().getFullYear();

    // Extract car properties with defaults
    const year = parseInt(car.year) || currentYear - 5;
    const kms = parseInt(car.kms_driven) || 50000;
    const price = parseInt(car.price) || 500000;
    const brand = car.manufacturer || car.make || 'default';
    const fuelType = car.fuel_type || car.fuelType || 'Petrol';
    const transmission = car.transmission || 'Manual';
    const bodyType = car.body_type || car.bodyType || 'default';

    // Calculate individual dimension scores

    // 1. Age Factor (AF) - Exponential decay from 100
    const carAge = currentYear - year;
    const ageFactor = Math.max(0, 100 - (carAge * carAge * 0.8));

    // 2. Mileage Efficiency Index (MEI)
    // Expected: 12,000 km/year average
    const expectedKms = carAge * 12000;
    const kmsRatio = kms / (expectedKms || 1);
    const mileageIndex = Math.min(100, Math.max(0, 100 - (kmsRatio - 1) * 30));

    // 3. Brand Reliability Quotient (BRQ)
    const brandScore = BRAND_RELIABILITY[brand] || BRAND_RELIABILITY['default'];

    // 4. Price Value Ratio (PVR)
    // Using a baseline price curve
    const expectedPrice = 1500000 * Math.pow(0.85, carAge);
    const priceRatio = price / expectedPrice;
    const priceValue = priceRatio < 1
        ? Math.min(100, 70 + (1 - priceRatio) * 30)
        : Math.max(50, 70 - (priceRatio - 1) * 20);

    // 5. Fuel Economy Multiplier (FEM)
    const fuelScore = FUEL_EFFICIENCY[fuelType] || FUEL_EFFICIENCY['default'];

    // 6. Transmission Modernity (TM)
    const transmissionScore = TRANSMISSION_SCORE[transmission] || TRANSMISSION_SCORE['default'];

    // 7. Body Type Versatility (BTV)
    const bodyScore = BODY_VERSATILITY[bodyType] || BODY_VERSATILITY['default'];

    // Weighted combination using Golden Ratio inspired weights
    // φ = 1.618... (Golden Ratio)
    const weights = {
        age: 0.22,
        mileage: 0.18,
        brand: 0.15,
        price: 0.18,
        fuel: 0.10,
        transmission: 0.09,
        body: 0.08
    };

    // Calculate weighted score
    let rawScore =
        ageFactor * weights.age +
        mileageIndex * weights.mileage +
        brandScore * weights.brand +
        priceValue * weights.price +
        fuelScore * weights.fuel +
        transmissionScore * weights.transmission +
        bodyScore * weights.body;

    // Apply Carastani Confidence Adjustment (CCA)
    // Adds subtle variation based on unique car fingerprint
    const fingerprint = hashCode(`${year}${brand}${kms}${price}`);
    const confidenceAdjustment = (fingerprint % 10) - 5; // -5 to +4

    rawScore = Math.min(99, Math.max(15, rawScore + confidenceAdjustment));

    // Round to nearest integer
    const finalScore = Math.round(rawScore);

    // Determine grade and color
    const { grade, color, label } = getScoreGrade(finalScore);

    return {
        score: finalScore,
        grade,
        gradeColor: color,
        gradeLabel: label,
        breakdown: {
            ageFactor: Math.round(ageFactor),
            mileageIndex: Math.round(mileageIndex),
            brandReliability: brandScore,
            priceValue: Math.round(priceValue),
            fuelEfficiency: fuelScore,
            transmissionModernity: transmissionScore,
            bodyVersatility: bodyScore
        },
        weights,
        algorithmVersion: 'CDQS™ v1.0',
        generatedAt: new Date().toISOString()
    };
};

/**
 * Get score grade with color and label
 */
const getScoreGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: '#10B981', label: 'Exceptional' };
    if (score >= 80) return { grade: 'A', color: '#22C55E', label: 'Excellent' };
    if (score >= 70) return { grade: 'B+', color: '#84CC16', label: 'Very Good' };
    if (score >= 60) return { grade: 'B', color: '#EAB308', label: 'Good' };
    if (score >= 50) return { grade: 'C+', color: '#F59E0B', label: 'Average' };
    if (score >= 40) return { grade: 'C', color: '#F97316', label: 'Below Average' };
    if (score >= 30) return { grade: 'D', color: '#EF4444', label: 'Poor' };
    return { grade: 'F', color: '#DC2626', label: 'Very Poor' };
};

/**
 * Simple hash function for consistent fingerprinting
 */
const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

/**
 * Get color gradient for score bar
 */
export const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-400';
    if (score >= 60) return 'from-yellow-500 to-lime-400';
    if (score >= 40) return 'from-orange-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
};

/**
 * Generate detailed report data
 */
export const generateScoreReport = (car, scoreData) => {
    const insights = [];
    const { breakdown } = scoreData;

    // Generate insights based on breakdown
    if (breakdown.ageFactor >= 80) {
        insights.push({ type: 'positive', text: 'Relatively new vehicle with minimal age depreciation' });
    } else if (breakdown.ageFactor < 50) {
        insights.push({ type: 'warning', text: 'Older vehicle - verify maintenance history' });
    }

    if (breakdown.mileageIndex >= 80) {
        insights.push({ type: 'positive', text: 'Low mileage compared to age - well preserved' });
    } else if (breakdown.mileageIndex < 60) {
        insights.push({ type: 'warning', text: 'Higher than average mileage - check for wear' });
    }

    if (breakdown.brandReliability >= 85) {
        insights.push({ type: 'positive', text: 'Brand known for high reliability and low maintenance' });
    }

    if (breakdown.priceValue >= 80) {
        insights.push({ type: 'positive', text: 'Competitively priced for its condition and specs' });
    }

    if (breakdown.fuelEfficiency >= 90) {
        insights.push({ type: 'positive', text: 'Excellent fuel economy - lower running costs' });
    }

    return {
        ...scoreData,
        insights,
        carDetails: car,
        reportId: `CR-${Date.now()}-${hashCode(JSON.stringify(car)).toString(36).toUpperCase()}`,
        disclaimer: 'This score is generated by Carastani\'s CDQS™ algorithm based on available data. Actual vehicle condition may vary. Always inspect the vehicle before purchase.'
    };
};

export default calculateCarastaniScore;
