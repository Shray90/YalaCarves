const pool = require('../config/database');

async function updateImagePaths() {
  try {
    console.log('Updating image paths to use public folder...');
    
    // Get all products with image URLs
    const productsResult = await pool.query('SELECT id, name, image_url FROM products WHERE image_url IS NOT NULL');
    console.log(`Found ${productsResult.rows.length} products with images to update:`);
    
    // Update each product's image path to use public folder
    for (const product of productsResult.rows) {
      let newImageUrl = product.image_url;
      
      // Convert from /src/components/pictures/ to /images/
      if (newImageUrl.includes('/src/components/pictures/')) {
        newImageUrl = newImageUrl.replace('/src/components/pictures/', '/images/');
        
        // Update the product with the new image URL
        await pool.query(
          'UPDATE products SET image_url = $1 WHERE id = $2',
          [newImageUrl, product.id]
        );
        
        console.log(`✅ Updated "${product.name}": ${product.image_url} → ${newImageUrl}`);
      } else {
        console.log(`⏭️ Skipped "${product.name}": ${product.image_url} (already correct)`);
      }
    }
    
    // Show updated products
    const updatedProducts = await pool.query(`
      SELECT id, name, emoji, image_url 
      FROM products 
      WHERE image_url IS NOT NULL
      ORDER BY id
    `);
    
    console.log('\n📸 Updated Products with New Image Paths:');
    updatedProducts.rows.forEach(product => {
      console.log(`${product.id}. ${product.emoji} ${product.name}`);
      console.log(`   Image: ${product.image_url}`);
    });
    
    console.log(`\n🎉 Successfully updated ${updatedProducts.rows.length} product image paths!`);
    console.log('\n📝 Next steps:');
    console.log('1. Copy images from src/components/pictures/ to public/images/');
    console.log('2. Images will be accessible at http://localhost:8080/images/filename.png');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating image paths:', error);
    process.exit(1);
  }
}

updateImagePaths();
