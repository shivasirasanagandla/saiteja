-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE TABLES
-- =============================================

-- User Profiles (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Zones
CREATE TABLE delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    local_area TEXT NOT NULL,
    pincode TEXT,
    is_active BOOLEAN DEFAULT true,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(state, district, local_area)
);

-- User Addresses
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    address_type TEXT CHECK (address_type IN ('home', 'office', 'other')),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    local_area TEXT NOT NULL,
    pincode TEXT NOT NULL,
    landmark TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES product_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    unit TEXT NOT NULL, -- kg, liter, piece
    min_quantity DECIMAL(10,2) DEFAULT 1,
    max_quantity_per_order DECIMAL(10,2),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    is_subscription_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    nutritional_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Cart
CREATE TABLE user_cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    is_subscription BOOLEAN DEFAULT false,
    subscription_frequency TEXT CHECK (subscription_frequency IN ('daily', 'weekly', 'monthly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    order_type TEXT CHECK (order_type IN ('one_time', 'subscription')) DEFAULT 'one_time',
    status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')) DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('wallet', 'cod', 'online')),
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    delivery_address_id UUID REFERENCES user_addresses(id),
    delivery_instructions TEXT,
    scheduled_delivery_date DATE,
    scheduled_delivery_time TEXT,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    is_subscription BOOLEAN DEFAULT false,
    subscription_frequency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    status TEXT CHECK (status IN ('active', 'paused', 'cancelled', 'expired')) DEFAULT 'active',
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_delivery_date DATE,
    total_deliveries INTEGER DEFAULT 0,
    completed_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Items
CREATE TABLE subscription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Schedule
CREATE TABLE delivery_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    scheduled_date DATE NOT NULL,
    delivery_time_slot TEXT,
    status TEXT CHECK (status IN ('scheduled', 'in_progress', 'delivered', 'cancelled', 'skipped')) DEFAULT 'scheduled',
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vacation Schedule
CREATE TABLE vacation_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet
CREATE TABLE wallet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Wallet Transactions
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallet(id) ON DELETE CASCADE,
    transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_type TEXT CHECK (reference_type IN ('order', 'refund', 'referral', 'manual', 'subscription')),
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    referred_email TEXT NOT NULL,
    referred_name TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
    reward_amount DECIMAL(10,2) DEFAULT 0,
    reward_status TEXT CHECK (reward_status IN ('pending', 'credited', 'expired')) DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Requests
CREATE TABLE support_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT CHECK (category IN ('delivery', 'payment', 'product', 'subscription', 'technical', 'other')),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
    assigned_to UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farm Visits
CREATE TABLE farm_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    preferred_time TEXT,
    number_of_visitors INTEGER DEFAULT 1,
    purpose TEXT,
    special_requirements TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id UUID REFERENCES user_profiles(id),
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Logs
CREATE TABLE payment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL,
    transaction_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT CHECK (status IN ('pending', 'success', 'failed', 'refunded')) NOT NULL,
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_user_cart_user_id ON user_cart(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_delivery_schedule_subscription_id ON delivery_schedule(subscription_id);
CREATE INDEX idx_wallet_user_id ON wallet(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_support_requests_user_id ON support_requests(user_id);
CREATE INDEX idx_farm_visits_user_id ON farm_visits(user_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_payment_logs_order_id ON payment_logs(order_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_cart_updated_at BEFORE UPDATE ON user_cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_schedule_updated_at BEFORE UPDATE ON delivery_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vacation_schedule_updated_at BEFORE UPDATE ON vacation_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_updated_at BEFORE UPDATE ON wallet FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_requests_updated_at BEFORE UPDATE ON support_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farm_visits_updated_at BEFORE UPDATE ON farm_visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacation_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_visits ENABLE ROW LEVEL SECURITY;

-- Public tables (read-only for authenticated users)
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Addresses: Users can only access their own addresses
CREATE POLICY "Users can view own addresses" ON user_addresses
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = user_addresses.user_id));

CREATE POLICY "Users can manage own addresses" ON user_addresses
    FOR ALL USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = user_addresses.user_id));

-- User Cart: Users can only access their own cart
CREATE POLICY "Users can view own cart" ON user_cart
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = user_cart.user_id));

CREATE POLICY "Users can manage own cart" ON user_cart
    FOR ALL USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = user_cart.user_id));

-- Orders: Users can only access their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = orders.user_id));

CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = orders.user_id));

-- Order Items: Users can view items from their own orders
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = (SELECT id FROM user_profiles WHERE user_id = auth.uid())
        )
    );

