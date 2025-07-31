import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getReviewsByProduct, addReview, getCurrentUser } from '../data/mockData';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const currentUser = getCurrentUser();

  useEffect(() => {
    const productData = getProductById(id);
    setProduct(productData);
    loadReviews();
  }, [id, refreshKey]);

  const loadReviews = () => {
    const productReviews = getReviewsByProduct(id);
    setReviews(productReviews);
  };

  const handleAddReview = async (reviewData) => {
    try {
      const newReview = addReview({
        ...reviewData,
        productId: parseInt(id)
      });
      setShowReviewForm(false);
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const handleReviewUpdate = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const hasUserReviewed = () => {
    return reviews.some(review => review.userId === currentUser.id);
  };

  if (!product) {
    return (
      <div className="product-detail">
        <div className="error-message">
          <h2>Product not found</h2>
          <Link to="/" className="back-link">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const avgRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();
  const userHasReviewed = hasUserReviewed();

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">← Back to Products</Link>
      
      <div className="product-detail-content">
        <div className="product-main">
          <img src={product.image} alt={product.name} className="product-detail-image" />
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            <p className="product-detail-price">${product.price}</p>
            <span className="product-detail-category">{product.category}</span>
            
            <div className="product-rating-summary">
              <div className="average-rating">
                <StarRating rating={parseFloat(avgRating)} readOnly size={24} />
                <span className="rating-text">
                  {avgRating > 0 ? `${avgRating} out of 5` : 'No ratings yet'}
                </span>
                <span className="review-count">({reviews.length} reviews)</span>
              </div>
              
              {reviews.length > 0 && (
                <div className="rating-breakdown">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="rating-bar">
                      <span>{rating} ★</span>
                      <div className="bar">
                        <div 
                          className="bar-fill"
                          style={{ 
                            width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span>({ratingDistribution[rating]})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Reviews</h2>
            {!userHasReviewed && (
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="write-review-btn"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            )}
            {userHasReviewed && (
              <p className="already-reviewed">You have already reviewed this product</p>
            )}
          </div>

          {showReviewForm && (
            <ReviewForm 
              onSubmit={handleAddReview}
              onCancel={() => setShowReviewForm(false)}
            />
          )}

          <ReviewList 
            reviews={reviews} 
            onReviewUpdate={handleReviewUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;