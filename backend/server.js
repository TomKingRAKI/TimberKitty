console.log('--- SERVER.JS v2 --- URUCHAMIAM NAJNOWSZĄ WERSJĘ KODU ---');

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

const shopData = {     char_santa: { id: 'char_santa', name: 'Święty', category: 'characters', icon: '🧑‍🎄', price: 500, description: 'Dłuższy czas za cięcie (+0.5s)', bonus: { type: 'timeGainBonus', value: 0.5 } },
    char_vampire: { id: 'char_vampire', name: 'Wampir', category: 'characters', icon: '🧛', price: 750, description: 'Dłuższy czas za cięcie (+0.75s)', bonus: { type: 'timeGainBonus', value: 0.75 } },
    char_robot: { id: 'char_robot', name: 'Robot', category: 'characters', icon: '🤖', price: 1200, description: 'Dłuższy czas za cięcie (+1s)', bonus: { type: 'timeGainBonus', value: 1.0 } },
    hat_tophat: { id: 'hat_tophat', name: 'Cylinder', category: 'hats', icon: '🎩', price: 150, description: 'Spowalnia czas o 5%', bonus: { type: 'timerSlowdown', value: 0.05 } },
    hat_grad: { id: 'hat_grad', name: 'Czapka Absolwenta', category: 'hats', icon: '🎓', price: 300, description: 'Spowalnia czas o 10%', bonus: { type: 'timerSlowdown', value: 0.10 } },
    hat_crown: { id: 'hat_crown', name: 'Korona', category: 'hats', icon: '👑', price: 1000, description: 'Spowalnia czas o 15%', bonus: { type: 'timerSlowdown', value: 0.15 } },
    axe_sword: { id: 'axe_sword', name: 'Miecz', category: 'axes', icon: '⚔️', price: 200, description: '+1 pkt za cięcie', bonus: { type: 'pointsPerChop', value: 1 } },
    axe_pickaxe: { id: 'axe_pickaxe', name: 'Kilof', category: 'axes', icon: '⛏️', price: 400, description: '+2 pkt za cięcie', bonus: { type: 'pointsPerChop', value: 2 } },
    axe_golden: { id: 'axe_golden', name: 'Złota Siekiera', category: 'axes', icon: '🪓', price: 800, description: '+3 pkt za cięcie', bonus: { type: 'pointsPerChop', value: 3 } },
    acc_glasses: { id: 'acc_glasses', name: 'Okulary 3D', category: 'accessories', icon: '🕶️', price: 300, description: 'Monety +10%', bonus: { type: 'coinMultiplier', value: 0.1 } },
    acc_scarf: { id: 'acc_scarf', name: 'Szalik', category: 'accessories', icon: '🧣', price: 500, description: 'Monety +20%', bonus: { type: 'coinMultiplier', value: 0.2 } },
    pet_dog: { id: 'pet_dog', name: 'Piesek', category: 'pets', icon: '🐶', price: 2500, description: 'Jednorazowa ochrona', bonus: { type: 'oneTimeSave', value: 1 } },
    pet_cat: { id: 'pet_cat', name: 'Kotek', category: 'pets', icon: '🐱', price: 2500, description: 'Jednorazowa ochrona', bonus: { type: 'oneTimeSave', value: 1 } }, };
