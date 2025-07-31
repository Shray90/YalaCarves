# Product Review System

A complete React-based product review system with full CRUD functionality, star ratings, image uploads, and multi-user support.

## Features

### 🌟 Core Functionality
- **Complete CRUD Operations**: Create, Read, Update, Delete reviews
- **Star Rating System**: Interactive 5-star rating with hover effects
- **Image Upload**: Users can attach images to their reviews (max 5MB)
- **Multi-user Support**: Switch between different users to test functionality
- **Real-time Updates**: Reviews update instantly across the application
- **Persistent Storage**: Data stored in localStorage for persistence

### 📱 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, attractive interface with smooth animations
- **User Authentication Simulation**: Easy user switching for testing
- **Review Validation**: Prevents duplicate reviews from same user
- **Image Preview**: Preview images before uploading
- **Edit/Delete Controls**: Users can only edit/delete their own reviews

### 🛍️ Product Features
- **Product Catalog**: Browse products with ratings and reviews
- **Product Detail Pages**: Detailed view with all reviews
- **Rating Summary**: Average ratings and distribution breakdown
- **Review Statistics**: Review counts and rating breakdowns

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-review-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage Guide

### 1. Browsing Products
- View all products on the homepage
- See average ratings and review counts
- Click on any product to view details

### 2. Viewing Reviews
- Navigate to a product detail page
- See all reviews from different users
- View rating distribution and average scores

### 3. Writing Reviews
- Click "Write a Review" on any product page
- Select a star rating (1-5 stars)
- Write a detailed description (up to 1000 characters)
- Optionally upload an image (JPG, PNG, GIF - max 5MB)
- Submit your review

### 4. Managing Reviews
- **Edit**: Click "Edit" on your own reviews to modify them
- **Delete**: Click "Delete" to remove your reviews (with confirmation)
- **View**: See creation and edit timestamps

### 5. User Switching (Testing Feature)
- Use the user switcher in the header
- Switch between Alice, Bob, Carol, and David
- Test different user perspectives and permissions

## Technical Architecture

### Components Structure
```
src/
├── components/
│   ├── ProductList.jsx       # Product catalog view
│   ├── ProductDetail.jsx     # Individual product page
│   ├── ReviewForm.jsx        # Create/edit review form
│   ├── ReviewList.jsx        # Display all reviews
│   ├── StarRating.jsx        # Interactive star rating
│   └── UserSwitcher.jsx      # User authentication simulation
├── data/
│   └── mockData.js           # Data management and CRUD operations
├── App.jsx                   # Main application component
└── App.css                   # Comprehensive styling
```

### Data Management
- **Products**: Static product catalog with images from Unsplash
- **Users**: Mock user accounts for testing
- **Reviews**: Dynamic review data with full CRUD operations
- **Storage**: localStorage for data persistence across sessions

### Key Features Implementation

#### CRUD Operations
- **Create**: Add new reviews with validation
- **Read**: Display reviews with filtering and sorting
- **Update**: Edit existing reviews with form pre-population
- **Delete**: Remove reviews with confirmation dialog

#### Image Upload System
- File type validation (images only)
- Size limit enforcement (5MB max)
- Base64 encoding for localStorage compatibility
- Image preview functionality
- Remove image option

#### Rating System
- Interactive star selection
- Hover effects for better UX
- Read-only display mode
- Average calculation and display
- Rating distribution visualization

## API Reference

### Data Functions (mockData.js)

#### Product Functions
- `getProductById(id)` - Get product by ID
- `mockProducts` - Array of all products

#### Review Functions
- `getReviews()` - Get all reviews
- `getReviewsByProduct(productId)` - Get reviews for specific product
- `addReview(reviewData)` - Create new review
- `updateReview(reviewId, updatedData)` - Update existing review
- `deleteReview(reviewId)` - Delete review

#### User Functions
- `getCurrentUser()` - Get current active user
- `setCurrentUser(user)` - Switch active user
- `mockUsers` - Array of all users

#### Storage Functions
- `getStoredData(key, defaultValue)` - Get data from localStorage
- `setStoredData(key, data)` - Save data to localStorage
- `initializeData()` - Initialize default data

## Customization

### Adding New Products
Edit `src/data/mockData.js` and add to the `mockProducts` array:
```javascript
{
  id: 5,
  name: "New Product",
  price: 99.99,
  description: "Product description",
  image: "https://image-url.com",
  category: "Category"
}
```

### Styling Customization
- Main styles in `src/App.css`
- CSS custom properties for easy theme changes
- Responsive breakpoints at 768px
- Modern design with gradients and shadows

### Adding Features
- Extend CRUD operations in `mockData.js`
- Add new components in `src/components/`
- Update routing in `App.jsx`

## Browser Support
- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## Performance Considerations
- Lazy loading for images
- Efficient re-rendering with React keys
- LocalStorage optimization
- Image compression recommendations

## Security Notes
- Client-side only (demo purposes)
- No server-side validation
- Images stored as base64 in localStorage
- User authentication is simulated

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - feel free to use this project for learning and development.

---

**Note**: This is a demonstration project showcasing React CRUD operations, component architecture, and modern UI/UX practices. For production use, implement proper backend API, authentication, and security measures.
