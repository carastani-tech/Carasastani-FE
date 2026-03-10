import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, MapPin, Fuel, Gauge, Settings, Calendar, Star, Shield, Share2, Heart, Car, Check } from 'lucide-react';
import { CarScoreBar } from './CarScore';
import { calculateCarastaniScore } from '../../utils/carastaniScore';

// Seller platform configurations
const SELLER_STYLES = {
    'Cars24': {
        bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
        text: 'text-white',
        hoverBg: 'hover:from-orange-600 hover:to-orange-700',
        url: 'https://www.cars24.com',
    },
    'Spinny': {
        bg: 'bg-gradient-to-r from-purple-600 to-purple-700',
        text: 'text-white',
        hoverBg: 'hover:from-purple-700 hover:to-purple-800',
        url: 'https://www.spinny.com',
    },
    'CarWale': {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        text: 'text-white',
        hoverBg: 'hover:from-blue-700 hover:to-blue-800',
        url: 'https://www.carwale.com',
    },
    'OLX': {
        bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
        text: 'text-black',
        hoverBg: 'hover:from-yellow-500 hover:to-yellow-600',
        url: 'https://www.olx.in',
    },
    'CarDekho': {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        text: 'text-white',
        hoverBg: 'hover:from-red-600 hover:to-red-700',
        url: 'https://www.cardekho.com',
    },
    'Droom': {
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        text: 'text-white',
        hoverBg: 'hover:from-green-600 hover:to-green-700',
        url: 'https://www.droom.in',
    },
};

const FALLBACK_IMAGE = 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80';

