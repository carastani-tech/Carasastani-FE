import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, ArrowRight, Download, Scale, Star } from 'lucide-react';
import { calculateCarastaniScore } from '../../utils/carastaniScore';

const CompareModal = ({ cars, onClose }) => {
    const [downloading, setDownloading] = useState(false);

    if (!cars || cars.length < 2) return null;

    // Comparison specifications
    const specs = [
        { key: 'price', label: 'Price', format: (v) => `₹${v?.toLocaleString('en-IN') || 'N/A'}` },
        { key: 'year', label: 'Year', format: (v) => v || 'N/A' },
        { key: 'kms_driven', label: 'KMs Driven', format: (v) => v ? `${v.toLocaleString()} km` : 'N/A' },
        { key: 'fuel_type', label: 'Fuel Type', format: (v) => v || 'N/A' },
        { key: 'transmission', label: 'Transmission', format: (v) => v || 'N/A' },
        { key: 'body_type', label: 'Body Type', format: (v) => v || 'N/A' },
        { key: 'engine', label: 'Engine', format: (v) => v || 'N/A' },
        { key: 'location', label: 'Location', format: (v) => v || 'N/A' },
    ];

    // Get best value index for a spec
    const getBestIndex = (spec) => {
        const values = cars.map(car => car[spec.key]);
        if (spec.key === 'price') {
            const validPrices = values.filter(v => v && v > 0);
            if (validPrices.length === 0) return -1;
            const minPrice = Math.min(...validPrices);
            return values.indexOf(minPrice);
        }
        if (spec.key === 'year') {
            const validYears = values.filter(v => v && v > 0);
            if (validYears.length === 0) return -1;
            const maxYear = Math.max(...validYears);
            return values.indexOf(maxYear);
        }
        if (spec.key === 'kms_driven') {
            const validKms = values.filter(v => v && v > 0);
            if (validKms.length === 0) return -1;
            const minKms = Math.min(...validKms);
            return values.indexOf(minKms);
        }
        return -1;
    };

    // Calculate scores for all cars
    const carScores = cars.map(car => ({
        ...car,
        scoreData: calculateCarastaniScore(car)
    }));

    // Find best car by score
    const scores = carScores.map(c => c.scoreData.score);
    const bestCarIndex = scores.indexOf(Math.max(...scores));
    const bestCar = carScores[bestCarIndex];

    // Generate comparison PDF via backend API
    const downloadComparisonPDF = async () => {
        setDownloading(true);

        try {
            // Prepare car data for API request
            const requestBody = {
                cars: carScores.map(car => {
                    // Helper to parse numbers safely
                    const parseNumber = (val) => {
                        if (typeof val === 'number') return val;
                        if (typeof val === 'string') {
                            return parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                        }
                        return 0;
                    };

                    return {
                        name: car.name || 'Unknown Car',
                        year: parseNumber(car.year),
                        price: parseNumber(car.price),
                        kms_driven: parseNumber(car.kms_driven),
                        fuel_type: car.fuel_type || 'N/A',
                        transmission: car.transmission || 'N/A',
                        body_type: car.body_type || 'N/A',
                        engine: car.engine || 'N/A',
                        location: car.location || 'N/A',
                        seller: car.seller || 'N/A',
                        carastani_score: car.scoreData.score,
                        grade: car.scoreData.grade,
                        grade_label: car.scoreData.gradeLabel
                    };
                })
            };

            // Call backend API
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/reports/comparison`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/pdf',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            // Get PDF blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `carastani_comparison_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setDownloading(false);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please make sure the backend server is running.');
            setDownloading(false);
        }
    };

    // Dynamic grid columns based on car count
    const getGridCols = () => {
        return `grid-template-columns: 120px repeat(${cars.length}, minmax(140px, 1fr))`;
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 sm:p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                            <Scale size={24} />
                            Compare {cars.length} Cars
                        </h2>
                        <p className="text-white/70 text-xs sm:text-sm">Side-by-side comparison</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Comparison Table */}
                <div className="overflow-x-auto max-h-[60vh] sm:max-h-[65vh]">
                    <table className="w-full min-w-max border-collapse">
                        {/* Car Headers */}
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-50">
                                <th className="p-3 sm:p-4 text-left text-gray-600 font-semibold text-sm sm:text-base w-28 sm:w-32 sticky left-0 bg-gray-50 z-20">
                                    Specification
                                </th>
                                {carScores.map((car, index) => (
                                    <th key={index} className="p-2 sm:p-4 min-w-[140px] sm:min-w-[180px]">
                                        <div className="bg-white rounded-xl p-2 sm:p-3 text-center shadow-sm border">
                                            <div className="relative w-full h-16 sm:h-24 bg-gray-100 rounded-lg overflow-hidden mb-2">
                                                <img
                                                    src={car.image}
                                                    alt={car.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {index === bestCarIndex && (
                                                    <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                        <Star size={8} fill="white" /> Best
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{car.name}</h3>
                                            <p className="text-[10px] sm:text-xs text-gray-500">{car.year} • {car.fuel_type}</p>
                                            <div
                                                className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
                                                style={{ backgroundColor: `${car.scoreData.gradeColor}20`, color: car.scoreData.gradeColor }}
                                            >
                                                {car.scoreData.score}/100
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {specs.map((spec, rowIndex) => {
                                const bestIdx = getBestIndex(spec);
                                return (
                                    <tr key={spec.key} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="p-3 sm:p-4 font-medium text-gray-700 text-xs sm:text-sm sticky left-0 bg-inherit z-10">
                                            {spec.label}
                                        </td>
                                        {carScores.map((car, idx) => {
                                            const isBest = idx === bestIdx;
                                            return (
                                                <td
                                                    key={idx}
                                                    className={`p-2 sm:p-3 text-center text-xs sm:text-sm ${isBest ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-900'}`}
                                                >
                                                    {spec.format(car[spec.key])}
                                                    {isBest && <Check size={12} className="inline ml-1 text-green-600" />}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            {/* Score Row */}
                            <tr className="bg-gray-100 border-t-2 border-primary/20">
                                <td className="p-3 sm:p-4 font-bold text-gray-700 text-xs sm:text-sm sticky left-0 bg-gray-100 z-10">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-accent" />
                                        Score
                                    </div>
                                </td>
                                {carScores.map((car, idx) => {
                                    const isBest = idx === bestCarIndex;
                                    return (
                                        <td
                                            key={idx}
                                            className={`p-2 sm:p-3 text-center ${isBest ? 'bg-primary/10' : ''}`}
                                        >
                                            <div
                                                className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold"
                                                style={{ backgroundColor: `${car.scoreData.gradeColor}20`, color: car.scoreData.gradeColor }}
                                            >
                                                {car.scoreData.score}
                                            </div>
                                            <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                                {car.scoreData.grade}
                                            </div>
                                            {isBest && (
                                                <div className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                                                    <Star size={10} fill="white" /> Winner
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer Actions */}
                <div className="p-3 sm:p-5 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                    <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-green-100 rounded"></span>
                        Green = Best value • Comparing {cars.length} cars
                    </p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={downloadComparisonPDF}
                            disabled={downloading}
                            className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-black font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm"
                        >
                            <Download size={16} />
                            {downloading ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none bg-secondary hover:bg-secondary/90 text-white font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                            Close
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Animation Style */}
            <style>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default CompareModal;
