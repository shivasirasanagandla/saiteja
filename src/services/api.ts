import { supabase } from '../lib/supabase';
import { 
  UserProfile, 
  Product, 
  Order, 
  Subscription, 
  CartItem, 
  Wallet,
  BlogPost,
  Inserts,
  Updates
} from '../lib/database.types';

// =============================================
// AUTHENTICATION SERVICES
// =============================================

export const authService = {
  // Sign up with email
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  // Update password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    });
    return { error };
  }
};

// =============================================
// USER PROFILE SERVICES
// =============================================

export const userService = {
  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Updates<'user_profiles'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Get user addresses
  async getUserAddresses(userId: string) {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_default', { ascending: false });
    return { data, error };
  },

  // Add user address
  async addUserAddress(address: Inserts<'user_addresses'>) {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert(address)
      .select()
      .single();
    return { data, error };
  },

  // Update user address
  async updateUserAddress(addressId: string, updates: Updates<'user_addresses'>) {
    const { data, error } = await supabase
      .from('user_addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single();
    return { data, error };
  },

  // Delete user address
  async deleteUserAddress(addressId: string) {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId);
    return { error };
  }
};

// =============================================
// PRODUCT SERVICES
// =============================================

export const productService = {
  // Get all products
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          description
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get featured products
  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          description
        )
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get product by ID
  async getProductById(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          description
        )
      `)
      .eq('id', productId)
      .single();
    return { data, error };
  },

  // Get products by category
  async getProductsByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          description
        )
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get all categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    return { data, error };
  }
};

// =============================================
// CART SERVICES
// =============================================

export const cartService = {
  // Get user cart
  async getUserCart(userId: string) {
    const { data, error } = await supabase
      .from('user_cart')
      .select(`
        *,
        products (
          id,
          name,
          description,
          image_url,
          price,
          unit,
          stock_quantity
        )
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  // Add item to cart
  async addToCart(cartItem: Inserts<'user_cart'>) {
    const { data, error } = await supabase
      .from('user_cart')
      .upsert(cartItem, { onConflict: 'user_id,product_id' })
      .select(`
        *,
        products (
          id,
          name,
          description,
          image_url,
          price,
          unit,
          stock_quantity
        )
      `)
      .single();
    return { data, error };
  },

  // Update cart item
  async updateCartItem(cartItemId: string, updates: Updates<'user_cart'>) {
    const { data, error } = await supabase
      .from('user_cart')
      .update(updates)
      .eq('id', cartItemId)
      .select(`
        *,
        products (
          id,
          name,
          description,
          image_url,
          price,
          unit,
          stock_quantity
        )
      `)
      .single();
    return { data, error };
  },

  // Remove item from cart
  async removeFromCart(cartItemId: string) {
    const { error } = await supabase
      .from('user_cart')
      .delete()
      .eq('id', cartItemId);
    return { error };
  },

  // Clear user cart
  async clearCart(userId: string) {
    const { error } = await supabase
      .from('user_cart')
      .delete()
      .eq('user_id', userId);
    return { error };
  }
};

// =============================================
// ORDER SERVICES
// =============================================