const lootBoxData = {
    'hats': [
        {
            id: 'box_hats_1',
            name: 'Zwykła Skrzynia Kapelusznika',
            price: 200,
            description: 'Zawiera pospolite i rzadkie czapki.',
            icon: '📦',
            enabled: true,
            lootPool: [
                { itemId: 'hat_tophat', rarity: 'common', weight: 10 },
                { itemId: 'hat_grad', rarity: 'rare', weight: 4 }
            ]
        },
        {
            id: 'box_hats_2',
            name: 'Legendarna Skrzynia Koronna',
            price: 1500,
            description: 'Gwarantowana legendarna czapka!',
            icon: '👑',
            enabled: false, // Ta skrzynka jest na razie niedostępna
            lootPool: [
                { itemId: 'hat_crown', rarity: 'legendary', weight: 1 }
            ]
        }
    ],
    'axes': [
        {
            id: 'box_axes_1',
            name: 'Skrzynia Drwala',
            price: 400,
            description: 'Zawiera losową siekierę.',
            icon: '📦',
            enabled: true,
            lootPool: [
                { itemId: 'axe_sword', rarity: 'common', weight: 10 },
                { itemId: 'axe_pickaxe', rarity: 'rare', weight: 4 },
                { itemId: 'axe_golden', rarity: 'legendary', weight: 1 }
            ]
        }
    ],
    'characters': [
        {
            id: 'box_characters_1',
            name: 'Skrzynia Bohaterów',
            price: 800,
            description: 'Odblokowuje losową postać.',
            icon: '🎁',
            enabled: true,
            lootPool: [
                { itemId: 'char_santa', rarity: 'common', weight: 10 },
                { itemId: 'char_vampire', rarity: 'rare', weight: 4 },
                { itemId: 'char_robot', rarity: 'legendary', weight: 1 }
            ]
        }
    ],
    'accessories': [
         {
            id: 'box_accessories_1',
            name: 'Paczka z Akcesoriami',
            price: 500,
            description: 'Zawiera losowe akcesorium.',
            icon: '🎁',
            enabled: true,
            lootPool: [
                { itemId: 'acc_glasses', rarity: 'common', weight: 6 },
                { itemId: 'acc_scarf', rarity: 'rare', weight: 3 }
            ]
        }
    ],
    'pets': [
        {
            id: 'box_pets_1',
            name: 'Kosz ze Zwierzakiem',
            price: 3000,
            description: 'Może zawierać uroczego towarzysza.',
            icon: '🎀',
            enabled: true,
            lootPool: [
                { itemId: 'pet_dog', rarity: 'legendary', weight: 1 },
                { itemId: 'pet_cat', rarity: 'legendary', weight: 1 }
            ]
        }
    ]
};

// --- Inicjalizacja Aplikacji Express ---
const app = express();
app.set('trust proxy', 1);
app.use(express.json()); // Middleware do parsowania JSON w ciele zapytań POST

