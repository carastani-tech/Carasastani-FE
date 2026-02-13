import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SpecItem = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-700">
            <button
                className="w-full py-4 flex justify-between items-center text-left text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-medium">{title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && (
                <div className="pb-4 text-xs text-gray-500">
                    Details about {title} go here...
                </div>
            )}
        </div>
    );
};

const TechSpecs = () => {
    return (
        <div className="bg-black text-white py-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                {/* Specs List */}
                <div className="w-full md:w-1/3">
                    <h2 className="text-2xl font-bold mb-8">Technical Specs</h2>
                    <div className="space-y-1">
                        <SpecItem title="Power unit" />
                        <SpecItem title="Performance" />
                        <SpecItem title="Capacities" />
                        <SpecItem title="Body" />
                        <SpecItem title="Consumption/Emissions" />
                        <SpecItem title="Sound Level" />
                    </div>
                </div>

                {/* Wireframe Image */}
                <div className="w-full md:w-2/3 relative">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2016_Porsche_911_Carrera_4S_top_view.jpg/800px-2016_Porsche_911_Carrera_4S_top_view.jpg"
                        alt="Car Wireframe"
                        className="w-full invert opacity-80 mix-blend-screen"
                    />
                    {/* Dimensions Annotations (Mock) */}
                    <div className="absolute top-10 right-0 text-right">
                        <p className="text-[10px] text-gray-400">Width</p>
                        <p className="text-sm font-bold">1,852mm</p>
                    </div>
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-right">
                        <p className="text-[10px] text-gray-400">Height</p>
                        <p className="text-sm font-bold">1,298mm</p>
                    </div>
                    <div className="absolute bottom-10 right-0 text-right">
                        <p className="text-[10px] text-gray-400">Wheel Base</p>
                        <p className="text-sm font-bold">2,450mm</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechSpecs;
