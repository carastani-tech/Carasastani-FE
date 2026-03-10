import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';

const RateReview = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim() || !username.trim() || rating === 0) return;

        setSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/reviews-sub`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content.trim(),
                    username: username.trim(),
                    location: location.trim() || 'India',
                    active: true,
                    rating: rating,
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setContent('');
                setUsername('');
                setLocation('');
                setRating(0);
            }
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-gray-50 py-16 px-6 md:px-12">
                <div className="max-w-lg mx-auto text-center">
                    <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-500 text-sm mb-6">Your review has been submitted successfully. It will appear on the page shortly.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Write Another Review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-16 px-6 md:px-12">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
                <p className="text-gray-500 text-sm mb-8">We'd love to hear about your experience with our platform.</p>

                {/* Star rating */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your Rating *</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`transition-colors ${star <= (hoverRating || rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-3 text-sm text-gray-500 self-center">
                                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Your Name *</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Mumbai, Delhi"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Review text */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Your Review *</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell us about your experience..."
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!content.trim() || !username.trim() || rating === 0 || submitting}
                    className="bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Send size={16} />
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
};

export default RateReview;
