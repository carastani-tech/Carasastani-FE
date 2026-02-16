import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bgColors = ['bg-red-400', 'bg-red-500', 'bg-teal-500', 'bg-indigo-500', 'bg-orange-500'];

const StoryCard = ({ text, name, tag, bgColor }) => (
    <div className={`rounded-xl p-6 text-white relative overflow-hidden ${bgColor} min-w-[300px] md:min-w-[350px] flex-shrink-0`}>
        <p className="text-sm mb-6 leading-relaxed font-light">"{text}"</p>
        <div className="mt-auto">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                    <h4 className="text-sm font-bold">{name}</h4>
                    <p className="text-[10px] opacity-80">@{tag}</p>
                </div>
            </div>
        </div>
    </div>
);

const CustomerStories = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/reviews-main`);
                const data = await response.json();
                const activeReviews = data.filter(r => r.active);
                setReviews(activeReviews);
            } catch (err) {
                console.error('Failed to fetch reviews-main:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 380;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="bg-white py-16 px-6 md:px-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">120,000+ Happy Customers</h2>
                <p className="text-xs text-gray-500">Real stories from real people who found their dream car.</p>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Left arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 hidden md:block hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar px-8 scroll-smooth"
                >
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-xl p-6 bg-gray-200 animate-pulse min-w-[300px] md:min-w-[350px] h-40 flex-shrink-0" />
                        ))
                    ) : reviews.length === 0 ? (
                        <p className="text-gray-400 text-sm">No reviews available.</p>
                    ) : (
                        reviews.map((review, idx) => (
                            <StoryCard
                                key={review.id}
                                text={review.content}
                                name={review.username}
                                tag={review.usertag}
                                bgColor={bgColors[idx % bgColors.length]}
                            />
                        ))
                    )}
                </div>

                {/* Right arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 hidden md:block hover:bg-gray-50 transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default CustomerStories;
