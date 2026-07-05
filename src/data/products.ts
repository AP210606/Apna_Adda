/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Collection } from '../types';

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-electronics',
    title: 'Electronics',
    handle: 'electronics',
    description: 'Acoustic innovations, cinematic audio drivers, and intelligent appliances.',
    image: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      altText: 'Premium minimalist design headphones and gadgets'
    }
  },
  {
    id: 'col-mobile',
    title: 'Mobile Accessories',
    handle: 'mobile-accessories',
    description: 'Precision MagSafe docks, inductive pads, and micro braided power cords.',
    image: {
      url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
      altText: 'Minimalist smartphone charging stands and setups'
    }
  },
  {
    id: 'col-home',
    title: 'Home & Kitchen',
    handle: 'home-kitchen',
    description: 'Transform your habitat with items designed for peace, balance, and architectural beauty.',
    image: {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
      altText: 'Minimalist warm home interior decor with curated items'
    }
  },
  {
    id: 'col-beauty',
    title: 'Beauty & Personal Care',
    handle: 'beauty-personal-care',
    description: 'Organic jade stones, microcurrent therapies, and raw facial essentials.',
    image: {
      url: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=800&auto=format&fit=crop',
      altText: 'Minimalist organic beauty serums and accessories'
    }
  },
  {
    id: 'col-fashion',
    title: 'Fashion',
    handle: 'fashion',
    description: 'Heritage leather timers, carry-on canvas bags, and micro protective gear.',
    image: {
      url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
      altText: 'Neutral tone high-end apparel and leather accessories'
    }
  },
  {
    id: 'col-fitness',
    title: 'Fitness',
    handle: 'fitness',
    description: 'Ergonomic heavy skipping systems, cork balance boards, and smart logs.',
    image: {
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      altText: 'Sleek dark dumbbells and cork yoga mats in gym setup'
    }
  },
  {
    id: 'col-pets',
    title: 'Pets',
    handle: 'pets',
    description: 'Stoneware elevated pet bowls, memory foam pet caves, and minimal toys.',
    image: {
      url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop',
      altText: 'Minimalist pet accessories and cozy dog bed'
    }
  },
  {
    id: 'col-car',
    title: 'Car Accessories',
    handle: 'car-accessories',
    description: 'Airvent magsafe clamps, alloy dash organizers, and premium car diffuse blocks.',
    image: {
      url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop',
      altText: 'Sleek luxury car interior elements and phone mounts'
    }
  },
  {
    id: 'col-office',
    title: 'Office Essentials',
    handle: 'office-essentials',
    description: 'Milled aerospace aluminum desk panels and merino felt surface pads.',
    image: {
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
      altText: 'Metallic geometric blocks organizing sleek office desk'
    }
  },
  {
    id: 'col-trending',
    title: 'Trending Products',
    handle: 'trending-products',
    description: 'Viral dropshipping design trends that are taking over metropolitan India.',
    image: {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      altText: 'Red architectural design product display'
    }
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-soundbar',
    title: 'Aura Soundbar Companion',
    handle: 'aura-soundbar-companion',
    description: 'A masterpiece of auditory engineering. Designed to sit elegantly beneath desktop systems or home theater setups, the Aura Soundbar Companion projects a rich, immersive soundstage. Featuring dynamic spatial tuning and dual-passive radiator blocks, it marries pure aluminum grids with deep oak timber panels.',
    descriptionHtml: '<p>A masterpiece of auditory engineering. Designed to sit elegantly beneath desktop systems or home theater setups, the Aura Soundbar Companion projects a rich, immersive soundstage.</p><p>Featuring dynamic spatial tuning and dual-passive radiator blocks, it marries pure aluminum grids with deep oak timber panels.</p><ul><li>4-channel architectural acoustics</li><li>Bluetooth 5.3 Low-Latency & Optical Line-In</li><li>Solid structural Walnut/Oak frame</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop',
        altText: 'Premium wood paneled audio driver sitting on sleek timber table'
      },
      {
        url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1200&auto=format&fit=crop',
        altText: 'Rear panel showing brass physical dial knobs and inputs'
      }
    ],
    options: [
      { name: 'Finish', values: ['American Walnut', 'Siberian Birch'] }
    ],
    variants: [
      {
        id: 'var-soundbar-walnut',
        title: 'American Walnut',
        price: '14999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Finish', value: 'American Walnut' }]
      },
      {
        id: 'var-soundbar-birch',
        title: 'Siberian Birch',
        price: '13999.00',
        compareAtPrice: '16500.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Finish', value: 'Siberian Birch' }]
      }
    ],
    priceRange: { minVariantPrice: '13999.00', maxVariantPrice: '14999.00' },
    compareAtPriceRange: { minVariantPrice: '16500.00', maxVariantPrice: '16500.00' },
    availableForSale: true,
    tags: ['Audio', 'Soundbar', 'Speakers', 'Minimalist Tech', 'Premium'],
    collections: ['electronics', 'trending-products'],
    rating: 4.9,
    reviewsCount: 18,
    reviews: [
      {
        id: 'rev-sb-1',
        author: 'Rohan Sharma',
        rating: 5,
        title: 'Acoustic perfection meets art',
        comment: 'This is not just a soundbar; it is fine furniture. The Walnut casing aligns beautifully with my desktop setup. The sound profile is perfectly flat and balanced—not muddy like mainstream brands. Absolute stellar product.',
        date: '2026-06-11'
      }
    ],
    specifications: {
      'Frequency Response': '45Hz - 22,000Hz',
      'Drivers': '2 x 3-inch woven carbon fiber cones, 2 x silk dome tweeters',
      'Connectivity': 'Bluetooth 5.3 aptX, AUX 3.5mm, Toslink Optical, USB-C Audio',
      'Power Output': '80W RMS class-D amplified system',
      'Dimensions': '62cm x 9.5cm x 8cm'
    },
    isTrending: true,
    shippingInfo: 'Shipped in premium matte custom double-walled boxing with premium braided USB-C and optical cables. Free express shipping.'
  },
  {
    id: 'prod-headphones',
    title: 'Aether ANC Studio Headphones',
    handle: 'aether-anc-studio-headphones',
    description: 'Precision hybrid active noise-cancelling headphones tuned for accurate workspace focus. Crafted with architectural memory foam earcups wrapped in premium breathable mesh, and sandblasted anodized aluminum headband rails. Features ultra-low latency spatial audio for immersive deep work sessions.',
    descriptionHtml: '<p>Precision hybrid active noise-cancelling headphones tuned for accurate workspace focus. Crafted with architectural memory foam earcups wrapped in premium breathable mesh, and sandblasted anodized aluminum headband rails.</p><ul><li>45dB hybrid adaptive noise cancellation</li><li>40-hour deep battery with speed charging</li><li>High-fidelity dynamic 40mm beryllium coated drivers</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
        altText: 'Premium matte black studio headphones'
      }
    ],
    options: [
      { name: 'Color', values: ['Cosmic Charcoal', 'Alabaster White'] }
    ],
    variants: [
      {
        id: 'var-headphone-charcoal',
        title: 'Cosmic Charcoal',
        price: '8999.00',
        compareAtPrice: '11999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color', value: 'Cosmic Charcoal' }]
      },
      {
        id: 'var-headphone-white',
        title: 'Alabaster White',
        price: '8999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color', value: 'Alabaster White' }]
      }
    ],
    priceRange: { minVariantPrice: '8999.00', maxVariantPrice: '8999.00' },
    compareAtPriceRange: { minVariantPrice: '11999.00', maxVariantPrice: '11999.00' },
    availableForSale: true,
    tags: ['Audio', 'Headphones', 'ANC', 'Workplace', 'Wireless'],
    collections: ['electronics'],
    rating: 4.8,
    reviewsCount: 42,
    reviews: [
      {
        id: 'rev-hp-1',
        author: 'Nikhil Mehta',
        rating: 5,
        title: 'Incredible focus booster',
        comment: 'The hybrid ANC is absolute magic. Cuts out the hum of ceiling fans and AC units instantly. Bass is punchy but balanced. Highly recommended for coders.',
        date: '2026-06-22'
      }
    ],
    specifications: {
      'ANC Rating': 'Up to 45dB adaptive hybrid',
      'Battery Life': '40 hours (ANC on) | 55 hours (ANC off)',
      'Drivers': '40mm custom Beryllium diaphragms',
      'Weight': '250 grams',
      'Bluetooth Protocol': 'Version 5.4 with multipoint pairing'
    },
    isBestSeller: true,
    shippingInfo: 'Includes travel hardshell canvas case, braided USB-C cable, and premium 3.5mm line-out adapter.'
  },
  {
    id: 'prod-magsafe-charger',
    title: 'Orbit MagSafe Wireless Charger',
    handle: 'orbit-magsafe-wireless-charger',
    description: 'A weighted geometric desktop wireless charging dock milled from solid alloy with a tactile sandblasted finish. Heavy non-slip silicone backing keeps the stand rooted firmly on your workspace, while dual neodymium magnetic arrays ensure flawless smartphone orientation. Supports 15W Qi2 wireless charging standards.',
    descriptionHtml: '<p>A weighted geometric desktop wireless charging dock milled from solid alloy with a tactile sandblasted finish. Heavy non-slip silicone backing keeps the stand rooted firmly on your workspace.</p><ul><li>True Qi2 15W rapid wireless magnetic charge</li><li>Machined solid block aluminum construction</li><li>Dual orientation viewing (horizontal or vertical)</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1200&auto=format&fit=crop',
        altText: 'Weighted aluminum magsafe desktop charger'
      }
    ],
    options: [
      { name: 'Color', values: ['Nordic Slate', 'Obsidian Black'] }
    ],
    variants: [
      {
        id: 'var-magsafe-slate',
        title: 'Nordic Slate',
        price: '2499.00',
        compareAtPrice: '3499.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color', value: 'Nordic Slate' }]
      },
      {
        id: 'var-magsafe-black',
        title: 'Obsidian Black',
        price: '2499.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color', value: 'Obsidian Black' }]
      }
    ],
    priceRange: { minVariantPrice: '2499.00', maxVariantPrice: '2499.00' },
    compareAtPriceRange: { minVariantPrice: '3499.00', maxVariantPrice: '3499.00' },
    availableForSale: true,
    tags: ['MagSafe', 'Charger', 'Power', 'Minimalist Tech', 'Dock'],
    collections: ['mobile-accessories', 'trending-products'],
    rating: 4.7,
    reviewsCount: 31,
    reviews: [
      {
        id: 'rev-ms-1',
        author: 'Arjun Sen',
        rating: 5,
        title: 'Very premium and heavy',
        comment: 'This is heavy enough that you can pick your phone up with one hand without the dock lifting. Magnetic hold is super solid. Worth the premium over plastic chargers.',
        date: '2026-06-29'
      }
    ],
    specifications: {
      'Protocol': 'Qi2 Certified & MagSafe compatible',
      'Power Input': 'Requires 20W PD adapter or higher',
      'Power Output': '5W / 7.5W / 10W / 15W adaptive charge',
      'Material': '6000-series anodized aluminum with matte silicone grip pad',
      'Weight': '380 grams'
    },
    isTrending: true,
    shippingInfo: 'Requires USB-C wall adapter (not included). Packaged in custom recyclable organic pulped box.'
  },
  {
    id: 'prod-vase',
    title: 'Solitude Ceramic Vase',
    handle: 'solitude-ceramic-vase',
    description: 'Crafted by master artisans over seven days, the Solitude Ceramic Vase boasts a textured, volcanic sand finish that catches the light in organic ways. Its organic, asymmetrical silhouette is designed to stand alone as a sculpture or elevate simple dried botanicals.',
    descriptionHtml: '<p>Crafted by master artisans over seven days, the Solitude Ceramic Vase boasts a textured, volcanic sand finish that catches the light in organic ways.</p><p>Its organic, asymmetrical silhouette is designed to stand alone as a sculpture or elevate simple dried botanicals.</p><ul><li>Artisanal volcanic sand stoneware</li><li>Waterproof sealed interior</li><li>Responsibly sourced materials</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=1200&auto=format&fit=crop',
        altText: 'Off-white chalk ceramic vase standing in soft light'
      },
      {
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop',
        altText: 'Close up of volcanic sand texture on ceramic'
      }
    ],
    options: [
      { name: 'Color', values: ['Chalk White', 'Sienna Clay', 'Charcoal Smoke'] },
      { name: 'Size', values: ['Medium', 'Large'] }
    ],
    variants: [
      {
        id: 'var-vase-white-m',
        title: 'Chalk White / Medium',
        price: '2499.00',
        compareAtPrice: '3200.00',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Chalk White' },
          { name: 'Size', value: 'Medium' }
        ],
        image: {
          url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800&auto=format&fit=crop',
          altText: 'Medium Chalk White Ceramic Vase'
        }
      },
      {
        id: 'var-vase-white-l',
        title: 'Chalk White / Large',
        price: '3499.00',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Chalk White' },
          { name: 'Size', value: 'Large' }
        ],
        image: {
          url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800&auto=format&fit=crop',
          altText: 'Large Chalk White Ceramic Vase'
        }
      },
      {
        id: 'var-vase-sienna-m',
        title: 'Sienna Clay / Medium',
        price: '2499.00',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Sienna Clay' },
          { name: 'Size', value: 'Medium' }
        ],
        image: {
          url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
          altText: 'Medium Sienna Clay Vase'
        }
      },
      {
        id: 'var-vase-sienna-l',
        title: 'Sienna Clay / Large',
        price: '3499.00',
        availableForSale: false,
        selectedOptions: [
          { name: 'Color', value: 'Sienna Clay' },
          { name: 'Size', value: 'Large' }
        ],
        image: {
          url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
          altText: 'Large Sienna Clay Vase'
        }
      },
      {
        id: 'var-vase-charcoal-m',
        title: 'Charcoal Smoke / Medium',
        price: '2699.00',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Charcoal Smoke' },
          { name: 'Size', value: 'Medium' }
        ]
      },
      {
        id: 'var-vase-charcoal-l',
        title: 'Charcoal Smoke / Large',
        price: '3699.00',
        availableForSale: true,
        selectedOptions: [
          { name: 'Color', value: 'Charcoal Smoke' },
          { name: 'Size', value: 'Large' }
        ]
      }
    ],
    priceRange: { minVariantPrice: '2499.00', maxVariantPrice: '3699.00' },
    compareAtPriceRange: { minVariantPrice: '3200.00', maxVariantPrice: '3200.00' },
    availableForSale: true,
    tags: ['Vase', 'Ceramic', 'Home', 'Decor', 'Artisanal'],
    collections: ['home-kitchen'],
    rating: 4.8,
    reviewsCount: 34,
    reviews: [
      {
        id: 'rev-vase-1',
        author: 'Arjun Mehta',
        rating: 5,
        title: 'Stunning centerpiece',
        comment: 'The volcanic texture is even more striking in person. It has a beautiful weight to it and works wonderfully as a standalone sculptural element on my bookshelf.',
        date: '2026-06-15'
      },
      {
        id: 'rev-vase-2',
        author: 'Ananya Roy',
        rating: 4,
        title: 'Beautiful but texture is rough',
        comment: 'Beautiful minimalist silhouette. Be careful on glass surfaces because the bottom ceramic texture is quite raw and could scratch if dragged. Highly recommend placing a felt pad under it.',
        date: '2026-06-20'
      }
    ],
    specifications: {
      'Material': 'High-fire volcanic stoneware',
      'Origin': 'Handcrafted in Jaipur, India',
      'Weight': 'Medium: 1.2kg | Large: 2.1kg',
      'Dimensions': 'Medium: 22cm x 14cm | Large: 32cm x 18cm',
      'Waterproof': 'Yes, fully glazed interior'
    },
    isBestSeller: true,
    shippingInfo: 'Packaged in custom biodegradable high-density structural foam molds. Ships within 2-3 business days across India.',
    returnPolicy: 'Due to the fragile handcrafted nature, returns are accepted within 7 days in original, unused packaging.'
  },
  {
    id: 'prod-throw',
    title: 'Ascent Australian Wool Throw',
    handle: 'ascent-wool-throw',
    description: 'Weaved from pure organic Australian Merino fibers, the Ascent Throw features an architectural grid line-work pattern. Heavyweight yet exceptionally breathable, it adds a warm, tactile layering to any minimalist lounge or bedding scene.',
    descriptionHtml: '<p>Weaved from pure organic Australian Merino fibers, the Ascent Throw features an architectural grid line-work pattern.</p><p>Heavyweight yet exceptionally breathable, it adds a warm, tactile layering to any minimalist lounge or bedding scene.</p><ul><li>100% superfine Merino wool</li><li>Architectural flat jacquard knit</li><li>Naturally hypoallergenic and climate-regulating</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=1200&auto=format&fit=crop',
        altText: 'Woven organic neutral tone wool throw blanket folded neatly'
      }
    ],
    options: [
      { name: 'Color Way', values: ['Sand & Oatmeal', 'Cobalt & Slate'] }
    ],
    variants: [
      {
        id: 'var-throw-sand',
        title: 'Sand & Oatmeal',
        price: '4899.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color Way', value: 'Sand & Oatmeal' }]
      },
      {
        id: 'var-throw-cobalt',
        title: 'Cobalt & Slate',
        price: '4999.00',
        compareAtPrice: '5999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color Way', value: 'Cobalt & Slate' }]
      }
    ],
    priceRange: { minVariantPrice: '4899.00', maxVariantPrice: '4999.00' },
    compareAtPriceRange: { minVariantPrice: '5999.00', maxVariantPrice: '5999.00' },
    availableForSale: true,
    tags: ['Textiles', 'Throw Blanket', 'Wool', 'Home Decor'],
    collections: ['home-kitchen'],
    rating: 4.6,
    reviewsCount: 15,
    reviews: [
      {
        id: 'rev-thr-1',
        author: 'Priyah Singh',
        rating: 5,
        title: 'Incredibly soft and cozy',
        comment: 'This has become the center of our living room. It does not scratch at all like synthetic mixtures. The color sand match is extremely pure.',
        date: '2026-06-02'
      }
    ],
    specifications: {
      'Composition': '100% Pure Superfine Merino Wool (21 microns)',
      'Weave Pattern': 'Bespoke architectural flat jacquard',
      'Weight': '920 grams dry weight',
      'Dimensions': '140cm x 190cm (excluding hand-knotted fringe)'
    },
    isTrending: false,
    shippingInfo: 'Ships in bespoke protective organic linen storage bags with natural cedar block anti-moth bars.'
  },
  {
    id: 'prod-face-roller',
    title: 'Soma Quartz Face Roller Set',
    handle: 'soma-quartz-face-roller-gua-sha-set',
    description: 'An premium, double-sided crystalline quartz lymphatic drainage roller paired with a sculpted heart-shaped Gua Sha scraping board. Meticulously cut from grade-A, ethically sourced crystalline quartz blocks. Crafted with noise-free silicone dampers for a completely silent, therapeutic glide.',
    descriptionHtml: '<p>An premium, double-sided crystalline quartz lymphatic drainage roller paired with a sculpted heart-shaped Gua Sha scraping board.</p><ul><li>100% genuine crystalline high-grade rose quartz</li><li>Bespoke silent glide silicone noise protection rings</li><li>Helps ease facial tension, puffiness, and supports serum absorption</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=1200&auto=format&fit=crop',
        altText: 'Genuine rose quartz roller on minimalist marble backdrop'
      }
    ],
    options: [
      { name: 'Crystal Type', values: ['Rose Quartz', 'Siberian Jade'] }
    ],
    variants: [
      {
        id: 'var-roller-quartz',
        title: 'Rose Quartz',
        price: '1899.00',
        compareAtPrice: '2499.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Crystal Type', value: 'Rose Quartz' }]
      },
      {
        id: 'var-roller-jade',
        title: 'Siberian Jade',
        price: '1999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Crystal Type', value: 'Siberian Jade' }]
      }
    ],
    priceRange: { minVariantPrice: '1899.00', maxVariantPrice: '1999.00' },
    compareAtPriceRange: { minVariantPrice: '2499.00', maxVariantPrice: '2499.00' },
    availableForSale: true,
    tags: ['Beauty', 'Skincare', 'Roller', 'Gua Sha', 'Selfcare'],
    collections: ['beauty-personal-care'],
    rating: 4.5,
    reviewsCount: 26,
    reviews: [
      {
        id: 'rev-fr-1',
        author: 'Meera Patel',
        rating: 5,
        title: 'Incredibly therapeutic',
        comment: 'I put mine in the skincare fridge before using it. The cooling sensation coupled with the smooth rolling action is spectacular after long days in front of screens.',
        date: '2026-06-18'
      }
    ],
    specifications: {
      'Stone Grade': 'Grade-A natural quartz/jade crystals (chemical free)',
      'Frame Composition': 'Heavy duty zinc alloy in rose gold finish',
      'Glide dampers': 'Integrated vibration-free silicone caps',
      'Box Dimensions': '18cm x 12cm x 4.5cm deluxe padded tray'
    },
    shippingInfo: 'Shipped in velvet-lined structural magnetic presentation boxes.'
  },
  {
    id: 'prod-chronometer',
    title: 'Orbit Horizon Chronometer',
    handle: 'orbit-horizon-chronometer',
    description: 'A monument to modern horology. Built with sandblasted surgical stainless steel, the Orbit Horizon dial features a sweeping automatic mechanical movement and a bespoke multi-layer dark face that replicates the curvature of the horizon. Paired with a top-grain Italian full-aniline leather strap.',
    descriptionHtml: '<p>A monument to modern horology. Built with sandblasted surgical stainless steel, the Orbit Horizon dial features a sweeping automatic mechanical movement and a bespoke multi-layer dark face that replicates the curvature of the horizon.</p><ul><li>Automatic sweeping mechanics (no battery)</li><li>Double-dome anti-reflective sapphire glass</li><li>Vegetable-tanned full-grain aniline leather</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1200&auto=format&fit=crop',
        altText: 'Silver steel chronometer watch with brown top grain leather strap'
      },
      {
        url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop',
        altText: 'Watch on a dark minimal wrist setting close up'
      }
    ],
    options: [
      { name: 'Strap Color', values: ['Vachetta Tan', 'Noir Black', 'Forest Slate'] }
    ],
    variants: [
      {
        id: 'var-watch-tan',
        title: 'Vachetta Tan',
        price: '11999.00',
        compareAtPrice: '14999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Strap Color', value: 'Vachetta Tan' }]
      },
      {
        id: 'var-watch-noir',
        title: 'Noir Black',
        price: '11999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Strap Color', value: 'Noir Black' }]
      },
      {
        id: 'var-watch-forest',
        title: 'Forest Slate',
        price: '12499.00',
        availableForSale: false,
        selectedOptions: [{ name: 'Strap Color', value: 'Forest Slate' }]
      }
    ],
    priceRange: { minVariantPrice: '11999.00', maxVariantPrice: '12499.00' },
    compareAtPriceRange: { minVariantPrice: '14999.00', maxVariantPrice: '14999.00' },
    availableForSale: true,
    tags: ['Watches', 'Accessories', 'Leather', 'Premium Wear', 'Classic'],
    collections: ['fashion', 'trending-products'],
    rating: 4.7,
    reviewsCount: 22,
    reviews: [
      {
        id: 'rev-watch-1',
        author: 'Vikram Joshi',
        rating: 5,
        title: 'Sublime craft',
        comment: 'The sweeping mechanical movement is completely silent and incredibly satisfying to watch. The double-dome sapphire lens has almost zero glare. Well worth the price.',
        date: '2026-05-30'
      }
    ],
    specifications: {
      'Movement': 'Miyota 9015 Automatic sweep-second mechanics',
      'Case Diameter': '39mm surgical sandblasted steel',
      'Case Thickness': '10.2mm profile',
      'Strap Material': 'Top-grain vegetable-tanned aniline cowhide',
      'Water Resistance': '5 ATM (50 Meters)'
    },
    isBestSeller: true,
    shippingInfo: 'Packaged in premium leather presentation travel rolls with solid steel buckle accents. Includes 2-year warranty card.'
  },
  {
    id: 'prod-duffle',
    title: 'Nomad Canvas Weekend Duffle',
    handle: 'nomad-canvas-weekend-duffle',
    description: 'An architectural weekend travel bag crafted from heavy-density water-resistant organic cotton duck canvas and reinforced with premium full-grain vachetta leather straps. Features custom brass sand-cast luggage clasps, dynamic side button extensions, and a water-resistant interior lining.',
    descriptionHtml: '<p>An architectural weekend travel bag crafted from heavy-density water-resistant organic cotton duck canvas and reinforced with premium full-grain vachetta leather straps.</p><ul><li>24oz water-repellent organic cotton duck canvas</li><li>Grade-A solid brass hardware</li><li>Dedicated ventilated shoe compartment</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
        altText: 'Premium canvas and leather travel dapple on wood floor'
      }
    ],
    options: [
      { name: 'Color Way', values: ['Olive Drab', 'Desert Sand'] }
    ],
    variants: [
      {
        id: 'var-duffle-olive',
        title: 'Olive Drab',
        price: '4500.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color Way', value: 'Olive Drab' }]
      },
      {
        id: 'var-duffle-sand',
        title: 'Desert Sand',
        price: '4500.00',
        compareAtPrice: '5200.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color Way', value: 'Desert Sand' }]
      }
    ],
    priceRange: { minVariantPrice: '4500.00', maxVariantPrice: '4500.00' },
    compareAtPriceRange: { minVariantPrice: '5200.00', maxVariantPrice: '5200.00' },
    availableForSale: true,
    tags: ['Travel Bags', 'Canvas', 'Fashion', 'Luggage', 'Unisex'],
    collections: ['fashion'],
    rating: 4.6,
    reviewsCount: 14,
    reviews: [
      {
        id: 'rev-df-1',
        author: 'Rishi Sen',
        rating: 5,
        title: 'Flawless proportions',
        comment: 'Fits comfortably in cabin overhead containers on Indigo flights. The canvas has a beautiful heavy wax feel to it. Absolute dropshipping masterstroke.',
        date: '2026-06-03'
      }
    ],
    specifications: {
      'Volume Capacity': '45 Liters',
      'Canvas Density': '24oz double-fill heavy cotton duck',
      'Hardware': 'Solid brass alloy with antique sand-casting',
      'Dimensions': '52cm x 28cm x 26cm',
      'Weight': '1.35 kilograms empty'
    },
    shippingInfo: 'Packed in protective muslin dust covers. Standard 3-day premium transit across India.'
  },
  {
    id: 'prod-jump-rope',
    title: 'Vertex Smart Weighted Jump Rope',
    handle: 'vertex-smart-weighted-jump-rope',
    description: 'An advanced speed jump rope with interchangeable hollow core handles, custom load blocks, and a micro high-precision fluid-rotation bearing axis. Connected to a bright, hidden-LED status grid in the handle bar that synchronizes rotations and cardio loops to your device.',
    descriptionHtml: '<p>An advanced speed jump rope with interchangeable hollow core handles, custom load blocks, and a micro high-precision fluid-rotation bearing axis.</p><ul><li>Dual-axis 360-degree fluid stainless steel bearing systems</li><li>LED digital count tracker built directly into polymer grips</li><li>Weighted modular load bars (100g and 200g inserts)</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
        altText: 'Smart sports skipping rope next to dumbbells'
      }
    ],
    options: [
      { name: 'Edition', values: ['Standard Black', 'Gold Edition'] }
    ],
    variants: [
      {
        id: 'var-rope-black',
        title: 'Standard Black',
        price: '1599.00',
        compareAtPrice: '2299.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Edition', value: 'Standard Black' }]
      },
      {
        id: 'var-rope-gold',
        title: 'Gold Edition',
        price: '1899.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Edition', value: 'Gold Edition' }]
      }
    ],
    priceRange: { minVariantPrice: '1599.00', maxVariantPrice: '1899.00' },
    compareAtPriceRange: { minVariantPrice: '2299.00', maxVariantPrice: '2299.00' },
    availableForSale: true,
    tags: ['Fitness', 'Workout', 'Jump Rope', 'Smart Gym', 'Cardio'],
    collections: ['fitness'],
    rating: 4.4,
    reviewsCount: 19,
    reviews: [
      {
        id: 'rev-jr-1',
        author: 'Kunal Kapoor',
        rating: 4,
        title: 'Very smooth rotation',
        comment: 'Bearings spin absolutely forever. LED count matches physical reps exactly. Very modern way to skip.',
        date: '2026-06-25'
      }
    ],
    specifications: {
      'Bearings': 'Double grade-A professional ABEC-9 fluid balls',
      'Cable Length': '3.0 meters (fully customizable with alloy clips)',
      'Digital Battery': 'Rechargeable Li-Po via USB-C (approx. 25 hours usage)',
      'Core Handle Material': 'Anodized alloy sleeves with tactile grooved wraps'
    },
    shippingInfo: 'Includes custom nylon mesh drawstring pouch and interchangeable 3mm and 4.5mm steel cables.'
  },
  {
    id: 'prod-pet-bowl',
    title: 'Nook Ceramic Elevated Pet Bowl',
    handle: 'nook-ceramic-elevated-pet-bowl',
    description: 'An elegant, posture-correcting elevated pet dining system featuring a premium high-density heavy ceramic bowl resting on a minimalist sculptural wooden frame. Designed in a modular profile that facilitates easy cleaning and prevents spinal strain for cats and small dogs.',
    descriptionHtml: '<p>An elegant, posture-correcting elevated pet dining system featuring a premium high-density heavy ceramic bowl resting on a minimalist sculptural wooden frame.</p><ul><li>High-fire organic ceramic bowl, 100% dishwasher safe</li><li>Raised 12cm geometric support base for neck strain prevention</li><li>Heavy stable wooden frame prevents spills and sliding</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200&auto=format&fit=crop',
        altText: 'Ceramic pet bowl in modern aesthetic living room'
      }
    ],
    options: [
      { name: 'Color Way', values: ['Cream White', 'Moss Green'] }
    ],
    variants: [
      {
        id: 'var-bowl-white',
        title: 'Cream White',
        price: '1299.00',
        compareAtPrice: '1899.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color Way', value: 'Cream White' }]
      },
      {
        id: 'var-bowl-green',
        title: 'Moss Green',
        price: '1299.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Color Way', value: 'Moss Green' }]
      }
    ],
    priceRange: { minVariantPrice: '1299.00', maxVariantPrice: '1299.00' },
    compareAtPriceRange: { minVariantPrice: '1899.00', maxVariantPrice: '1899.00' },
    availableForSale: true,
    tags: ['Pets', 'Pet Food', 'Bowl', 'Stoneware', 'Dog Cat'],
    collections: ['pets'],
    rating: 4.8,
    reviewsCount: 12,
    reviews: [
      {
        id: 'rev-pb-1',
        author: 'Sanjana Roy',
        rating: 5,
        title: 'Perfect for my Persian cat',
        comment: 'My cat was vomiting after meals occasionally, this elevated bowl completely stopped that. Plus it actually looks like luxury decor on my floor rather than ugly plastic bowls.',
        date: '2026-06-12'
      }
    ],
    specifications: {
      'Bowl Material': '1300-degree high-fire vitreous ceramic stoneware',
      'Frame Base': 'Sustainable FSC certified rubberwood with water-resistant glaze',
      'Capacity': '450 ml food / water volume',
      'Total Elevation': '12.5 cm total feeding height'
    },
    shippingInfo: 'Custom double boxed packaging with expanded cardboard safeguards.'
  },
  {
    id: 'prod-car-mount',
    title: 'Halo MagSafe Smart Car Mount',
    handle: 'halo-magsafe-smart-car-mount',
    description: 'A revolutionary active airvent and dashboard smartphone mount equipped with high-performance N52 neodymium magnetic halos and a rigid, zero-rattle stabilizing strut. Custom milled aluminum face with a soft-touch matte silicone protective bumper.',
    descriptionHtml: '<p>A revolutionary active airvent and dashboard smartphone mount equipped with high-performance N52 neodymium magnetic halos and a rigid, zero-rattle stabilizing strut.</p><ul><li>Extra strong N52 military-grade magnetic pull</li><li>Machined ball-head for infinite angle control</li><li>Zero-noise physical stabilizer bar prevents vent drooping</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
        altText: 'Sleek aluminum smartphone car mount on airvent'
      }
    ],
    options: [
      { name: 'Mount Type', values: ['Airvent Clamp', 'Suction Arm'] }
    ],
    variants: [
      {
        id: 'var-mount-vent',
        title: 'Airvent Clamp',
        price: '1999.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Mount Type', value: 'Airvent Clamp' }]
      },
      {
        id: 'var-mount-suction',
        title: 'Suction Arm',
        price: '2199.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Mount Type', value: 'Suction Arm' }]
      }
    ],
    priceRange: { minVariantPrice: '1999.00', maxVariantPrice: '2199.00' },
    availableForSale: true,
    tags: ['Car Accessories', 'MagSafe', 'Phone Mount', 'Dashboard', 'Travel'],
    collections: ['car-accessories'],
    rating: 4.6,
    reviewsCount: 23,
    reviews: [
      {
        id: 'rev-cm-1',
        author: 'Piyush Desai',
        rating: 5,
        title: 'Stays completely still',
        comment: 'Driving on Mumbai potholes is the ultimate test. My iPhone 15 Pro Max did not move a single millimeter. Outstanding clamp mechanism.',
        date: '2026-07-02'
      }
    ],
    specifications: {
      'Magnet Grade': '16 x N52 high-grade industrial magnets (supports up to 1.8kg load)',
      'Strut Support': 'Telescopic stabilizing kickstand with soft rubber caps',
      'Chassis': 'Milled CNC 6000 aircraft aluminum',
      'Compatibility': 'MagSafe casings or direct raw Apple/Samsung backs'
    },
    shippingInfo: 'Includes premium 3M adhesive pad extensions and 12-month replacement warrant card.'
  },
  {
    id: 'prod-monolith',
    title: 'Monolith Desk Organizer',
    handle: 'monolith-desk-organizer',
    description: 'An elegant statement piece milled from a single block of anodized space-grade aerospace aluminum. Featuring dynamic, high-strength magnetic dividers and soft microsuede slots, the Monolith consolidates all modern tools into one absolute architectural block.',
    descriptionHtml: '<p>An elegant statement piece milled from a single block of anodized space-grade aerospace aluminum.</p><p>Featuring dynamic, high-strength magnetic dividers and soft microsuede slots, the Monolith consolidates all modern tools into one absolute architectural block.</p>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop',
        altText: 'Metallic geometric blocks organizing sleek pencils and device docks'
      }
    ],
    options: [
      { name: 'Anodization', values: ['Space Gray', 'Chalk Silver'] }
    ],
    variants: [
      {
        id: 'var-mon-gray',
        title: 'Space Gray',
        price: '3800.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Anodization', value: 'Space Gray' }]
      },
      {
        id: 'var-mon-silver',
        title: 'Chalk Silver',
        price: '3800.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Anodization', value: 'Chalk Silver' }]
      }
    ],
    priceRange: { minVariantPrice: '3800.00', maxVariantPrice: '3800.00' },
    availableForSale: true,
    tags: ['Workspace', 'Desk Setup', 'Minimalist Tech', 'Aluminum'],
    collections: ['office-essentials', 'trending-products'],
    rating: 4.8,
    reviewsCount: 11,
    reviews: [
      {
        id: 'rev-mon-1',
        author: 'Dhruv Kapoor',
        rating: 5,
        title: 'A work of structural art',
        comment: 'Incredibly heavy base, does not slip an inch on my solid wood desk. The magnetic click of dividers is ridiculously satisfying.',
        date: '2026-06-25'
      }
    ],
    specifications: {
      'Material': '6061-T6 Aerospace Anodized Aluminum',
      'Dividers': '4 x neodymium high-grade slide bars',
      'Base': 'Custom high-density non-marking silicone backing',
      'Weight': '1.4 kilograms',
      'Dimensions': '300mm x 90mm x 35mm'
    },
    isFlashDeal: true,
    flashDealDiscount: 20, // 20% off
    shippingInfo: 'Ships securely in high-density paper pulp molds with matte details. Standard 3-day delivery.'
  },
  {
    id: 'prod-desk-pad',
    title: 'Aero Ergonomic Felt Desk Pad',
    handle: 'aero-ergonomic-felt-desk-pad',
    description: 'Create structure on your desk workspace with this thick, premium pressed Merino wool felt desk pad. Features an anti-skid biological cork base overlay and precision stitched seam borders. Designed to protect your timber desk while providing acoustic damping and a warm tactile surface for hands and devices.',
    descriptionHtml: '<p>Create structure on your desk workspace with this thick, premium pressed Merino wool felt desk pad. Features an anti-skid biological cork base overlay and precision stitched seam borders.</p><ul><li>100% genuine pressed German Merino wool felt (5mm thick)</li><li>Organic biological anti-slip cork bottom lining</li><li>Muted acoustic properties dampens key clicks</li></ul>',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200&auto=format&fit=crop',
        altText: 'Dark gray pressed felt desk pad with sleek mouse and mechanical keyboard'
      }
    ],
    options: [
      { name: 'Size', values: ['Medium', 'Large'] }
    ],
    variants: [
      {
        id: 'var-deskpad-med',
        title: 'Medium',
        price: '1499.00',
        compareAtPrice: '2199.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: 'Medium' }]
      },
      {
        id: 'var-deskpad-large',
        title: 'Large',
        price: '1899.00',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: 'Large' }]
      }
    ],
    priceRange: { minVariantPrice: '1499.00', maxVariantPrice: '1899.00' },
    compareAtPriceRange: { minVariantPrice: '2199.00', maxVariantPrice: '2199.00' },
    availableForSale: true,
    tags: ['Workspace', 'Desk Setup', 'Felt Pad', 'Office', 'Wool'],
    collections: ['office-essentials'],
    rating: 4.7,
    reviewsCount: 14,
    reviews: [
      {
        id: 'rev-dp-1',
        author: 'Swati Sen',
        rating: 5,
        title: 'Absolute premium setup',
        comment: 'Completely changed the look of my WFH office desk. It dampens keyboard sound beautifully and feels extremely soft under my wrists. Highly recommended.',
        date: '2026-06-19'
      }
    ],
    specifications: {
      'Composition': '85% Pressed Merino Wool Felt | 15% biological wood cork lining',
      'Thickness': '5.0 mm thick triple-pressed profiling',
      'Dimensions': 'Medium: 60cm x 30cm | Large: 90cm x 40cm',
      'Anti-fraying': 'Precision perimeter locks stitching stitches'
    },
    shippingInfo: 'Shipped rolled in robust spiral cardboard tubes. Lies completely flat after 24 hours of decompression.'
  }
];
