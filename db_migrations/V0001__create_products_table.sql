CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_id ON products(category_id);
CREATE INDEX idx_updated_at ON products(updated_at);

CREATE TABLE IF NOT EXISTS feed_sync_log (
    id SERIAL PRIMARY KEY,
    sync_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_completed_at TIMESTAMP,
    products_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'running',
    error_message TEXT
);