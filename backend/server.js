// --- Importowanie bibliotek ---
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const { Pool } = require('pg'); // Do obsługi bazy danych

// --- Konfiguracja Połączenia z Bazą Danych ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// --- Inicjalizacja Aplikacji Express ---
const app = express();
app.set('trust proxy', 1);
app.use(express.json()); // Middleware do parsowania JSON w ciele zapytań POST

// --- Konfiguracja CORS ---
app.use(cors({
    origin: 'https://timberkitty.netlify.app',
    credentials: true
}));

// --- Konfiguracja Sesji ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // Sesja ważna przez 7 dni
    }
}));

// --- Inicjalizacja Passport.js ---
app.use(passport.initialize());
app.use(passport.session());

// --- ZMODYFIKOWANA STRATEGIA GOOGLE Z OBSŁUGĄ BAZY DANYCH ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, photos } = profile;

    try {
        // Sprawdź, czy użytkownik już istnieje w bazie danych
        const existingUser = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);

        if (existingUser.rows.length > 0) {
            // Użytkownik istnieje, zwróć jego dane z bazy
            console.log('Użytkownik znaleziony:', existingUser.rows[0]);
            return done(null, existingUser.rows[0]);
        }

        // Użytkownik nie istnieje, stwórz nowego
        // --- POPRAWKA TUTAJ ---
        // Dodajemy unlocked_items i przekazujemy pusty obiekt {} jako domyślną wartość
        const newUser = await pool.query(
            'INSERT INTO users (google_id, display_name, avatar_url, unlocked_items) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, displayName, photos[0].value, {}]
        );
        // --- KONIEC POPRAWKI ---

        console.log('Stworzono nowego użytkownika:', newUser.rows[0]);
        return done(null, newUser.rows[0]);

    } catch (err) {
        return done(err, null);
    }
  }
));

// --- ZMODYFIKOWANA SERIALIZACJA I DESERIALIZACJA ---
passport.serializeUser((user, done) => {
    done(null, user.id); // Zapisujemy w sesji tylko ID użytkownika z naszej bazy
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, user.rows[0]); // Odczytujemy pełne dane z bazy na podstawie ID
    } catch (err) {
        done(err, null);
    }
});

// =======================================================
// --- ADRESY URL (ROUTING) ---
// =======================================================

// --- Endpointy Autoryzacji ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://timberkitty.netlify.app' }),
  (req, res) => {
    res.redirect('https://timberkitty.netlify.app'); 
  }
);

app.get('/auth/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('https://timberkitty.netlify.app');
        });
    });
});

// --- NOWE ENDPOINTY API DO ZARZĄDZANIA STATYSTYKAMI ---

// Endpoint do pobierania PEŁNYCH danych zalogowanego gracza (w tym statystyk)
app.get('/api/me', (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Użytkownik niezalogowany' });
    }
});

// Endpoint do zapisywania statystyk po grze
app.post('/api/stats', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby zapisać postęp.' });
    }

    try {
        const { highScore, totalChops, coins, unlockedAchievements, unlockedItems, equippedItems } = req.body;
        const userId = req.user.id;

        const unlockedItemsJSON = JSON.stringify(unlockedItems);
        const equippedItemsJSON = JSON.stringify(equippedItems);

        // Używamy bezpośrednio puli połączeń, bez ręcznego BEGIN/COMMIT
        const result = await pool.query(
            `UPDATE users 
             SET high_score = $1, total_chops = $2, coins = $3, unlocked_achievements = $4, unlocked_items = $5, equipped_items = $6 
             WHERE id = $7 RETURNING *`,
            [highScore, totalChops, coins, unlockedAchievements, unlockedItemsJSON, equippedItemsJSON, userId]
        );

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Błąd zapisu statystyk:', err);
        res.status(500).json({ message: 'Błąd serwera podczas zapisywania postępu.' });
    }
});

// --- URUCHOMIENIE SERWERA ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});