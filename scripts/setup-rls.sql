-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Anyone can read approved agents" ON agents;
DROP POLICY IF EXISTS "Sellers can manage own agents" ON agents;
DROP POLICY IF EXISTS "Anyone can read categories" ON categories;

-- USERS TABLE POLICIES
CREATE POLICY "Users can read own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Allow insert for authenticated users"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- CATEGORIES TABLE POLICIES (public read)
CREATE POLICY "Anyone can read categories"
    ON categories FOR SELECT
    TO PUBLIC
    USING (true);

-- AGENTS TABLE POLICIES
CREATE POLICY "Anyone can read approved agents"
    ON agents FOR SELECT
    TO PUBLIC
    USING (status = 'APPROVED' OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert own agents"
    ON agents FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own agents"
    ON agents FOR UPDATE
    USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own agents"
    ON agents FOR DELETE
    USING (auth.uid() = seller_id);

-- SELLER PROFILES TABLE POLICIES
CREATE POLICY "Anyone can read seller profiles"
    ON seller_profiles FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Users can manage own seller profile"
    ON seller_profiles FOR ALL
    USING (auth.uid() = user_id);

-- PURCHASES TABLE POLICIES
CREATE POLICY "Users can read own purchases"
    ON purchases FOR SELECT
    USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create purchases"
    ON purchases FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- REVIEWS TABLE POLICIES
CREATE POLICY "Anyone can read reviews"
    ON reviews FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Users can create reviews for own purchases"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = buyer_id);

-- SUPPORT REQUESTS TABLE POLICIES
CREATE POLICY "Users can read own support requests"
    ON support_requests FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create support requests"
    ON support_requests FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

-- ADMIN LOGS (admins only - will add admin check later)
CREATE POLICY "Admins can read logs"
    ON admin_logs FOR SELECT
    USING (true);