export const orderService = {
  // Create order
  async createOrder(order: Inserts<'orders'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    return { data, error };
  },

  // Get user orders
  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          unit,
          total_price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get order by ID
  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          unit,
          total_price
        )
      `)
      .eq('id', orderId)
      .single();
    return { data, error };
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    return { data, error };
  }
};

// =============================================
// SUBSCRIPTION SERVICES
// =============================================

export const subscriptionService = {
  // Create subscription
  async createSubscription(subscription: Inserts<'subscriptions'>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    return { data, error };
  },

  // Get user subscriptions
  async getUserSubscriptions(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_items (
          id,
          quantity,
          products (
            id,
            name,
            description,
            image_url,
            price,
            unit
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Update subscription status
  async updateSubscriptionStatus(subscriptionId: string, status: Subscription['status']) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status })
      .eq('id', subscriptionId)
      .select()
      .single();
    return { data, error };
  }
};

// =============================================
// WALLET SERVICES
// =============================================

export const walletService = {
  // Get user wallet
  async getUserWallet(userId: string) {
    const { data, error } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Get wallet transactions
  async getWalletTransactions(walletId: string) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Add wallet transaction
  async addWalletTransaction(transaction: Inserts<'wallet_transactions'>) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert(transaction)
      .select()
      .single();
    return { data, error };
  }
};

// =============================================
// DELIVERY SERVICES
// =============================================

export const deliveryService = {
  // Check delivery zone
  async checkDeliveryZone(state: string, district: string, localArea: string) {
    const { data, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('state', state)
      .eq('district', district)
      .eq('local_area', localArea)
      .eq('is_active', true)
      .single();
    return { data, error };
  },

  // Get delivery schedule
  async getDeliverySchedule(subscriptionId?: string, orderId?: string) {
    let query = supabase
      .from('delivery_schedule')
      .select('*')
      .order('scheduled_date', { ascending: true });

    if (subscriptionId) {
      query = query.eq('subscription_id', subscriptionId);
    }
    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Create vacation schedule
  async createVacationSchedule(vacation: Inserts<'vacation_schedule'>) {
    const { data, error } = await supabase
      .from('vacation_schedule')
      .insert(vacation)
      .select()
      .single();
    return { data, error };
  },

  // Get user vacation schedules
  async getUserVacationSchedules(userId: string) {
    const { data, error } = await supabase
      .from('vacation_schedule')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });
    return { data, error };
  }
};

// =============================================
// SUPPORT SERVICES
// =============================================

export const supportService = {
  // Create support request
  async createSupportRequest(request: Inserts<'support_requests'>) {
    const { data, error } = await supabase
      .from('support_requests')
      .insert(request)
      .select()
      .single();
    return { data, error };
  },

  // Get user support requests
  async getUserSupportRequests(userId: string) {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Create farm visit request
  async createFarmVisit(visit: Inserts<'farm_visits'>) {
    const { data, error } = await supabase
      .from('farm_visits')
      .insert(visit)
      .select()
      .single();
    return { data, error };
  },

  // Get user farm visits
  async getUserFarmVisits(userId: string) {
    const { data, error } = await supabase
      .from('farm_visits')
      .select('*')
      .eq('user_id', userId)
      .order('visit_date', { ascending: true });
    return { data, error };
  }
};

// =============================================
// REFERRAL SERVICES
// =============================================

export const referralService = {
  // Create referral
  async createReferral(referral: Inserts<'referrals'>) {
    const { data, error } = await supabase
      .from('referrals')
      .insert(referral)
      .select()
      .single();
    return { data, error };
  },

  // Get user referrals
  async getUserReferrals(userId: string) {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Update referral status
  async updateReferralStatus(referralId: string, status: 'pending' | 'completed' | 'expired') {
    const { data, error } = await supabase
      .from('referrals')
      .update({ status })
      .eq('id', referralId)
      .select()
      .single();
    return { data, error };
  }
};

// =============================================
// BLOG SERVICES
// =============================================

export const blogService = {
  // Get all blog posts
  async getAllBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    return { data, error };
  },

  // Get blog post by slug
  async getBlogPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    return { data, error };
  }
};

// =============================================
// INVOICE SERVICES
// =============================================

export const invoiceService = {
  // Get order invoices
  async getOrderInvoices(orderId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Create invoice
  async createInvoice(invoice: Inserts<'invoices'>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    return { data, error };
  }
};

// =============================================
// REALTIME SUBSCRIPTIONS
// =============================================

export const realtimeService = {
  // Subscribe to order updates
  subscribeToOrderUpdates(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`orders:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to cart updates
  subscribeToCartUpdates(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`cart:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_cart',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to subscription updates
  subscribeToSubscriptionUpdates(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`subscriptions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
}; 