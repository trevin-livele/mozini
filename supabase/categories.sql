-- ============================================
-- CATEGORIES TABLE (hierarchical categories)
-- ============================================
-- Run this migration in your Supabase SQL editor

create table if not exists public.categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  parent_id integer references public.categories(id) on delete cascade,
  icon text not null default '🛍️',
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categories_parent on public.categories(parent_id);
create index idx_categories_slug on public.categories(slug);
create index idx_categories_active on public.categories(is_active);
create index idx_categories_sort on public.categories(sort_order);

-- Updated_at trigger
create trigger set_updated_at before update on public.categories
  for each row execute function public.update_updated_at();

-- RLS
alter table public.categories enable row level security;

create policy "Anyone can read active categories"
  on public.categories for select using (is_active = true);

create policy "Admins can manage categories"
  on public.categories for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ============================================
-- SEED DATA from Mozini category chart
-- ============================================

-- Top-level: Watches
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Watches', 'watches', null, '⌚', null, 1);

-- Sub: Ladies Watches
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Ladies Watches', 'ladies-watches', (select id from public.categories where slug='watches'), '⌚', '/images/hannah-martin/image00001.jpeg', 1);

-- Models under Ladies Watches
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Hannah Martin', 'hannah-martin', (select id from public.categories where slug='ladies-watches'), '⌚', '/images/hannah-martin/image00001.jpeg', 1),
  ('WWOR', 'wwor', (select id from public.categories where slug='ladies-watches'), '⌚', null, 2),
  ('Daniel Wellington', 'daniel-wellington', (select id from public.categories where slug='ladies-watches'), '⌚', null, 3),
  ('Michael Kors', 'michael-kors', (select id from public.categories where slug='ladies-watches'), '⌚', null, 4),
  ('Naviforce', 'naviforce-ladies', (select id from public.categories where slug='ladies-watches'), '⌚', null, 5),
  ('Cartier', 'cartier', (select id from public.categories where slug='ladies-watches'), '⌚', null, 6),
  ('Curren', 'curren-ladies', (select id from public.categories where slug='ladies-watches'), '⌚', null, 7),
  ('Olevs', 'olevs', (select id from public.categories where slug='ladies-watches'), '⌚', null, 8),
  ('Megir', 'megir-ladies', (select id from public.categories where slug='ladies-watches'), '⌚', null, 9),
  ('Best Sellers', 'best-sellers-ladies', (select id from public.categories where slug='ladies-watches'), '⌚', null, 10);

-- Sub: Gents Watches
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Gents Watches', 'gents-watches', (select id from public.categories where slug='watches'), '⌚', '/images/curren/image00001.jpeg', 2);

-- Models under Gents Watches
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Naviforce', 'naviforce', (select id from public.categories where slug='gents-watches'), '⌚', '/images/naviforce/image00001.jpeg', 1),
  ('Curren', 'curren', (select id from public.categories where slug='gents-watches'), '⌚', '/images/curren/image00001.jpeg', 2),
  ('CRRJU', 'crrju', (select id from public.categories where slug='gents-watches'), '⌚', null, 3),
  ('Poedagar', 'poedagar', (select id from public.categories where slug='gents-watches'), '⌚', '/images/poedagar/image00001.jpeg', 4),
  ('Hublot', 'hublot', (select id from public.categories where slug='gents-watches'), '⌚', null, 5),
  ('Audemars Piguet (AP)', 'audemars-piguet', (select id from public.categories where slug='gents-watches'), '⌚', null, 6),
  ('Patek Philippe', 'patek-philippe', (select id from public.categories where slug='gents-watches'), '⌚', null, 7),
  ('Seiko', 'seiko', (select id from public.categories where slug='gents-watches'), '⌚', null, 8),
  ('Megir', 'megir', (select id from public.categories where slug='gents-watches'), '⌚', null, 9),
  ('Best Sellers', 'best-sellers-gents', (select id from public.categories where slug='gents-watches'), '⌚', null, 10);

