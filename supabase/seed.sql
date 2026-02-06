-- ============================================
-- Seed: Migrate existing product data
-- ============================================

insert into public.products (id, name, brand, category, price, old_price, icon, badge, tag, description, stock) values
  (1, 'Classic Gold Men''s Watch', 'Mozini', 'Men''s Watches', 4500, 6500, '⌚', 'sale', 'featured', 'Elegant gold-tone men''s watch with stainless steel band. Water resistant, perfect for everyday wear.', 100),
  (2, 'Rose Gold Ladies Watch', 'Mozini', 'Women''s Watches', 3800, 0, '⌚', '', 'featured', 'Beautiful rose gold ladies watch with crystal accents. Delicate and stylish for any occasion.', 100),
  (3, 'Sports Digital Watch', 'Mozini', 'Men''s Watches', 2500, 3200, '⌚', 'sale', 'featured', 'Multi-function digital sports watch with stopwatch, alarm, and backlight. Perfect for active lifestyles.', 100),
  (4, 'Minimalist Silver Watch', 'Mozini', 'Unisex Watches', 3200, 0, '⌚', '', 'featured', 'Clean minimalist design with genuine leather strap. Timeless elegance for him or her.', 100),
  (5, 'Luxury Chronograph Watch', 'Mozini', 'Men''s Watches', 7500, 9000, '⌚', 'sale', 'best', 'Premium chronograph with date display and luminous hands. Statement piece for the distinguished gentleman.', 100),
  (6, 'Diamond Accent Ladies Watch', 'Mozini', 'Women''s Watches', 5500, 0, '⌚', 'hot', 'best', 'Stunning ladies watch with genuine diamond accents. Luxury meets everyday elegance.', 100),
  (7, 'Vintage Leather Watch', 'Mozini', 'Men''s Watches', 3000, 3500, '⌚', 'sale', 'best', 'Classic vintage-inspired design with genuine brown leather strap. Timeless sophistication.', 100),
  (8, 'Smart Casual Watch', 'Mozini', 'Unisex Watches', 2800, 0, '⌚', '', 'best', 'Versatile watch that transitions from office to weekend. Mesh band in brushed silver.', 100),
  (9, 'Oud Royale Perfume 100ml', 'Mozini', 'Men''s Perfumes', 4500, 5500, '🧴', 'sale', 'new', 'Rich Arabian oud fragrance with notes of sandalwood and amber. Long-lasting luxury scent.', 100),
  (10, 'Floral Dreams EDP 50ml', 'Mozini', 'Women''s Perfumes', 3200, 0, '🌸', '', 'new', 'Delicate floral bouquet with jasmine, rose, and lily. Fresh and feminine all day.', 100),
  (11, 'Ocean Breeze Cologne 100ml', 'Mozini', 'Men''s Perfumes', 2800, 3500, '🧴', 'sale', 'new', 'Fresh aquatic fragrance with citrus top notes. Perfect for the modern man.', 100),
  (12, 'Vanilla Musk Perfume 50ml', 'Mozini', 'Women''s Perfumes', 3500, 0, '🌸', 'hot', 'new', 'Warm vanilla and musk blend. Sensual and captivating evening fragrance.', 100),
  (13, 'Black Intense EDT 100ml', 'Mozini', 'Men''s Perfumes', 3800, 4500, '🧴', 'sale', 'featured', 'Bold and mysterious with leather and spice notes. Make a lasting impression.', 100),
  (14, 'Cherry Blossom EDP 75ml', 'Mozini', 'Women''s Perfumes', 4200, 0, '🌸', '', 'best', 'Light cherry blossom with hints of peach. Fresh, youthful, and irresistible.', 100),
  (15, 'Men''s Watch & Perfume Set', 'Mozini', 'Gift Sets', 6500, 8000, '🎁', 'sale', 'featured', 'Perfect gift combo: Classic watch paired with Oud Royale perfume in premium gift box.', 100),
  (16, 'Ladies Gift Collection', 'Mozini', 'Gift Sets', 5800, 0, '🎁', 'hot', 'best', 'Elegant ladies watch with matching perfume. Beautifully packaged for gifting.', 100);

-- Reset the sequence to continue after our seeded IDs
select setval('products_id_seq', (select max(id) from public.products));
