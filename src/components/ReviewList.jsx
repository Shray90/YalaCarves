import { useState } from 'react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { getCurrentUser, updateReview, deleteReview } from '../data/mockData';

const ReviewList = ({ reviews, onReviewUpdate }) => {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const currentUser = getCurrentUser();

  const handleEditReview = (reviewId) => {
    setEditingReviewId(reviewId);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      const updatedReview = updateReview(editingReviewId, reviewData);
      setEditingReviewId(null);
      onReviewUpdate(); // Refresh the reviews list
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        deleteReview(reviewId);
        onReviewUpdate(); // Refresh the reviews list
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      <h3>Customer Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          {editingReviewId === review.id ? (
            <ReviewForm
              initialData={review}
              isEditing={true}
              onSubmit={handleUpdateReview}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{review.userName}</strong>
                  <span className="review-date">{formatDate(review.createdAt)}</span>
                  {review.updatedAt !== review.createdAt && (
                    <span className="review-edited">(edited)</span>
                  )}
                </div>
                <div className="review-rating">
                  <StarRating rating={review.rating} readOnly size={20} />
                </div>
              </div>

              <div className="review-content">
                <p>{review.description}</p>
                {review.image && (
                  <div className="review-image">
                    <img src={review.image} alt="Review" />
                  </div>
                )}
              </div>

              {currentUser.id === review.userId && (
                <div className="review-actions">
                  <button 
                    onClick={() => handleEditReview(review.id)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;