# 😼 TimberKitty 🪓

# 😼 TimberKitty 🪓

An addictive arcade game with a charming twist on the classic Timberman. Built from scratch using pure JavaScript, HTML5 Canvas, and a fully functional Node.js backend for online progress saving.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20TimberKitty!-brightgreen?style=for-the-badge)](https://timberkitty.netlify.app)

---

## 🌟 Key Features

- **Google Login:** Full integration with OAuth 2.0 for secure player authentication.
- **Online Progress Saving:** All stats, items, and achievements are tied to the player's account and saved in a PostgreSQL database.
- **Guest Mode:** Players can enjoy the game without logging in, with their progress saved to `localStorage`.
- **Mission System:** A fully functional system for Daily, Weekly, and Monthly missions with rewards.
- **Online Player Leaderboards:** Global rankings for high scores, total chops, level, and coins.
- **Item Crate (Lootbox) System:** Purchase crates with random items of varying rarities.
- **Shop & Equipment System:** Buy and equip items (axes, hats, characters) that provide real in-game bonuses.
- **Item Rarity Visualization:** Equipped items now have colored borders corresponding to their rarity.
- **Achievement System:** Dozens of achievements to unlock for reaching in-game milestones.
- **Profile Customization:** Ability to change your username and in-game avatar.
- **Multilingual Support:** The interface is available in both Polish and English.
- **Dynamic Gameplay:** Smooth animation based on HTML5 Canvas, complete with particle effects and a procedurally generated tree.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS, i18next
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (hosted on Supabase)
- **Authentication:** Passport.js (Google OAuth 2.0 Strategy)
- **Hosting:**
  - Frontend: Netlify
  - Backend: Render

---

## 🚀 Roadmap / Future Plans

This project is in active development! The list below outlines planned features, divided into stages.

### Near-Term Plans

- [ ] **New Game Modes:** Introduce alternative modes, like "Save the Birds," with specific objectives to complete.
- [ ] **Combo System:** Reward players for fast and fluid chopping with a score multiplier.
- [ ] **In-Game Power-ups:** Add special trunk segments that provide instant bonuses (e.g., extra coins, time freeze).

### Game & Competition Expansion

- [ ] **Weekly Tournaments & Leagues:** Compete in small groups for valuable prizes and promotion to higher leagues.
- [ ] **Battle Pass & Seasonal Events:** Special events (e.g., holiday-themed) with unique rewards and a battle pass.
- [ ] **Daily Login Rewards:** A system that rewards players for returning to the game regularly.
- [ ] **New Worlds & Items:** Expand the game with new, themed worlds featuring dedicated crates and equipment.
- [ ] **Full Equipment Visualization:** See equipped items (like hats) directly on the player character in-game.

### Long-Term Visions

- [ ] **Monetization:** Introduce optional microtransactions (e.g., coin packs).
- [ ] **Village / Building System:** Expand the game with strategic elements, like building your own lumberjack settlement.
- [ ] **PvP Game Modes:** Compete directly against other players or bots based on time or score.
- [ ] **Global Player Chat:** A real-time communication system for players.

---

## 💻 Running Locally

1.  Clone the repository: `git clone https://github.com/TomKingRAKI/TimberKitty.git`
2.  Install backend dependencies: `cd backend && npm install`
3.  Create a `.env` file in the `backend` folder and fill it with your API keys.
4.  Run the server: `node server.js`
5.  Open the `frontend/index.html` file in your browser (e.g., using the Live Server extension).