// --- Konfiguracja CORS ---
app.use(cors({
    origin: [
        'https://timberkitty.netlify.app', // Adres produkcyjny
        'http://127.0.0.1:5500'          // Adres deweloperski
    ],
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
            'INSERT INTO users (google_id, display_name, avatar_url, unlocked_items, exp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, displayName, photos[0].value, {}, 0]
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
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            // Użytkownik znaleziony, wszystko w porządku
            done(null, result.rows[0]);
        } else {
            // Użytkownik nie istnieje, grzecznie zakończ sesję
            done(null, false); 
        }
    } catch (err) {
        // Wystąpił błąd bazy danych
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
// W pliku server.js, ZASTĄP stary endpoint /api/stats tym kodem

app.post('/api/stats', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby zapisać postęp.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Odczytujemy wyniki z gry i nowe sumy bezpośrednio z zapytania
        const { scoreFromGame, coinsEarned, newTotals } = req.body;
        const userId = req.user.id;

        // --- 1. Zaktualizuj główne statystyki gracza używając gotowych sum ---
        const achievementsArrayLiteral = `{${newTotals.unlockedAchievements.join(',')}}`;
        const unlockedItemsJSON = JSON.stringify(newTotals.unlockedItems);
        const equippedItemsJSON = JSON.stringify(newTotals.equippedItems);

        await client.query(
            `UPDATE users SET high_score = $1, total_chops = $2, coins = $3, unlocked_achievements = $4, unlocked_items = $5, equipped_items = $6, exp = $7 WHERE id = $8`,
            [newTotals.highScore, newTotals.totalChops, newTotals.coins, achievementsArrayLiteral, unlockedItemsJSON, equippedItemsJSON, newTotals.exp, userId]
        );

        // --- 2. Zaktualizuj postęp w misjach używając wyników z TEJ JEDNEJ GRY ---
        const { rows: activeMissions } = await client.query(`
            SELECT pam.id, pam.progress, mp.type, mp.target_value
            FROM player_active_missions pam JOIN missions_pool mp ON pam.mission_id = mp.id
            WHERE pam.user_id = $1 AND pam.is_completed = false
        `, [userId]);

        for (const mission of activeMissions) {
            console.log(`--- Przetwarzanie misji ID: ${mission.id}, Typ: ${mission.type}, Obecny postęp: ${mission.progress} ---`);
            let progressGained = 0;
            switch (mission.type) {
                case 'CHOP_TOTAL':
                    progressGained = scoreFromGame || 0;
                    break;
                case 'SCORE_SINGLE_GAME':
                    // Ta misja jest o najwyższym wyniku, a nie sumie, więc aktualizujemy inaczej
                    if (scoreFromGame > mission.progress) {
                         await client.query('UPDATE player_active_missions SET progress = $1 WHERE id = $2', [scoreFromGame, mission.id]);
                    }
                    continue; // Przejdź do następnej misji
                case 'EARN_COINS_TOTAL':
                    progressGained = Math.floor(coinsEarned || 0);
                    break;
            }

            if (progressGained > 0) {
                // Dodajemy postęp do istniejącego
                console.log(`Misja ${mission.id}: Obliczono postęp do dodania: ${progressGained}`);
                await client.query(
                    'UPDATE player_active_missions SET progress = progress + $1 WHERE id = $2',
                    [progressGained, mission.id]
                );
                console.log(`Misja ${mission.id}: Wysłano aktualizację postępu do bazy.`);
            } else {
                // LOG 4: Sprawdzamy, dlaczego nic się nie stało
                console.log(`Misja ${mission.id}: Brak postępu do dodania (obliczone progressGained = ${progressGained})`);
            }
        }
        
        // Sprawdź, które misje zostały właśnie ukończone
        await client.query(`
            UPDATE player_active_missions
            SET is_completed = true
            WHERE user_id = $1 AND is_completed = false AND progress >= (SELECT target_value FROM missions_pool WHERE id = mission_id)
        `, [userId]);

        const { rows: updatedUser } = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        await client.query('COMMIT');

        res.status(200).json(updatedUser[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Błąd zapisu statystyk i postępu misji:', err);
        res.status(500).json({ message: 'Błąd serwera podczas zapisywania postępu.' });
    } finally {
        client.release();
    }
});

app.post('/api/open-box', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby otworzyć skrzynkę.' });
    }

    const { boxId } = req.body;
    const userId = req.user.id;

    let boxData = null;
    for (const category in lootBoxData) {
        const foundBox = lootBoxData[category].find(b => b.id === boxId);
        if (foundBox) {
            boxData = foundBox;
            break;
        }
    }

    if (!boxData) {
        return res.status(404).json({ message: 'Nie znaleziono takiej skrzynki.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Pobierz aktualny stan monet gracza (z blokadą wiersza na czas transakcji)
        const userResult = await client.query('SELECT coins, unlocked_items FROM users WHERE id = $1 FOR UPDATE', [userId]);
        const user = userResult.rows[0];

        if (user.coins < boxData.price) {
            await client.query('ROLLBACK'); // Wycofaj transakcję
            return res.status(400).json({ message: 'Za mało monet!' });
        }

        // Odejmij koszt skrzynki
        const newCoins = user.coins - boxData.price;

        // --- Logika losowania nagrody ---
        const totalWeight = boxData.lootPool.reduce((sum, item) => sum + item.weight, 0);
        let randomRoll = Math.random() * totalWeight;
        let wonItem = null;

        for (const item of boxData.lootPool) {
            randomRoll -= item.weight;
            if (randomRoll <= 0) {
                wonItem = item;
                break;
            }
        }
        // --- Koniec logiki losowania ---

        // Zaktualizuj ekwipunek gracza
        const newUnlockedItems = { ...user.unlocked_items };
        const currentQuantity = newUnlockedItems[wonItem.itemId] || 0;
        newUnlockedItems[wonItem.itemId] = currentQuantity + 1;

        const unlockedItemsJSON = JSON.stringify(newUnlockedItems);

        // Zapisz zmiany w bazie danych
        const updateResult = await client.query(
            'UPDATE users SET coins = $1, unlocked_items = $2 WHERE id = $3 RETURNING *',
            [newCoins, unlockedItemsJSON, userId]
        );

        await client.query('COMMIT');

        // Wyślij odpowiedź do gracza z informacją o wygranej i zaktualizowanymi danymi
        res.status(200).json({
            wonItem: shopData[wonItem.itemId], // Wyślij pełne dane przedmiotu
            updatedUser: updateResult.rows[0]
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Błąd podczas otwierania skrzynki:', err);
        res.status(500).json({ message: 'Błąd serwera podczas otwierania skrzynki.' });
    } finally {
        client.release();
    }
});

// Endpoint do resetowania postępu użytkownika
app.post('/api/reset-progress', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby zresetować postęp.' });
    }

    try {
        const userId = req.user.id;

        // Resetuj wszystkie statystyki użytkownika do wartości domyślnych
        const result = await pool.query(
            `UPDATE users 
             SET high_score = 0, total_chops = 0, coins = 0, exp = 0, 
                 unlocked_achievements = '{}', unlocked_items = '{}', 
                 equipped_items = '{"character": null, "hat": null, "axe": null, "accessory": null, "pet": null}'
             WHERE id = $1 RETURNING *`,
            [userId]
        );

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Błąd resetowania postępu:', err);
        res.status(500).json({ message: 'Błąd serwera podczas resetowania postępu.' });
    }
});

// Endpoint do aktualizacji profilu użytkownika
app.post('/api/update-profile', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby edytować profil.' });
    }

    try {
        const userId = req.user.id;
        const { display_name, avatar_type } = req.body;

        // Przygotuj zapytanie SQL dynamicznie
        let updateFields = [];
        let values = [];
        let paramCount = 1;

        if (display_name !== undefined) {
            updateFields.push(`display_name = $${paramCount}`);
            values.push(display_name);
            paramCount++;
        }

        if (avatar_type !== undefined) {
            updateFields.push(`avatar_type = $${paramCount}`);
            values.push(avatar_type);
            paramCount++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'Brak danych do aktualizacji.' });
        }

        // Dodaj WHERE clause
        values.push(userId);

        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        
        const result = await pool.query(query, values);

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Błąd aktualizacji profilu:', err);
        res.status(500).json({ message: 'Błąd serwera podczas aktualizacji profilu.' });
    }
});

