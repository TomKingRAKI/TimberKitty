// Krok 1: Importowanie bibliotek
require('dotenv').config(); // Ładuje zmienne z pliku .env
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Krok 2: Inicjalizacja aplikacji Express
const app = express();
app.set('trust proxy', 1);
const PORT = 3000;

// Krok 3: Konfiguracja sesji
// Sesja pozwala serwerowi "pamiętać" zalogowanego użytkownika między zapytaniami
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Krok 4: Inicjalizacja Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Krok 5: Konfiguracja "Strategii Google"
// Tutaj mówimy Passportowi, jak ma się komunikować z Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback" // Na ten adres Google odeśle użytkownika po zalogowaniu
  },
  (accessToken, refreshToken, profile, done) => {
    // Ta funkcja uruchomi się, gdy Google potwierdzi tożsamość użytkownika
    console.log('Otrzymaliśmy profil od Google:');
    console.log(profile);

    // NA RAZIE: Po prostu zwracamy profil bez zapisu do bazy danych
    // W następnym kroku dodamy tutaj logikę bazy danych
    return done(null, profile);
  }
));

// Krok 6: Serializacja i Deserializacja użytkownika
// Mówimy Passportowi, jak zapisać użytkownika w sesji i jak go z niej odczytać
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


// --- ADRESY URL (ROUTING) ---

// Testowy adres
app.get('/', (req, res) => {
    res.send('Serwer Timberman działa! Jesteśmy gotowi do pracy.');
});

// Adres, na który gra przekieruje użytkownika, aby zacząć logowanie
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }) // Prosimy Google o profil i email
);

// Adres, na który Google odeśle użytkownika po zalogowaniu
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), // Jeśli się nie uda, wróć na stronę główną
  (req, res) => {
    // Sukces! Użytkownik jest zalogowany. Na razie przekierujmy go na stronę główną.
    // W przyszłości zmienimy to na adres Twojej gry na Netlify
    res.redirect('https://timberkitty.netlify.app'); 
  }
);

// Adres, który sprawdzi frontend, aby dowiedzieć się, kto jest zalogowany
app.get('/api/me', (req, res) => {
    if (req.user) {
        // Jeśli użytkownik jest w sesji (zalogowany), odeślij jego dane
        res.json(req.user);
    } else {
        // Jeśli nie, odeślij błąd "Unauthorized"
        res.status(401).json({ message: 'Użytkownik niezalogowany' });
    }
});

// Adres do wylogowania użytkownika
app.get('/auth/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        // Po wylogowaniu przekieruj z powrotem na stronę główną
        // W przyszłości wstawisz tu adres swojej gry na Netlify
        res.redirect('/'); 
    });
});


// --- URUCHOMIENIE SERWERA ---
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});

