import sqlite3
import os
import random
from datetime import datetime, timedelta
from Backend.config import settings

DB_FILE = os.path.abspath(settings.SQLITE_DB_PATH)

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_sqlite_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            district TEXT,
            preferred_language TEXT,
            primary_crop TEXT,
            is_admin BOOLEAN DEFAULT 0
        )
    ''')

    # Create Markets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS markets (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            district TEXT NOT NULL,
            state TEXT NOT NULL,
            type TEXT NOT NULL,
            lat REAL,
            lng REAL,
            distance_km INTEGER,
            chilli_price REAL,
            turmeric_price REAL,
            trend TEXT
        )
    ''')

    # Create Prices table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            crop TEXT NOT NULL,
            market TEXT NOT NULL,
            price REAL NOT NULL,
            arrivals_quintals INTEGER,
            source TEXT
        )
    ''')

    # Create Notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            read BOOLEAN DEFAULT 0
        )
    ''')

    # Create Alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            crop TEXT NOT NULL,
            market TEXT NOT NULL,
            target_price REAL NOT NULL,
            condition TEXT NOT NULL,
            created_at TEXT NOT NULL,
            active BOOLEAN DEFAULT 1
        )
    ''')

    conn.commit()

    # Seed data if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor, conn)

    conn.close()

def seed_data(cursor, conn):
    # Seed default Admin & Farmer accounts
    cursor.execute('''
        INSERT INTO users (id, name, mobile, email, password_hash, district, preferred_language, primary_crop, is_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        "user_demo_farmer",
        "Jagadeesh",
        "6303403633",
        "jagadeeshtippani@gmail.com",
        "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", # "farmer123"
        "Guntur",
        "en",
        "chilli",
        0
    ))

    cursor.execute('''
        INSERT INTO users (id, name, mobile, email, password_hash, district, preferred_language, primary_crop, is_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        "user_demo_admin",
        "Agri Admin",
        "9999999999",
        "admin@agriprice.ai",
        "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", # "admin123"
        "Guntur",
        "en",
        "chilli",
        1
    ))

    # Seed AP Markets
    ap_markets = [
        ("guntur", "Guntur Mandi", "Guntur", "Andhra Pradesh", "Primary APMC Market", 16.3067, 80.4365, 12, 18500, 12400, "up"),
        ("duggirala", "Duggirala Market", "Guntur", "Andhra Pradesh", "Turmeric Special Yard", 16.3262, 80.6271, 28, 19100, 12200, "up"),
        ("vijayawada", "Vijayawada Rythu Bazar", "NTR", "Andhra Pradesh", "Urban Wholesale Market", 16.5062, 80.6480, 35, 18200, 12000, "stable"),
        ("kurnool", "Kurnool APMC Mandi", "Kurnool", "Andhra Pradesh", "Regional Hub", 15.8281, 78.0373, 210, 17900, 12600, "up"),
        ("kadapa", "Kadapa Agri Market", "YSR Kadapa", "Andhra Pradesh", "District Trade Center", 14.4673, 78.8242, 280, 17600, 11800, "down"),
        ("anantapur", "Anantapur Market", "Anantapur", "Andhra Pradesh", "Secondary APMC", 14.6819, 77.6006, 340, 17400, 11500, "stable")
    ]

    for m in ap_markets:
        cursor.execute('''
            INSERT INTO markets (id, name, district, state, type, lat, lng, distance_km, chilli_price, turmeric_price, trend)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', m)

    # Seed 90 days of price records
    today = datetime.now()
    for i in range(90, -1, -1):
        date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        chilli_base = 17500 + (90 - i) * 15 + random.uniform(-200, 200)
        turmeric_base = 11500 + (90 - i) * 10 + random.uniform(-150, 150)

        for m in ap_markets:
            m_name = m[1].split()[0]
            c_price = round(chilli_base + (m[8] - 18500), 2)
            t_price = round(turmeric_base + (m[9] - 12400), 2)

            cursor.execute('''
                INSERT INTO prices (date, crop, market, price, arrivals_quintals, source)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (date_str, "chilli", m_name, c_price, random.randint(1200, 3500), "DEMO_DATA"))

            cursor.execute('''
                INSERT INTO prices (date, crop, market, price, arrivals_quintals, source)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (date_str, "turmeric", m_name, t_price, random.randint(800, 2200), "DEMO_DATA"))

    # Seed Notifications
    cursor.execute('''
        INSERT INTO notifications (id, title, message, type, timestamp, read)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        "notif_1",
        "Chilli Market Outlook",
        "Guntur Chilli prices expected to gain +8.4% over next 15 days due to lower market arrivals.",
        "info",
        (today - timedelta(hours=3)).strftime("%Y-%m-%d %H:%M"),
        0
    ))

    cursor.execute('''
        INSERT INTO notifications (id, title, message, type, timestamp, read)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        "notif_2",
        "Turmeric Target Reached",
        "Duggirala Turmeric price touched ₹12,200/quintal today.",
        "alert",
        (today - timedelta(days=1)).strftime("%Y-%m-%d %H:%M"),
        1
    ))

    conn.commit()

# Run initialization on import
init_sqlite_db()