// Endpoint do pobierania rankingu
app.get('/api/leaderboard', async (req, res) => {
    try {
        const { type = 'highscore', score } = req.query;
        const userId = req.user ? req.user.id : null;
        
        let orderBy = '';
        let limit = 50; // Limit do 50 graczy
        
        switch (type) {
            case 'highscore':
                orderBy = 'high_score DESC, total_chops DESC, created_at ASC';
                break;
            case 'totalchops':
                orderBy = 'total_chops DESC, high_score DESC, created_at ASC';
                break;
            case 'level':
                orderBy = 'exp DESC, high_score DESC, created_at ASC';
                break;
            case 'coins':
                orderBy = 'coins DESC, high_score DESC, created_at ASC';
                break;
            default:
                orderBy = 'high_score DESC, total_chops DESC, created_at ASC';
        }
        
        // Pobierz ranking graczy
        const leaderboardQuery = `
            SELECT 
                id, display_name, avatar_url, avatar_type, 
                high_score, total_chops, coins, exp,
                created_at
            FROM users 
            WHERE high_score > 0
            ORDER BY ${orderBy}
            LIMIT $1
        `;
        
        const leaderboardResult = await pool.query(leaderboardQuery, [limit]);
        let leaderboard = leaderboardResult.rows;
        
        // Dodaj informację o aktualnym użytkowniku
        if (userId) {
            leaderboard = leaderboard.map(player => ({
                ...player,
                isCurrentUser: player.id === userId
            }));
        }
        
        // Znajdź pozycję użytkownika w rankingu
        let userRank = null;
        if (userId) {
            const userQuery = `
                SELECT 
                    id, display_name, avatar_url, avatar_type,
                    high_score, total_chops, coins, exp,
                    ROW_NUMBER() OVER (ORDER BY ${orderBy}) as rank
                FROM users 
                WHERE id = $1 AND high_score > 0
            `;
            
            const userResult = await pool.query(userQuery, [userId]);
            if (userResult.rows.length > 0) {
                userRank = userResult.rows[0];
            }
        }
        
        res.status(200).json({
            leaderboard,
            userRank,
            type
        });
        
    } catch (err) {
        console.error('Błąd pobierania rankingu:', err);
        res.status(500).json({ message: 'Błąd serwera podczas pobierania rankingu.' });
    }
});

