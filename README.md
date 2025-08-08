# 😼 TimberKitty 🪓

An addictive arcade game with a charming twist on the classic Timberman. Built from scratch using pure JavaScript, HTML5 Canvas, and a fully functional Node.js backend for online progress saving.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20TimberKitty!-brightgreen?style=for-the-badge)](https://timberkitty.netlify.app)

---

## 🌟 Key Features

* **Google Login:** Full integration with OAuth 2.0 for secure player authentication.
* **Online Progress Saving:** All stats, items, and achievements are tied to the player's account and saved in a PostgreSQL database.
* **Guest Mode:** Players can enjoy the game without logging in, with their progress saved to `localStorage`.
* **Shop & Equipment System:** A system for purchasing items (axes, hats, characters) that provide real in-game bonuses.
* **Achievement System:** Dozens of achievements to unlock for reaching milestones.
* **Dynamic Gameplay:** Smooth animation based on HTML5 Canvas, complete with particle effects and a procedurally generated tree.

---

## 🛠️ Tech Stack

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (hosted on Supabase)
* **Authentication:** Passport.js (Google OAuth 2.0 Strategy)
* **Hosting:**
    * Frontend: Netlify
    * Backend: Render

---

## 🚀 Roadmap / Future Plans

This project is actively being developed! The list below outlines planned features:

* [ ] **Main Character Sprite:** Replace the current player graphic with a cute, animated cat to match the "TimberKitty" theme.
* [ ] **New Maps & Themes:** Add the ability to switch environments (e.g., winter, night, desert themes).
* [ ] **Improved Graphics & Animations:** Introduce more advanced animations for the character and the environment.
* [ ] **Mobile Optimization:** Enhance controls and UI for a better experience on touch devices.
* [ ] **Competitive Mode:** Implement a global leaderboard and possibly weekly tournaments.
* [ ] **In-Game Power-ups:** Add special items (e.g., time freeze, branch-clearing bombs) that appear during gameplay.
* [ ] **Daily Missions:** A system of daily challenges with rewards.
* [ ] **More Items & Achievements:** Expand the shop with new categories and add more challenging achievements.

---

## 💻 Running Locally

1.  Clone the repository: `git clone https://github.com/TomKingRAKI/TimberKitty.git`
2.  Install backend dependencies: `cd backend && npm install`
3.  Create a `.env` file in the `backend` folder based on your own API keys.
4.  Run the server: `node server.js`
5.  Open the `frontend/index.html` file in your browser.
