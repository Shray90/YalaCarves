const pool = require('../config/database');

async function testProductsAPI() {
  try {
    console.log('Testing products API queries...');
    
    // Test the main products query (similar to what the frontend calls)
    const query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.original_price,
        p.artisan, p.emoji, p.stock_quantity, p.is_active, p.created_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
      LIMIT 20
    `;

    const result = await pool.query(query);
    console.log(`Found ${result.rows.length} active products:`);
    
    result.rows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.emoji} ${product.name}`);
      console.log(`   Price: Rs ${product.price} | Stock: ${product.stock_quantity}`);
      console.log(`   Category: ${product.category_name || 'Uncategorized'}`);
      console.log(`   Artisan: ${product.artisan}`);
      console.log('');
    });
    
    // Test categories query
    const categoriesQuery = 'SELECT * FROM categories ORDER BY name';
    const categoriesResult = await pool.query(categoriesQuery);
    
    console.log(`\nFound ${categoriesResult.rows.length} categories:`);
    categoriesResult.rows.forEach(category => {
      console.log(`- ${category.name} (${category.slug})`);
    });
    
    // Test a specific product query
    if (result.rows.length > 0) {
      const firstProduct = result.rows[0];
      console.log(`\nTesting single product query for ID ${firstProduct.id}:`);
      
      const singleProductQuery = `
        SELECT 
          p.*, 
          c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
      `;
      
      const singleResult = await pool.query(singleProductQuery, [firstProduct.id]);
      if (singleResult.rows.length > 0) {
        const product = singleResult.rows[0];
        console.log(`✅ Product found: ${product.name}`);
        console.log(`   Description: ${product.description}`);
        console.log(`   Price: Rs ${product.price}`);
        console.log(`   Category: ${product.category_name}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing products API:', error);
    process.exit(1);
  }
}

testProductsAPI();