// Wklej ten kod w server.js razem z innymi endpointami API

app.get('/api/missions', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby zobaczyć misje.' });
    }

    const userId = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Rozpocznij transakcję

        const timeCategories = [
            { name: 'daily', count: 3 },
            { name: 'weekly', count: 5 },
            { name: 'monthly', count: 10 }
        ];

        const now = new Date();

        for (const category of timeCategories) {
            const { rows: activeMissions } = await client.query(
                'SELECT generated_at FROM player_active_missions WHERE user_id = $1 AND mission_id IN (SELECT id FROM missions_pool WHERE time_category = $2) LIMIT 1',
                [userId, category.name]
            );
        
            let needsNewMissions = true;
            if (activeMissions.length > 0) {
                const generatedAt = new Date(activeMissions[0].generated_at);
                generatedAt.setHours(0, 0, 0, 0); // Normalizuj datę do północy
        
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalizuj dzisiejszą datę do północy
        
                if (category.name === 'daily' && today.getTime() === generatedAt.getTime()) {
                    needsNewMissions = false;
                }
                
                if (category.name === 'weekly') {
                    const startOfWeek = new Date(today);
                    // Ustaw na ostatni poniedziałek (dzień tygodnia: 0=Nd, 1=Pon, ..., 6=Sob)
                    startOfWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); 
                    if (generatedAt >= startOfWeek) {
                        needsNewMissions = false;
                    }
                }
        
                if (category.name === 'monthly' && today.getFullYear() === generatedAt.getFullYear() && today.getMonth() === generatedAt.getMonth()) {
                    needsNewMissions = false;
                }
            }
        
            if (needsNewMissions) {
                // Ta część kodu (usuwanie, losowanie, wstawianie) pozostaje bez zmian...
                console.log(`Generowanie nowych misji [${category.name}] dla użytkownika ${userId}`);
                await client.query(
                    'DELETE FROM player_active_missions WHERE user_id = $1 AND mission_id IN (SELECT id FROM missions_pool WHERE time_category = $2)',
                    [userId, category.name]
                );
                const { rows: missionPool } = await client.query(
                    'SELECT id FROM missions_pool WHERE time_category = $1 ORDER BY RANDOM() LIMIT $2',
                    [category.name, category.count]
                );
                for (const mission of missionPool) {
                    await client.query(
                        'INSERT INTO player_active_missions (user_id, mission_id, generated_at) VALUES ($1, $2, NOW())',
                        [userId, mission.id]
                    );
                }
            }
        }
        
        // 5. Pobierz wszystkie aktualne misje gracza i zwróć je do frontendu
        const { rows: finalMissions } = await client.query(`
            SELECT pam.id, pam.progress, pam.is_completed, pam.is_claimed,
                   mp.description_key, mp.type, mp.target_value, mp.reward_coins, mp.reward_exp, mp.time_category
            FROM player_active_missions pam
            JOIN missions_pool mp ON pam.mission_id = mp.id
            WHERE pam.user_id = $1
        `, [userId]);

        await client.query('COMMIT'); // Zatwierdź transakcję

        // Pogrupuj misje przed wysłaniem
        const groupedMissions = {
            daily: finalMissions.filter(m => m.time_category === 'daily'),
            weekly: finalMissions.filter(m => m.time_category === 'weekly'),
            monthly: finalMissions.filter(m => m.time_category === 'monthly'),
        };

        res.status(200).json(groupedMissions);

    } catch (err) {
        await client.query('ROLLBACK'); // Wycofaj zmiany w razie błędu
        console.error('Błąd podczas generowania/pobierania misji:', err);
        res.status(500).json({ message: 'Błąd serwera podczas obsługi misji.' });
    } finally {
        client.release();
    }
});

