import { useState, useRef } from 'react';
import StarRating from './StarRating';
import { getCurrentUser } from '../data/mockData';

const ReviewForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(initialData?.image || null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const currentUser = getCurrentUser();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImage(imageData);
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!description.trim()) {
      alert('Please write a review description');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        rating,
        description: description.trim(),
        image,
        userId: currentUser.id,
        userName: currentUser.name
      };

      await onSubmit(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>{isEditing ? 'Edit Review' : 'Write a Review'}</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Rating *</label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating}
            size={32}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Review Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            maxLength={1000}
            required
          />
          <small>{description.length}/1000 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="image">Add Photo (Optional)</label>
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <small>Max size: 5MB. Supported formats: JPG, PNG, GIF</small>
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Review preview" />
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="remove-image-btn"
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting || rating === 0 || !description.trim()}
            className="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
          </button>
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;