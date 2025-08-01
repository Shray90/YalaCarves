const pool = require('../config/database');

async function updateProductImages() {
  try {
    console.log('Updating product images...');
    
    // First, add image_url column if it doesn't exist
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'image_url'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('Adding image_url column to products table...');
      await pool.query(`
        ALTER TABLE products 
        ADD COLUMN image_url VARCHAR(255)
      `);
      console.log('✅ image_url column added successfully');
    }
    
    // Get all current products
    const productsResult = await pool.query('SELECT id, name, emoji FROM products ORDER BY id');
    console.log(`Found ${productsResult.rows.length} products to update:`);
    
    // Create mapping of product names to images
    const imageMapping = {
      'Traditional Ganesh Sculpture': '/src/components/pictures/ganesh.png',
      'Buddha Statue': '/src/components/pictures/buddha.png',
      'Shiva Sculpture': '/src/components/pictures/shiva.png',
      'Lion Guardian': '/src/components/pictures/lion.png',
      'Yak Carving': '/src/components/pictures/yak.png',
      'Lotus Carving': '/src/components/pictures/lotus.png',
      'Peacock Wall Art': '/src/components/pictures/peacockwallart.png',
      'Traditional Mask': '/src/components/pictures/mask.png',
      'Prayer Wheel': '/src/components/pictures/prayerwheel.png',
      'Incense Holder': '/src/components/pictures/incenseholder.png',
      'Door Panel': '/src/components/pictures/doorpanel.png',
      'Window Panel': '/src/components/pictures/windowpanel.png',
      'Madhubani Painting': '/src/components/pictures/peacockwallart.png', // Use peacock art for painting
      'Silk Saree': '/src/components/pictures/lotus.png', // Use lotus for textile
      'Silver Necklace': '/src/components/pictures/lotus.png', // Use lotus for jewelry
      'Clay Pot Set': '/src/components/pictures/incenseholder.png', // Use incense holder for pottery
      'Wooden Elephant': '/src/components/pictures/ganesh.png', // Use ganesh for elephant
      'Warli Art Painting': '/src/components/pictures/mask.png', // Use mask for tribal art
      'Brass Lamp': '/src/components/pictures/incenseholder.png', // Use incense holder for lamp
    };
    
    // Update each product with appropriate image
    for (const product of productsResult.rows) {
      let imageUrl = imageMapping[product.name];
      
      // If no specific mapping found, try to match by keywords
      if (!imageUrl) {
        const name = product.name.toLowerCase();
        if (name.includes('ganesh') || name.includes('elephant')) {
          imageUrl = '/src/components/pictures/ganesh.png';
        } else if (name.includes('buddha')) {
          imageUrl = '/src/components/pictures/buddha.png';
        } else if (name.includes('shiva')) {
          imageUrl = '/src/components/pictures/shiva.png';
        } else if (name.includes('lion')) {
          imageUrl = '/src/components/pictures/lion.png';
        } else if (name.includes('yak')) {
          imageUrl = '/src/components/pictures/yak.png';
        } else if (name.includes('lotus')) {
          imageUrl = '/src/components/pictures/lotus.png';
        } else if (name.includes('peacock')) {
          imageUrl = '/src/components/pictures/peacockwallart.png';
        } else if (name.includes('mask')) {
          imageUrl = '/src/components/pictures/mask.png';
        } else if (name.includes('prayer') || name.includes('wheel')) {
          imageUrl = '/src/components/pictures/prayerwheel.png';
        } else if (name.includes('incense') || name.includes('holder') || name.includes('lamp')) {
          imageUrl = '/src/components/pictures/incenseholder.png';
        } else if (name.includes('door') || name.includes('panel')) {
          imageUrl = '/src/components/pictures/doorpanel.png';
        } else if (name.includes('window')) {
          imageUrl = '/src/components/pictures/windowpanel.png';
        } else {
          // Default to homepage image for unmatched products
          imageUrl = '/src/components/pictures/homepage.png';
        }
      }
      
      // Update the product with the image URL
      await pool.query(
        'UPDATE products SET image_url = $1 WHERE id = $2',
        [imageUrl, product.id]
      );
      
      console.log(`✅ Updated "${product.name}" with image: ${imageUrl}`);
    }
    
    // Show updated products
    const updatedProducts = await pool.query(`
      SELECT id, name, emoji, image_url 
      FROM products 
      ORDER BY id
    `);
    
    console.log('\n📸 Updated Products with Images:');
    updatedProducts.rows.forEach(product => {
      console.log(`${product.id}. ${product.emoji} ${product.name}`);
      console.log(`   Image: ${product.image_url}`);
    });
    
    console.log(`\n🎉 Successfully updated ${updatedProducts.rows.length} products with images!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
}

updateProductImages();
