const pool = require('../config/database');

async function testProductsWithImages() {
  try {
    console.log('Testing products API with images...');
    
    // Test the main products query (similar to what the frontend calls)
    const query = `
      SELECT 
        p.id, p.name, p.slug, p.description, p.price, p.original_price,
        p.artisan, p.emoji, p.image_url, p.stock_quantity, p.created_at,
        c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
      LIMIT 10
    `;

    const result = await pool.query(query);
    console.log(`Found ${result.rows.length} products:`);
    
    result.rows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.emoji} ${product.name}`);
      console.log(`   Price: Rs ${product.price} | Stock: ${product.stock_quantity}`);
      console.log(`   Category: ${product.category_name || 'Uncategorized'}`);
      console.log(`   Image: ${product.image_url || 'No image'}`);
      console.log(`   Artisan: ${product.artisan || 'Unknown'}`);
      console.log('');
    });
    
    // Test a single product query
    if (result.rows.length > 0) {
      const firstProduct = result.rows[0];
      console.log(`\nTesting single product query for ID ${firstProduct.id}:`);
      
      const singleQuery = `
        SELECT 
          p.id, p.name, p.slug, p.description, p.price, p.original_price,
          p.artisan, p.emoji, p.image_url, p.stock_quantity, p.created_at, p.updated_at,
          c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = TRUE AND p.id = $1
      `;
      
      const singleResult = await pool.query(singleQuery, [firstProduct.id]);
      if (singleResult.rows.length > 0) {
        const product = singleResult.rows[0];
        console.log(`✅ Product found: ${product.name}`);
        console.log(`   Image URL: ${product.image_url}`);
        console.log(`   Category: ${product.category_name} (${product.category_slug})`);
        console.log(`   In Stock: ${product.stock_quantity > 0 ? 'Yes' : 'No'}`);
        
        // Test the mapping that the API would return
        const mappedProduct = {
          ...product,
          price: parseFloat(product.price),
          originalPrice: product.original_price ? parseFloat(product.original_price) : null,
          image: product.image_url || product.emoji, // Use image_url if available, fallback to emoji
          inStock: product.stock_quantity > 0,
          category: product.category_slug || 'uncategorized'
        };
        
        console.log('\n📦 Mapped product object (as API would return):');
        console.log(`   ID: ${mappedProduct.id}`);
        console.log(`   Name: ${mappedProduct.name}`);
        console.log(`   Image: ${mappedProduct.image}`);
        console.log(`   Price: Rs ${mappedProduct.price}`);
        console.log(`   In Stock: ${mappedProduct.inStock}`);
        console.log(`   Category: ${mappedProduct.category}`);
      }
    }
    
    // Test categories
    console.log('\n📂 Testing categories:');
    const categoriesResult = await pool.query('SELECT id, name, slug, description FROM categories ORDER BY name');
    categoriesResult.rows.forEach(cat => {
      console.log(`   ${cat.name} (${cat.slug}): ${cat.description}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing products with images:', error);
    process.exit(1);
  }
}

testProductsWithImages();
