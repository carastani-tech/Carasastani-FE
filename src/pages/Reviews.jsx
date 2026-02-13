import React from 'react';
import ReviewsHero from '../components/reviews/ReviewsHero';
import CustomerStories from '../components/reviews/CustomerStories';
import ExpertReviews from '../components/reviews/ExpertReviews';
import CarReviewsGrid from '../components/reviews/CarReviewsGrid';
import ReviewSteps from '../components/reviews/ReviewSteps';
import RateReview from '../components/reviews/RateReview';

const Reviews = () => {
    return (
        <main>
            <ReviewsHero />
            <CustomerStories />
            <ExpertReviews />
            <CarReviewsGrid />
            <ReviewSteps />
            <RateReview />
        </main>
    );
};

export default Reviews;
