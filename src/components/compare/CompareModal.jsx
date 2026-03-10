import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Check, ArrowRight, Download, Scale, Star, Fuel, Gauge, MapPin, Car, Calendar, Settings, Zap, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateCarastaniScore } from '../../utils/carastaniScore';

const CompareModal = ({ cars, onClose }) => {
    const [downloading, setDownloading] = useState(false);
    const [showAllSpecs, setShowAllSpecs] = useState(false);

    if (!cars || cars.length < 2) return null;

    // Comparison specifications with icons
    const specs = [
        { key: 'price', label: 'Price', icon: '💰', format: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : 'N/A' },
        { key: 'year', label: 'Year', icon: '📅', format: (v) => v || 'N/A' },
        { key: 'kms_driven', label: 'KMs Driven', icon: '🛣️', format: (v) => v ? `${Number(v).toLocaleString()} km` : 'N/A' },
        { key: 'fuel_type', label: 'Fuel Type', icon: '⛽', format: (v) => v || 'N/A' },
        { key: 'transmission', label: 'Transmission', icon: '⚙️', format: (v) => v || 'N/A' },
        { key: 'body_type', label: 'Body Type', icon: '🚗', format: (v) => v || 'N/A' },
        { key: 'engine', label: 'Engine', icon: '🔧', format: (v) => v || 'N/A' },
        { key: 'location', label: 'Location', icon: '📍', format: (v) => v || 'N/A' },
    ];

    // Show only key specs initially, all on expand
    const visibleSpecs = showAllSpecs ? specs : specs.slice(0, 5);

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

    // Generate comparison PDF via backend API
    const downloadComparisonPDF = async () => {
        setDownloading(true);
        try {
            const requestBody = {
                cars: carScores.map(car => {
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

    // Score bar component
    const ScoreBar = ({ score, color, isBest }) => (
        <div className="flex flex-col items-center gap-1.5 w-full">
            <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${score}%`,
                        background: `linear-gradient(90deg, ${color}88, ${color})`
                    }}
                />
            </div>
            <span className="text-lg font-extrabold" style={{ color }}>{score}<span className="text-xs font-medium text-gray-400">/100</span></span>
        </div>
    );

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden animate-scale-in flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-primary via-primary/90 to-teal-600 text-white px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Scale size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Compare {cars.length} Cars
                            </h2>
                            <p className="text-white/60 text-xs sm:text-sm font-medium">Side-by-side comparison</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/25 rounded-xl flex items-center justify-center transition-all duration-200 hover:rotate-90"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Container for both Headers and Data */}
                <div className="flex-1 overflow-auto min-h-0 relative bg-white pb-2">
                    <table className="w-full min-w-max border-separate border-spacing-0">
                        {/* Car Header Cards - Scroll Normally */}
                        <thead className="shadow-sm">
                            <tr>
                                {/* Empty header cell above the labels, sticky left */}
                                <th className="sticky left-0 z-40 bg-white border-b border-gray-100 w-32 sm:w-40 px-4 sm:px-6 py-4">
                                    {/* Invisible placeholder for layout */}
                                </th>
                                
                                {carScores.map((car, index) => {
                                    const isBest = index === bestCarIndex;
                                    return (
                                        <th
                                            key={index}
                                            className="w-48 sm:w-64 p-3 sm:p-4 border-b border-gray-100 align-top font-normal bg-white"
                                        >
                                            <div
                                                className={`relative rounded-2xl p-3 sm:p-4 h-full flex flex-col transition-all duration-300 ${
                                                    isBest
                                                        ? 'bg-gradient-to-br from-primary/5 to-teal-50 border-2 border-primary/30 shadow-lg shadow-primary/10'
                                                        : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                                                }`}
                                            >
                                                {/* Best Badge */}
                                                {isBest && (
                                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                                                        <span className="bg-gradient-to-r from-primary to-teal-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md shadow-primary/25 whitespace-nowrap">
                                                            <Trophy size={11} /> Best Pick
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Car Thumbnail + Info */}
                                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 mb-3">
                                                    <div className="w-16 h-12 sm:w-20 sm:h-14 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                                        <img
                                                            src={car.image}
                                                            alt={car.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="%23f3f4f6" width="48" height="48"/><text x="50%" y="50%" fill="%239ca3af" font-size="8" text-anchor="middle" dy=".3em">N/A</text></svg>';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1 text-center sm:text-left">
                                                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">
                                                            {car.name}
                                                        </h3>
                                                        <p className="text-[10px] sm:text-xs text-gray-400 truncate mt-0.5">
                                                            {car.year} • {car.fuel_type || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Score Bar */}
                                                <div className="mt-auto">
                                                    <ScoreBar
                                                        score={car.scoreData.score}
                                                        color={car.scoreData.gradeColor}
                                                        isBest={isBest}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {/* Specs Table Body */}
                        <tbody>
                            {visibleSpecs.map((spec, rowIndex) => {
                                const bestIdx = getBestIndex(spec);
                                const isEven = rowIndex % 2 === 0;
                                const rowBg = isEven ? 'bg-white' : 'bg-gray-50/50';
                                const stickyBg = isEven ? 'bg-white' : 'bg-[#f8fafc]'; // Solid color for sticky to prevent transparency overlap
                                
                                return (
                                    <tr
                                        key={spec.key}
                                        className={`transition-colors duration-150 hover:bg-gray-50 ${rowBg}`}
                                    >
                                        {/* Label - Sticky Left */}
                                        <td className={`sticky left-0 z-20 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 ${stickyBg}`}>
                                            <div className="flex items-center gap-2 sm:gap-2.5">
                                                <span className="text-base sm:text-lg">{spec.icon}</span>
                                                <span className="font-semibold text-gray-600 text-xs sm:text-sm whitespace-nowrap">{spec.label}</span>
                                            </div>
                                        </td>

                                        {/* Values */}
                                        {carScores.map((car, idx) => {
                                            const isBest = idx === bestIdx;
                                            const value = spec.format(car[spec.key]);
                                            const isNA = value === 'N/A';
                                            return (
                                                <td
                                                    key={idx}
                                                    className="px-3 sm:px-4 py-3.5 sm:py-4 text-center border-b border-gray-100 transition-colors duration-200"
                                                >
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${
                                                        isBest
                                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                                            : isNA
                                                            ? 'text-gray-400'
                                                            : 'text-gray-800'
                                                    }`}>
                                                        {value}
                                                        {isBest && <Check size={13} className="text-emerald-500 shrink-0" strokeWidth={3} />}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Show more / less toggle */}
                    {specs.length > 5 && (
                        <div className="flex justify-center py-2 border-t border-gray-100 bg-white">
                            <button
                                onClick={() => setShowAllSpecs(!showAllSpecs)}
                                className="flex items-center gap-1.5 text-primary font-semibold text-xs sm:text-sm hover:text-primary/80 transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                            >
                                {showAllSpecs ? (
                                    <>Show Less <ChevronUp size={15} /></>
                                ) : (
                                    <>Show All Specs <ChevronDown size={15} /></>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Winner Verdict */}
                    <div className="mx-3 sm:mx-6 my-3 sm:my-4 bg-gradient-to-r from-primary/5 via-teal-50 to-primary/5 rounded-2xl p-4 sm:p-5 border border-primary/10">
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-200">
                                    <Trophy size={16} className="text-white" />
                                </div>
                                <span className="text-sm sm:text-base font-bold text-gray-800">Our Recommendation:</span>
                            </div>
                            <span className="text-base sm:text-lg font-extrabold text-primary">
                                {carScores[bestCarIndex]?.name}
                            </span>
                            <span
                                className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full"
                                style={{
                                    backgroundColor: `${carScores[bestCarIndex]?.scoreData.gradeColor}15`,
                                    color: carScores[bestCarIndex]?.scoreData.gradeColor
                                }}
                            >
                                Score: {carScores[bestCarIndex]?.scoreData.score}/100
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                            <span className="w-2.5 h-2.5 bg-emerald-100 rounded-sm ring-1 ring-emerald-300" />
                            <span>= Best value</span>
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>Comparing {cars.length} cars</span>
                    </p>
                    <div className="flex gap-2.5 w-full sm:w-auto">
                        <button
                            onClick={downloadComparisonPDF}
                            disabled={downloading}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-accent to-red-500 hover:from-red-500 hover:to-accent text-white font-semibold px-4 sm:px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5"
                        >
                            <Download size={15} />
                            {downloading ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 sm:px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                            Close
                            <X size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Animation Style */}
            <style>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.92) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-scale-in {
                    animation: scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default CompareModal;
