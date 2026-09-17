import Dexie from 'dexie';

export const db = new Dexie('KissanBazarDB');

// Define database schema matching all 8 steps & extra features
db.version(2).stores({
  users: '++id, name, role, phone, location, avatar',
  listings: '++id, farmerId, farmerName, farmerLocation, cropName, category, quantity, unit, qualityGrade, pricePerUnit, description, photoUrl, status, createdAt',
  chats: '++id, listingId, farmerId, buyerId, cropName, lastMessage, updatedAt',
  messages: '++id, chatId, senderId, senderRole, text, isOffer, offerPrice, status, timestamp',
  orders: '++id, listingId, buyerId, buyerName, farmerId, farmerName, cropName, quantity, unit, pricePerUnit, totalPrice, deliveryAddress, paymentMethod, paymentStatus, orderStatus, trackingHistory, createdAt',
  reviews: '++id, orderId, rating, comment, reviewerName, reviewerRole, targetName, createdAt',
  priceAlerts: '++id, buyerId, cropName, targetPrice, isTriggered, createdAt',
  communityPosts: '++id, authorName, authorRole, category, title, content, likes, commentsCount, createdAt',
  marketPrices: '++id, cropName, mandi, state, minPrice, maxPrice, modalPrice, trend, date'
});

// Seed data helper
export async function seedDatabase() {
  const listingsCount = await db.listings.count();
  if (listingsCount >= 12) return; // Already has rich catalogue

  console.log('Seeding extended crop catalogue (Fruits & Vegetables)...');

  // Clear existing to re-seed rich catalog
  await db.listings.clear();
  await db.users.clear();

  // Seed Farmers & Buyers
  const farmerId = await db.users.add({
    name: 'Ramesh Patil',
    role: 'Farmer',
    phone: '+91 98230 12345',
    location: 'Nashik, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  });

  const farmer2Id = await db.users.add({
    name: 'Suresh Kumar',
    role: 'Farmer',
    phone: '+91 94120 54321',
    location: 'Indore, Madhya Pradesh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  });

  const farmer3Id = await db.users.add({
    name: 'Balwinder Singh',
    role: 'Farmer',
    phone: '+91 98140 88776',
    location: 'Shimla, Himachal Pradesh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const buyerId = await db.users.add({
    name: 'Aniket Sharma',
    role: 'Buyer',
    phone: '+91 99887 76655',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  });

  // Rich Seed Crop Listings (Expanded Fruits & Vegetables)
  await db.listings.bulkAdd([
    // Vegetables
    {
      farmerId: farmerId,
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Nashik, Maharashtra',
      cropName: 'Fresh Tomatoes',
      category: 'Vegetables',
      quantity: 1200,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 20,
      description: 'Organic, farm-fresh vine-ripened red tomatoes direct from Nashik farm.',
      photoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmerId,
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Pune, Maharashtra',
      cropName: 'Red Onions',
      category: 'Vegetables',
      quantity: 2500,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 18,
      description: 'High storage life Nasik red onions, medium-to-large size bulbs.',
      photoUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmer2Id,
      farmerName: 'Suresh Kumar',
      farmerLocation: 'Indore, Madhya Pradesh',
      cropName: 'Fresh Potatoes',
      category: 'Vegetables',
      quantity: 1800,
      unit: 'kg',
      qualityGrade: 'B Grade',
      pricePerUnit: 16,
      description: 'Cleaned table quality potatoes, uniform size suitable for bulk buyers.',
      photoUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmer2Id,
      farmerName: 'Suresh Kumar',
      farmerLocation: 'Solapur, Maharashtra',
      cropName: 'Green Chillies',
      category: 'Vegetables',
      quantity: 600,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 30,
      description: 'Spicy sharp green chillies harvested fresh this morning.',
      photoUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmerId,
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Satara, Maharashtra',
      cropName: 'Organic Carrots',
      category: 'Vegetables',
      quantity: 800,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 25,
      description: 'Sweet crunch red carrots grown organically without pesticides.',
      photoUrl: 'https://images.unsplash.com/photo-1598170845058-12ef4a45753b?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmer2Id,
      farmerName: 'Suresh Kumar',
      farmerLocation: 'Udaipur, Rajasthan',
      cropName: 'Fresh Cauliflower',
      category: 'Vegetables',
      quantity: 500,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 22,
      description: 'Bright white snow-head cauliflowers, tight curds harvested fresh.',
      photoUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmerId,
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Nashik, Maharashtra',
      cropName: 'Green Capsicum (Bell Pepper)',
      category: 'Vegetables',
      quantity: 400,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 40,
      description: 'Firm thick-walled green capsicums direct from greenhouse.',
      photoUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },

    // Fruits
    {
      farmerId: farmer2Id,
      farmerName: 'Suresh Kumar',
      farmerLocation: 'Ratnagiri, Maharashtra',
      cropName: 'Alphonso Mangoes',
      category: 'Fruits',
      quantity: 1000,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 120,
      description: 'Naturally ripened GI Tagged Ratnagiri Alphonso mangoes.',
      photoUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmer3Id,
      farmerName: 'Balwinder Singh',
      farmerLocation: 'Shimla, Himachal Pradesh',
      cropName: 'Royal Delicious Apples',
      category: 'Fruits',
      quantity: 3000,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 90,
      description: 'Crispy juicy red Shimla apples harvested from high altitude orchards.',
      photoUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmerId,
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Jalgaon, Maharashtra',
      cropName: 'Grand Naine Bananas',
      category: 'Fruits',
      quantity: 4000,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 15,
      description: 'Premium Jalgaon yellow bananas, high sweet index and long shelf life.',
      photoUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmer3Id,
      farmerName: 'Balwinder Singh',
      farmerLocation: 'Nagpur, Maharashtra',
      cropName: 'Nagpur Oranges (Santra)',
      category: 'Fruits',
      quantity: 1500,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 45,
      description: 'Sweet tangy juicy Nagpur oranges, fresh harvest.',
      photoUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      farmerId: farmer2Id,
      farmerName: 'Suresh Kumar',
      farmerLocation: 'Solapur, Maharashtra',
      cropName: 'Bhagwa Pomegranates',
      category: 'Fruits',
      quantity: 800,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 85,
      description: 'Deep red arils, sweet rich juice Bhagwa variety pomegranates.',
      photoUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    },

    // Grains
    {
      farmerId: farmerId,
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Nashik, Maharashtra',
      cropName: 'Sharbati Wheat',
      category: 'Grains',
      quantity: 5000,
      unit: 'kg',
      qualityGrade: 'A Grade',
      pricePerUnit: 35,
      description: 'Golden high protein Sharbati wheat grains, machine sorted.',
      photoUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80',
      status: 'Active',
      createdAt: new Date().toISOString()
    }
  ]);

  // Seed Market Prices
  const marketPricesCount = await db.marketPrices.count();
  if (marketPricesCount === 0) {
    await db.marketPrices.bulkAdd([
      { cropName: 'Tomato', mandi: 'Nashik APMC', state: 'Maharashtra', minPrice: 16, maxPrice: 22, modalPrice: 20, trend: 'up', date: 'Today' },
      { cropName: 'Onion', mandi: 'Lasalgaon APMC', state: 'Maharashtra', minPrice: 14, maxPrice: 20, modalPrice: 18, trend: 'stable', date: 'Today' },
      { cropName: 'Potato', mandi: 'Indore APMC', state: 'Madhya Pradesh', minPrice: 13, maxPrice: 18, modalPrice: 16, trend: 'down', date: 'Today' },
      { cropName: 'Apple', mandi: 'Shimla APMC', state: 'Himachal Pradesh', minPrice: 75, maxPrice: 95, modalPrice: 85, trend: 'up', date: 'Today' },
      { cropName: 'Banana', mandi: 'Jalgaon APMC', state: 'Maharashtra', minPrice: 12, maxPrice: 16, modalPrice: 14, trend: 'stable', date: 'Today' },
      { cropName: 'Wheat', mandi: 'Khanna APMC', state: 'Punjab', minPrice: 32, maxPrice: 38, modalPrice: 35, trend: 'up', date: 'Today' }
    ]);
  }

  // Seed Community Posts
  const communityCount = await db.communityPosts.count();
  if (communityCount === 0) {
    await db.communityPosts.bulkAdd([
      {
        authorName: 'Ramesh Patil',
        authorRole: 'Verified Farmer',
        category: 'Organic Farming',
        title: 'Best natural pest control for tomato crop in monsoon season',
        content: 'Using Neem oil spray mixed with soapy water every 10 days reduced leaf curl virus significantly without synthetic chemicals!',
        likes: 24,
        commentsCount: 8,
        createdAt: '2 days ago'
      },
      {
        authorName: 'Balwinder Singh',
        authorRole: 'Fruit Grower',
        category: 'Orchard Care',
        title: 'Apple harvesting tip for maximum shelf life',
        content: 'Pluck apples with stem intact in early morning hours before sun warms up the skin. Reduces bruising by 40%.',
        likes: 38,
        commentsCount: 12,
        createdAt: '1 day ago'
      }
    ]);
  }

  console.log('Catalogue successfully updated with multiple fruits & vegetables!');
}