-- Sub: Kids Watches
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Kids Watches', 'kids-watches', (select id from public.categories where slug='watches'), '⌚', null, 3);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('SKMEI', 'skmei', (select id from public.categories where slug='kids-watches'), '⌚', 1);

-- Top-level: Gifts
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Gifts', 'gifts', null, '🎁', '/images/gift-cards/image00001.jpeg', 2);

-- Sub: For Her
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('For Her', 'for-her', (select id from public.categories where slug='gifts'), '🎁', 1);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Rose Watch Gift Set', 'rose-watch-gift-set', (select id from public.categories where slug='for-her'), '🎁', 1),
  ('Personalized Watch Package', 'personalized-watch-package-her', (select id from public.categories where slug='for-her'), '🎁', 2),
  ('Flower Bouquet', 'flower-bouquet', (select id from public.categories where slug='for-her'), '💐', 3),
  ('Gift Cards', 'gift-cards-her', (select id from public.categories where slug='for-her'), '🎁', 4),
  ('Her Self Care Package', 'her-self-care-package', (select id from public.categories where slug='for-her'), '🎁', 5),
  ('Tumbler', 'tumbler-her', (select id from public.categories where slug='for-her'), '🎁', 6);

-- Sub: For Him
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('For Him', 'for-him', (select id from public.categories where slug='gifts'), '🎁', 2);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Personalized Mug', 'personalized-mug-him', (select id from public.categories where slug='for-him'), '🎁', 1),
  ('Personalized Watch Package', 'personalized-watch-package-him', (select id from public.categories where slug='for-him'), '🎁', 2),
  ('Play n'' Pour Chess Set', 'play-n-pour-chess-set', (select id from public.categories where slug='for-him'), '🎁', 3),
  ('Whiskey Me Away', 'whiskey-me-away', (select id from public.categories where slug='for-him'), '🎁', 4),
  ('Gift Card', 'gift-card-him', (select id from public.categories where slug='for-him'), '🎁', 5),
  ('Tumbler', 'tumbler-him', (select id from public.categories where slug='for-him'), '🎁', 6),
  ('Personalized Mug', 'personalized-mug-him-2', (select id from public.categories where slug='for-him'), '🎁', 7);

-- Sub: Couples
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Couples', 'couples', (select id from public.categories where slug='gifts'), '🎁', 3);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Personalized Keyholder', 'personalized-keyholder', (select id from public.categories where slug='couples'), '🎁', 1),
  ('Hoodie', 'hoodie-couples', (select id from public.categories where slug='couples'), '🎁', 2),
  ('Sweatshirt', 'sweatshirt-couples', (select id from public.categories where slug='couples'), '🎁', 3);

-- Sub: ALL (general gifts)
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('All Gifts', 'all-gifts', (select id from public.categories where slug='gifts'), '🎁', 4);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Sweatshirt', 'sweatshirt', (select id from public.categories where slug='all-gifts'), '🎁', 1),
  ('Hoodie', 'hoodie', (select id from public.categories where slug='all-gifts'), '🎁', 2),
  ('Mug', 'mug', (select id from public.categories where slug='all-gifts'), '🎁', 3),
  ('Engraved Keychain', 'engraved-keychain', (select id from public.categories where slug='all-gifts'), '🎁', 4);

-- Sub: Corporate Gift Sets
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Corporate Gift Sets', 'corporate-gift-sets', (select id from public.categories where slug='gifts'), '🎁', 5);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Endless Ink Journal Set', 'endless-ink-journal-set', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 1),
  ('Notebook', 'notebook', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 2),
  ('Stress Ball', 'stress-ball', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 3),
  ('Desktop Pen 1', 'desktop-pen-1', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 4),
  ('Desktop Pen 2', 'desktop-pen-2', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 5),
  ('Personalized Gift Box', 'personalized-gift-box', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 6),
  ('Personalized Pen 1', 'personalized-pen-1', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 7),
  ('A3', 'a3', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 8),
  ('A4', 'a4', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 9),
  ('A6', 'a6', (select id from public.categories where slug='corporate-gift-sets'), '🎁', 10);

