-- =============================================
-- SEED DATA FOR MOOLALA DAIRY DELIVERY APP
-- =============================================

-- Insert Product Categories
INSERT INTO product_categories (name, description, image_url, sort_order) VALUES
('Fresh Milk', 'Pure and fresh milk from our farms', '/images/categories/milk.jpg', 1),
('Dairy Products', 'Fresh dairy products', '/images/categories/dairy.jpg', 2),
('Ghee & Butter', 'Pure ghee and butter products', '/images/categories/ghee.jpg', 3),
('Cheese & Paneer', 'Fresh cheese and paneer', '/images/categories/cheese.jpg', 4),
('Yogurt & Curd', 'Fresh yogurt and curd products', '/images/categories/yogurt.jpg', 5),
('Organic Products', 'Organic dairy products', '/images/categories/organic.jpg', 6);

-- Insert Delivery Zones
INSERT INTO delivery_zones (state, district, local_area, pincode, delivery_fee, min_order_amount) VALUES
('Maharashtra', 'Mumbai', 'Andheri West', '400058', 20.00, 100.00),
('Maharashtra', 'Mumbai', 'Andheri East', '400069', 20.00, 100.00),
('Maharashtra', 'Mumbai', 'Bandra West', '400050', 25.00, 150.00),
('Maharashtra', 'Mumbai', 'Bandra East', '400051', 25.00, 150.00),
('Maharashtra', 'Mumbai', 'Juhu', '400049', 30.00, 200.00),
('Maharashtra', 'Mumbai', 'Vile Parle West', '400056', 20.00, 100.00),
('Maharashtra', 'Mumbai', 'Vile Parle East', '400057', 20.00, 100.00),
('Maharashtra', 'Mumbai', 'Santacruz West', '400054', 25.00, 150.00),
('Maharashtra', 'Mumbai', 'Santacruz East', '400055', 25.00, 150.00),
('Maharashtra', 'Mumbai', 'Khar West', '400052', 30.00, 200.00),
('Maharashtra', 'Mumbai', 'Khar East', '400053', 30.00, 200.00);

-- Insert Products
INSERT INTO products (category_id, name, description, image_url, price, original_price, unit, min_quantity, max_quantity_per_order, stock_quantity, is_subscription_available, is_featured, nutritional_info) VALUES
-- Fresh Milk Products
((SELECT id FROM product_categories WHERE name = 'Fresh Milk'), 'Fresh Cow Milk', 'Pure and fresh cow milk delivered daily', '/images/products/fresh-cow-milk.jpg', 45.00, 50.00, 'liter', 0.5, 10.0, 1000.0, true, true, '{"calories": 42, "protein": 3.4, "fat": 1.0, "carbs": 5.0}'),
((SELECT id FROM product_categories WHERE name = 'Fresh Milk'), 'Fresh Buffalo Milk', 'Rich and creamy buffalo milk', '/images/products/fresh-buffalo-milk.jpg', 55.00, 60.00, 'liter', 0.5, 10.0, 800.0, true, true, '{"calories": 97, "protein": 3.8, "fat": 6.9, "carbs": 5.2}'),
((SELECT id FROM product_categories WHERE name = 'Fresh Milk'), 'Toned Milk', 'Low-fat milk perfect for daily consumption', '/images/products/toned-milk.jpg', 35.00, 40.00, 'liter', 0.5, 10.0, 1200.0, true, false, '{"calories": 35, "protein": 3.2, "fat": 0.5, "carbs": 4.8}'),
((SELECT id FROM product_categories WHERE name = 'Fresh Milk'), 'Double Toned Milk', 'Extra low-fat milk', '/images/products/double-toned-milk.jpg', 30.00, 35.00, 'liter', 0.5, 10.0, 900.0, true, false, '{"calories": 28, "protein": 3.1, "fat": 0.3, "carbs": 4.7}'),

-- Dairy Products
((SELECT id FROM product_categories WHERE name = 'Dairy Products'), 'Fresh Cream', 'Pure fresh cream for cooking', '/images/products/fresh-cream.jpg', 80.00, 90.00, 'kg', 0.25, 5.0, 200.0, false, false, '{"calories": 340, "protein": 2.5, "fat": 35.0, "carbs": 2.8}'),
((SELECT id FROM product_categories WHERE name = 'Dairy Products'), 'Malai', 'Fresh malai for sweets', '/images/products/malai.jpg', 120.00, 140.00, 'kg', 0.25, 3.0, 150.0, false, false, '{"calories": 450, "protein": 3.0, "fat": 45.0, "carbs": 3.5}'),

