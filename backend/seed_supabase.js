const { Client } = require('pg');
const argon2 = require('argon2');
const crypto = require('crypto');

// Supabase PostgreSQL Configuration
const client = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.shavgttipitgwhmafocn',
  password: 'Sih2026almsproject',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const ENCRYPTION_KEY_HEX = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const keyBuffer = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]);
}

async function seed() {
  console.log(' Connecting to Supabase PostgreSQL...');
  await client.connect();
  console.log(' Connected to Supabase!');

  // Begin Transaction
  await client.query('BEGIN');

  try {
    console.log(' Cleaning existing mock seed data...');
    // Clean up dependent tables
    await client.query('DELETE FROM seo_metadata');
    await client.query('DELETE FROM product_media');
    await client.query('DELETE FROM product_attributes');
    await client.query('DELETE FROM quotes');
    await client.query('DELETE FROM rfq_matches');
    await client.query('DELETE FROM rfqs');
    await client.query('DELETE FROM reviews');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM trust_events');
    await client.query('DELETE FROM trust_scores');
    await client.query('DELETE FROM artisan_verifications');
    await client.query('DELETE FROM artisan_profiles');
    await client.query('DELETE FROM buyer_verifications');
    await client.query('DELETE FROM buyer_profiles');
    await client.query('DELETE FROM refresh_tokens');
    await client.query('DELETE FROM users WHERE email LIKE \'%@alms.in\' OR email LIKE \'%@fabindia.com\' OR email LIKE \'%@trent-tata.com\' OR email LIKE \'%@goodearth.in\'');

    const defaultPasswordHash = await argon2.hash('Password123!', { type: argon2.argon2id });

    // 1. SEED USERS & ARTISANS
    console.log(' Seeding Master Artisans and Buyers into Supabase...');

    const artisansData = [
      {
        email: 'artisan.bastar@alms.in',
        fullName: 'Rajan Sutar Collective',
        state: 'Chhattisgarh',
        district: 'Kondagaon',
        primaryCraft: 'Bastar Dokra Metal Art',
        trustScore: 96,
        monthlyCapacity: 120,
        leadTime: 15
      },
      {
        email: 'artisan.mithila@alms.in',
        fullName: 'Shanti Devi Mithila Guild',
        state: 'Bihar',
        district: 'Madhubani',
        primaryCraft: 'Madhubani Painting',
        trustScore: 98,
        monthlyCapacity: 60,
        leadTime: 18
      },
      {
        email: 'artisan.jaipur@alms.in',
        fullName: 'Kripal Kumbh Heritage Pottery',
        state: 'Rajasthan',
        district: 'Jaipur',
        primaryCraft: 'Jaipur Blue Pottery',
        trustScore: 94,
        monthlyCapacity: 180,
        leadTime: 12
      },
      {
        email: 'artisan.kanchipuram@alms.in',
        fullName: 'Meenakshi Handloom Society',
        state: 'Tamil Nadu',
        district: 'Kanchipuram',
        primaryCraft: 'Kancheepuram Silk',
        trustScore: 99,
        monthlyCapacity: 45,
        leadTime: 25
      },
      {
        email: 'artisan.kashmir@alms.in',
        fullName: 'Mirza Ghulam Pashmina Artisans',
        state: 'Jammu & Kashmir',
        district: 'Srinagar',
        primaryCraft: 'Pashmina',
        trustScore: 97,
        monthlyCapacity: 50,
        leadTime: 30
      },
      {
        email: 'artisan.warli@alms.in',
        fullName: 'Jivya Soma Warli Collective',
        state: 'Maharashtra',
        district: 'Palghar',
        primaryCraft: 'Warli Painting',
        trustScore: 95,
        monthlyCapacity: 90,
        leadTime: 10
      },
      {
        email: 'artisan.bidar@alms.in',
        fullName: 'Ustad Bilal Heritage Bidriware',
        state: 'Karnataka',
        district: 'Bidar',
        primaryCraft: 'Bidriware',
        trustScore: 96,
        monthlyCapacity: 110,
        leadTime: 14
      },
      {
        email: 'artisan.lucknow@alms.in',
        fullName: 'Noor Jahan Chikan Karigari',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        primaryCraft: 'Chikankari',
        trustScore: 95,
        monthlyCapacity: 250,
        leadTime: 14
      }
    ];

    const artisanMap = {};

    for (const a of artisansData) {
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role, status, language_pref)
         VALUES ($1, $2, 'ARTISAN', 'ACTIVE', 'hi')
         RETURNING id`,
        [a.email, defaultPasswordHash]
      );
      const userId = userRes.rows[0].id;
      artisanMap[a.primaryCraft] = userId;

      const fullNameEnc = encrypt(a.fullName);
      await client.query(
        `INSERT INTO artisan_profiles (id, full_name_enc, state, district, primary_craft, verified, trust_score, monthly_capacity, lead_time_days)
         VALUES ($1, $2, $3, $4, $5, true, $6, $7, $8)`,
        [userId, fullNameEnc, a.state, a.district, a.primaryCraft, a.trustScore, a.monthlyCapacity, a.leadTime]
      );

      await client.query(
        `INSERT INTO trust_scores (user_id, score) VALUES ($1, $2)`,
        [userId, a.trustScore]
      );
    }

    // 2. SEED BUYERS & CONSUMERS
    const buyersData = [
      {
        email: 'procurement@fabindia.com',
        company: 'FabIndia Overseas Pvt Ltd',
        category: 'Apparel & Home Retail',
        gst: '07AABCF1234F1Z1',
        address: 'Plot 10, Okhla Industrial Area Phase 3, New Delhi'
      },
      {
        email: 'sourcing@trent-tata.com',
        company: 'Trent Limited (Tata Westside)',
        category: 'Department Stores & Corporate Gifting',
        gst: '27AAACT5678B1Z2',
        address: 'Bombay House, Homi Mody Street, Fort, Mumbai'
      },
      {
        email: 'buyers@goodearth.in',
        company: 'Good Earth Design Studio',
        category: 'Luxury Home & Living',
        gst: '29AABCG9012D1Z3',
        address: 'Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru'
      }
    ];

    const buyerMap = {};
    for (const b of buyersData) {
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role, status, language_pref)
         VALUES ($1, $2, 'BUYER', 'ACTIVE', 'en')
         RETURNING id`,
        [b.email, defaultPasswordHash]
      );
      const userId = userRes.rows[0].id;
      buyerMap[b.email] = userId;

      const gstEnc = encrypt(b.gst);
      const addrEnc = encrypt(b.address);
      await client.query(
        `INSERT INTO buyer_profiles (id, company_name, gst_number_enc, registered_address_enc, business_category, verified, trust_score)
         VALUES ($1, $2, $3, $4, $5, true, 98.5)`,
        [userId, b.company, gstEnc, addrEnc, b.category]
      );
    }

    // 2b. SEED CONSUMER
    console.log(' Seeding Global Consumer into Supabase...');
    await client.query(
      `INSERT INTO users (email, password_hash, role, status, language_pref)
       VALUES ($1, $2, 'CONSUMER', 'ACTIVE', 'en')`,
      ['consumer@alms.in', defaultPasswordHash]
    );

    // 3. SEED PRODUCTS & MEDIA
    console.log(' Seeding Authentic GI Products & Media into Supabase...');

    const productsData = [
      {
        craft: 'Bastar Dokra Metal Art',
        title: 'Bastar Tribal Dokra Brass Bull Figurine',
        descEn: 'Authentic 4,000-year-old lost-wax bell metal casting featuring intricate tribal motifs and handcrafted brass alloy formulation.',
        descHi: 'बस्तर का पारंपरिक ढोकरा ब्रास नंदी बैल, खोई-मोम ढलाई तकनीक से हस्तनिर्मित।',
        category: 'Dokra & Brass',
        subcategory: 'Figurines & Sculptures',
        material: 'Lost-wax bell metal (Brass & beeswax)',
        technique: 'Cire Perdue (Lost-Wax Casting)',
        care: 'Wipe with a clean dry soft cotton cloth. Do not use chemical abrasive cleaners.',
        dimensions: '22cm x 8cm x 18cm, 1.4kg',
        retailPrice: 1850.00,
        wholesalePrice: 1250.00,
        moq: 25,
        inventory: 45,
        leadTime: 15,
        giEligible: true,
        imageOrig: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&q=90&auto=format&fit=crop',
        slug: 'bastar-tribal-dokra-brass-bull-figurine',
        keywords: ['dokra', 'bell metal', 'bastar', 'tribal art', 'brass figurine', 'gi craft']
      },
      {
        craft: 'Madhubani Painting',
        title: 'Mithila Madhubani Handpainted Tussar Silk Wall Scroll',
        descEn: 'Intricately hand-drawn Kohbar tree-of-life and celestial motifs painted with natural organic vegetable and flower dyes on pure Bhagalpur Tussar silk.',
        descHi: 'तसर रेशम पर प्राकृतिक रंगों से हाथ से बनाई गई पारंपरिक मिथिला मधुबनी पेंटिंग।',
        category: 'Folk Paintings',
        subcategory: 'Wall Hangings & Scrolls',
        material: 'Pure Tussar Silk & Organic Botanical Pigments',
        technique: 'Fine Nib & Bamboo Twig Freehand Painting',
        care: 'Dry clean only. Keep away from direct harsh moisture and prolonged direct sunlight.',
        dimensions: '90cm x 45cm, 350g',
        retailPrice: 4200.00,
        wholesalePrice: 2800.00,
        moq: 10,
        inventory: 28,
        leadTime: 18,
        giEligible: true,
        imageOrig: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=90&auto=format&fit=crop',
        slug: 'mithila-madhubani-tussar-silk-wall-scroll',
        keywords: ['madhubani', 'mithila', 'silk painting', 'folk art', 'bihar gi', 'kohbar']
      },
      {
        craft: 'Jaipur Blue Pottery',
        title: 'Jaipur Cobalt Floral Glazed Ceramic Urn Vase',
        descEn: 'Traditional Persian-Rajasthani quartz composite urn hand-painted with signature cobalt oxide glazes and fired at low temperature without clay.',
        descHi: 'पारंपरिक जयपुर ब्लू पॉटरी फूलदान, क्वार्ट्ज और कोबाल्ट ग्लेज़ से निर्मित।',
        category: 'Blue Pottery',
        subcategory: 'Vases & Ceramic Vessels',
        material: 'Quartz Powder, Fuller Earth & Cobalt Oxide Glaze',
        technique: 'Egyptian Faience Hand Moulding & Brush Glazing',
        care: 'Gentle hand wash with lukewarm water. Handle with care as earthenware.',
        dimensions: '28cm height x 16cm diameter, 1.8kg',
        retailPrice: 2100.00,
        wholesalePrice: 1350.00,
        moq: 20,
        inventory: 35,
        leadTime: 12,
        giEligible: true,
        imageOrig: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&q=90&auto=format&fit=crop',
        slug: 'jaipur-cobalt-floral-glazed-ceramic-urn',
        keywords: ['blue pottery', 'jaipur', 'ceramic vase', 'rajasthan craft', 'faience']
      },
      {
        craft: 'Kancheepuram Silk',
        title: 'Royal Kanchipuram Pure Mulberry Silk Brocade Saree',
        descEn: 'Handwoven 3-ply heavy mulberry silk saree featuring pure silver zari Korvai interlocking border and authentic temple gopuram motifs.',
        descHi: 'कांचीपुरम की शुद्ध शहतूत रेशम और शुद्ध चांदी की जरी से हाथ से बुनी गई साड़ी।',
        category: 'Handloom & Silk',
        subcategory: 'Heritage Sarees',
        material: '100% Pure Mulberry Silk & Silver Zari',
        technique: 'Korvai Shuttle Weaving on Traditional Pit Looms',
        care: 'Strictly dry clean only. Wrap in unbleached muslin cloth for long-term storage.',
        dimensions: '6.3 metres (including blouse piece), 850g',
        retailPrice: 18500.00,
        wholesalePrice: 12800.00,
        moq: 5,
        inventory: 15,
        leadTime: 25,
        giEligible: true,
        imageOrig: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=90&auto=format&fit=crop',
        slug: 'royal-kanchipuram-pure-mulberry-silk-saree',
        keywords: ['kanchipuram silk', 'handloom saree', 'zari', 'tamil nadu gi', 'mulberry silk']
      },
      {
        craft: 'Pashmina',
        title: 'Kashmiri Hand-Spun Diamond Weave Pashmina Shawl',
        descEn: 'Finest 12-micron Changthangi mountain cashmere hand-spun on traditional yender spinning wheels and hand-woven in delicate Chashm-e-Bulbul weave.',
        descHi: 'चांगथांगी कश्मीरी पश्मीना ऊन से हाथ से काता और बुना हुआ प्रामाणिक शॉल।',
        category: 'Handloom & Silk',
        subcategory: 'Luxury Shawls & Wraps',
        material: '100% Grade-A Mountain Cashmere (Pashm)',
        technique: 'Hand Spun on Yender & Woven on Wooden Looms',
        care: 'Professional cashmere dry clean only. Do not wring or hang wet.',
        dimensions: '200cm x 100cm, 180g',
        retailPrice: 14500.00,
        wholesalePrice: 9800.00,
        moq: 8,
        inventory: 20,
        leadTime: 30,
        giEligible: true,
        imageOrig: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&q=90&auto=format&fit=crop',
        slug: 'kashmiri-hand-spun-diamond-weave-pashmina-shawl',
        keywords: ['pashmina', 'kashmir shawl', 'cashmere', 'gi tagged', 'handwoven']
      },
      {
        craft: 'Bastar Dokra Metal Art',
        title: 'Bastar Handwoven Natural Seasoned Bamboo Storage Basket',
        descEn: 'Eco-friendly sustainable basket hand-braided from seasoned hill bamboo strips by tribal craftswomen of Dandakaranya forest.',
        descHi: 'बस्तर के जंगलों के प्राकृतिक बांस से हाथ से बुनी गई टिकाऊ टोकरी।',
        category: 'Natural Basketry',
        subcategory: 'Storage & Planters',
        material: 'Wild Seasoned Hill Bamboo & Natural Cane',
        technique: 'Diagonal Interlocking Hexagonal Twill Weaving',
        care: 'Wipe with damp cloth and dry in open shade.',
        dimensions: '35cm diameter x 30cm height, 420g',
        retailPrice: 850.00,
        wholesalePrice: 480.00,
        moq: 40,
        inventory: 75,
        leadTime: 10,
        giEligible: false,
        imageOrig: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=90&auto=format&fit=crop',
        slug: 'bastar-handwoven-seasoned-bamboo-basket',
        keywords: ['bamboo basket', 'eco-friendly', 'cane craft', 'tribal basketry', 'sustainable']
      },
      {
        craft: 'Warli Painting',
        title: 'Warli Tribal Harvest & Tarpa Dance Canvas Art',
        descEn: 'Authentic Sahyadri indigenous ceremonial mural painted using rice paste and natural ochre binder on cow-dung and red geru coated raw canvas.',
        descHi: 'चावल के लेप और प्राकृतिक गेरू से कैनवास पर चित्रित पारंपरिक वारली तारपा नृत्य।',
        category: 'Folk Paintings',
        subcategory: 'Framed Canvas Art',
        material: 'Rice Flour Paste & Geru Earth Clay on Natural Cotton Canvas',
        technique: 'Sacred Indigenous Bamboo Brush Dot-and-Line Geometry',
        care: 'Keep in glass-framed enclosure away from direct water splashes.',
        dimensions: '60cm x 40cm, 600g',
        retailPrice: 2800.00,
        wholesalePrice: 1750.00,
        moq: 15,
        inventory: 30,
        leadTime: 10,
        giEligible: true,
        imageOrig: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=90&auto=format&fit=crop',
        slug: 'warli-tribal-harvest-tarpa-dance-canvas',
        keywords: ['warli art', 'tribal painting', 'tarpa dance', 'maharashtra gi', 'folk canvas']
      },
      {
        craft: 'Bidriware',
        title: 'Bidriware Pure Silver Wire Inlaid Zinc Alloy Flower Vase',
        descEn: 'Masterpiece 14th-century Bahmani metallurgical heritage craft crafted from blackened zinc-copper alloy hand-inlaid with 99.9% pure silver foil and wires.',
        descHi: 'शुद्ध चांदी की तार जड़ाई से अलंकृत पारंपरिक बीदरी फूलदान।',
        category: 'Dokra & Brass',
        subcategory: 'Metallic Decorative Crafts',
        material: 'Zinc-Copper Alloy, 99.9% Fine Silver Inlay, Bidar Soil Patina',
        technique: 'Tarkashi (Pure Silver Wire Chasing & Earth Oxidation)',
        care: 'Rub periodically with mineral oil or coconut oil to maintain midnight black luster.',
        dimensions: '24cm height x 12cm base diameter, 1.2kg',
        retailPrice: 5600.00,
        wholesalePrice: 3800.00,
        moq: 10,
        inventory: 18,
        leadTime: 14,
        giEligible: true,
        imageOrig: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
        imageEnh: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=90&auto=format&fit=crop',
        slug: 'bidriware-pure-silver-wire-inlaid-vase',
        keywords: ['bidriware', 'silver inlay', 'karnataka gi', 'tarkashi', 'metal art']
      }
    ];

    const seededProducts = [];

    for (const p of productsData) {
      const artisanId = artisanMap[p.craft];
      const prodRes = await client.query(
        `INSERT INTO products (
           artisan_id, title, description_en, description_hi, category, subcategory,
           material, craft_technique, care_instructions, dimensions, retail_price,
           wholesale_price, moq, status, inventory_qty, lead_time_days, gi_eligible
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'PUBLISHED', $14, $15, $16)
         RETURNING id, title, category, retail_price, wholesale_price`,
        [
          artisanId, p.title, p.descEn, p.descHi, p.category, p.subcategory,
          p.material, p.technique, p.care, p.dimensions, p.retailPrice,
          p.wholesalePrice, p.moq, p.inventory, p.leadTime, p.giEligible
        ]
      );
      const prodId = prodRes.rows[0].id;
      seededProducts.push({ id: prodId, artisanId, title: p.title, price: p.retailPrice });

      // Media
      await client.query(
        `INSERT INTO product_media (product_id, r2_key_orig, r2_key_enh, is_active, sort_order)
         VALUES ($1, $2, $3, true, 0)`,
        [prodId, p.imageOrig, p.imageEnh]
      );

      // SEO
      await client.query(
        `INSERT INTO seo_metadata (product_id, meta_title, meta_description, canonical_slug, hashtags, keywords)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          prodId,
          `${p.title} | Authentic Indian GI Craft - ALMS`,
          p.descEn.slice(0, 155),
          p.slug,
          p.keywords.map(k => `#${k.replace(/\s+/g, '')}`),
          p.keywords
        ]
      );
    }

    // 4. SEED B2B RFQS & QUOTES
    console.log(' Seeding B2B RFQs and Institutional Sourcing Orders...');
    const fabindiaId = buyerMap['procurement@fabindia.com'];
    const trentId = buyerMap['sourcing@trent-tata.com'];

    const rfq1 = await client.query(
      `INSERT INTO rfqs (buyer_id, category, required_qty, target_unit_price, delivery_date, delivery_city, delivery_state, spec_notes, status, expiry_date)
       VALUES ($1, 'Dokra & Brass', 350, 1150.00, CURRENT_DATE + 30, 'New Delhi', 'Delhi', 'Custom branded Dokra elephant mementos for Annual India Heritage Summit. Eco-friendly jute box packaging required.', 'OPEN', CURRENT_DATE + 20)
       RETURNING id`,
      [fabindiaId]
    );

    const rfq2 = await client.query(
      `INSERT INTO rfqs (buyer_id, category, required_qty, target_unit_price, delivery_date, delivery_city, delivery_state, spec_notes, status, expiry_date)
       VALUES ($1, 'Handloom & Silk', 120, 8500.00, CURRENT_DATE + 45, 'Mumbai', 'Maharashtra', 'Pure Pashmina shawls in neutral ivory and charcoal grey for luxury corporate Diwali hampers. Silk Mark verification mandatory.', 'OPEN', CURRENT_DATE + 25)
       RETURNING id`,
      [trentId]
    );

    // 5. SEED REGION STATS FOR CRAFT ATLAS
    console.log(' Seeding Craft Atlas Regional Stats...');
    const regionStats = [
      { code: 'JK', count: 4200 },
      { code: 'RJ', count: 8650 },
      { code: 'CG', count: 3100 },
      { code: 'BR', count: 5400 },
      { code: 'TN', count: 9200 },
      { code: 'MH', count: 4800 },
      { code: 'KA', count: 6100 },
      { code: 'UP', count: 12400 },
      { code: 'WB', count: 7800 },
      { code: 'OR', count: 3900 },
      { code: 'GJ', count: 5900 },
      { code: 'AS', count: 2800 },
      { code: 'KL', count: 3400 }
    ];

    for (const r of regionStats) {
      await client.query(
        `INSERT INTO region_stats (region_code, artisan_count)
         VALUES ($1, $2)
         ON CONFLICT (region_code) DO UPDATE SET artisan_count = EXCLUDED.artisan_count`,
        [r.code, r.count]
      );
    }

    await client.query('COMMIT');
    console.log('\n======================================================');
    console.log(' SUPABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(` Seeded ${artisansData.length} Master Artisans (All credentials: Password123!)`);
    console.log(` Seeded ${buyersData.length} B2B Institutional Buyers`);
    console.log(` Seeded ${productsData.length} Authentic GI Products with Real Media & SEO`);
    console.log(` Seeded Live B2B RFQs & Craft Atlas Regional Statistics`);
    console.log('======================================================\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(' SEEDING ERROR:', err);
  } finally {
    await client.end();
  }
}

seed().catch(console.error);
