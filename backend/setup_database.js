const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample Categories
const categories = [
  {
    name: "Milk",
    description: "Fresh dairy milk products",
    image: "/images/milk-category.jpg",
    slug: "milk",
    featured: true,
    createdAt: serverTimestamp()
  },
  {
    name: "Cheese",
    description: "Premium cheese varieties",
    image: "/images/cheese-category.jpg",
    slug: "cheese",
    featured: true,
    createdAt: serverTimestamp()
  },
  {
    name: "Butter",
    description: "Pure butter products",
    image: "/images/butter-category.jpg",
    slug: "butter",
    featured: false,
    createdAt: serverTimestamp()
  },
  {
    name: "Yogurt",
    description: "Fresh yogurt products",
    image: "/images/yogurt-category.jpg",
    slug: "yogurt",
    featured: true,
    createdAt: serverTimestamp()
  }
];

// Sample Products
const products = [
  {
    name: "Fresh Organic Milk",
    description: "Pure, fresh milk from indigenous-breed cows",
    price: 45,
    originalPrice: 50,
    category: "Milk",
    categoryId: "milk",
    image: "/images/freshmilk.jpeg",
    badge: "Organic",
    featured: true,
    inStock: true,
    unit: "L",
    features: ["Organic", "Fresh", "No Preservatives"],
    nutritionalInfo: {
      calories: 42,
      protein: 3.4,
      fat: 1.0,
      carbs: 5.0
    },
    createdAt: serverTimestamp()
  },
  {
    name: "Toned Milk",
    description: "Low-fat milk perfect for daily consumption",
    price: 35,
    originalPrice: 40,
    category: "Milk",
    categoryId: "milk",
    image: "/images/toned milk.jpg",
    badge: "Low Fat",
    featured: true,
    inStock: true,
    unit: "L",
    features: ["Low Fat", "High Protein", "Fresh"],
    nutritionalInfo: {
      calories: 35,
      protein: 3.2,
      fat: 0.5,
      carbs: 4.8
    },
    createdAt: serverTimestamp()
  },
  {
    name: "Fresh Paneer",
    description: "Homemade fresh paneer for cooking",
    price: 120,
    originalPrice: 140,
    category: "Cheese",
    categoryId: "cheese",
    image: "/images/fresh paneer.png",
    badge: "Fresh",
    featured: true,
    inStock: true,
    unit: "kg",
    features: ["Fresh", "Homemade", "High Protein"],
    nutritionalInfo: {
      calories: 265,
      protein: 18.0,
      fat: 20.0,
      carbs: 2.0
    },
    createdAt: serverTimestamp()
  },
  {
    name: "Organic Butter",
    description: "Pure organic butter made from fresh cream",
    price: 180,
    originalPrice: 200,
    category: "Butter",
    categoryId: "butter",
    image: "/images/butter.jpeg",
    badge: "Organic",
    featured: false,
    inStock: true,
    unit: "kg",
    features: ["Organic", "Pure", "Fresh"],
    nutritionalInfo: {
      calories: 717,
      protein: 0.9,
      fat: 81.0,
      carbs: 0.1
    },
    createdAt: serverTimestamp()
  },
  {
    name: "Fresh Curd",
    description: "Homemade fresh curd with live cultures",
    price: 60,
    originalPrice: 70,
    category: "Yogurt",
    categoryId: "yogurt",
    image: "/images/curd.jpeg",
    badge: "Probiotic",
    featured: true,
    inStock: true,
    unit: "kg",
    features: ["Probiotic", "Fresh", "Live Cultures"],
    nutritionalInfo: {
      calories: 59,
      protein: 10.0,
      fat: 0.4,
      carbs: 3.6
    },
    createdAt: serverTimestamp()
  },
  {
    name: "Organic Ghee",
    description: "Pure organic ghee for cooking and health",
    price: 250,
    originalPrice: 280,
    category: "Butter",
    categoryId: "butter",
    image: "/images/orghanic ghee.jpg",
    badge: "Organic",
    featured: true,
    inStock: true,
    unit: "kg",
    features: ["Organic", "Pure", "Ayurvedic"],
    nutritionalInfo: {
      calories: 900,
      protein: 0.0,
      fat: 100.0,
      carbs: 0.0
    },
    createdAt: serverTimestamp()
  }
];

// Setup function
async function setupDatabase() {
  try {
    console.log('🚀 Setting up Firebase database...');

    // Add categories
    console.log('📂 Adding categories...');
    const categoryIds = {};
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'categories'), category);
      categoryIds[category.slug] = docRef.id;
      console.log(`✅ Added category: ${category.name}`);
    }

    // Add products
    console.log('📦 Adding products...');
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
      console.log(`✅ Added product: ${product.name}`);
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Categories added:', categories.length);
    console.log('📦 Products added:', products.length);
    console.log('🔗 You can now start the backend server');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 