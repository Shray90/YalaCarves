import { Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';
import StarRating from './StarRating';
import { getReviewsByProduct } from '../data/mockData';

const ProductList = () => {
  const getAverageRating = (productId) => {
    const reviews = getReviewsByProduct(productId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getReviewCount = (productId) => {
    return getReviewsByProduct(productId).length;
  };

  return (
    <div className="product-list">
      <h1>Our Products</h1>
      <div className="products-grid">
        {mockProducts.map((product) => {
          const avgRating = getAverageRating(product.id);
          const reviewCount = getReviewCount(product.id);
          
          return (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-rating">
                    <StarRating rating={parseFloat(avgRating)} readOnly size={16} />
                    <span className="review-count">({reviewCount} reviews)</span>
                  </div>
                  <p className="product-price">${product.price}</p>
                  <span className="product-category">{product.category}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;