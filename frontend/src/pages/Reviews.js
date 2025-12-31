import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, User, Calendar, MessageSquare } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews/owner');
      setReviews(response.data.reviews);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Dummy data
      setReviews([
        {
          _id: '1',
          user: {
            name: 'Rahul Sharma',
            profilePhoto: null
          },
          car: {
            name: 'Swift Dzire',
            brand: 'Maruti'
          },
          rating: 5,
          comment: 'Excellent car! Very clean and well maintained. Owner was very cooperative and responsive.',
          createdAt: '2024-01-18T10:30:00Z'
        },
        {
          _id: '2',
          user: {
            name: 'Priya Patel',
            profilePhoto: null
          },
          car: {
            name: 'Honda City',
            brand: 'Honda'
          },
          rating: 4,
          comment: 'Good experience overall. Car was in good condition. Pickup and drop was smooth.',
          createdAt: '2024-01-15T14:20:00Z'
        },
        {
          _id: '3',
          user: {
            name: 'Amit Kumar',
            profilePhoto: null
          },
          car: {
            name: 'Hyundai Creta',
            brand: 'Hyundai'
          },
          rating: 5,
          comment: 'Amazing car for long drives! Comfortable and fuel efficient. Highly recommended!',
          createdAt: '2024-01-10T09:15:00Z'
        },
        {
          _id: '4',
          user: {
            name: 'Sneha Gupta',
            profilePhoto: null
          },
          car: {
            name: 'Swift Dzire',
            brand: 'Maruti'
          },
          rating: 4,
          comment: 'Nice car, good service. Only minor issue was with AC but overall satisfied.',
          createdAt: '2024-01-08T16:45:00Z'
        }
      ]);
      
      setStats({
        averageRating: 4.5,
        totalReviews: 4,
        ratingBreakdown: {
          5: 2,
          4: 2,
          3: 0,
          2: 0,
          1: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600">See what customers say about your cars</p>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <p className="text-gray-600">
              Based on {stats.totalReviews} reviews
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingBreakdown[rating] || 0;
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {rating}★
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Reviews will appear here once customers rate your cars</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={review.user.profilePhoto || `https://ui-avatars.com/api/?name=${review.user.name}&background=random&color=fff&size=40`}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {review.user.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {review.car.name} - {review.car.brand}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;