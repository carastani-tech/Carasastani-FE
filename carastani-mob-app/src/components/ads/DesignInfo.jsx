import React from 'react';

const DesignInfo = () => {
    return (
        <div className="bg-white py-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                {/* Image */}
                <div className="md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop"
                        alt="Red SUV"
                        className="w-full h-auto object-contain drop-shadow-xl"
                    />
                </div>

                {/* Text Content */}
                <div className="md:w-1/2 text-right">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
                        Timeless design, contemporary <br />
                        interpretation.
                    </h2>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-md ml-auto">
                        Inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec at rhoncus est. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DesignInfo;
