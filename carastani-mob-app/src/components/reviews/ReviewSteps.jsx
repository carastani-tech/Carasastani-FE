import React from 'react';
import { MessageSquare, Star, Send, ArrowRight } from 'lucide-react';

const Step = ({ number, icon: Icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="relative">
            <div className="bg-white rounded-full p-3 text-black shadow-lg">
                <Icon size={22} />
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {number}
            </span>
        </div>
        <div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-gray-400 text-xs mt-0.5">{description}</p>
        </div>
    </div>
);

const ReviewSteps = () => {
    return (
        <div className="bg-black py-10 px-6 md:px-12">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                <Step number="1" icon={MessageSquare} title="Share Your Experience" description="Tell us about your journey" />
                <ArrowRight className="text-gray-500 hidden md:block mt-3" />
                <Step number="2" icon={Star} title="Rate Our Service" description="How did we do? Rate 1-5 stars" />
                <ArrowRight className="text-gray-500 hidden md:block mt-3" />
                <Step number="3" icon={Send} title="Submit Review" description="Help others make better choices" />
            </div>
        </div>
    );
};

export default ReviewSteps;
