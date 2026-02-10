-- ============================================
-- Seed: Mozini E-Commerce — Real Product Data
-- Image paths match public/images/ folder
-- ============================================

-- Clean out old data (order matters due to foreign keys)
delete from public.order_items;
delete from public.orders;
delete from public.wishlists;
delete from public.cart_items;
delete from public.products;

-- Reset the product ID sequence
alter sequence products_id_seq restart with 1;

insert into public.products (id, name, brand, category, price, old_price, icon, image_url, badge, tag, description, stock) values

-- ============================================
-- CURREN — Gents Watches (13 images)
-- ============================================
(1,  'Curren Classic Black Dial Watch',        'Curren', 'Curren', 4500, 6500, '⌚', '/images/curren/image00001.jpeg', 'sale',  'featured', 'Bold black dial with stainless steel band. Water resistant Japanese quartz movement. A timeless everyday watch.', 100),
(2,  'Curren Silver Chronograph Watch',        'Curren', 'Curren', 5200, 0,    '⌚', '/images/curren/image00002.jpeg', '',      'featured', 'Sleek silver chronograph with date display. Premium stainless steel construction for the modern gentleman.', 100),
(3,  'Curren Blue Dial Sports Watch',          'Curren', 'Curren', 3800, 4500, '⌚', '/images/curren/image00003.jpeg', 'sale',  'new',      'Striking blue dial with luminous hands. Sporty yet elegant design for active lifestyles.', 100),
(4,  'Curren Gold Tone Luxury Watch',          'Curren', 'Curren', 5500, 0,    '⌚', '/images/curren/image00004.jpeg', 'hot',   'best',     'Luxurious gold-tone finish with textured dial. Statement piece for special occasions.', 80),
(5,  'Curren Leather Strap Classic Watch',     'Curren', 'Curren', 3500, 4200, '⌚', '/images/curren/image00005.jpeg', 'sale',  'featured', 'Classic design with genuine leather strap. Comfortable fit and vintage-inspired elegance.', 100),
(6,  'Curren Minimalist Steel Watch',          'Curren', 'Curren', 4000, 0,    '⌚', '/images/curren/image00006.jpeg', '',      'new',      'Clean minimalist dial with mesh steel band. Modern Scandinavian-inspired design.', 100),
(7,  'Curren Rose Gold Executive Watch',       'Curren', 'Curren', 4800, 5800, '⌚', '/images/curren/image00007.jpeg', 'sale',  'best',     'Rose gold executive watch with sub-dials. Sophisticated timepiece for the boardroom.', 80),
(8,  'Curren Dark Knight Watch',               'Curren', 'Curren', 4200, 0,    '⌚', '/images/curren/image00008.jpeg', 'hot',   'new',      'All-black matte finish with red accents. Bold and masculine design that commands attention.', 100),
(9,  'Curren Dual Tone Bracelet Watch',        'Curren', 'Curren', 5000, 6000, '⌚', '/images/curren/image00009.jpeg', 'sale',  'featured', 'Two-tone silver and gold bracelet watch. Versatile design that pairs with any outfit.', 80),
(10, 'Curren Military Style Watch',            'Curren', 'Curren', 3800, 0,    '⌚', '/images/curren/image00964.jpeg', '',      'best',     'Rugged military-inspired design with canvas strap. Built tough for adventure.', 100),
(11, 'Curren Aviator Pilot Watch',             'Curren', 'Curren', 4500, 5500, '⌚', '/images/curren/image00965.jpeg', 'sale',  'new',      'Aviation-inspired dial with large numerals. Pilot watch styling with everyday wearability.', 80),
(12, 'Curren Ocean Blue Diver Watch',          'Curren', 'Curren', 5200, 0,    '⌚', '/images/curren/image00966.jpeg', 'hot',   'featured', 'Deep ocean blue bezel with luminous markers. Diver-style watch with rotating bezel.', 80),
(13, 'Curren Carbon Fiber Watch',              'Curren', 'Curren', 4800, 5800, '⌚', '/images/curren/image00967.jpeg', 'sale',  'best',     'Carbon fiber textured dial with sporty design. Lightweight and durable for daily wear.', 100),

