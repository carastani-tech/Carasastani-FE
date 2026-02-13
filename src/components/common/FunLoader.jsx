import React, { useState, useEffect, useMemo } from 'react';

const FunLoader = ({ message = "Finding your perfect ride..." }) => {
    const facts = [
        "🚗 First car built in 1886",
        "🏎️ Average car has 30,000 parts",
        "⛽ India has 70,000+ petrol pumps",
        "🔧 Cars need 2,000 welds",
        "🌍 1 billion cars on Earth",
        "💨 Fastest car: 490+ km/h",
        "🇮🇳 Maruti leads India sales",
        "🔋 EVs growing 40% yearly",
    ];

    const [currentFact, setCurrentFact] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % facts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const theme = useMemo(() => {
        const themes = [
            { color: "#16a34a", accent: "#065f46", flame: "#f97316" },
            { color: "#dc2626", accent: "#7f1d1d", flame: "#fde047" },
            { color: "#2563eb", accent: "#1e3a8a", flame: "#fb7185" },
            { color: "#7c3aed", accent: "#4c1d95", flame: "#facc15" },
        ];
        return themes[Math.floor(Math.random() * themes.length)];
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">

            {/* ═══ SPEED LINES — horizontal streaks across the background ═══ */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={`speed-${i}`}
                        className="absolute sc-speed-line"
                        style={{
                            top: `${18 + i * 8}%`,
                            height: '2px',
                            width: `${60 + Math.random() * 120}px`,
                            background: `linear-gradient(90deg, transparent, rgba(0,0,0,${0.04 + Math.random() * 0.04}), transparent)`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${2 + Math.random() * 1.5}s`,
                        }}
                    />
                ))}
            </div>

            {/* ═══ WIND PARTICLES — small dots flying past ═══ */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`wind-${i}`}
                        className="absolute rounded-full sc-wind-particle"
                        style={{
                            top: `${25 + i * 10}%`,
                            width: `${3 + Math.random() * 3}px`,
                            height: '2px',
                            background: `rgba(0,0,0,${0.06 + Math.random() * 0.06})`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${1.5 + Math.random() * 1}s`,
                        }}
                    />
                ))}
            </div>

            {/* Car stage — full width for the race animation */}
            <div className="relative w-full h-44 mb-4">

                {/* Road line */}
                <div className="absolute left-0 right-0" style={{ bottom: '20px', height: '2px', background: 'linear-gradient(90deg, transparent, #d1d5db 15%, #d1d5db 85%, transparent)' }} />

                {/* Road dashes */}
                <div className="absolute left-0 right-0 flex gap-4 sc-road-dashes" style={{ bottom: '12px' }}>
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 rounded-full" style={{ width: '14px', height: '2px', background: '#d1d5db' }} />
                    ))}
                </div>

                {/* ═══ TIRE SMOKE — puffs behind the car ═══ */}
                <div className="absolute sc-car-race" style={{ bottom: '22px' }}>
                    {/* Smoke puffs trail behind the rear wheel */}
                    <div className="absolute sc-smoke-trail" style={{ left: '-10px', bottom: '4px' }}>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={`smoke-${i}`}
                                className="absolute rounded-full sc-smoke-puff"
                                style={{
                                    width: `${8 + i * 6}px`,
                                    height: `${8 + i * 6}px`,
                                    left: `${-i * 14}px`,
                                    bottom: `${i * 5}px`,
                                    background: `rgba(180,180,180,${0.25 - i * 0.04})`,
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Car wrapper — races left to right */}
                <div className="absolute sc-car-race" style={{ bottom: '22px' }}>
                    <svg viewBox="0 0 520 200" className="will-change-transform w-full max-w-[280px]" style={{ overflow: 'visible' }}>

                        {/* Car */}
                        <g transform="translate(140 80)">

                            {/* ═══ EXHAUST FLAME — behind car body, inside car group ═══ */}
                            <g className="sc-flame-group" style={{ transformOrigin: '18px 68px' }}>
                                {/* Outer red glow */}
                                <ellipse cx="-8" cy="68" rx="16" ry="7" fill="#ef4444" opacity="0.4" className="sc-flame-outer" />
                                {/* Mid orange */}
                                <ellipse cx="2" cy="68" rx="13" ry="5.5" fill={theme.flame} opacity="0.7" className="sc-flame-mid" />
                                {/* Inner bright core */}
                                <ellipse cx="10" cy="68" rx="9" ry="4" fill="#fde047" opacity="0.9" className="sc-flame-inner" />
                            </g>

                            {/* ═══ EXHAUST PIPE — small dark circle at rear ═══ */}
                            <ellipse cx="18" cy="68" rx="4" ry="3" fill="#333" />
                            <ellipse cx="18" cy="68" rx="2.5" ry="2" fill="#1a1a1a" />

                            {/* Rear Spoiler */}
                            <rect x="190" y="10" width="32" height="6" rx="3" fill={theme.accent} />

                            {/* Body */}
                            <path
                                d="M20 70 Q30 35 90 30 H160 Q210 32 240 60 L260 70 Z"
                                fill={theme.color}
                            />

                            {/* Side Skirt */}
                            <rect x="40" y="65" width="190" height="8" rx="4" fill={theme.accent} />

                            {/* Window */}
                            <path
                                d="M85 38 H155 Q170 38 178 50 H95 Z"
                                fill={theme.accent}
                            />

                            {/* Headlight */}
                            <ellipse cx="255" cy="60" rx="6" ry="4" fill="#fde047" />

                            {/* Rear wheel */}
                            <g className="sc-wheel" style={{ transformOrigin: '70px 75px' }}>
                                <circle cx="70" cy="75" r="18" fill="#111" />
                                <circle cx="70" cy="75" r="7" fill="#9ca3af" />
                            </g>

                            {/* Front wheel */}
                            <g className="sc-wheel" style={{ transformOrigin: '200px 75px' }}>
                                <circle cx="200" cy="75" r="18" fill="#111" />
                                <circle cx="200" cy="75" r="7" fill="#9ca3af" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Loading message */}
            <p className="text-gray-600 text-lg tracking-wide animate-pulse">{message}</p>

            {/* Fact pill */}
            <div className="mt-3 px-5 py-2 rounded-full border bg-white shadow-sm text-sm text-gray-500">
                <span className="text-green-600 font-semibold">DID YOU KNOW</span>
                <span className="mx-1">·</span>
                <span key={currentFact} className="inline-block animate-[fadeUp_0.4s_ease-out]">
                    {facts[currentFact]}
                </span>
            </div>

            <style>{`
                /* ══════════════════════════════════════════════════
                   CAR RACE: slow enter → accelerate center → fast exit
                   ══════════════════════════════════════════════════ */
                .sc-car-race {
                    animation: scCarRace 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                @keyframes scCarRace {
                    0%   { left: -20%; }
                    35%  { left: 38%; }
                    45%  { left: 40%; }
                    65%  { left: 55%; }
                    85%  { left: 100%; }
                    100% { left: 110%; }
                }

                /* ══════════════════════════════
                   WHEELS
                   ══════════════════════════════ */
                .sc-wheel {
                    animation: scWheelSpin 0.4s linear infinite;
                }
                @keyframes scWheelSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                /* ══════════════════════════════
                   EXHAUST FLAME
                   ══════════════════════════════ */
                .sc-flame-group {
                    animation: scFlameStretch 3.5s ease-in-out infinite;
                }
                @keyframes scFlameStretch {
                    0%   { transform: scaleX(0.3) scaleY(0.5); opacity: 0.2; }
                    20%  { transform: scaleX(0.6) scaleY(0.8); opacity: 0.5; }
                    35%  { transform: scaleX(1.0) scaleY(1.0); opacity: 0.8; }
                    45%  { transform: scaleX(1.4) scaleY(1.1); opacity: 1.0; }
                    55%  { transform: scaleX(1.2) scaleY(1.0); opacity: 0.9; }
                    65%  { transform: scaleX(2.0) scaleY(1.2); opacity: 1.0; }
                    80%  { transform: scaleX(2.5) scaleY(1.3); opacity: 1.0; }
                    90%  { transform: scaleX(1.5) scaleY(0.8); opacity: 0.5; }
                    100% { transform: scaleX(0.3) scaleY(0.5); opacity: 0.1; }
                }

                .sc-flame-outer {
                    animation: scFlameColorOuter 0.6s ease-in-out infinite;
                }
                @keyframes scFlameColorOuter {
                    0%, 100% { opacity: 0.2; }
                    50%      { opacity: 0.6; }
                }

                .sc-flame-mid {
                    animation: scFlameColorMid 0.6s ease-in-out infinite;
                }
                @keyframes scFlameColorMid {
                    0%, 100% { opacity: 0.4; }
                    50%      { opacity: 0.9; }
                }

                .sc-flame-inner {
                    animation: scFlameColorInner 0.6s ease-in-out infinite;
                }
                @keyframes scFlameColorInner {
                    0%, 100% { opacity: 0.6; }
                    50%      { opacity: 1.0; }
                }

                /* ══════════════════════════════
                   SPEED LINES — horizontal streaks
                   ══════════════════════════════ */
                .sc-speed-line {
                    animation: scSpeedLine 2s linear infinite;
                }
                @keyframes scSpeedLine {
                    0%   { right: -10%; opacity: 0; }
                    10%  { opacity: 1; }
                    80%  { opacity: 1; }
                    100% { right: 110%; opacity: 0; }
                }

                /* ══════════════════════════════
                   WIND PARTICLES — fast dots
                   ══════════════════════════════ */
                .sc-wind-particle {
                    animation: scWindParticle 1.5s linear infinite;
                }
                @keyframes scWindParticle {
                    0%   { right: -5%; opacity: 0; }
                    15%  { opacity: 1; }
                    85%  { opacity: 1; }
                    100% { right: 105%; opacity: 0; }
                }

                /* ══════════════════════════════
                   TIRE SMOKE — puffs behind car
                   ══════════════════════════════ */
                .sc-smoke-trail {
                    animation: scSmokeTrail 3.5s ease-in-out infinite;
                }
                @keyframes scSmokeTrail {
                    0%   { opacity: 0; }
                    30%  { opacity: 0.3; }
                    45%  { opacity: 0.7; }
                    55%  { opacity: 0.9; }
                    70%  { opacity: 1; }
                    85%  { opacity: 0.4; }
                    100% { opacity: 0; }
                }

                .sc-smoke-puff {
                    animation: scSmokePuff 0.8s ease-out infinite;
                }
                @keyframes scSmokePuff {
                    0%   { transform: scale(0.8); opacity: 0.3; }
                    50%  { transform: scale(1.2); opacity: 0.15; }
                    100% { transform: scale(0.8); opacity: 0.3; }
                }

                /* ══════════════════════════════
                   ROAD DASHES
                   ══════════════════════════════ */
                .sc-road-dashes {
                    animation: scRoadDash 0.5s linear infinite;
                }
                @keyframes scRoadDash {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-26px); }
                }

                /* ══════════════════════════════
                   FACT FADE-UP
                   ══════════════════════════════ */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(5px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default FunLoader;
