# Supabase Setup for Trading Journal

## Prerequisites
- Supabase account and project created
- Users, accounts, and trades tables created in your Supabase database

## Setup Steps

### 1. Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key

### 2. Create Environment File
1. Copy `env.example` to `.env` in the `app` directory
2. Fill in your Supabase credentials:

```bash
# Copy the example file
cp env.example .env

# Edit .env with your actual values
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Schema
Make sure you have these tables in your Supabase database:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Accounts Table
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  starting_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  current_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Trades Table
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL,
  entry_price DECIMAL(15,4) NOT NULL,
  exit_price DECIMAL(15,4),
  quantity INTEGER NOT NULL,
  entry_date DATE NOT NULL,
  exit_date DATE,
  pnl DECIMAL(15,2),
  notes TEXT,
  reason TEXT,
  result VARCHAR(10),
  option_details VARCHAR(255),
  source VARCHAR(255),
  commission DECIMAL(10,2) DEFAULT 0,
  fees DECIMAL(10,2) DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Row Level Security (RLS)
Enable RLS on your tables and create policies for user data isolation:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create policies (example for trades table)
CREATE POLICY "Users can view own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Test the Connection
1. Start your React app: `npm start`
2. Check the connection status in the header
3. You should see "Database connected" if everything is set up correctly

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure your database tables exist and have the correct structure

### RLS Issues
- Make sure RLS is enabled on all tables
- Verify your policies allow the operations you need
- Check that auth.uid() is working correctly

### Environment Variables
- Ensure your `.env` file is in the `app` directory
- Restart your development server after changing environment variables
- Verify the variable names start with `REACT_APP_`

## Next Steps
Once the connection is working, you can:
1. Implement user authentication
2. Create hooks for CRUD operations
3. Replace local state with database operations
4. Add real-time subscriptions for live updates