-- ============================================
-- NAVIFORCE — Gents Watches (10 images)
-- ============================================
(14, 'Naviforce Dual Display Sport Watch',     'Naviforce', 'Naviforce', 5500, 7000, '⌚', '/images/naviforce/image00001.jpeg', 'sale',  'featured', 'Analog-digital dual display with LED backlight. Multi-function sport watch with stopwatch and alarm.', 80),
(15, 'Naviforce Steel Commander Watch',        'Naviforce', 'Naviforce', 4800, 0,    '⌚', '/images/naviforce/image00002.jpeg', 'hot',   'best',     'Full stainless steel construction with date window. Commanding presence on the wrist.', 100),
(16, 'Naviforce Black Ops Watch',              'Naviforce', 'Naviforce', 4200, 5000, '⌚', '/images/naviforce/image00003.jpeg', 'sale',  'new',      'Stealth black design with orange accents. Tactical-inspired timepiece for the bold.', 100),
(17, 'Naviforce Leather Executive Watch',      'Naviforce', 'Naviforce', 5000, 0,    '⌚', '/images/naviforce/image00004.jpeg', '',      'featured', 'Premium leather band with sophisticated dial. Executive styling meets everyday comfort.', 80),
(18, 'Naviforce Digital Warrior Watch',        'Naviforce', 'Naviforce', 3800, 4500, '⌚', '/images/naviforce/image00005.jpeg', 'sale',  'new',      'Full digital display with multiple time zones. Rugged construction for outdoor adventures.', 100),
(19, 'Naviforce Gold Prestige Watch',          'Naviforce', 'Naviforce', 6500, 8000, '⌚', '/images/naviforce/image00006.jpeg', 'sale',  'best',     'Prestigious gold-tone watch with day-date display. Luxury craftsmanship at an accessible price.', 60),
(20, 'Naviforce Chronograph Pro Watch',        'Naviforce', 'Naviforce', 5800, 0,    '⌚', '/images/naviforce/image00007.jpeg', 'hot',   'featured', 'Professional chronograph with tachymeter bezel. Precision timing for the discerning man.', 80),
(21, 'Naviforce Mesh Band Modern Watch',       'Naviforce', 'Naviforce', 4500, 5500, '⌚', '/images/naviforce/image00008.jpeg', 'sale',  'new',      'Contemporary mesh band with clean dial. Modern minimalism meets robust build quality.', 100),
(22, 'Naviforce Tactical Field Watch',         'Naviforce', 'Naviforce', 4000, 0,    '⌚', '/images/naviforce/image00009.jpeg', '',      'best',     'Field watch design with high-visibility markers. Built for reliability in any condition.', 100),
(23, 'Naviforce Royal Blue Watch',             'Naviforce', 'Naviforce', 5200, 6500, '⌚', '/images/naviforce/image00010.jpeg', 'sale',  'featured', 'Royal blue sunburst dial with silver case. Elegant color combination that turns heads.', 80),

-- ============================================
-- POEDAGAR — Gents Watches (4 images)
-- ============================================
(24, 'Poedagar Luxury Diamond Watch',          'Poedagar', 'Poedagar', 6500, 8500, '⌚', '/images/poedagar/image00001.jpeg', 'sale',  'featured', 'Diamond-accented dial with premium steel band. Luxury statement watch with Japanese movement.', 60),
(25, 'Poedagar Skeleton Automatic Watch',      'Poedagar', 'Poedagar', 7500, 0,    '⌚', '/images/poedagar/image00002.jpeg', 'hot',   'best',     'Open-heart skeleton dial revealing the movement. Automatic mechanical watch for the connoisseur.', 50),
(26, 'Poedagar Classic Silver Watch',          'Poedagar', 'Poedagar', 5500, 6500, '⌚', '/images/poedagar/image00003.jpeg', 'sale',  'new',      'Timeless silver design with Roman numeral markers. Classic elegance that never goes out of style.', 80),
(27, 'Poedagar Black Titanium Watch',          'Poedagar', 'Poedagar', 6000, 0,    '⌚', '/images/poedagar/image00004.jpeg', '',      'featured', 'Black titanium finish with sapphire crystal. Ultra-durable premium watch for the modern man.', 60),

