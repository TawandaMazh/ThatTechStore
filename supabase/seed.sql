-- Phase 2 seed: 4 problem categories + 12 products + phone units + sample reviews
-- Run AFTER the migration. Safe to re-run: clears seed rows by known keys/slugs.

begin;

-- Clear previous seed (order matters for FKs)
delete from public.cart_items;
delete from public.carts;
delete from public.reviews
  where product_id in (select id from public.products where slug like '%');
delete from public.product_units
  where product_id in (select id from public.products);
delete from public.products;
delete from public.categories;

insert into public.categories (id, key, title, description, sort_order) values
  ('a1000000-0000-4000-8000-000000000001', 'too-hot', 'Too hot', 'Cooling that keeps rooms livable.', 1),
  ('a1000000-0000-4000-8000-000000000002', 'power-cuts', 'Power cuts', 'Backup power when ZESCO drops.', 2),
  ('a1000000-0000-4000-8000-000000000003', 'storms', 'Storms', 'Surge gear for rainy-season spikes.', 3),
  ('a1000000-0000-4000-8000-000000000004', 'phones', 'Phones', 'Checked handsets with warranty.', 4);

insert into public.products (
  id, category_id, name, slug, price_zmw, description, problem_solved,
  stock_qty, images, specs, badge, featured, active
) values
-- Too hot (3)
(
  'b2000000-0000-4000-8000-000000000001',
  'a1000000-0000-4000-8000-000000000001',
  'Standing Fan Pro 18"',
  'standing-fan-pro-18',
  890,
  'Quiet oscillating pedestal fan with three speeds and a wide sweep — built for Lusaka afternoons when the room will not cool down.',
  'Keeps sitting rooms and bedrooms moveable-air cool without needing AC.',
  14,
  array['/products/standing-fan.svg'],
  '{"type":"Pedestal fan","blade_size":"18 inch","speeds":3,"oscillation":true,"power":"55W","voltage":"220–240V"}'::jsonb,
  'Best seller',
  true,
  true
),
(
  'b2000000-0000-4000-8000-000000000002',
  'a1000000-0000-4000-8000-000000000001',
  'Solar Desk Fan 12"',
  'solar-desk-fan-12',
  650,
  'USB/solar hybrid desk fan with a fold-out panel option. Run it off a power bank when the grid is down.',
  'Desk cooling that still works during daytime load shedding.',
  22,
  array['/products/solar-desk-fan.svg'],
  '{"type":"Desk fan","blade_size":"12 inch","power_options":["USB","Solar panel"],"battery":"optional power bank","noise":"low"}'::jsonb,
  'Solar ready',
  true,
  true
),
(
  'b2000000-0000-4000-8000-000000000003',
  'a1000000-0000-4000-8000-000000000001',
  'Portable AC 9000 BTU',
  'portable-ac-9000',
  7900,
  'Self-contained portable air conditioner with window kit. Moves cool air into one room without permanent install.',
  'Real cooling for bedrooms and small offices when fans are not enough.',
  4,
  array['/products/portable-ac.svg'],
  '{"cooling":"9000 BTU","rooms":"up to ~20 m²","modes":["cool","fan","dehumidify"],"exhaust":"window kit included"}'::jsonb,
  null,
  false,
  true
),
-- Storms (3)
(
  'b2000000-0000-4000-8000-000000000004',
  'a1000000-0000-4000-8000-000000000003',
  'Surge Guard 6-Way',
  'surge-guard-6-way',
  320,
  'Six-outlet surge protector with indicator lights. First line of defence when rainy-season voltage spikes hit.',
  'Stops cheap spikes from frying TVs, routers, and chargers.',
  40,
  array['/products/surge-guard.svg'],
  '{"outlets":6,"protection":"surge + overload","max_load":"2500W","indicator":true}'::jsonb,
  'Must-have',
  true,
  true
),
(
  'b2000000-0000-4000-8000-000000000005',
  'a1000000-0000-4000-8000-000000000003',
  'Voltage Regulator 2000VA',
  'voltage-regulator-2000va',
  980,
  'Automatic voltage regulator for fridges, TVs, and small appliances when the line sags or climbs.',
  'Stabilises brownouts and high voltage so appliances last longer.',
  11,
  array['/products/voltage-regulator.svg'],
  '{"capacity":"2000VA","input":"140–260V","output":"220V ±5%","delay":"3 min fridge protect"}'::jsonb,
  null,
  false,
  true
),
(
  'b2000000-0000-4000-8000-000000000006',
  'a1000000-0000-4000-8000-000000000003',
  'Rechargeable LED Lamp Kit',
  'rechargeable-led-lamp-kit',
  450,
  'Bright rechargeable LED lantern plus two desk lamps. Charge when power is on; light when storms cut the grid.',
  'Light for homework and cooking when the lights go out mid-storm.',
  28,
  array['/products/led-lamp-kit.svg'],
  '{"pieces":3,"runtime":"6–12 hours","charge":"USB-C","lumens":"up to 800"}'::jsonb,
  'Storm kit',
  true,
  true
),
-- Power cuts (3)
(
  'b2000000-0000-4000-8000-000000000007',
  'a1000000-0000-4000-8000-000000000002',
  '1.5kVA Hybrid Inverter',
  'hybrid-inverter-1-5kva',
  4850,
  'Hybrid inverter ready for battery + optional solar input. Keeps lights, Wi-Fi, and a fridge running through load shedding.',
  'Home backup power when ZESCO drops — without a generator racket.',
  6,
  array['/products/hybrid-inverter.svg'],
  '{"capacity":"1.5kVA","type":"hybrid","input":["grid","battery","solar optional"],"waveform":"pure sine"}'::jsonb,
  'In stock',
  true,
  true
),
(
  'b2000000-0000-4000-8000-000000000008',
  'a1000000-0000-4000-8000-000000000002',
  '100Ah Lithium Battery',
  'lithium-battery-100ah',
  5400,
  'LiFePO4 battery pack sized for evening backup with a matching inverter. Longer cycle life than lead-acid.',
  'Stores enough energy for lights, phone charging, and a fridge overnight.',
  5,
  array['/products/lithium-battery.svg'],
  '{"chemistry":"LiFePO4","capacity":"100Ah","voltage":"12.8V","cycles":">3000"}'::jsonb,
  null,
  true,
  true
),
(
  'b2000000-0000-4000-8000-000000000009',
  'a1000000-0000-4000-8000-000000000002',
  'Solar Power Station 500Wh',
  'solar-power-station-500wh',
  3200,
  'Portable power station with AC outlets and USB-C PD. Pair with a foldable panel for daytime top-ups.',
  'Plug-and-play backup for laptops, routers, and small appliances on the go.',
  9,
  array['/products/power-station.svg'],
  '{"capacity":"500Wh","ac_outlets":2,"usb_c_pd":"100W","solar_input":"up to 120W"}'::jsonb,
  'Portable',
  false,
  true
),
-- Phones (3)
(
  'b2000000-0000-4000-8000-000000000010',
  'a1000000-0000-4000-8000-000000000004',
  'iPhone 13 128GB',
  'iphone-13-128gb',
  6200,
  'Refurbished iPhone 13, IMEI checked, battery health verified, and sold with store warranty. Midnight finish.',
  'A reliable daily phone with Face ID, great camera, and parts we can support.',
  3,
  array['/products/iphone-13.svg'],
  '{"storage":"128GB","condition":"refurbished Grade A","colour":"Midnight","network":"unlocked","includes":["box","cable"]}'::jsonb,
  'IMEI checked',
  true,
  true
),
(
  'b2000000-0000-4000-8000-000000000011',
  'a1000000-0000-4000-8000-000000000004',
  'Samsung Galaxy A54 128GB',
  'samsung-a54-128gb',
  3800,
  'Refurbished Galaxy A54 with checked IMEI and healthy battery. Strong mid-range for WhatsApp, maps, and work apps.',
  'Android phone that lasts a full Lusaka day without drama.',
  5,
  array['/products/samsung-a54.svg'],
  '{"storage":"128GB","condition":"refurbished Grade A","colour":"Awesome Graphite","network":"dual SIM","includes":["box","charger"]}'::jsonb,
  'IMEI checked',
  true,
  true
),
(
  'b2000000-0000-4000-8000-000000000012',
  'a1000000-0000-4000-8000-000000000004',
  '25W USB-C Fast Charger',
  'usb-c-fast-charger-25w',
  180,
  'Official-spec 25W USB-C wall charger. Works with Samsung and most USB-C phones.',
  'Fast top-ups between meetings when power comes back.',
  35,
  array['/products/fast-charger.svg'],
  '{"output":"25W","port":"USB-C","cable":"1m USB-C included","compat":"USB-C phones"}'::jsonb,
  null,
  false,
  true
);

