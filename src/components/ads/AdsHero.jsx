import React from 'react';

const AdsHero = () => {
    return (
        <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-20">
            <div className="text-center z-10 mb-8">
                <h2 className="text-2xl md:text-4xl font-light mb-2">Speed your wings</h2>
                <p className="text-[10px] md:text-xs text-gray-400 max-w-lg mx-auto mb-8 px-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                </p>
                <h1 className="text-5xl md:text-8xl font-bold text-white/10 tracking-widest absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none">
                    HYUNDAI TUSCON
                </h1>
            </div>

            {/* Car Image */}
            <div className="relative z-10 w-full max-w-4xl mx-auto mb-16">
                <img
                    src="https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=1200&auto=format&fit=crop"
                    alt="Hyundai Tucson"
                    className="w-full h-auto object-contain drop-shadow-2xl grayscale contrast-125 brightness-110"
                />
            </div>

            {/* Stats */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-3 gap-4 text-center border-t border-white/10 pt-8 pb-12">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold">331 KW/450PS</h3>
                    <p className="text-[10px] text-gray-500">Power (kW)/Power (PS)</p>
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-bold">3.07s</h3>
                    <p className="text-[10px] text-gray-500">Acceleration 0 - 100 km/h</p>
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-bold">308kmph</h3>
                    <p className="text-[10px] text-gray-500">Top Speed</p>
                </div>
            </div>
        </div>
    );
};

export default AdsHero;