-- ============================================
-- HANNAH MARTIN — Ladies Watches (15 images)
-- ============================================
(28, 'Hannah Martin Rose Gold Mesh Watch',     'Hannah Martin', 'Hannah Martin', 3500, 4500, '⌚', '/images/hannah-martin/image00001.jpeg', 'sale',  'featured', 'Minimalist rose gold mesh strap with elegant dial. Japanese quartz movement, water resistant.', 50),
(29, 'Hannah Martin Crystal Silver Watch',     'Hannah Martin', 'Hannah Martin', 3800, 0,    '⌚', '/images/hannah-martin/image00002.jpeg', 'hot',   'featured', 'Crystal-studded bezel with silver mesh band. Sparkling elegance for every occasion.', 50),
(30, 'Hannah Martin Midnight Blue Watch',      'Hannah Martin', 'Hannah Martin', 3200, 4000, '⌚', '/images/hannah-martin/image00003.jpeg', 'sale',  'new',      'Deep blue dial with rose gold mesh strap. A bold yet feminine statement piece.', 50),
(31, 'Hannah Martin Gold Luxe Watch',          'Hannah Martin', 'Hannah Martin', 4200, 0,    '⌚', '/images/hannah-martin/image00004.jpeg', '',      'best',     'Luxurious gold-tone bracelet watch with mother-of-pearl dial. Pure sophistication.', 50),
(32, 'Hannah Martin Pearl White Watch',        'Hannah Martin', 'Hannah Martin', 2800, 3500, '⌚', '/images/hannah-martin/image00005.jpeg', 'sale',  'new',      'Clean white dial with rose gold accents. Minimalist Bauhaus-inspired design.', 50),
(33, 'Hannah Martin Emerald Green Watch',      'Hannah Martin', 'Hannah Martin', 3600, 0,    '⌚', '/images/hannah-martin/image00006.jpeg', 'hot',   'featured', 'Elegant emerald green dial with rose gold mesh strap. A unique color that turns heads.', 50),
(34, 'Hannah Martin Diamond Mesh Watch',       'Hannah Martin', 'Hannah Martin', 4800, 5800, '⌚', '/images/hannah-martin/image00811.jpeg', 'sale',  'best',     'Diamond accent markers with rose gold mesh band and magnetic clasp. The ultimate gift for her.', 40),
(35, 'Hannah Martin Slim Silver Watch',        'Hannah Martin', 'Hannah Martin', 2500, 0,    '⌚', '/images/hannah-martin/image00812.jpeg', '',      'new',      'Ultra-slim silver watch with delicate mesh strap. Simple, refined, and comfortable all day.', 50),
(36, 'Hannah Martin 3D Bee Fashion Watch',     'Hannah Martin', 'Hannah Martin', 3000, 3800, '⌚', '/images/hannah-martin/image00813.jpeg', 'sale',  'featured', 'Charming 3D bee motif on dial with rose gold mesh band. A conversation starter on your wrist.', 50),
(37, 'Hannah Martin Black Rose Gold Watch',    'Hannah Martin', 'Hannah Martin', 3400, 0,    '⌚', '/images/hannah-martin/image00814.jpeg', '',      'best',     'Striking black dial with rose gold case and mesh strap. Modern elegance redefined.', 50),
(38, 'Hannah Martin Champagne Gold Watch',     'Hannah Martin', 'Hannah Martin', 2900, 3600, '⌚', '/images/hannah-martin/image00815.jpeg', 'sale',  'new',      'Delicate champagne gold dial with matching mesh band. Perfect for slender wrists.', 50),
(39, 'Hannah Martin Aurora Crystal Set',       'Hannah Martin', 'Hannah Martin', 5200, 6500, '⌚', '/images/hannah-martin/image00816.jpeg', 'hot',   'best',     'Crystal-encrusted bezel with matching bracelet set. Complete jewelry set for special occasions.', 30),
(40, 'Hannah Martin Starlight Bracelet Watch', 'Hannah Martin', 'Hannah Martin', 4000, 4800, '⌚', '/images/hannah-martin/image00817.jpeg', 'sale',  'featured', 'Starlight-inspired dial with delicate bracelet band. Dreamy and romantic design.', 40),
(41, 'Hannah Martin Blush Pink Watch',         'Hannah Martin', 'Hannah Martin', 3200, 0,    '⌚', '/images/hannah-martin/image00818.jpeg', '',      'new',      'Soft blush pink dial with rose gold mesh. Feminine and charming for everyday wear.', 50),
(42, 'Hannah Martin Signature Collection',     'Hannah Martin', 'Hannah Martin', 5500, 7000, '⌚', '/images/hannah-martin/IMG_9433.webp',   'sale',  'best',     'Signature collection piece with premium finish. The crown jewel of Hannah Martin craftsmanship.', 30),

