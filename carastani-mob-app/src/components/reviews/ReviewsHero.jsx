import React from 'react';
import { Star, MessageSquare, Users } from 'lucide-react';

const ReviewsHero = () => {
    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 md:py-20 px-6 md:px-12 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-20 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 relative">
                What Our Customers Say
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-sm md:text-base">
                Real reviews from real people. See why thousands of car buyers trust us for their journey.
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 relative">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-500/20 p-3 rounded-full">
                        <Users size={22} className="text-teal-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-white font-bold text-lg">120K+</p>
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Happy Customers</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-3 rounded-full">
                        <Star size={22} className="text-yellow-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-white font-bold text-lg">4.8/5</p>
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Average Rating</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-3 rounded-full">
                        <MessageSquare size={22} className="text-red-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-white font-bold text-lg">15K+</p>
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Reviews Written</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsHero;