-- Top-level: Jewelry
insert into public.categories (name, slug, parent_id, icon, image_url, sort_order) values
  ('Jewelry', 'jewelry', null, '💍', '/images/necklaces/image00001.jpeg', 3);

-- Sub: Necklace
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Necklace', 'necklace', (select id from public.categories where slug='jewelry'), '💍', 1);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('"I love you" in 100 languages', 'i-love-you-100-languages', (select id from public.categories where slug='necklace'), '💍', 1),
  ('Golden Blossom Pendant', 'golden-blossom-pendant', (select id from public.categories where slug='necklace'), '💍', 2),
  ('Dual Charm', 'dual-charm', (select id from public.categories where slug='necklace'), '💍', 3),
  ('Emerald Heart', 'emerald-heart', (select id from public.categories where slug='necklace'), '💍', 4);

-- Top-level: Valentines Collection
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Valentines Collection', 'valentines-collection', null, '💝', 4);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Flower Bouquet', 'flower-bouquet-val', (select id from public.categories where slug='valentines-collection'), '💐', 1),
  ('Flower Bouquet + Personalized Newspaper', 'flower-bouquet-newspaper', (select id from public.categories where slug='valentines-collection'), '💐', 2),
  ('My Forever Gift Cards', 'my-forever-gift-cards', (select id from public.categories where slug='valentines-collection'), '🎁', 3),
  ('Valentwine', 'valentwine', (select id from public.categories where slug='valentines-collection'), '🍷', 4),
  ('Chocolate Delight', 'chocolate-delight-val', (select id from public.categories where slug='valentines-collection'), '🍫', 5),
  ('Gifts for Her', 'gifts-for-her-val', (select id from public.categories where slug='valentines-collection'), '🎁', 6),
  ('Gifts for Him', 'gifts-for-him-val', (select id from public.categories where slug='valentines-collection'), '🎁', 7),
  ('Couples Gifts', 'couples-gifts-val', (select id from public.categories where slug='valentines-collection'), '💕', 8);

-- Top-level: Galentines Collection
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Galentines Collection', 'galentines-collection', null, '👯', 5);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Gifts', 'galentine-gifts', (select id from public.categories where slug='galentines-collection'), '🎁', 1),
  ('Galentine Mozini Game', 'galentine-mozini-game', (select id from public.categories where slug='galentines-collection'), '🎮', 2);

-- Top-level: Drinks & Candy
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Drinks & Candy', 'drinks-candy', null, '🍫', 6);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Wine + Personalized Wine Sticker', 'wine-personalized-sticker', (select id from public.categories where slug='drinks-candy'), '🍷', 1),
  ('Chocolate Delight', 'chocolate-delight', (select id from public.categories where slug='drinks-candy'), '🍫', 2);

-- Top-level: Alarms
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Alarms', 'alarms', null, '⏰', 7);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('3D LED', '3d-led', (select id from public.categories where slug='alarms'), '⏰', 1),
  ('Sunrise Alarm', 'sunrise-alarm', (select id from public.categories where slug='alarms'), '⏰', 2),
  ('Wooden LED', 'wooden-led', (select id from public.categories where slug='alarms'), '⏰', 3),
  ('Digital Alarm', 'digital-alarm', (select id from public.categories where slug='alarms'), '⏰', 4),
  ('Smart Wireless Charging Alarm', 'smart-wireless-charging-alarm', (select id from public.categories where slug='alarms'), '⏰', 5);

-- Top-level: Gift Consultancy
insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('Gift Consultancy', 'gift-consultancy', null, '🎯', 8);

insert into public.categories (name, slug, parent_id, icon, sort_order) values
  ('KIKI''S', 'kikis', (select id from public.categories where slug='gift-consultancy'), '🎯', 1),
  ('F1 Lover', 'f1-lover', (select id from public.categories where slug='gift-consultancy'), '🏎️', 2),
  ('Booklover', 'booklover', (select id from public.categories where slug='gift-consultancy'), '📚', 3);
