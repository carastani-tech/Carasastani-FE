import React from 'react';

const Brands = () => {
    // Car brand logos - expanded list
    const brands = [
        { name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
        { name: 'Mercedes', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
        { name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
        { name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
        { name: 'Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png' },
        { name: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
        { name: 'Maruti Suzuki', logo: 'https://www.carlogos.org/car-logos/maruti-suzuki-logo.png' },
        { name: 'Tata', logo: 'https://www.carlogos.org/car-logos/tata-logo.png' },
        { name: 'Mahindra', logo: 'https://www.carlogos.org/car-logos/mahindra-logo.png' },
        { name: 'Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png' },
        { name: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
        { name: 'Skoda', logo: 'https://www.carlogos.org/car-logos/skoda-logo.png' },
        { name: 'Ford', logo: 'https://www.carlogos.org/car-logos/ford-logo.png' },
        { name: 'Jeep', logo: 'https://www.carlogos.org/car-logos/jeep-logo.png' },
        { name: 'MG', logo: 'https://www.carlogos.org/car-logos/mg-logo.png' },
    ];

    // Duplicate the brands array for seamless infinite loop
    const duplicatedBrands = [...brands, ...brands];

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 py-16 overflow-hidden">
            {/* Section Header */}
            <div className="text-center mb-10 px-6">
                <span className="text-xs font-semibold text-accent uppercase tracking-widest">Trusted Partners</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">Brands We Feature</h3>
            </div>

            {/* Sliding Container */}
            <div className="relative">
                {/* Gradient Overlays for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

                {/* Sliding Track */}
                <div className="flex animate-marquee hover:pause-animation">
                    {duplicatedBrands.map((brand, index) => (
                        <div
                            key={`${brand.name}-${index}`}
                            className="flex-shrink-0 mx-8 md:mx-12 group cursor-pointer"
                        >
                            <div className="h-16 w-24 md:w-32 flex flex-col items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <span className="hidden text-sm font-bold text-gray-700">{brand.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Marquee Animation Styles */}
            <style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }

                .animate-marquee:hover {
                    animation-play-state: paused;
                }

                .pause-animation {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default Brands;
