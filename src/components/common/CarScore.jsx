import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Shield, TrendingUp, FileText, Download, X, CheckCircle, AlertTriangle, Info, Award, Zap, Gauge, Fuel, Car, Calendar, DollarSign, Settings } from 'lucide-react';
import { calculateCarastaniScore, generateScoreReport, getScoreGradient } from '../../utils/carastaniScore';

/**
 * Animated Carastani Score Badge
 * Shows the CDQS™ score with circular animation
 */
export const CarScoreBadge = ({ car, size = 'default', showReport = true }) => {
    const [scoreData, setScoreData] = useState(null);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        if (car) {
            const data = calculateCarastaniScore(car);
            setScoreData(data);

            // Animate score counting up
            let current = 0;
            const target = data.score;
            const duration = 1500;
            const step = target / (duration / 16);

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    setAnimatedScore(target);
                    clearInterval(timer);
                } else {
                    setAnimatedScore(Math.floor(current));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [car]);

    if (!scoreData) return null;

    const sizeClasses = {
        small: 'w-12 h-12 text-sm',
        default: 'w-16 h-16 text-lg',
        large: 'w-24 h-24 text-2xl'
    };

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    return (
        <>
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => showReport && setShowReportModal(true)}
            >
                {/* Circular Score Gauge */}
                <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
                    <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                        />
                        {/* Animated progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={scoreData.gradeColor}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    {/* Score number */}
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="font-bold" style={{ color: scoreData.gradeColor }}>
                            {animatedScore}
                        </span>
                    </div>
                </div>

                {/* Score Info */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <Shield size={14} className="text-primary" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Carastani Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className="text-sm font-bold px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${scoreData.gradeColor}20`, color: scoreData.gradeColor }}
                        >
                            {scoreData.grade}
                        </span>
                        <span className="text-xs text-gray-500">{scoreData.gradeLabel}</span>
                    </div>
                    {showReport && (
                        <span className="text-xs text-primary mt-1 group-hover:underline flex items-center gap-1">
                            <FileText size={10} />
                            View Report
                        </span>
                    )}
                </div>
            </div>

            {/* Score Report Modal */}
            {showReportModal && (
                <ScoreReportModal
                    car={car}
                    scoreData={scoreData}
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </>
    );
};

/**
 * Horizontal Score Bar for compact display
 */
export const CarScoreBar = ({ car, showLabel = true }) => {
    const [scoreData, setScoreData] = useState(null);
    const [animatedWidth, setAnimatedWidth] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        if (car) {
            const data = calculateCarastaniScore(car);
            setScoreData(data);

            // Animate bar width
            setTimeout(() => {
                setAnimatedWidth(data.score);
            }, 100);
        }
    }, [car]);

    if (!scoreData) return null;

    return (
        <>
            <div
                className="w-full cursor-pointer group"
                onClick={(e) => { e.stopPropagation(); setShowReportModal(true); }}
            >
                {showLabel && (
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <Shield size={12} className="text-primary" />
                            <span className="text-xs font-semibold text-gray-700">Carastani Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className="text-xs font-bold"
                                style={{ color: scoreData.gradeColor }}
                            >
                                {scoreData.score}/100
                            </span>
                            <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${scoreData.gradeColor}20`, color: scoreData.gradeColor }}
                            >
                                {scoreData.grade}
                            </span>
                        </div>
                    </div>
                )}

                {/* Animated Bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    {/* Color segments */}
                    <div className="absolute inset-0 flex">
                        <div className="flex-1 bg-red-200"></div>
                        <div className="flex-1 bg-orange-200"></div>
                        <div className="flex-1 bg-yellow-200"></div>
                        <div className="flex-1 bg-lime-200"></div>
                        <div className="flex-1 bg-green-200"></div>
                    </div>

                    {/* Animated fill */}
                    <div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreGradient(scoreData.score)} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${animatedWidth}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>

                    {/* Score indicator */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full shadow-md transition-all duration-1000"
                        style={{ left: `calc(${animatedWidth}% - 6px)`, borderColor: scoreData.gradeColor }}
                    ></div>
                </div>

                <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-400">Poor</span>
                    <span className="text-[10px] text-primary group-hover:underline flex items-center gap-0.5">
                        <FileText size={8} />
                        View Report
                    </span>
                    <span className="text-[10px] text-gray-400">Excellent</span>
                </div>
            </div>

            {showReportModal && (
                <ScoreReportModal
                    car={car}
                    scoreData={scoreData}
                    onClose={() => setShowReportModal(false)}
                />
            )}

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </>
    );
};

/**
 * Full Screen Score Report Modal with PDF Download
 */
const ScoreReportModal = ({ car, scoreData, onClose }) => {
    const reportData = generateScoreReport(car, scoreData);
    const reportRef = React.useRef(null);
    const [downloading, setDownloading] = React.useState(false);

    const dimensionIcons = {
        ageFactor: Calendar,
        mileageIndex: Gauge,
        brandReliability: Award,
        priceValue: DollarSign,
        fuelEfficiency: Fuel,
        transmissionModernity: Settings,
        bodyVersatility: Car
    };

    const dimensionLabels = {
        ageFactor: 'Age Factor',
        mileageIndex: 'Mileage Index',
        brandReliability: 'Brand Reliability',
        priceValue: 'Price Value',
        fuelEfficiency: 'Fuel Efficiency',
        transmissionModernity: 'Transmission',
        bodyVersatility: 'Body Versatility'
    };

    // PDF Download function via backend API
    const downloadPDF = async () => {
        setDownloading(true);
        try {
            // Helper to parse numbers safely
            const parseNumber = (val) => {
                if (typeof val === 'number') return val;
                if (typeof val === 'string') {
                    return parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                }
                return 0;
            };

            // Prepare request body for backend API
            const requestBody = {
                car: {
                    name: car.name || `${car.make} ${car.model}`,
                    year: parseNumber(car.year),
                    price: parseNumber(car.price),
                    kms_driven: parseNumber(car.kms_driven),
                    fuel_type: car.fuel_type || 'N/A',
                    transmission: car.transmission || 'N/A',
                    body_type: car.body_type || 'N/A',
                    engine: car.engine || 'N/A',
                    location: car.location || 'N/A',
                    seller: car.seller || 'N/A',
                    carastani_score: scoreData.score,
                    grade: scoreData.grade,
                    grade_label: scoreData.gradeLabel
                },
                breakdown: reportData.breakdown,
                insights: reportData.insights,
                report_id: reportData.reportId,
                generated_at: reportData.generatedAt,
                disclaimer: reportData.disclaimer
            };

            // Call backend API
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/reports/score`, {
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
            a.download = `carastani_score_report_${Date.now()}.pdf`;
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

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
            <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 flex items-start justify-center">
                <div
                    ref={reportRef}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in my-4"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary via-primary/90 to-accent/80 text-white p-4 sm:p-8 relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-accent rounded-full blur-2xl"></div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <X size={18} className="sm:hidden" />
                            <X size={24} className="hidden sm:block" />
                        </button>

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <Shield size={20} className="sm:hidden" />
                                <Shield size={28} className="hidden sm:block" />
                                <span className="text-sm sm:text-lg font-medium text-white/80">CARASTANI SCORE REPORT</span>
                            </div>
                            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 pr-8">{car.name || `${car.make} ${car.model}`}</h2>
                            <p className="text-white/60 text-xs sm:text-base">Report ID: {reportData.reportId}</p>
                        </div>

                        {/* Large Score Display */}
                        <div className="flex items-center gap-4 sm:gap-8 mt-4 sm:mt-8">
                            <div className="relative w-20 h-20 sm:w-36 sm:h-36 flex-shrink-0">
                                <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                                    <circle
                                        cx="50" cy="50" r="45"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 45}
                                        strokeDashoffset={2 * Math.PI * 45 * (1 - scoreData.score / 100)}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl sm:text-5xl font-bold">{scoreData.score}</span>
                                    <span className="text-[10px] sm:text-sm text-white/70">out of 100</span>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div
                                    className="text-lg sm:text-4xl font-bold px-3 sm:px-6 py-1.5 sm:py-3 rounded-xl sm:rounded-2xl inline-block"
                                    style={{ backgroundColor: `${scoreData.gradeColor}50` }}
                                >
                                    Grade {scoreData.grade}
                                </div>
                                <p className="text-sm sm:text-2xl mt-1 sm:mt-3">{scoreData.gradeLabel}</p>
                                <p className="text-[10px] sm:text-sm text-white/60 mt-0.5 sm:mt-1">{scoreData.algorithmVersion}</p>
                            </div>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className="p-4 sm:p-8">
                        {/* Score Breakdown */}
                        <div className="mb-6 sm:mb-10">
                            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                Score Breakdown
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                                {Object.entries(reportData.breakdown).map(([key, value]) => {
                                    const Icon = dimensionIcons[key] || Zap;
                                    return (
                                        <div key={key} className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center hover:shadow-lg transition-shadow">
                                            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-3">
                                                <Icon size={16} className="text-primary sm:hidden" />
                                                <Icon size={24} className="text-primary hidden sm:block" />
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">{dimensionLabels[key]}</p>
                                            <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
                                            <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full mt-1 sm:mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                                    style={{ width: `${value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="mb-6 sm:mb-10">
                            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                                <Info size={20} className="text-primary" />
                                Key Insights
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                {reportData.insights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl ${insight.type === 'positive' ? 'bg-green-50' : 'bg-amber-50'
                                            }`}
                                    >
                                        {insight.type === 'positive' ? (
                                            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                                        ) : (
                                            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
                                        )}
                                        <p className={`text-xs sm:text-sm ${insight.type === 'positive' ? 'text-green-700' : 'text-amber-700'}`}>
                                            {insight.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Algorithm Info */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <Shield size={18} className="text-accent" />
                                <span className="font-bold text-sm sm:text-base">About CDQS™ Algorithm</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                The Carastani Dynamic Quality Score uses a proprietary 7-dimensional weighted analysis system
                                to evaluate vehicles based on age, mileage, brand reliability, pricing, fuel efficiency,
                                transmission, and body type. Each dimension is weighted using a Golden Ratio-inspired
                                formula to ensure the most accurate representation of vehicle quality.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-4 sm:mt-6 italic text-center">
                            {reportData.disclaimer}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Generated: {new Date(reportData.generatedAt).toLocaleString()}
                        </p>
                        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                            <button
                                onClick={downloadPDF}
                                disabled={downloading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all hover:scale-105 disabled:opacity-50 text-sm"
                            >
                                <Download size={18} />
                                {downloading ? 'Generating...' : 'Download PDF'}
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 sm:flex-none bg-secondary hover:bg-secondary/90 text-white font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all hover:scale-105 text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-scale-in {
                    animation: scale-in 0.4s ease-out forwards;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default CarScoreBadge;
