import { useState } from 'react';

const StarRating = ({ rating = 0, onRatingChange, readOnly = false, size = 24 }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starRating) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (!readOnly) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoveredRating(0);
    }
  };

  const getStarColor = (starIndex) => {
    const currentRating = hoveredRating || rating;
    return starIndex <= currentRating ? '#ffd700' : '#e0e0e0';
  };

  return (
    <div 
      className="star-rating"
      onMouseLeave={handleMouseLeave}
      style={{ 
        display: 'flex', 
        gap: '2px',
        cursor: readOnly ? 'default' : 'pointer'
      }}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <span
          key={starIndex}
          className="star"
          onClick={() => handleStarClick(starIndex)}
          onMouseEnter={() => handleStarHover(starIndex)}
          style={{
            fontSize: `${size}px`,
            color: getStarColor(starIndex),
            transition: 'color 0.2s ease',
            userSelect: 'none'
          }}
        >
          ★
        </span>
      ))}
      {!readOnly && (
        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
          {hoveredRating || rating || 0}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;