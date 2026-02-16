import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const ExpertCard = ({ text, name, category, date }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
        <div className="absolute -top-4 left-6 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            {category || 'EXPERT PICK'}
        </div>
        <div className="absolute top-4 right-4 text-gray-200">
            <Quote size={40} />
        </div>

        <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                {name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
                <h4 className="text-sm font-bold">{name}</h4>
                <div className="flex text-yellow-400 text-xs">★★★★★</div>
                {date && <p className="text-[10px] text-gray-400 mt-0.5">{new Date(date).toLocaleDateString()}</p>}
            </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
            "{text}"
        </p>
    </div>
);

const ExpertReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/reviews-normal`);
                const data = await response.json();
                const activeReviews = data.filter(r => r.active);
                setReviews(activeReviews);
            } catch (err) {
                console.error('Failed to fetch reviews-normal:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div className="bg-gray-50 py-16 px-6 md:px-12">
            <div className="mb-12">
                <h2 className="text-3xl font-bold">
                    Unveiling the <span className="text-red-500">True</span> <br />
                    <span className="text-red-500">Expert</span> Experience
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-48 animate-pulse" />
                    ))
                ) : reviews.length === 0 ? (
                    <p className="text-gray-400 text-sm col-span-4">No expert reviews available.</p>
                ) : (
                    reviews.map((review) => (
                        <ExpertCard
                            key={review.id}
                            text={review.content}
                            name={review.username}
                            category={review.category}
                            date={review.postedDate}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpertReviews;
