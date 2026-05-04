-- ==============================================
-- Supabase PostgreSQL Migration
-- Database: Budget Iklan (db_budgeting_ads)
-- ==============================================

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
  id_user SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('Admin', 'Staff'))
);

-- 2. Table: campaign
CREATE TABLE IF NOT EXISTS campaign (
  id_campaign SERIAL PRIMARY KEY,
  id_user INT,
  nama_campaign VARCHAR(255) NOT NULL,
  platform VARCHAR(100),
  total_budget INT,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Completed')),
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- 3. Table: realisasi
CREATE TABLE IF NOT EXISTS realisasi (
  id_realisasi SERIAL PRIMARY KEY,
  id_campaign INT,
  id_user INT,
  tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  biaya INT,
  FOREIGN KEY (id_campaign) REFERENCES campaign(id_campaign) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

-- 4. Table: performa_campaign
CREATE TABLE IF NOT EXISTS performa_campaign (
  id_performa SERIAL PRIMARY KEY,
  id_campaign INT,
  id_user INT,
  tanggal DATE,
  impression INT DEFAULT 0,
  click INT DEFAULT 0,
  conversion INT DEFAULT 0,
  revenue INT DEFAULT 0,
  FOREIGN KEY (id_campaign) REFERENCES campaign(id_campaign) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

-- 5. Table: laporan
CREATE TABLE IF NOT EXISTS laporan (
  id_laporan SERIAL PRIMARY KEY,
  id_campaign INT,
  id_user INT,
  periode_awal DATE,
  periode_akhir DATE,
  tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_campaign) REFERENCES campaign(id_campaign) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

-- ==============================================
-- SEED DATA (Data Awal)
-- ==============================================

-- Seed: users
INSERT INTO users (id_user, nama, email, password, role) VALUES
  (1, 'Budi Admin', 'admin@gmail.com', 'admin123', 'Admin'),
  (2, 'Siti Staff', 'staff@gmail.com', 'staff123', 'Staff')
ON CONFLICT (id_user) DO NOTHING;

-- Reset sequence setelah insert manual
SELECT setval('users_id_user_seq', (SELECT MAX(id_user) FROM users));

-- Seed: campaign
INSERT INTO campaign (id_campaign, id_user, nama_campaign, platform, total_budget, tanggal_mulai, tanggal_selesai, status) VALUES
  (1, 1, 'Promo Ramadhan', 'Instagram', 5000000, '2026-03-01', '2026-04-01', 'Active'),
  (2, 1, 'Flash Sale 4.4', 'TikTok', 10000000, '2026-04-01', '2026-04-05', 'Completed')
ON CONFLICT (id_campaign) DO NOTHING;

SELECT setval('campaign_id_campaign_seq', (SELECT MAX(id_campaign) FROM campaign));

-- Seed: realisasi
INSERT INTO realisasi (id_realisasi, id_campaign, id_user, tanggal, biaya) VALUES
  (1, 1, 2, '2026-04-07 09:11:39', 500000),
  (2, 1, 2, '2026-04-07 09:11:39', 750000),
  (3, 1, 2, '2026-04-07 09:11:39', 1000000),
  (4, 2, 2, '2026-04-07 09:11:39', 2000000),
  (5, 2, 2, '2026-04-07 09:11:39', 3000000)
ON CONFLICT (id_realisasi) DO NOTHING;

SELECT setval('realisasi_id_realisasi_seq', (SELECT MAX(id_realisasi) FROM realisasi));

-- Seed: performa_campaign
INSERT INTO performa_campaign (id_performa, id_campaign, id_user, tanggal, impression, click, conversion, revenue) VALUES
  (1, 1, 2, '2026-03-10', 10000, 500, 50, 2000000),
  (2, 1, 2, '2026-03-11', 12000, 600, 60, 2500000),
  (3, 2, 2, '2026-04-02', 50000, 2500, 200, 15000000),
  (4, 2, 2, '2026-04-03', 45000, 2100, 180, 12000000),
  (5, 2, 2, '2026-04-04', 60000, 3000, 300, 20000000)
ON CONFLICT (id_performa) DO NOTHING;

SELECT setval('performa_campaign_id_performa_seq', (SELECT MAX(id_performa) FROM performa_campaign));

-- ==============================================
-- DISABLE RLS (Row Level Security) for API access
-- Supabase enables RLS by default, we need to disable it
-- for our custom Express backend authentication
-- ==============================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaign DISABLE ROW LEVEL SECURITY;
ALTER TABLE realisasi DISABLE ROW LEVEL SECURITY;
ALTER TABLE performa_campaign DISABLE ROW LEVEL SECURITY;
ALTER TABLE laporan DISABLE ROW LEVEL SECURITY;
