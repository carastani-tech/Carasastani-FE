import React from 'react';

const Brands = () => {
    // Car brand logos - expanded list
    const brands = [
        { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png' },
        { name: 'Mercedes', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/1024px-Mercedes-Logo.svg.png' },
        { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/2560px-Audi-Logo_2016.svg.png' },
        { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Toyota_EU.svg/2560px-Toyota_EU.svg.png' },
        { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/2560px-Honda.svg.png' },
        { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/2560px-Hyundai_Motor_Company_logo.svg.png' },
        { name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/2560px-Suzuki_logo_2.svg.png' },
        { name: 'Tata', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/2560px-Tata_logo.svg.png' },
        { name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mahindra_Wordmark.svg/2560px-Mahindra_Wordmark.svg.png' },
        { name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.svg/2560px-Kia-logo.svg.png' },
        { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png' },
        { name: 'Skoda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Skoda_Wordmark_2022.svg/2560px-Skoda_Wordmark_2022.svg.png' },
        { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/2560px-Ford_Motor_Company_Logo.svg.png' },
        { name: 'Jeep', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jeep_logo.svg/2560px-Jeep_logo.svg.png' },
        { name: 'MG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/MG_Motor_UK_Logo.svg/2560px-MG_Motor_UK_Logo.svg.png' },
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
                            <div className="h-16 w-24 md:w-32 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain"
                                    loading="lazy"
                                />
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
