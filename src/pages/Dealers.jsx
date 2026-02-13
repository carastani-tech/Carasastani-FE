import React from 'react';

const Dealers = () => {
    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center"></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-6">
                <h1 className="text-5xl md:text-8xl font-serif mb-4 tracking-wide">COMING SOON</h1>

                {/* Decorative Line */}
                <div className="flex justify-center items-center gap-2 mb-8">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div className="h-0.5 w-32 bg-gray-500"></div>
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>

                <p className="text-gray-300 max-w-lg mx-auto mb-12 text-sm md:text-base leading-relaxed font-light">
                    We are currently working on making our new website <br />
                    will be launching soon, subscribe to be notified.
                </p>

                <button className="bg-primary hover:bg-teal-800 text-white px-12 py-3 rounded text-sm tracking-widest transition-colors uppercase">
                    Notify Me
                </button>
            </div>
        </div>
    );
};

export default Dealers;
