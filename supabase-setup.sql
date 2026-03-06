-- ============================================
-- SUPABASE TABLE SETUP - CMS PIDUM DATA
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- 1. Buat tabel utama (menyimpan SEMUA localStorage data)
CREATE TABLE IF NOT EXISTS cms_pidum_data (
    storage_key TEXT PRIMARY KEY,     -- localStorage key
    data_json TEXT,                   -- localStorage value (JSON string)
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE cms_pidum_data ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Semua orang bisa BACA (untuk tampilan publik)
CREATE POLICY "Allow public read" ON cms_pidum_data
    FOR SELECT USING (true);

-- 4. Policy: Semua orang bisa TULIS (auth dikelola oleh CMS)
CREATE POLICY "Allow public insert" ON cms_pidum_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON cms_pidum_data
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON cms_pidum_data
    FOR DELETE USING (true);

-- 5. Index untuk performa
CREATE INDEX IF NOT EXISTS idx_cms_pidum_key 
    ON cms_pidum_data (storage_key);
