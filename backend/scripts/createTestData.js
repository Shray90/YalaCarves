const pool = require('../config/database');

async function createTestData() {
  try {
    console.log('Creating test categories and products...');
    
    // Check if categories exist
    const categoriesResult = await pool.query('SELECT COUNT(*) FROM categories');
    const categoriesCount = parseInt(categoriesResult.rows[0].count);
    
    if (categoriesCount === 0) {
      console.log('Creating categories...');
      
      const categories = [
        { name: 'Sculptures', slug: 'sculptures', description: 'Traditional and modern sculptures' },
        { name: 'Paintings', slug: 'paintings', description: 'Beautiful handmade paintings' },
        { name: 'Textiles', slug: 'textiles', description: 'Traditional textiles and fabrics' },
        { name: 'Jewelry', slug: 'jewelry', description: 'Handcrafted jewelry pieces' },
        { name: 'Pottery', slug: 'pottery', description: 'Clay and ceramic items' },
      ];
      
      for (const category of categories) {
        await pool.query(
          'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)',
          [category.name, category.slug, category.description]
        );
        console.log(`✅ Created category: ${category.name}`);
      }
    } else {
      console.log(`Categories already exist: ${categoriesCount} found`);
    }
    
    // Check if products exist
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');
    const productsCount = parseInt(productsResult.rows[0].count);
    
    if (productsCount === 0) {
      console.log('Creating sample products...');
      
      // Get category IDs
      const categoriesData = await pool.query('SELECT id, name FROM categories');
      const categoryMap = {};
      categoriesData.rows.forEach(cat => {
        categoryMap[cat.name] = cat.id;
      });
      
      const products = [
        {
          name: 'Traditional Ganesh Sculpture',
          description: 'Beautiful handcrafted Ganesh sculpture made from premium materials. Perfect for home decoration and spiritual purposes.',
          price: 35000,
          originalPrice: 40000,
          categoryId: categoryMap['Sculptures'],
          artisan: 'Rajesh Kumar',
          emoji: '🐘',
          stockQuantity: 5,
          isActive: true
        },
        {
          name: 'Madhubani Painting',
          description: 'Authentic Madhubani painting depicting traditional folk art from Bihar. Hand-painted with natural colors.',
          price: 15000,
          originalPrice: 18000,
          categoryId: categoryMap['Paintings'],
          artisan: 'Sita Devi',
          emoji: '🎨',
          stockQuantity: 8,
          isActive: true
        },
        {
          name: 'Silk Saree',
          description: 'Exquisite handwoven silk saree with intricate patterns. Made using traditional weaving techniques.',
          price: 25000,
          originalPrice: 30000,
          categoryId: categoryMap['Textiles'],
          artisan: 'Lakshmi Textiles',
          emoji: '👘',
          stockQuantity: 3,
          isActive: true
        },
        {
          name: 'Silver Necklace',
          description: 'Elegant silver necklace with traditional design. Handcrafted by skilled artisans.',
          price: 12000,
          originalPrice: 15000,
          categoryId: categoryMap['Jewelry'],
          artisan: 'Mohan Jewelers',
          emoji: '💎',
          stockQuantity: 10,
          isActive: true
        },
        {
          name: 'Clay Pot Set',
          description: 'Set of 3 traditional clay pots for cooking and storage. Made from natural clay.',
          price: 2500,
          originalPrice: 3000,
          categoryId: categoryMap['Pottery'],
          artisan: 'Pottery Works',
          emoji: '🏺',
          stockQuantity: 15,
          isActive: true
        },
        {
          name: 'Wooden Elephant',
          description: 'Carved wooden elephant with intricate details. Perfect decorative piece for any home.',
          price: 8000,
          originalPrice: 10000,
          categoryId: categoryMap['Sculptures'],
          artisan: 'Wood Craft Studio',
          emoji: '🐘',
          stockQuantity: 7,
          isActive: true
        },
        {
          name: 'Warli Art Painting',
          description: 'Traditional Warli art painting on canvas. Depicts rural life and nature.',
          price: 6000,
          originalPrice: 7500,
          categoryId: categoryMap['Paintings'],
          artisan: 'Tribal Art Collective',
          emoji: '🖼️',
          stockQuantity: 12,
          isActive: true
        },
        {
          name: 'Brass Lamp',
          description: 'Traditional brass oil lamp with beautiful engravings. Perfect for festivals and ceremonies.',
          price: 4500,
          originalPrice: 5500,
          categoryId: categoryMap['Sculptures'],
          artisan: 'Brass Works',
          emoji: '🪔',
          stockQuantity: 20,
          isActive: true
        }
      ];
      
      for (const product of products) {
        await pool.query(`
          INSERT INTO products (
            name, description, price, original_price, category_id, 
            artisan, emoji, stock_quantity, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          product.name, product.description, product.price, product.originalPrice,
          product.categoryId, product.artisan, product.emoji, product.stockQuantity,
          product.isActive
        ]);
        console.log(`✅ Created product: ${product.name}`);
      }
    } else {
      console.log(`Products already exist: ${productsCount} found`);
    }
    
    // Show summary
    const finalCategoriesResult = await pool.query('SELECT COUNT(*) FROM categories');
    const finalProductsResult = await pool.query('SELECT COUNT(*) FROM products');
    
    console.log('\n🎉 Test data creation completed!');
    console.log(`📁 Categories: ${finalCategoriesResult.rows[0].count}`);
    console.log(`📦 Products: ${finalProductsResult.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();
