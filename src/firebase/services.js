import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile 
} from 'firebase/auth';
import { db, auth } from './config';

// User Services
export const userService = {
  // Register new user
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.name || email
      });
      
      // Save additional user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        createdAt: serverTimestamp(),
        type: userData.type || 'email'
      });
      
      return { success: true, user };
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Get user data
  async getUserData(uid) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Update user data
  async updateUserData(uid, userData) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = doc(db, 'users', querySnapshot.docs[0].id);
        await updateDoc(docRef, userData);
        return { success: true };
      }
      throw new Error('User not found');
    } catch (error) {
      throw error;
    }
  }
};

// Product Services
export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('featured', '==', true), limit(6));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get product by ID
  async getProductById(productId) {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Add new product (admin only)
  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      throw error;
    }
  },

  // Update product (admin only)
  async updateProduct(productId, productData) {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, productData);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Delete product (admin only)
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

// Order Services
export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        status: 'processing'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      throw error;
    }
  },

  // Get user orders
  async getUserOrders(userId) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, { status });
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

// Category Services
export const categoryService = {
  // Get all categories
  async getAllCategories() {
    try {
      const categoriesRef = collection(db, 'categories');
      const querySnapshot = await getDocs(categoriesRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(categoryId) {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('categoryId', '==', categoryId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
}; 