-- Subscriptions: Users can only access their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = subscriptions.user_id));

CREATE POLICY "Users can manage own subscriptions" ON subscriptions
    FOR ALL USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = subscriptions.user_id));

-- Delivery Schedule: Users can view their own delivery schedules
CREATE POLICY "Users can view own delivery schedule" ON delivery_schedule
    FOR SELECT USING (
        auth.uid() = (
            SELECT user_id FROM user_profiles 
            WHERE id = (
                SELECT user_id FROM subscriptions 
                WHERE subscriptions.id = delivery_schedule.subscription_id
            )
        )
    );

-- Vacation Schedule: Users can only access their own vacation schedule
CREATE POLICY "Users can view own vacation schedule" ON vacation_schedule
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = vacation_schedule.user_id));

CREATE POLICY "Users can manage own vacation schedule" ON vacation_schedule
    FOR ALL USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = vacation_schedule.user_id));

-- Wallet: Users can only access their own wallet
CREATE POLICY "Users can view own wallet" ON wallet
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = wallet.user_id));

-- Wallet Transactions: Users can view their own transactions
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
    FOR SELECT USING (
        auth.uid() = (
            SELECT user_id FROM user_profiles 
            WHERE id = (SELECT user_id FROM wallet WHERE wallet.id = wallet_transactions.wallet_id)
        )
    );

-- Invoices: Users can view invoices for their own orders
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (
        auth.uid() = (
            SELECT user_id FROM user_profiles 
            WHERE id = (SELECT user_id FROM orders WHERE orders.id = invoices.order_id)
        )
    );

-- Referrals: Users can view their own referrals
CREATE POLICY "Users can view own referrals" ON referrals
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = referrals.referrer_id));

CREATE POLICY "Users can create own referrals" ON referrals
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = referrals.referrer_id));

-- Support Requests: Users can only access their own support requests
CREATE POLICY "Users can view own support requests" ON support_requests
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = support_requests.user_id));

CREATE POLICY "Users can create own support requests" ON support_requests
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = support_requests.user_id));

-- Farm Visits: Users can only access their own farm visit requests
CREATE POLICY "Users can view own farm visits" ON farm_visits
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = farm_visits.user_id));

CREATE POLICY "Users can manage own farm visits" ON farm_visits
    FOR ALL USING (auth.uid() = (SELECT user_id FROM user_profiles WHERE id = farm_visits.user_id));

-- Public tables: Authenticated users can read
CREATE POLICY "Authenticated users can read delivery zones" ON delivery_zones
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read product categories" ON product_categories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read blog posts" ON blog_posts
    FOR SELECT USING (auth.role() = 'authenticated' AND status = 'published');

-- =============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =============================================

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    -- Create wallet for new user
    INSERT INTO public.wallet (user_id, balance)
    VALUES (NEW.id, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    counter INTEGER;
BEGIN
    counter := 1;
    LOOP
        order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
        
        -- Check if order number exists
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = order_num) THEN
            RETURN order_num;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    invoice_num TEXT;
    counter INTEGER;
BEGIN
    counter := 1;
    LOOP
        invoice_num := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
        
        -- Check if invoice number exists
        IF NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = invoice_num) THEN
            RETURN invoice_num;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance(
    p_user_id UUID,
    p_amount DECIMAL,
    p_transaction_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_wallet_id UUID;
    v_current_balance DECIMAL;
    v_new_balance DECIMAL;
    v_transaction_id UUID;
BEGIN
    -- Get wallet
    SELECT id, balance INTO v_wallet_id, v_current_balance
    FROM wallet WHERE user_id = p_user_id;
    
    IF v_wallet_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Calculate new balance
    IF p_transaction_type = 'credit' THEN
        v_new_balance := v_current_balance + p_amount;
    ELSIF p_transaction_type = 'debit' THEN
        v_new_balance := v_current_balance - p_amount;
    ELSE
        RETURN FALSE;
    END IF;
    
    -- Update wallet balance
    UPDATE wallet SET balance = v_new_balance, updated_at = NOW()
    WHERE id = v_wallet_id;
    
    -- Create transaction record
    INSERT INTO wallet_transactions (
        wallet_id, transaction_type, amount, balance_before, 
        balance_after, description, reference_type, reference_id
    ) VALUES (
        v_wallet_id, p_transaction_type, p_amount, v_current_balance,
        v_new_balance, p_description, p_reference_type, p_reference_id
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 