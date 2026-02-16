import React from 'react';
import { ArrowRight } from 'lucide-react';

const FeatureItem = ({ title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-4">
            {description}
        </p>
    </div>
);

const Features = () => {
    return (
        <div className="bg-gray-50 py-20 px-6 md:px-12 relative overflow-hidden">
            {/* Car Image (Blue) */}
            <div className="max-w-4xl mx-auto mb-16 relative z-10">
                <img
                    src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop"
                    alt="Blue Sports Car"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                />
                <button className="absolute top-1/2 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
                    <ArrowRight size={24} />
                </button>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                <FeatureItem
                    title="Weight Reduction"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan."
                />
                <FeatureItem
                    title="Sports Seats plus"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan."
                />
                <FeatureItem
                    title="PASM Sports Suspension"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan."
                />
                <FeatureItem
                    title="20/21 -inch Carrera S wheels"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan."
                />
            </div>
        </div>
    );
};

export default Features;