-- Ghee & Butter
((SELECT id FROM product_categories WHERE name = 'Ghee & Butter'), 'Pure Cow Ghee', 'Pure cow ghee for cooking', '/images/products/cow-ghee.jpg', 250.00, 280.00, 'kg', 0.25, 5.0, 300.0, true, true, '{"calories": 900, "protein": 0.0, "fat": 100.0, "carbs": 0.0}'),
((SELECT id FROM product_categories WHERE name = 'Ghee & Butter'), 'Pure Buffalo Ghee', 'Rich buffalo ghee', '/images/products/buffalo-ghee.jpg', 300.00, 320.00, 'kg', 0.25, 5.0, 250.0, true, false, '{"calories": 900, "protein": 0.0, "fat": 100.0, "carbs": 0.0}'),
((SELECT id FROM product_categories WHERE name = 'Ghee & Butter'), 'Fresh Butter', 'Fresh butter for cooking', '/images/products/fresh-butter.jpg', 180.00, 200.00, 'kg', 0.25, 3.0, 200.0, false, false, '{"calories": 717, "protein": 0.9, "fat": 81.0, "carbs": 0.1}'),

-- Cheese & Paneer
((SELECT id FROM product_categories WHERE name = 'Cheese & Paneer'), 'Fresh Paneer', 'Homemade fresh paneer', '/images/products/fresh-paneer.jpg', 120.00, 140.00, 'kg', 0.25, 5.0, 400.0, true, true, '{"calories": 265, "protein": 18.0, "fat": 20.0, "carbs": 2.0}'),
((SELECT id FROM product_categories WHERE name = 'Cheese & Paneer'), 'Cottage Cheese', 'Fresh cottage cheese', '/images/products/cottage-cheese.jpg', 100.00, 120.00, 'kg', 0.25, 5.0, 300.0, false, false, '{"calories": 98, "protein": 11.0, "fat": 4.3, "carbs": 3.4}'),
((SELECT id FROM product_categories WHERE name = 'Cheese & Paneer'), 'Mozzarella Cheese', 'Fresh mozzarella cheese', '/images/products/mozzarella.jpg', 200.00, 220.00, 'kg', 0.25, 3.0, 150.0, false, false, '{"calories": 280, "protein": 28.0, "fat": 17.0, "carbs": 2.2}'),

-- Yogurt & Curd
((SELECT id FROM product_categories WHERE name = 'Yogurt & Curd'), 'Fresh Curd', 'Homemade fresh curd', '/images/products/fresh-curd.jpg', 60.00, 70.00, 'kg', 0.25, 5.0, 500.0, true, true, '{"calories": 59, "protein": 10.0, "fat": 0.4, "carbs": 3.6}'),
((SELECT id FROM product_categories WHERE name = 'Yogurt & Curd'), 'Greek Yogurt', 'Thick and creamy Greek yogurt', '/images/products/greek-yogurt.jpg', 80.00, 90.00, 'kg', 0.25, 3.0, 200.0, false, false, '{"calories": 59, "protein": 10.0, "fat": 0.4, "carbs": 3.6}'),
((SELECT id FROM product_categories WHERE name = 'Yogurt & Curd'), 'Sweetened Curd', 'Sweetened curd for desserts', '/images/products/sweetened-curd.jpg', 70.00, 80.00, 'kg', 0.25, 3.0, 250.0, false, false, '{"calories": 120, "protein": 8.0, "fat": 2.0, "carbs": 18.0}'),

-- Organic Products
((SELECT id FROM product_categories WHERE name = 'Organic Products'), 'Organic Cow Milk', 'Certified organic cow milk', '/images/products/organic-cow-milk.jpg', 65.00, 70.00, 'liter', 0.5, 10.0, 500.0, true, true, '{"calories": 42, "protein": 3.4, "fat": 1.0, "carbs": 5.0}'),
((SELECT id FROM product_categories WHERE name = 'Organic Products'), 'Organic Ghee', 'Certified organic ghee', '/images/products/organic-ghee.jpg', 350.00, 380.00, 'kg', 0.25, 5.0, 200.0, true, false, '{"calories": 900, "protein": 0.0, "fat": 100.0, "carbs": 0.0}'),
((SELECT id FROM product_categories WHERE name = 'Organic Products'), 'Organic Paneer', 'Certified organic paneer', '/images/products/organic-paneer.jpg', 180.00, 200.00, 'kg', 0.25, 5.0, 300.0, true, false, '{"calories": 265, "protein": 18.0, "fat": 20.0, "carbs": 2.0}');

