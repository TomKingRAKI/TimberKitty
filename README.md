# 🌲 Timberman Clone 🪓

Wciągająca gra zręcznościowa w stylu klasycznego Timbermana, stworzona od zera przy użyciu czystego JavaScript, HTML5 Canvas oraz w pełni funkcjonalnego backendu do zapisu postępów online.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now!-brightgreen?style=for-the-badge)](https://timberkitty.netlify.app)

---

## 🌟 Kluczowe Funkcje

* **Logowanie przez Google:** Pełna integracja z OAuth 2.0 do bezpiecznego uwierzytelniania graczy.
* **Zapis Postępów Online:** Wszystkie statystyki, przedmioty i osiągnięcia są przypisane do konta gracza i zapisywane w bazie danych PostgreSQL.
* **Tryb Gościa:** Możliwość gry bez logowania z zapisem postępów w `localStorage`.
* **Sklep i Ekwipunek:** System kupowania przedmiotów (siekier, czapek, postaci), które dają realne bonusy w grze.
* **System Osiągnięć:** Kilkanaście osiągnięć do odblokowania za postępy w grze.
* **Dynamiczna Rozgrywka:** Płynna animacja oparta na HTML5 Canvas, z efektami cząsteczkowymi i dynamicznie generowanym drzewem.

---

## 🛠️ Użyte Technologie

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Baza Danych:** PostgreSQL (hostowana na Supabase)
* **Autoryzacja:** Passport.js (strategia Google OAuth 2.0)
* **Hosting:**
    * Frontend: Netlify
    * Backend: Render

---

## 🚀 Roadmap / Plany Rozwoju

Ten projekt będzie dalej rozwijany! Poniżej znajduje się lista planowanych funkcji:

* [ ] **Nowe Mapy i Motywy:** Dodanie możliwości zmiany otoczenia (np. motyw zimowy, nocny, pustynny).
* [ ] **Poprawa Grafiki i Animacji:** Wprowadzenie bardziej zaawansowanych animacji postaci i otoczenia.
* [ ] **Optymalizacja Mobilna:** Ulepszenie sterowania i interfejsu dla urządzeń dotykowych.
* [ ] **Tryb Rywalizacji:** Stworzenie globalnej tablicy wyników (leaderboard) i być może cotygodniowych turniejów.
* [ ] **Dynamiczne Power-upy:** Dodanie przedmiotów specjalnych (np. zatrzymanie czasu, bomby czyszczące gałęzie) pojawiających się w trakcie gry.
* [ ] **Misje Dzienne:** System codziennych wyzwań z nagrodami.
* [ ] **Więcej Przedmiotów i Osiągnięć:** Rozbudowa sklepu o nowe kategorie i dodanie bardziej wymagających osiągnięć.

---

## 💻 Uruchomienie Lokalne

1.  Sklonuj repozytorium: `git clone <URL>`
2.  Zainstaluj zależności backendu: `cd backend && npm install`
3.  Stwórz plik `.env` w folderze `backend` na podstawie własnych kluczy API.
4.  Uruchom serwer: `node server.js`
5.  Otwórz plik `frontend/index.html` w swojej przeglądarce.