app.post('/api/missions/claim', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby odebrać nagrodę.' });
    }

    const { missionId } = req.body; // Oczekujemy ID z tabeli player_active_missions
    if (!missionId) {
        return res.status(400).json({ message: 'Nie podano ID misji.' });
    }

    const userId = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Pobierz misję i upewnij się, że spełnia wszystkie warunki
        const missionResult = await client.query(`
            SELECT pam.id, pam.user_id, pam.is_completed, pam.is_claimed,
                   mp.reward_coins, mp.reward_exp
            FROM player_active_missions pam
            JOIN missions_pool mp ON pam.mission_id = mp.id
            WHERE pam.id = $1 AND pam.user_id = $2
            FOR UPDATE 
        `, [missionId, userId]);

        if (missionResult.rows.length === 0) {
            throw new Error('Nie znaleziono misji lub nie należy ona do Ciebie.');
        }

        const mission = missionResult.rows[0];

        if (!mission.is_completed) {
            throw new Error('Ta misja nie została jeszcze ukończona!');
        }
        if (mission.is_claimed) {
            throw new Error('Ta nagroda została już odebrana!');
        }

        // 2. Zaktualizuj statystyki gracza
        await client.query(
            'UPDATE users SET coins = coins + $1, exp = exp + $2 WHERE id = $3',
            [mission.reward_coins, mission.reward_exp, userId]
        );

        // 3. Oznacz misję jako odebraną
        await client.query(
            'UPDATE player_active_missions SET is_claimed = true WHERE id = $1',
            [missionId]
        );

        // 4. Pobierz zaktualizowane dane gracza, aby odesłać je do frontendu
        const { rows: updatedUser } = await client.query('SELECT * FROM users WHERE id = $1', [userId]);

        await client.query('COMMIT');
        res.status(200).json({ 
            message: 'Nagroda odebrana!',
            updatedUser: updatedUser[0] 
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Błąd podczas odbierania nagrody za misję:', err);
        // Sprawdzamy, czy błąd ma zdefiniowaną przez nas wiadomość
        res.status(400).json({ message: err.message || 'Błąd serwera.' });
    } finally {
        client.release();
    }
});

