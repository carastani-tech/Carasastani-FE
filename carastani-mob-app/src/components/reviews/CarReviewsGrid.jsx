import React, { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';

const CarReviewCard = ({ content, username, location, rating }) => {
    const stars = Math.min(Math.max(rating || 0, 0), 5);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                    {username?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                    <h3 className="text-sm font-bold">{username}</h3>
                    {location && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <MapPin size={10} /> {location}
                        </p>
                    )}
                </div>
            </div>

            {/* Star rating */}
            <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                    />
                ))}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">"{content}"</p>
        </div>
    );
};

const CarReviewsGrid = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/reviews-sub`);
                const data = await response.json();
                const activeReviews = data.filter(r => r.active);
                setReviews(activeReviews);
            } catch (err) {
                console.error('Failed to fetch reviews-sub:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div className="bg-white py-16 px-6 md:px-12">
            <h2 className="text-2xl font-bold mb-8 border-b-2 border-gray-200 inline-block pb-1 text-teal-600">Car Reviews</h2>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse" />
                    ))
                ) : reviews.length === 0 ? (
                    <p className="text-gray-400 text-sm col-span-4">No car reviews available.</p>
                ) : (
                    reviews.map((review) => (
                        <CarReviewCard
                            key={review.id}
                            content={review.content}
                            username={review.username}
                            location={review.location}
                            rating={review.rating}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CarReviewsGrid;