-- Insert Sample Blog Posts
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image_url, status, published_at) VALUES
('Benefits of Fresh Milk', 'benefits-of-fresh-milk', 
'Fresh milk is one of the most nutritious beverages available. It contains essential nutrients like calcium, protein, and vitamins that are crucial for bone health and overall well-being.

Our fresh milk comes directly from our farms, ensuring the highest quality and freshness. We follow strict quality control measures to maintain the nutritional value and taste of our milk.

Key benefits of fresh milk:
- Rich in calcium for strong bones
- High-quality protein for muscle growth
- Essential vitamins and minerals
- Natural and unprocessed
- Supports healthy digestion

Start your day with a glass of fresh milk for a healthy and nutritious beginning!', 
'Discover the amazing health benefits of fresh milk and why it should be a part of your daily diet.', 
'/images/blog/fresh-milk-benefits.jpg', 'published', NOW()),

('How to Store Dairy Products', 'how-to-store-dairy-products',
'Proper storage of dairy products is essential to maintain their freshness and nutritional value. Here are some tips for storing different dairy products:

**Milk Storage:**
- Keep milk refrigerated at 2-4°C
- Store in the coldest part of the refrigerator
- Use within 3-5 days of opening
- Never freeze milk as it affects taste and texture

**Ghee Storage:**
- Store in an airtight container
- Keep in a cool, dry place
- Avoid direct sunlight
- Can be stored at room temperature for months

**Paneer Storage:**
- Keep refrigerated in an airtight container
- Use within 3-4 days
- Can be frozen for longer storage
- Thaw in refrigerator before use

**Curd Storage:**
- Store in refrigerator
- Use within 5-7 days
- Keep in original container or airtight container
- Avoid contamination with other foods

Follow these storage guidelines to enjoy fresh and safe dairy products!',
'Learn the proper storage techniques for different dairy products to maintain their freshness and quality.',
'/images/blog/dairy-storage.jpg', 'published', NOW()),

('Organic vs Regular Dairy Products', 'organic-vs-regular-dairy-products',
'Understanding the difference between organic and regular dairy products can help you make informed choices for your family.

**Organic Dairy Products:**
- Produced without synthetic pesticides or fertilizers
- Cows are fed organic feed
- No antibiotics or growth hormones
- More expensive but better for environment
- May have higher nutritional value

**Regular Dairy Products:**
- May contain traces of pesticides
- Cows may be given antibiotics
- More affordable option
- Still nutritious and safe
- Widely available

**Key Differences:**
1. **Production Methods:** Organic follows strict guidelines
2. **Cost:** Organic products are typically more expensive
3. **Availability:** Regular products are more widely available
4. **Environmental Impact:** Organic is more eco-friendly
5. **Nutrition:** Both provide essential nutrients

**Our Commitment:**
We offer both organic and regular dairy products to cater to different preferences and budgets. All our products meet the highest quality standards and are safe for consumption.

Choose what works best for your family and budget!',
'Compare organic and regular dairy products to understand the differences and make informed choices.',
'/images/blog/organic-vs-regular.jpg', 'published', NOW());

-- Insert Sample Support Categories (for reference)
-- These are handled in the application logic, but here are the categories:
-- delivery, payment, product, subscription, technical, other

-- Note: User profiles, wallets, and other user-specific data will be created automatically
-- when users sign up through the application.

-- =============================================
-- SAMPLE DATA COMPLETED
-- =============================================

-- Display summary
SELECT 
    'Product Categories' as table_name,
    COUNT(*) as record_count
FROM product_categories
UNION ALL
SELECT 
    'Products' as table_name,
    COUNT(*) as record_count
FROM products
UNION ALL
SELECT 
    'Delivery Zones' as table_name,
    COUNT(*) as record_count
FROM delivery_zones
UNION ALL
SELECT 
    'Blog Posts' as table_name,
    COUNT(*) as record_count
FROM blog_posts; 