// Endpoint do odświeżania misji za opłatą
app.post('/api/missions/refresh', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby odświeżyć misje.' });
    }

    const { missionType } = req.body;
    if (!missionType || !['daily', 'weekly', 'monthly'].includes(missionType)) {
        return res.status(400).json({ message: 'Nieprawidłowy typ misji.' });
    }

    const userId = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Koszty odświeżenia
        const costs = { daily: 100, weekly: 200, monthly: 300 };
        const cost = costs[missionType];

        // Pobierz aktualne monety gracza
        const userResult = await client.query('SELECT coins FROM users WHERE id = $1 FOR UPDATE', [userId]);
        const user = userResult.rows[0];

        if (user.coins < cost) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Za mało monet!' });
        }

        // Sprawdź czy gracz ma ukończone misje tego typu
        const { rows: completedMissions } = await client.query(`
            SELECT pam.id, pam.is_completed, pam.is_claimed
            FROM player_active_missions pam 
            JOIN missions_pool mp ON pam.mission_id = mp.id
            WHERE pam.user_id = $1 AND mp.time_category = $2
        `, [userId, missionType]);

        // Sprawdź czy wszystkie misje są ukończone i odebrane
        const allCompletedAndClaimed = completedMissions.every(mission => 
            mission.is_completed && mission.is_claimed
        );

        if (!allCompletedAndClaimed) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Możesz odświeżyć misje tylko gdy wszystkie są ukończone i odebrane!' });
        }

        // Odejmij koszt od monet gracza
        await client.query(
            'UPDATE users SET coins = coins - $1 WHERE id = $2',
            [cost, userId]
        );

        // Usuń stare misje tego typu
        await client.query(`
            DELETE FROM player_active_missions 
            WHERE user_id = $1 AND mission_id IN (
                SELECT id FROM missions_pool WHERE time_category = $2
            )
        `, [userId, missionType]);

        // Wygeneruj nowe misje tego typu
        const missionCounts = { daily: 3, weekly: 5, monthly: 10 };
        const count = missionCounts[missionType];

        const { rows: newMissions } = await client.query(
            'SELECT id FROM missions_pool WHERE time_category = $1 ORDER BY RANDOM() LIMIT $2',
            [missionType, count]
        );

        for (const mission of newMissions) {
            await client.query(
                'INSERT INTO player_active_missions (user_id, mission_id, generated_at) VALUES ($1, $2, NOW())',
                [userId, mission.id]
            );
        }

        // Pobierz zaktualizowane dane gracza
        const { rows: updatedUser } = await client.query('SELECT * FROM users WHERE id = $1', [userId]);

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Misje zostały odświeżone!',
            updatedUser: updatedUser[0]
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Błąd podczas odświeżania misji:', err);
        res.status(500).json({ message: 'Błąd serwera podczas odświeżania misji.' });
    } finally {
        client.release();
    }
});

// Endpoint do odświeżania pojedynczej misji
app.post('/api/missions/refresh-single', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Musisz być zalogowany, aby odświeżyć misje.' });
    }

    const { missionId, timeCategory } = req.body;
    if (!missionId || !timeCategory || !['daily', 'weekly', 'monthly'].includes(timeCategory)) {
        return res.status(400).json({ message: 'Nieprawidłowe dane misji.' });
    }

    const userId = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Koszty odświeżenia
        const costs = { daily: 100, weekly: 200, monthly: 300 };
        const cost = costs[timeCategory];

        // Pobierz aktualne monety gracza
        const userResult = await client.query('SELECT coins FROM users WHERE id = $1 FOR UPDATE', [userId]);
        const user = userResult.rows[0];

        if (user.coins < cost) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Za mało monet!' });
        }

        // Sprawdź czy misja istnieje i należy do gracza
        const { rows: existingMission } = await client.query(`
            SELECT pam.id, pam.is_claimed, mp.time_category
            FROM player_active_missions pam 
            JOIN missions_pool mp ON pam.mission_id = mp.id
            WHERE pam.id = $1 AND pam.user_id = $2
        `, [missionId, userId]);

        if (existingMission.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Nie znaleziono misji.' });
        }

        if (existingMission[0].is_claimed) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Nie można odświeżyć już odebranej misji!' });
        }

        // Odejmij koszt od monet gracza
        await client.query(
            'UPDATE users SET coins = coins - $1 WHERE id = $2',
            [cost, userId]
        );

        // Usuń starą misję
        await client.query(
            'DELETE FROM player_active_missions WHERE id = $1',
            [missionId]
        );

        // Wygeneruj nową misję tego samego typu
        const { rows: newMission } = await client.query(
            'SELECT id FROM missions_pool WHERE time_category = $1 ORDER BY RANDOM() LIMIT 1',
            [timeCategory]
        );

        if (newMission.length > 0) {
            await client.query(
                'INSERT INTO player_active_missions (user_id, mission_id, generated_at) VALUES ($1, $2, NOW())',
                [userId, newMission[0].id]
            );
        }

        // Pobierz zaktualizowane dane gracza
        const { rows: updatedUser } = await client.query('SELECT * FROM users WHERE id = $1', [userId]);

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Misja została odświeżona!',
            updatedUser: updatedUser[0]
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Błąd podczas odświeżania pojedynczej misji:', err);
        res.status(500).json({ message: 'Błąd serwera podczas odświeżania misji.' });
    } finally {
        client.release();
    }
});

// --- URUCHOMIENIE SERWERA ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});