const CarDetailPopup = ({ car, onClose }) => {
    const navigate = useNavigate();
    const [shareCopied, setShareCopied] = useState(false);

    // Lock body scroll when popup is open to prevent flickering
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const seller = car?.seller || car?.source || 'Cars24';
    const sellerStyle = SELLER_STYLES[seller] || SELLER_STYLES['Cars24'];

    const scoreData = useMemo(() => {
        if (!car) return null;
        return calculateCarastaniScore({
            ...car,
            manufacturer: car.manufacturer || car.make || car.brand || car.name?.split(' ')[0],
            fuel_type: car.fuel_type || car.fuelType,
            kms_driven: car.kms_driven || car.mileage || 50000,
        });
    }, [car]);

    const formattedPrice = useMemo(() => {
        if (!car?.price) return 'N/A';
        const price = car.price;
        if (typeof price === 'string') return `₹${price}`;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    }, [car?.price]);

    if (!car || !scoreData) return null;

    const carName = car.name || `${car.make || ''} ${car.model || ''}`.trim();
    const mileage = car.kms_driven || car.mileage;
    const fuelType = car.fuelType || car.fuel_type || 'Petrol';
    const transmission = car.transmission || 'Manual';
    const location = car.location || car.city || 'India';
    const bodyType = car.bodyType || car.body_type || 'Car';
    const color = car.color || null;
    const sourceUrl = car.sourceUrl || sellerStyle.url;

    const handleRedirect = () => {
        window.open(sourceUrl, '_blank', 'noopener,noreferrer');
    };

    const handleShare = async () => {
        const shareData = {
            title: carName,
            text: `Check out this ${car.year} ${carName} for ${formattedPrice} on ${seller}!`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
            }
        } catch (err) {
            // User cancelled share
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Main container */}
            <div 
                className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'carPopupIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                {/* ── Image Section ─────────────────────────────── */}
                <div className="relative h-40 sm:h-56 flex-shrink-0 bg-gray-100 overflow-hidden">
                    <img
                        src={car.image || FALLBACK_IMAGE}
                        alt={carName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-10"
                    >
                        <X size={18} />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                        <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {car.year}
                        </span>
                        <span className={`${sellerStyle.bg} ${sellerStyle.text} text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                            {seller}
                        </span>
                    </div>

                    {/* Verified badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        <Shield size={12} />
                        Verified
                    </div>

                    {/* Price overlay */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 shadow-xl border border-white/20">
                        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Asking Price</p>
                        <p className="text-lg sm:text-2xl font-extrabold text-primary leading-none">{formattedPrice}</p>
                    </div>
                </div>

                {/* ── Content (Compact View) ──────────────────────── */}
                <div className="flex flex-col bg-white">
                    <div className="p-4 sm:p-6 pb-2">
                        {/* Title */}
                        <div className="mb-4 sm:mb-5">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{carName}</h2>
                            <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-1.5 text-xs sm:text-sm text-gray-500 font-medium">
                                <span>{bodyType}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="flex items-center gap-1.5 md:gap-2">
                                    <MapPin size={16} className="md:w-5 md:h-5" />
                                    {location}
                                </span>
                                {color && (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                        <span>{color}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5">
                            <div className="bg-gray-50 rounded-xl p-2 sm:p-3 text-center transition-colors border border-gray-100">
                                <Calendar size={16} className="mx-auto text-primary mb-1 sm:w-5 sm:h-5" />
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Year</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-900">{car.year}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2 sm:p-3 text-center transition-colors border border-gray-100">
                                <Gauge size={16} className="mx-auto text-primary mb-1 sm:w-5 sm:h-5" />
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Mileage</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-900">
                                    {mileage ? `${(mileage / 1000).toFixed(0)}K` : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2 sm:p-3 text-center transition-colors border border-gray-100">
                                <Fuel size={16} className="mx-auto text-primary mb-1 sm:w-5 sm:h-5" />
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Fuel</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-900">{fuelType}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2 sm:p-3 text-center transition-colors border border-gray-100">
                                <Settings size={16} className="mx-auto text-primary mb-1 sm:w-5 sm:h-5" />
                                <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Trans.</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-900">{transmission}</p>
                            </div>
                        </div>

                        {/* Carastani Score */}
                        <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-1.5">
                                    <Star size={16} className="text-accent sm:w-5 sm:h-5" />
                                    Carastani Score
                                </span>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-base sm:text-lg font-bold px-2 py-0.5 bg-white rounded cursor-default shadow-sm text-sm"
                                        style={{ color: scoreData.gradeColor }}
                                    >
                                        {scoreData.score}/100
                                    </span>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded"
                                        style={{ backgroundColor: `${scoreData.gradeColor}15`, color: scoreData.gradeColor }}
                                    >
                                        {scoreData.grade}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${scoreData.score}%`, backgroundColor: scoreData.gradeColor }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-400 mt-1.5 font-medium">
                                <span>Poor</span>
                                <span className="text-gray-500 font-semibold">{scoreData.gradeLabel}</span>
                                <span>Excellent</span>
                            </div>
                        </div>

                        {/* Quick action row */}
                        <div className="flex gap-3 mb-4 sm:mb-5">
                            <div className="relative flex-1">
                                <button
                                    onClick={handleShare}
                                    className="flex w-full items-center gap-1.5 px-4 py-2.5 sm:py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl transition-colors text-xs sm:text-sm font-semibold justify-center group"
                                >
                                    {shareCopied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} className="text-gray-500 group-hover:text-primary transition-colors" />}
                                    Share
                                </button>
                                {/* Tooltip for copied state */}
                                <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap transition-all duration-300 pointer-events-none ${shareCopied ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}>
                                    Copied!
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate('/used');
                                }}
                                className="flex items-center gap-1.5 px-4 py-2.5 sm:py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl transition-colors text-xs sm:text-sm font-semibold flex-1 justify-center group"
                            >
                                <Car size={16} className="text-gray-500 group-hover:text-primary transition-colors" />
                                Browse More
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Sticky Footer — Redirect CTA ─────────────── */}
                <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full rounded-b-2xl sm:rounded-b-3xl">
                    <button
                        onClick={handleRedirect}
                        className={`
                            w-full flex items-center justify-center gap-2
                            ${sellerStyle.bg} ${sellerStyle.hoverBg} ${sellerStyle.text}
                            font-bold text-sm sm:text-base py-3 rounded-xl
                            transition-all duration-300 hover:shadow-md active:scale-[0.98]
                        `}
                    >
                        <ExternalLink size={18} />
                        View on {seller}
                    </button>
                    <p className="text-center text-[9px] sm:text-[10px] text-gray-400 mt-1.5 sm:mt-2 font-medium">
                        You'll be safely redirected to {seller}'s official website
                    </p>
                </div>
            </div>

            {/* Styles */}
            <style>{`
                @keyframes carPopupIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .custom-scrollbar-popup::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar-popup::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-popup::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
                .custom-scrollbar-popup::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
            `}</style>
        </div>,
        document.body
    );
};

export default CarDetailPopup;