-- ============================================
-- JEWELRY — Valentines Necklaces (7 images)
-- ============================================
(43, 'Heart Pendant Gold Necklace',            'Mozini', 'Jewelry', 2800, 0,    '�', '/images/necklaces/image00001.jpeg', 'hot',   'featured', 'Elegant heart pendant on gold-plated chain. Perfect Valentine''s gift to show your love.', 100),
(44, 'Crystal Drop Necklace',                  'Mozini', 'Jewelry', 3200, 3800, '�', '/images/necklaces/image00002.jpeg', 'sale',  'new',      'Sparkling crystal drop pendant on delicate chain. Catches the light beautifully.', 100),
(45, 'Rose Gold Love Necklace',                'Mozini', 'Jewelry', 2500, 0,    '💍', '/images/necklaces/image00003.jpeg', '',      'best',     'Rose gold love-themed necklace. Romantic and timeless design for everyday wear.', 100),
(46, 'Silver Infinity Necklace',               'Mozini', 'Jewelry', 2200, 2800, '💍', '/images/necklaces/image00004.jpeg', 'sale',  'featured', 'Sterling silver infinity symbol pendant. Symbolizes eternal love and connection.', 100),
(47, 'Pearl Pendant Necklace',                 'Mozini', 'Jewelry', 3500, 0,    '�', '/images/necklaces/image00005.jpeg', 'hot',   'new',      'Classic pearl pendant on gold chain. Timeless elegance that complements any outfit.', 80),
(48, 'Diamond Heart Necklace',                 'Mozini', 'Jewelry', 4500, 5500, '💍', '/images/necklaces/image00006.jpeg', 'sale',  'best',     'Diamond-accented heart pendant. Luxury gift that says I love you.', 60),
(49, 'Layered Chain Necklace Set',             'Mozini', 'Jewelry', 2000, 0,    '�', '/images/necklaces/image00007.jpeg', '',      'featured', 'Set of layered gold chains at different lengths. Trendy and versatile styling.', 100),

-- ============================================
-- GIFT CARDS — His & Hers Valentine's (10 images)
-- ============================================
(50, 'Valentine''s Gift Card - For Him',       'Mozini', 'Gift Cards', 2000, 0,    '🎫', '/images/gift-cards/image00001.jpeg', '',      'new',      'Valentine''s themed gift card for him. Let him choose his perfect gift.', 999),
(51, 'Valentine''s Gift Card - For Her',       'Mozini', 'Gift Cards', 2000, 0,    '🎫', '/images/gift-cards/image00002.jpeg', '',      'new',      'Valentine''s themed gift card for her. The perfect way to say I love you.', 999),
(52, 'Couple''s Gift Card - KES 5,000',        'Mozini', 'Gift Cards', 5000, 0,    '🎫', '/images/gift-cards/image00003.jpeg', 'hot',   'featured', 'His & Hers couple''s gift card worth KES 5,000. Share the love of gifting.', 999),
(53, 'Premium Gift Card - KES 10,000',         'Mozini', 'Gift Cards', 10000, 0,   '🎫', '/images/gift-cards/image00004.jpeg', 'hot',   'best',     'Premium gift card worth KES 10,000. The ultimate Valentine''s surprise.', 999),
(54, 'Love Gift Card - Rose Design',           'Mozini', 'Gift Cards', 3000, 0,    '🎫', '/images/gift-cards/image00005.jpeg', '',      'featured', 'Beautiful rose-themed gift card. Romantic design for your special someone.', 999),
(55, 'Valentine''s Gift Card - Hearts',        'Mozini', 'Gift Cards', 3000, 0,    '🎫', '/images/gift-cards/image00006.jpeg', '',      'new',      'Hearts-themed Valentine''s gift card. Spread love with the gift of choice.', 999),
(56, 'Anniversary Gift Card',                  'Mozini', 'Gift Cards', 5000, 0,    '🎫', '/images/gift-cards/image00007.jpeg', '',      'best',     'Anniversary celebration gift card. Perfect for marking milestones together.', 999),
(57, 'Luxury Gift Card - Gold',                'Mozini', 'Gift Cards', 7500, 0,    '🎫', '/images/gift-cards/image00008.jpeg', 'hot',   'featured', 'Gold-themed luxury gift card. Premium presentation for a premium gift.', 999),
(58, 'Valentine''s His & Hers Card Set',       'Mozini', 'Gift Cards', 4000, 5000, '🎫', '/images/gift-cards/image00913.jpeg', 'sale',  'best',     'Matching his and hers gift card set. Perfect Valentine''s Day surprise for couples.', 999),
(59, 'Valentine''s Special Edition Card',      'Mozini', 'Gift Cards', 5000, 6000, '🎫', '/images/gift-cards/image00914.jpeg', 'sale',  'featured', 'Limited edition Valentine''s gift card with exclusive design. Collectible and thoughtful.', 500);

-- Reset the sequence to continue after our seeded IDs
select setval('products_id_seq', (select max(id) from public.products));