-- Phone units (serial/IMEI + battery + warranty)
insert into public.product_units (
  product_id, serial_or_imei, battery_health, imei_checked, warranty_months, status
) values
  ('b2000000-0000-4000-8000-000000000010', '356938101234567', 92, true, 3, 'available'),
  ('b2000000-0000-4000-8000-000000000010', '356938101234568', 88, true, 3, 'available'),
  ('b2000000-0000-4000-8000-000000000010', '356938101234569', 95, true, 3, 'available'),
  ('b2000000-0000-4000-8000-000000000011', '359872061112233', 90, true, 3, 'available'),
  ('b2000000-0000-4000-8000-000000000011', '359872061112234', 87, true, 3, 'available'),
  ('b2000000-0000-4000-8000-000000000011', '359872061112235', 94, true, 3, 'available'),
  ('b2000000-0000-4000-8000-000000000011', '359872061112236', 91, true, 3, 'available'),
  ('b2000000-0000-4000-8000-000000000011', '359872061112237', 89, true, 3, 'available');

-- Non-phone serials (optional tracking)
insert into public.product_units (
  product_id, serial_or_imei, battery_health, imei_checked, warranty_months, status
) values
  ('b2000000-0000-4000-8000-000000000007', 'INV-15K-88421', null, false, 12, 'available'),
  ('b2000000-0000-4000-8000-000000000008', 'LFP-100-44102', null, false, 24, 'available'),
  ('b2000000-0000-4000-8000-000000000009', 'PS500-22901', null, false, 12, 'available');

-- Approved reviews (product-linked + a couple general)
insert into public.reviews (product_id, author, rating, body, location, approved) values
  ('b2000000-0000-4000-8000-000000000001', 'Chipo M.', 5, 'Fan is quiet enough for the bedroom. Arrived same day to Woodlands.', 'Woodlands', true),
  ('b2000000-0000-4000-8000-000000000007', 'Joseph K.', 5, 'Inverter kept the fridge and Wi-Fi through a 6-hour cut. Setup help was clear.', 'Kabwata', true),
  ('b2000000-0000-4000-8000-000000000010', 'Mutale S.', 4, 'Battery at 92%, IMEI checked in front of me. Fair price for Lusaka.', 'Roma', true),
  ('b2000000-0000-4000-8000-000000000004', 'Grace N.', 5, 'Bought two surge guards after last storm fried a decoder. Wish I had them sooner.', 'Chelstone', true),
  ('b2000000-0000-4000-8000-000000000011', 'Brian T.', 5, 'A54 looks nearly new. Delivery to Makeni was quick.', 'Makeni', true),
  ('b2000000-0000-4000-8000-000000000006', 'Natasha P.', 4, 'Lamp kit saved homework night when power went mid-rain.', 'Kabulonga', true);

commit;
