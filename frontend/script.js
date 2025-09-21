// --- Ustawienia gry ---
const BACKEND_URL = 'https://timberman-backend.onrender.com';

// --- Konfiguracja Tłumaczeń (i18next) ---
function initI18n() {
  const i18n = window.i18next;

  if (!i18n) {
    console.error('i18next core nie jest załadowany.');
    return;
  }

  // Wbudowane zasoby tłumaczeń (fallback bez HTTP)
  const inlineResources = {
    pl: {
      translation: {
        title: 'TimberKitty',
        buttons: { loading: 'Ładowanie...', logout: 'Wyloguj się', login: 'Zaloguj się z Google' },
        bottomNav: { shop: 'Sklep', equipment: 'Ekwipunek', account: 'Konto' },
        statsPanel: {
          title: 'Profil Gracza', guest: 'Gość', coins: 'Monety', level: 'Poziom', menu: 'Menu', equipment: 'Ekwipunek 🎒', account: 'Konto 👤', missions: 'Misje 📜'
        },
        startScreen: { ready: 'Gotowy?', prompt: 'Kliknij przycisk, aby rozpocząć!', play: 'Graj!', reset: 'Zresetuj postęp' },
        gameOver: { title: 'Koniec Gry!', result: 'Twój wynik', playAgain: 'Zagraj Ponownie' },
        instructions: { controls: 'Użyj klawiszy (A/D, J/L, ←/→) lub kliknij, aby ścinać drzewo.', avoid: 'Omijaj gałęzie!' },
        shopPanel: { title: 'Sklep' },
        accountHub: {
          title: 'Konto Gracza',
          tabs: { stats: 'Statystyki', achievements: 'Osiągnięcia', missions: 'Misje', profile: 'Profil' },
          stats_tab: { 
            high_score: 'Najlepszy Wynik', 
            total_chops: 'Suma Ściętych', 
            leaderboard: 'Ranking 📈',
            leaderboard_title: '🏆 Ranking Graczy',
            leaderboard_highscore: '🎯 Najlepszy Wynik',
            leaderboard_totalchops: '🪓 Suma Ściętych',
            leaderboard_level: '⭐ Poziom',
            leaderboard_coins: '💰 Monety',
            leaderboard_loading: 'Ładowanie rankingu...',
            leaderboard_your_position: 'Twoja pozycja',
            leaderboard_rank: 'Miejsce',
            leaderboard_score: 'Wynik',
            leaderboard_chops: 'Ścięte',
            leaderboard_level_label: 'Poziom',
            leaderboard_coins_label: 'Monety',
            post_game_ranking_title: '🏆 Nowy Rekord!',
            post_game_ranking_continue: 'Kontynuuj'
          },
          profile_tab: { 
            equipment: 'Ekwipunek 🎒', 
            edit_profile: 'Edytuj Profil ✏️',
            guest_message: 'Zaloguj się, aby zobaczyć swój profil i zapisywać postęp',
            login_button: 'Zaloguj się przez Google',
            logout_button: 'Wyloguj się',
            change_avatar: 'Zmień Avatar',
            change_username: 'Zmień Nazwę',
            new_username_label: 'Nowa nazwa użytkownika',
            new_username_placeholder: 'Wprowadź nową nazwę',
            max_chars: 'Maksymalnie 50 znaków',
            avatar_preview_text: 'Wybierz nowy avatar z dostępnych opcji',
            cancel: 'Anuluj',
            save: 'Zapisz'
          }
        },
        gameOver: { 
            title: 'Koniec Gry!', 
            result: 'Twój wynik', 
            playAgain: 'Zagraj Ponownie',
            returnToMenu: 'Powrót do Menu' // <-- NOWY KLUCZ
        },
        mainMenu: {
            classic: 'Gra Zwykła',
            competition: 'Rywalizacja',
            birds: 'Uratuj Ptaki',
            challenges: 'Wyzwania'
        },
        classicMenu: {
            title: 'Tryb Klasyczny',
            start: 'Rozpocznij',
            back: 'Powrót'
        },
        birdsMenu: {
            title: 'Uratuj Ptaki',
            description: 'Wybierz poziom trudności i zetnij wymaganą liczbę pni, aby uratować ptaki!',
            easy: 'Łatwy',
            medium: 'Średni',
            hard: 'Trudny'
        },
        birdsMode: {
            warning: 'Ptaki są w niebezpieczeństwie!',
            preStart: 'Ptaki są w niebezpieczeństwie! Zetnij {{count}} pni, aby je ochronić.',
            success: 'Ptaki uratowane!',
            fail: 'Nie udało się uratować ptaków.',
            playAgain: 'Zagraj jeszcze raz',
            returnToMenu: 'Powrót do menu'
        },
        missions: {
            daily: 'Dzienne',
            weekly: 'Tygodniowe',
            monthly: 'Miesięczne',
            reward: 'Nagroda',
            claim: 'Odbierz',
            example_chop_desc: 'Zetnij 50 pni drzewa',
            no_weekly: 'Brak misji tygodniowych.',
            no_monthly: 'Brak misji miesięcznych.',
            no_daily: 'Brak misji dziennych.',
            loading: 'Ładowanie misji...',
            in_progress: 'W toku',
            claimed: 'Odebrano',
            next_refresh: 'Następne odświeżenie:',
            refresh: 'Odśwież',
            refresh_confirm: 'Czy na pewno chcesz odświeżyć misje za',
            refresh_success: 'Misje zostały odświeżone!',
            refresh_error: 'Błąd odświeżania misji',
            refresh_no_money: 'Za mało monet!',
            'desc.chop_50': 'Zetnij 50 pni',
            'desc.score_30': 'Zdobądź 30 punktów w jednej grze',
            'desc.chop_500': 'Zetnij łącznie 500 pni',
            'desc.score_100': 'Zdobądź 100 punktów w jednej grze',
            'desc.earn_1000': 'Zarób łącznie 1000 monet'
        },
        inventoryHub: { title: 'Ekwipunek' },
        equipmentModal: { title: 'Wybierz przedmiot', unequip: 'Zdejmij przedmiot' },
        lootbox: { continue: 'Kontynuuj' },
        revealModal: { title: 'Zdobyto Nowy Przedmiot!', button: 'Super!' },
        categories: { hats: 'Czapki', characters: 'Postacie', axes: 'Siekiery', accessories: 'Akcesoria', pets: 'Zwierzaki' },
        shop: { coins_label: 'monet', buy: 'KUP', buy_open: 'KUP i OTWÓRZ', coming_soon: 'WKRÓTCE DOSTĘPNE', possible_contents: 'Możliwa zawartość:' },
        achievements: {
          chop10: { name: 'Początkujący', description: 'Zetnij 10 drzew.' },
          chop100: { name: 'Drwal', description: 'Zetnij 100 drzew.' },
          chop500: { name: 'Mistrz Drwali', description: 'Zetnij 500 drzew.' },
          score50: { name: 'Szybkie Ręce', description: 'Zdobądź 50 pkt.' },
          score100: { name: 'Demon Prędkości', description: 'Zdobądź 100 pkt.' },
          coins100: { name: 'Kieszonkowe', description: 'Zdobądź 100 monet.' },
          coins1000: { name: 'Skarbnik', description: 'Zdobądź 1000 monet.' },
          noBranch10: { name: 'Szczęściarz', description: 'Zetnij 10 drzew bez gałęzi.' },
          locked: 'Zablokowane', none: 'Brak osiągnięć'
        },
        items: {
          char_santa: { name: 'Święty', description: 'Dłuższy czas za cięcie (+0.5s)' },
          char_vampire: { name: 'Wampir', description: 'Dłuższy czas za cięcie (+0.75s)' },
          char_robot: { name: 'Robot', description: 'Dłuższy czas za cięcie (+1s)' },
          hat_tophat: { name: 'Cylinder', description: 'Spowalnia czas o 5%' },
          hat_grad: { name: 'Czapka Absolwenta', description: 'Spowalnia czas o 10%' },
          hat_crown: { name: 'Korona', description: 'Spowalnia czas o 15%' },
          axe_sword: { name: 'Miecz', description: '+10% monet za wynik' },        // STARY OPIS: '+1 pkt za cięcie'
          axe_pickaxe: { name: 'Kilof', description: '+20% monet za wynik' },       // STARY OPIS: '+2 pkt za cięcie'
          axe_golden: { name: 'Złota Siekiera', description: '+30% monet za wynik' },
          acc_glasses: { name: 'Okulary 3D', description: 'Monety +10%' },
          acc_scarf: { name: 'Szalik', description: 'Monety +20%' },
          pet_dog: { name: 'Piesek', description: '+15% EXP za wynik' },           // STARY OPIS: 'Jednorazowa ochrona'
          pet_cat: { name: 'Kotek', description: '+15% EXP za wynik' }   
        },
        lootboxes: {
          box_hats_1: { name: 'Zwykła Skrzynia Kapelusznika', description: 'Zawiera pospolite i rzadkie czapki.' },
          box_hats_2: { name: 'Legendarna Skrzynia Koronna', description: 'Gwarantowana legendarna czapka!' },
          box_axes_1: { name: 'Skrzynia Drwala', description: 'Zawiera losową siekierę.' },
          box_characters_1: { name: 'Skrzynia Bohaterów', description: 'Odblokowuje losową postać.' },
          box_accessories_1: { name: 'Paczka z Akcesoriami', description: 'Zawiera losowe akcesorium.' },
          box_pets_1: { name: 'Kosz ze Zwierzakiem', description: 'Może zawierać uroczego towarzysza.' }
        }
      }
    },
    en: {
      translation: {
        title: 'TimberKitty',
        buttons: { loading: 'Loading...', logout: 'Log Out', login: 'Log in with Google' },
        bottomNav: { shop: 'Shop', equipment: 'Equipment', account: 'Account' },
        statsPanel: {
          title: 'Player Profile', guest: 'Guest', coins: 'Coins', level: 'Level', menu: 'Menu', equipment: 'Equipment 🎒', account: 'Account 👤', missions: 'Missions 📜'
        },
        startScreen: { ready: 'Ready?', prompt: 'Click the button to start!', play: 'Play!', reset: 'Reset progress' },
        gameOver: { title: 'Game Over!', result: 'Your score', playAgain: 'Play Again' },
        instructions: { controls: 'Use keys (A/D, J/L, ←/→) or click to chop the tree.', avoid: 'Avoid the branches!' },
        shopPanel: { title: 'Shop' },
        accountHub: {
          title: 'Player Account',
          tabs: { stats: 'Statistics', achievements: 'Achievements', missions: 'Missions', profile: 'Profile' },
          stats_tab: { 
            high_score: 'High Score', 
            total_chops: 'Total Chops', 
            leaderboard: 'Leaderboard 📈',
            leaderboard_title: '🏆 Player Ranking',
            leaderboard_highscore: '🎯 High Score',
            leaderboard_totalchops: '🪓 Total Chops',
            leaderboard_level: '⭐ Level',
            leaderboard_coins: '💰 Coins',
            leaderboard_loading: 'Loading leaderboard...',
            leaderboard_your_position: 'Your position',
            leaderboard_rank: 'Rank',
            leaderboard_score: 'Score',
            leaderboard_chops: 'Chops',
            leaderboard_level_label: 'Level',
            leaderboard_coins_label: 'Coins',
            post_game_ranking_title: '🏆 New Record!',
            post_game_ranking_continue: 'Continue'
          },
          profile_tab: { 
            equipment: 'Equipment 🎒', 
            edit_profile: 'Edit Profile ✏️',
            guest_message: 'Log in to see your profile and save progress',
            login_button: 'Log in with Google',
            logout_button: 'Log Out',
            change_avatar: 'Change Avatar',
            change_username: 'Change Username',
            new_username_label: 'New username',
            new_username_placeholder: 'Enter new username',
            max_chars: 'Maximum 50 characters',
            avatar_preview_text: 'Choose a new avatar from available options',
            cancel: 'Cancel',
            save: 'Save'
          }
        },
        gameOver: { 
            title: 'Game Over!', 
            result: 'Your score', 
            playAgain: 'Play Again',
            returnToMenu: 'Return to Menu' // <-- NEW KEY
        },
        mainMenu: {
            classic: 'Classic Game',
            competition: 'Competition',
            birds: 'Save the Birds',
            challenges: 'Challenges'
        },
        classicMenu: {
            title: 'Classic Mode',
            start: 'Start',
            back: 'Back'
        },
        birdsMenu: {
            title: 'Save the Birds',
            description: 'Choose difficulty level and chop the required number of trunks to save the birds!',
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard'
        },
        birdsMode: {
            warning: 'Birds are in danger!',
            preStart: 'Birds are in danger! Chop {{count}} trunks to save them.',
            success: 'Birds saved!',
            fail: 'Failed to save the birds.',
            playAgain: 'Play again',
            returnToMenu: 'Return to menu'
        },
        missions: {
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            reward: 'Reward',
            claim: 'Claim',
            example_chop_desc: 'Chop 50 tree trunks',
            no_weekly: 'No weekly missions.',
            no_monthly: 'No monthly missions.',
            no_daily: 'No daily missions.',
            loading: 'Loading missions...',
            in_progress: 'In Progress',
            claimed: 'Claimed',
            next_refresh: 'Next refresh:',
            refresh: 'Refresh',
            refresh_confirm: 'Are you sure you want to refresh missions for',
            refresh_success: 'Missions have been refreshed!',
            refresh_error: 'Error refreshing missions',
            refresh_no_money: 'Not enough coins!',
            // Keys from the database
            'desc.chop_50': 'Chop 50 trunks',
            'desc.score_30': 'Get 30 points in a single game',
            'desc.chop_500': 'Chop a total of 500 trunks',
            'desc.score_100': 'Get 100 points in a single game',
            'desc.earn_1000': 'Earn a total of 1000 coins'
        },
        inventoryHub: { title: 'Inventory' },
        equipmentModal: { title: 'Choose item', unequip: 'Unequip' },
        lootbox: { continue: 'Continue' },
        revealModal: { title: 'New Item Obtained!', button: 'Great!' },
        categories: { hats: 'Hats', characters: 'Characters', axes: 'Axes', accessories: 'Accessories', pets: 'Pets' },
        shop: { coins_label: 'coins', buy: 'BUY', buy_open: 'BUY & OPEN', coming_soon: 'COMING SOON', possible_contents: 'Possible contents:' },
        achievements: {
          chop10: { name: 'Beginner', description: 'Chop 10 trees.' },
          chop100: { name: 'Lumberjack', description: 'Chop 100 trees.' },
          chop500: { name: 'Master Lumberjack', description: 'Chop 500 trees.' },
          score50: { name: 'Fast Hands', description: 'Score 50 pts.' },
          score100: { name: 'Speed Demon', description: 'Score 100 pts.' },
          coins100: { name: 'Pocket Money', description: 'Earn 100 coins.' },
          coins1000: { name: 'Treasurer', description: 'Earn 1000 coins.' },
          noBranch10: { name: 'Lucky', description: 'Chop 10 trees without branches.' },
          locked: 'Locked', none: 'No achievements'
        },
        items: {
          char_santa: { name: 'Santa', description: 'More time per chop (+0.5s)' },
          char_vampire: { name: 'Vampire', description: 'More time per chop (+0.75s)' },
          char_robot: { name: 'Robot', description: 'More time per chop (+1s)' },
          hat_tophat: { name: 'Top Hat', description: 'Slows timer by 5%' },
          hat_grad: { name: 'Graduate Cap', description: 'Slows timer by 10%' },
          hat_crown: { name: 'Crown', description: 'Slows timer by 15%' },
          axe_sword: { name: 'Sword', description: '+10% coins from score' },     // OLD DESC: '+1 pt per chop'
          axe_pickaxe: { name: 'Pickaxe', description: '+20% coins from score' },   // OLD DESC: '+2 pts per chop'
          axe_golden: { name: 'Golden Axe', description: '+30% coins from score' },
          acc_glasses: { name: '3D Glasses', description: 'Coins +10%' },
          acc_scarf: { name: 'Scarf', description: 'Coins +20%' },
          pet_dog: { name: 'Puppy', description: '+15% EXP from score' },        // OLD DESC: 'One-time save'
          pet_cat: { name: 'Kitty', description: '+15% EXP from score' }  
        },
        lootboxes: {
          box_hats_1: { name: 'Common Hatter Crate', description: 'Contains common and rare hats.' },
          box_hats_2: { name: 'Legendary Crown Crate', description: 'Guaranteed legendary hat!' },
          box_axes_1: { name: 'Lumberjack Crate', description: 'Contains a random axe.' },
          box_characters_1: { name: 'Heroes Crate', description: 'Unlocks a random character.' },
          box_accessories_1: { name: 'Accessories Pack', description: 'Contains a random accessory.' },
          box_pets_1: { name: 'Pet Basket', description: 'May contain a cute companion.' }
        }
      }
    }
  };

  const initialLng = localStorage.getItem('i18nextLng') || 'pl';

  i18n.init({
    fallbackLng: 'pl',
    debug: true,
    lng: initialLng,
    resources: inlineResources
  }, (err) => {
    if (err) console.error('i18next init error:', err);
    console.log('[i18n] initialized with', i18n.language);
    if (typeof updateContent === 'function') updateContent();
  });
}

// Odpal próbę inicjalizacji (jeśli pluginów jeszcze nie ma, funkcja sama ponowi próbę)
initI18n();

// Elementy UI
const mainMenu = document.getElementById('main-menu');
const classicMenu = document.getElementById('classic-menu');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownText = document.getElementById('countdown-text');
const gameOverMenu = document.getElementById('game-over-menu');
const gameOverScore = document.getElementById('game-over-score');
const playAgainBtn = document.getElementById('play-again-btn');
const returnToMenuBtn = document.getElementById('return-to-menu-btn');

const classicModeBtn = document.getElementById('classic-mode-btn');
const startClassicBtn = document.getElementById('start-classic-btn');
const backToMainMenuBtn = document.getElementById('back-to-main-menu-btn');

// Elementy trybu ptaków
const birdsModeBtn = document.getElementById('birds-mode-btn');
const birdsMenu = document.getElementById('birds-menu');
const birdsEasyBtn = document.getElementById('birds-easy-btn');
const birdsMediumBtn = document.getElementById('birds-medium-btn');
const birdsHardBtn = document.getElementById('birds-hard-btn');
const backToMainFromBirdsBtn = document.getElementById('back-to-main-from-birds-btn');
const birdsWarningOverlay = document.getElementById('birds-warning-overlay');
const birdsWarningText = document.getElementById('birds-warning-text');
const rescueProgressContainer = document.getElementById('rescue-progress-container');
const rescueProgressBar = document.getElementById('rescue-progress-bar');
const rescueProgressText = document.getElementById('rescue-progress-text');
const authButton = document.getElementById('auth-button');
const mainAvatarContainer = document.getElementById('main-avatar-container');
const mainUsername = document.getElementById('main-username');
const coinsStatEl = document.getElementById('coinsStat');
const levelStatEl = document.getElementById('levelStat');
const expProgressBar = document.getElementById('exp-progress-bar');
const expProgressText = document.getElementById('exp-progress-text');
const plButton = document.getElementById('pl-button');
const enButton = document.getElementById('en-button');
const changelogButton = document.getElementById('changelog-button');

// Elementy gry
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const messageOverlay = document.getElementById('message-overlay');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const timerBar = document.getElementById('timer-bar');

// Przyciski nawigacyjne
const navShopButton = document.getElementById('nav-shop-button');
const navEquipmentButton = document.getElementById('nav-equipment-button');
const navAccountButton = document.getElementById('nav-account-button');
const desktopEquipmentButton = document.getElementById('desktop-equipment-button');
const desktopAccountButton = document.getElementById('desktop-account-button');
const desktopMissionsButton = document.getElementById('desktop-missions-button');

// Modale
const shopModal = document.getElementById('shop-modal');
const closeShopButton = document.getElementById('close-shop-button');
const shopGrid = document.getElementById('shop-grid');
const shopModalTitle = document.getElementById('shop-modal-title');
const shopHubModal = document.getElementById('shop-hub-modal');
const closeShopHubButton = document.getElementById('close-shop-hub-button');
const shopHubGrid = document.getElementById('shop-hub-grid');
const inventoryHubModal = document.getElementById('inventory-hub-modal');
const closeInventoryHubButton = document.getElementById('close-inventory-hub-button');
const equipmentModal = document.getElementById('equipment-modal');
const closeEquipmentButton = document.getElementById('close-equipment-button');
const equipmentGrid = document.getElementById('equipment-grid');
const equipmentModalTitle = document.getElementById('equipment-modal-title');
const unequipButton = document.getElementById('unequip-button');
const accountHubModal = document.getElementById('account-hub-modal');
const closeAccountHubButton = document.getElementById('close-account-hub-button');
const changelogModal = document.getElementById('changelog-modal');
const closeChangelogButton = document.getElementById('close-changelog-button');

// Inne
const notificationContainer = document.getElementById('notification-container');
const bottomNav = document.getElementById('bottom-nav');
const shopPreviewContainer = document.getElementById('shop-preview-container');
const loadingOverlay = document.getElementById('loading-overlay');
const progressBarFill = document.getElementById('progress-bar-fill');
const loadingStatusText = document.getElementById('loading-status-text');
const lootboxAnimationModal = document.getElementById('lootbox-animation-modal');
const animationReel = document.getElementById('animation-reel');
const animationTicker = document.getElementById('animation-ticker');
const animationCloseButton = document.getElementById('animation-close-button');
const itemRevealModal = document.getElementById('item-reveal-modal');
const revealModalContent = document.getElementById('reveal-modal-content');
const revealItemRarity = document.getElementById('reveal-item-rarity');
const revealItemIcon = document.getElementById('reveal-item-icon');
const revealItemName = document.getElementById('reveal-item-name');
const revealItemDescription = document.getElementById('reveal-item-description');
const revealCloseButton = document.getElementById('reveal-close-button');
const resetWarningModal = document.getElementById('reset-warning-modal');
const resetConfirmButton = document.getElementById('reset-confirm-button');
const resetCancelButton = document.getElementById('reset-cancel-button');
let isKeyPressed = false; // Ta zmienna będzie naszą blokadą

// Elementy profilu
const userProfileSection = document.getElementById('user-profile-section');
const guestProfileSection = document.getElementById('guest-profile-section');
const profileAvatarContainer = document.getElementById('profile-avatar-container');
const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const editUsernameBtn = document.getElementById('edit-username-btn');
const profileLogoutBtn = document.getElementById('profile-logout-btn');
const guestLoginBtn = document.getElementById('guest-login-btn');

// Modale edycji profilu
const avatarEditModal = document.getElementById('avatar-edit-modal');
const closeAvatarModal = document.getElementById('close-avatar-modal');
const avatarPreview = document.getElementById('avatar-preview');
const avatarOptions = document.getElementById('avatar-options');
const cancelAvatarEdit = document.getElementById('cancel-avatar-edit');
const saveAvatar = document.getElementById('save-avatar');

const usernameEditModal = document.getElementById('username-edit-modal');
const closeUsernameModal = document.getElementById('close-username-modal');
const newUsernameInput = document.getElementById('new-username');
const cancelUsernameEdit = document.getElementById('cancel-username-edit');
const saveUsername = document.getElementById('save-username');

// Elementy rankingu
const leaderboardModal = document.getElementById('leaderboard-modal');
const closeLeaderboardModal = document.getElementById('close-leaderboard-modal');
const leaderboardContent = document.getElementById('leaderboard-content');
const userRankingStats = document.getElementById('user-ranking-stats');
const userRankingInfo = document.getElementById('user-ranking-info');
const leaderboardFilters = document.querySelectorAll('.leaderboard-filter');
const postGameRanking = document.getElementById('post-game-ranking');
const postGameRankingContent = document.getElementById('post-game-ranking-content');
const closePostGameRanking = document.getElementById('close-post-game-ranking');

// Pomocnicza: ustaw podświetlenie przycisków języka
function setActiveLanguageButtons(langCode) {
    if (!plButton || !enButton) return;
    const base = (langCode || '').split('-')[0];
    if (base === 'en') {
        enButton.classList.add('active-lang');
        plButton.classList.remove('active-lang');
    } else {
        plButton.classList.add('active-lang');
        enButton.classList.remove('active-lang');
    }
}

// Ustawienie rozmiaru płótna
const gameContainer = document.getElementById('game-container');
const TIMER_HEIGHT = 32; // wysokość timera + marginesy (24px + 8px)
canvas.width = gameContainer.clientWidth;
canvas.height = window.innerHeight * 0.7;
gameContainer.style.height = `${canvas.height + TIMER_HEIGHT}px`; // Dodaj miejsce dla timera

// Ustaw początkowy stan menu z odpowiednią wysokością
gameContainer.classList.add('menu-state');

// Stałe gry
const TRUNK_WIDTH = canvas.width * 0.25;
const TRUNK_X = (canvas.width - TRUNK_WIDTH) / 2;
const SEGMENT_HEIGHT = canvas.height * 0.15;
const PLAYER_HEIGHT = SEGMENT_HEIGHT * 0.8;
const PLAYER_WIDTH = TRUNK_WIDTH * 0.6;
const BRANCH_WIDTH = TRUNK_WIDTH * 1.2;
const BRANCH_HEIGHT = SEGMENT_HEIGHT * 0.4;
const GROUND_HEIGHT = 20;
const PLAYER_OFFSET_X = 15;
const LUNGE_MULTIPLIER = 1.7; 

// Kolory
const SKY_COLOR = '#87CEEB';
const GROUND_COLOR = '#3A5F0B';
const TRUNK_COLOR = '#8B4513';
const TRUNK_DARK_COLOR = '#654321';
const PLAYER_SKIN_COLOR = '#F5DEB3';
const PLAYER_SHIRT_COLOR = '#DC143C';
const PLAYER_PANTS_COLOR = '#00008B';
const BRANCH_COLOR = '#228B22';
const BRANCH_DARK_COLOR = '#006400';

// Zmienne stanu gry
let player = { side: 'left', frame: 'idle' };
let tree = [];
let particles = [];
let score = 0;
let gameState = 'start';
let currentUser = null; // Przechowuje pełne dane zalogowanego użytkownika z bazy
let animationTimeout1 = null;
let animationTimeout2 = null;
let missionsCache = null; // Cache dla misji
let missionsLastFetch = 0; // Timestamp ostatniego pobrania misji
let missionRefreshTimer = null; // Timer do odliczania do odświeżenia
let currentMissionType = 'daily'; // Aktualny typ misji (daily/weekly/monthly)

// Zmienne timera
let timer = 100;
const MAX_TIME = 100;
let gameLoopInterval = null;
let activeBonuses = {};
let petSaveUsed = false;

// --- Konfiguracja trybu ptaków ---
const BIRDS_CONFIG = {
  ranges: {
    easy:   { min: 100, max: 300 },
    medium: { min: 400, max: 600 },
    hard:   { min: 700, max: 1000 },
  },
  rewards: {
    easy:   { coins: 50, exp: 25 },
    medium: { coins: 100, exp: 50 },
    hard:   { coins: 200, exp: 100 },
  },
  totalChopsPolicy: 'UPDATE' // 'UPDATE' lub 'NO_UPDATE'
};

// Zmienne stanu trybu ptaków
let gameMode = 'classic'; // 'classic' | 'birds'
let birdsDifficulty = null; // 'easy' | 'medium' | 'hard'
let birdsTarget = 0;        // wylosowane N
let birdsProgress = 0;      // = score w tej rozgrywce
let birdsSuccess = false;

// System sprawdzania gotowości wszystkich komponentów
const loadingStates = {
    sprites: false,
    sounds: false,
    login: false,
    shop: false,
    translations: false,
    gameRender: false
};

function checkAllComponentsReady() {
    const allReady = Object.values(loadingStates).every(state => state === true);
    console.log('Stan komponentów:', loadingStates);
    if (allReady) {
        console.log('Wszystkie komponenty załadowane!');
        finishLoadingAnimation();
    } else {
        const notReady = Object.entries(loadingStates)
            .filter(([key, ready]) => !ready)
            .map(([key]) => key);
        console.log('Oczekiwanie na komponenty:', notReady);
    }
}

function markComponentReady(component) {
    if (loadingStates.hasOwnProperty(component)) {
        loadingStates[component] = true;
        console.log(`Komponent ${component} gotowy`);
        checkAllComponentsReady();
    }
}

// NOWY KOD: Wczytywanie grafik (spritów) postaci
const playerSprites = {};
const spritePaths = {
    idle: 'assets/kitty_idle_right.png',
    swing: 'assets/kitty_swing_right.png',
    chop: 'assets/kitty_chop_right.png'
};

function loadSprites() {
    let loadedCount = 0;
    const totalSprites = Object.keys(spritePaths).length;
    
    return new Promise((resolve, reject) => {
        for (const key in spritePaths) {
            const img = new Image();
            img.src = spritePaths[key];
            playerSprites[key] = img;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalSprites) {
                    console.log('Wszystkie grafiki postaci załadowane!');
                    markComponentReady('sprites');
                    resolve();
                }
            };
            img.onerror = () => reject(new Error(`Nie udało się załadować grafiki: ${spritePaths[key]}`));
        }
    });
}

const gameSounds = {};
const soundPaths = {
    reel_roll: 'sfx/reel_tick.wav',
    reel_stop: 'sfx/reel_stop.wav',
    chop: 'sfx/chop.mp3'
};

function loadSounds() {
    console.log('Ładowanie dźwięków...');
    return new Promise((resolve, reject) => {
        let loadedCount = 0;
        const totalSounds = Object.keys(soundPaths).length;
        if (totalSounds === 0) {
            markComponentReady('sounds');
            resolve();
            return;
        }

        for (const key in soundPaths) {
            const audio = new Audio();
            audio.src = soundPaths[key];
            gameSounds[key] = audio;

            // Czekamy, aż przeglądarka będzie gotowa do odtworzenia dźwięku
            audio.addEventListener('canplaythrough', () => {
                loadedCount++;
                if (loadedCount === totalSounds) {
                    console.log('Wszystkie dźwięki załadowane!');
                    markComponentReady('sounds');
                    resolve();
                }
            }, { once: true });

            audio.onerror = () => reject(new Error(`Nie udało się załadować dźwięku: ${soundPaths[key]}`));
        }
    });
}

// --- Baza Danych Osiągnięć i Sklepu ---
const achievementsData = {
    'chop10': { name: 'Początkujący', description: 'Zetnij 10 drzew.', icon: '🪵', condition: (stats) => stats.totalChops >= 10 },
    'chop100': { name: 'Drwal', description: 'Zetnij 100 drzew.', icon: '🪓', condition: (stats) => stats.totalChops >= 100 },
    'chop500': { name: 'Mistrz Drwali', description: 'Zetnij 500 drzew.', icon: '🏆', condition: (stats) => stats.totalChops >= 500 },
    'score50': { name: 'Szybkie Ręce', description: 'Zdobądź 50 pkt.', icon: '⚡', condition: (stats) => stats.highScore >= 50 },
    'score100': { name: 'Demon Prędkości', description: 'Zdobądź 100 pkt.', icon: '🔥', condition: (stats) => stats.highScore >= 100 },
    'coins100': { name: 'Kieszonkowe', description: 'Zdobądź 100 monet.', icon: '💰', condition: (stats) => stats.coins >= 100 },
    'coins1000': { name: 'Skarbnik', description: 'Zdobądź 1000 monet.', icon: '💎', condition: (stats) => stats.coins >= 1000 },
    'noBranch10': { name: 'Szczęściarz', description: 'Zetnij 10 drzew bez gałęzi.', icon: '🍀', condition: (stats) => stats.highScore >= 10 }
};
const shopData = {
    char_santa: { id: 'char_santa', name: 'Święty', category: 'characters', icon: '🧑‍🎄', price: 500, description: 'Dłuższy czas za cięcie (+0.5s)', bonus: { type: 'timeGainBonus', value: 0.5 } },
    char_vampire: { id: 'char_vampire', name: 'Wampir', category: 'characters', icon: '🧛', price: 750, description: 'Dłuższy czas za cięcie (+0.75s)', bonus: { type: 'timeGainBonus', value: 0.75 } },
    char_robot: { id: 'char_robot', name: 'Robot', category: 'characters', icon: '🤖', price: 1200, description: 'Dłuższy czas za cięcie (+1s)', bonus: { type: 'timeGainBonus', value: 1.0 } },
    hat_tophat: { id: 'hat_tophat', name: 'Cylinder', category: 'hats', icon: '🎩', price: 150, description: 'Spowalnia czas o 5%', bonus: { type: 'timerSlowdown', value: 0.05 } },
    hat_grad: { id: 'hat_grad', name: 'Czapka Absolwenta', category: 'hats', icon: '🎓', price: 300, description: 'Spowalnia czas o 10%', bonus: { type: 'timerSlowdown', value: 0.10 } },
    hat_crown: { id: 'hat_crown', name: 'Korona', category: 'hats', icon: '👑', price: 1000, description: 'Spowalnia czas o 15%', bonus: { type: 'timerSlowdown', value: 0.15 } },
    axe_sword: { id: 'axe_sword', name: 'Miecz', category: 'axes', icon: '⚔️', price: 200, description: '+10% monet za wynik', bonus: { type: 'coinMultiplierBonus', value: 0.1 } },
    axe_pickaxe: { id: 'axe_pickaxe', name: 'Kilof', category: 'axes', icon: '⛏️', price: 400, description: '+20% monet za wynik', bonus: { type: 'coinMultiplierBonus', value: 0.2 } },
    axe_golden: { id: 'axe_golden', name: 'Złota Siekiera', category: 'axes', icon: '🪓', price: 800, description: '+30% monet za wynik', bonus: { type: 'coinMultiplierBonus', value: 0.3 } },
    acc_glasses: { id: 'acc_glasses', name: 'Okulary 3D', category: 'accessories', icon: '🕶️', price: 300, description: 'Monety +10%', bonus: { type: 'coinMultiplier', value: 0.1 } },
    acc_scarf: { id: 'acc_scarf', name: 'Szalik', category: 'accessories', icon: '🧣', price: 500, description: 'Monety +20%', bonus: { type: 'coinMultiplier', value: 0.2 } },
    pet_dog: { id: 'pet_dog', name: 'Piesek', category: 'pets', icon: '🐶', price: 2500, description: '+15% EXP za wynik', bonus: { type: 'expMultiplierBonus', value: 0.15 } },
    pet_cat: { id: 'pet_cat', name: 'Kotek', category: 'pets', icon: '🐱', price: 2500, description: '+15% EXP za wynik', bonus: { type: 'expMultiplierBonus', value: 0.15 } },
};

// --- Baza Danych Skrzynek (Lootboxów) ---
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

const itemRarityMap = {};
for (const category in lootBoxData) {
    lootBoxData[category].forEach(box => {
        box.lootPool.forEach(item => {
            // Zapisujemy rzadkość dla danego ID przedmiotu, jeśli jeszcze nie istnieje
            if (!itemRarityMap[item.itemId]) {
                itemRarityMap[item.itemId] = item.rarity;
            }
        });
    });
}

const categoryToSlotMap = {
    characters: 'character', hats: 'hat', axes: 'axe', accessories: 'accessory', pets: 'pet'
};
const categoryNames = {
    get hats() { return (window.i18next && i18next.isInitialized) ? i18next.t('categories.hats') : 'Czapki'; },
    get characters() { return (window.i18next && i18next.isInitialized) ? i18next.t('categories.characters') : 'Postacie'; },
    get axes() { return (window.i18next && i18next.isInitialized) ? i18next.t('categories.axes') : 'Siekiery'; },
    get accessories() { return (window.i18next && i18next.isInitialized) ? i18next.t('categories.accessories') : 'Akcesoria'; },
    get pets() { return (window.i18next && i18next.isInitialized) ? i18next.t('categories.pets') : 'Zwierzaki'; }
};


// --- NOWA LOGIKA STATYSTYK I OSIĄGNIĘĆ ---

// --- SYSTEM EXP I POZIOMÓW ---
function calculateLevel(exp) {
    if (exp < 50) return 1;
    let level = 1;
    let requiredExp = 50;
    let currentExp = exp;
    
    while (currentExp >= requiredExp) {
        currentExp -= requiredExp;
        level++;
        requiredExp = Math.floor(requiredExp * 1.5); // x1.5 dla każdego poziomu
    }
    
    return level;
}

function getExpForLevel(level) {
    if (level <= 1) return 0;
    let totalExp = 0;
    let requiredExp = 50;
    
    for (let i = 2; i <= level; i++) {
        totalExp += requiredExp;
        requiredExp = Math.floor(requiredExp * 1.5);
    }
    
    return totalExp;
}

function getExpProgress(exp) {
    const currentLevel = calculateLevel(exp);
    const expForCurrentLevel = getExpForLevel(currentLevel);
    const expForNextLevel = getExpForLevel(currentLevel + 1);
    const expNeededForNextLevel = expForNextLevel - expForCurrentLevel;
    const currentLevelExp = exp - expForCurrentLevel;
    
    return {
        currentLevel,
        currentLevelExp,
        expNeededForNextLevel,
        progress: (currentLevelExp / expNeededForNextLevel) * 100
    };
}

// NOWA FUNKCJA: Tłumaczy nazwy z bazy danych (snake_case) na nazwy używane w JS (camelCase)
function parseStatsFromDB(dbUser) {
    return {
        highScore: Number(dbUser.high_score || 0),
        totalChops: Number(dbUser.total_chops || 0),
        coins: Number(dbUser.coins || 0),
        exp: Number(dbUser.exp || 0),
        unlockedAchievements: dbUser.unlocked_achievements || [],
        unlockedItems: dbUser.unlocked_items || {}, // ZMIANA: z [] na {}
        equippedItems: dbUser.equipped_items || { character: null, hat: null, axe: null, accessory: null, pet: null }
    };
}

// ZMODYFIKOWANA FUNKCJA: Teraz jest synchroniczna i działa w dwóch trybach
function loadStats() {
    if (currentUser) {
        return parseStatsFromDB(currentUser);
    } else {
        const defaultStats = { highScore: 0, totalChops: 0, coins: 0, exp: 0, unlockedAchievements: [], unlockedItems: {}, equippedItems: { character: null, hat: null, axe: null, accessory: null, pet: null } }; // ZMIANA: z [] na {}
        const statsFromStorage = JSON.parse(localStorage.getItem('timbermanStats'));
        return { ...defaultStats, ...statsFromStorage };
    }
}

// ZMODYFIKOWANA FUNKCJA: Teraz jest asynchroniczna i zapisuje dane na serwerze lub w localStorage
// W pliku script.js ZASTĄP TĘ FUNKCJĘ
async function updateAndSaveStats(scoreFromGame, oldStats, options = {}) {
    // options:
    // - mode: 'classic' | 'birds'
    // - birds: { success: boolean, coinsReward?: number, expReward?: number, countChopsInTotal?: boolean }
    // - overrideScoreContributions?: boolean // jeśli true, to highScore/coins/exp nie liczą się z "scoreFromGame"
    
    let coinsEarned = 0;
    let expEarned = 0;
    let newHighScore = oldStats.highScore;
    let newTotalChops = oldStats.totalChops;
    
    if (options.mode === 'birds') {
        // Tryb ptaków - nie naliczaj standardowych nagród ze score
        if (options.birds && options.birds.success) {
            coinsEarned = options.birds.coinsReward || 0;
            expEarned = options.birds.expReward || 0;
        }
        // W trybie ptaków nie aktualizuj highScore
        // Dla totalChops: sprawdź politykę
        if (BIRDS_CONFIG.totalChopsPolicy === 'UPDATE') {
            newTotalChops = oldStats.totalChops + scoreFromGame;
        }
    } else {
        // Tryb klasyczny - standardowe naliczanie
        coinsEarned = (scoreFromGame * (0.1 + (activeBonuses.coinMultiplierBonus || 0))) * (1 + (activeBonuses.coinMultiplier || 0));
        expEarned = Math.round(scoreFromGame * (1 + (activeBonuses.expMultiplierBonus || 0)));
        newHighScore = Math.max(oldStats.highScore, scoreFromGame);
        newTotalChops = oldStats.totalChops + scoreFromGame;
    }

    const newTotals = {
        ...oldStats,
        highScore: newHighScore,
        totalChops: newTotalChops,
        coins: oldStats.coins + coinsEarned,
        exp: oldStats.exp + expEarned
    };

    // Sprawdź osiągnięcia na podstawie nowych sum
    for (const id in achievementsData) {
        if (!newTotals.unlockedAchievements.includes(id) && achievementsData[id].condition(newTotals)) {
            newTotals.unlockedAchievements.push(id);
            const achievementName = (window.i18next && i18next.isInitialized) ? i18next.t(`achievements.${id}.name`) : achievementsData[id].name;
            showNotification(`Osiągnięcie: ${achievementName}`, 'success');
        }
    }

    if (currentUser) {
        console.log("Zapisywanie statystyk na serwerze...");
        try {
            // TERAZ WYSYŁAMY DO SERWERA ZARÓWNO WYNIK Z GRY, JAK I NOWE SUMY
            const response = await fetch(`${BACKEND_URL}/api/stats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    scoreFromGame: scoreFromGame,
                    coinsEarned: coinsEarned,
                    newTotals: newTotals // Wysyłamy całe, przeliczone statystyki
                })
            });
            if (!response.ok) throw new Error('Błąd zapisu na serwerze');
            const updatedUser = await response.json();
            currentUser = updatedUser;
            return parseStatsFromDB(updatedUser);
        } catch (error) {
            console.error("Nie udało się zapisać statystyk na serwerze:", error);
            return newTotals; // W razie błędu zwróć to co obliczyliśmy lokalnie
        }
    } else {
        console.log("Zapisywanie statystyk w localStorage (Tryb Gościa)...");
        localStorage.setItem('timbermanStats', JSON.stringify(newTotals));
        return newTotals;
    }
}

async function animateStatUpdate(oldStats, score, options = {}) {
    const newStats = await updateAndSaveStats(score, oldStats, options);
    
    // Zawsze odśwież misje po grze, aby były aktualne
    console.log('Odświeżanie misji po grze...');
    fetchAndDisplayMissions(true); // Wymuś odświeżenie po grze
    const duration = 1500;
    const startTime = performance.now();

    // Sprawdź czy gracz zlevelował
    const oldLevel = calculateLevel(oldStats.exp);
    const newLevel = calculateLevel(newStats.exp);
    const leveledUp = newLevel > oldLevel;

    // POPRAWKA 1: Animujemy tylko istniejący element
    const coinsStatBox = document.getElementById('coins-stat-box');
    const levelStatBox = document.getElementById('level-stat-box');
    if (coinsStatBox) {
        coinsStatBox.classList.add('stat-update-animation');
    }
    if (levelStatBox) {
        levelStatBox.classList.add('stat-update-animation');
    }

    function animationStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Animujemy przyrost monet
        const coinGain = (newStats.coins - oldStats.coins) * progress;
        const currentCoins = oldStats.coins + coinGain;
        coinsStatEl.textContent = currentCoins.toFixed(2);

        // Animujemy przyrost EXP
        const expGain = (newStats.exp - oldStats.exp) * progress;
        const currentExp = Math.floor(oldStats.exp + expGain); // Zaokrąglamy w dół do liczby całkowitej
        const expProgress = getExpProgress(currentExp);
        levelStatEl.textContent = expProgress.currentLevel;
        expProgressBar.style.width = `${expProgress.progress}%`;
        expProgressText.textContent = `${expProgress.currentLevelExp} / ${expProgress.expNeededForNextLevel} EXP`;

        if (progress < 1) {
            requestAnimationFrame(animationStep);
        } else {
            // Po animacji, zaktualizuj wszystkie statystyki (te w modalu też)
            updateStatsUI(newStats);
            if (coinsStatBox) {
                setTimeout(() => {
                    coinsStatBox.classList.remove('stat-update-animation');
                }, 500);
            }
            if (levelStatBox) {
                setTimeout(() => {
                    levelStatBox.classList.remove('stat-update-animation');
                }, 500);
            }
            
            // Jeśli zlevelował, uruchom specjalną animację
            if (leveledUp) {
                animateLevelUp(newLevel);
            }
        }
    }
    requestAnimationFrame(animationStep);
}

function animateLevelUp(newLevel) {
    // Dodaj efekt fajerwerków
    const levelStatBox = document.getElementById('level-stat-box');
    if (!levelStatBox) return;

    // Dodaj klasę animacji levelowania
    levelStatBox.classList.add('level-up-animation');
    
    // Pokaż powiadomienie o levelowaniu
    showNotification(`🎉 Poziom ${newLevel}! 🎉`, 'success');
    
    // Zakończ animację levelowania po krótkim czasie
    setTimeout(() => {
        levelStatBox.classList.remove('level-up-animation');
    }, 2000);
}

// Funkcja do resetowania postępu
async function resetProgress() {
    openModal(resetWarningModal);
}

async function confirmReset() {
    try {
        if (currentUser) {
            // Resetuj postęp na serwerze
            const response = await fetch(`${BACKEND_URL}/api/reset-progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error('Błąd resetowania na serwerze');
            
            const resetUser = await response.json();
            currentUser = resetUser;
        } else {
            // Resetuj postęp w localStorage (tryb gościa)
            localStorage.removeItem('timbermanStats');
        }
        
        // Zaktualizuj UI
        updateStatsUI(loadStats());
        closeModal(resetWarningModal);
        showNotification('Postęp został zresetowany!', 'success');
        
    } catch (error) {
        console.error('Błąd resetowania postępu:', error);
        showNotification('Wystąpił błąd podczas resetowania', 'error');
    }
}

function updateStatsUI(stats) {
    // Aktualizuj widoczne na stałe monety
    coinsStatEl.textContent = stats.coins.toFixed(2);

    // Aktualizuj poziom i EXP
    const expProgress = getExpProgress(stats.exp);
    levelStatEl.textContent = expProgress.currentLevel;
    expProgressBar.style.width = `${expProgress.progress}%`;
    expProgressText.textContent = `${expProgress.currentLevelExp} / ${expProgress.expNeededForNextLevel} EXP`;

    // Znajdź elementy w modalu i zaktualizuj je
    const highScoreBox = document.getElementById('highscore-stat-box-modal');
    const totalChopsBox = document.getElementById('totalchops-stat-box-modal');

    if (highScoreBox) {
        const label = (window.i18next && i18next.isInitialized) ? i18next.t('accountHub.stats_tab.high_score') : 'Najlepszy Wynik';
        highScoreBox.innerHTML = `<p class="text-gray-400 text-sm">${label}</p><p class="text-2xl font-bold">${stats.highScore}</p>`;
    }
    if (totalChopsBox) {
        const label = (window.i18next && i18next.isInitialized) ? i18next.t('accountHub.stats_tab.total_chops') : 'Suma Ściętych';
        totalChopsBox.innerHTML = `<p class="text-gray-400 text-sm">${label}</p><p class="text-2xl font-bold">${stats.totalChops}</p>`;
    }
}

function populateAchievementsPreview(stats) {
    achievementsPreview.innerHTML = '';
    const recentAchievements = stats.unlockedAchievements.slice(-4).reverse();
    if (recentAchievements.length === 0) {
        const none = (window.i18next && i18next.isInitialized) ? i18next.t('achievements.none') : 'Brak osiągnięć';
        achievementsPreview.innerHTML = `<span class="col-span-4 text-center text-gray-500 text-sm">${none}</span>`;
        return;
    }
    recentAchievements.forEach(id => {
        if (!achievementsData[id]) return;
        const achievement = achievementsData[id];
        const slot = document.createElement('div');
        slot.className = 'item-slot rounded-md achievement-preview-slot unlocked has-tooltip';
        slot.dataset.tooltip = achievement.description;
        slot.innerHTML = achievement.icon;
        achievementsPreview.appendChild(slot);
    });
}

function populateAchievementsGrid() {
    const achievementsGridModal = document.getElementById('achievements-grid-modal');
    achievementsGridModal.innerHTML = '';
    const stats = loadStats();
    for (const id in achievementsData) {
        const achievement = achievementsData[id];
        const isUnlocked = stats.unlockedAchievements.includes(id);
        const card = document.createElement('div');
        card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : '');
        const aName = (window.i18next && i18next.isInitialized) ? (i18next.t(`achievements.${id}.name`) || achievement.name) : achievement.name;
        const aDesc = isUnlocked
            ? ((window.i18next && i18next.isInitialized) ? (i18next.t(`achievements.${id}.description`) || achievement.description) : achievement.description)
            : ((window.i18next && i18next.isInitialized) ? i18next.t('achievements.locked') : 'Zablokowane');
        card.innerHTML = `<div class="icon">${isUnlocked ? achievement.icon : '?'}</div><div class="title">${aName}</div><div class="description">${aDesc}</div>`;
        achievementsGridModal.appendChild(card);
    }
}

function populateShopModal(categoryKey) {
    shopGrid.innerHTML = '';
    const categoryName = categoryNames[categoryKey];
    shopModalTitle.textContent = categoryName;
    const stats = loadStats();
    const itemsInCategory = Object.values(shopData).filter(item => item.category === categoryKey);

    itemsInCategory.forEach(item => {
        const name = (window.i18next && i18next.isInitialized) ? (i18next.t(`items.${item.id}.name`) || item.name) : item.name;
        const desc = (window.i18next && i18next.isInitialized) ? (i18next.t(`items.${item.id}.description`) || item.description) : item.description;
        const quantityOwned = stats.unlockedItems[item.id] || 0; // Sprawdź ilość, a nie czy istnieje
        const card = document.createElement('div');
        card.className = 'shop-item-slot'; // Usunięto .owned, bo przycisk jest zawsze aktywny

        // Przycisk KUP jest teraz zawsze widoczny
        const coinsLabel = (window.i18next && i18next.isInitialized) ? i18next.t('shop.coins_label') : 'monet';
        const buyLabel = (window.i18next && i18next.isInitialized) ? i18next.t('shop.buy') : 'KUP';
        let bottomContent = `<div class="w-full mt-auto"><div class="text-amber-400 font-bold mb-2">${item.price} ${coinsLabel}</div><button class="buy-button">${buyLabel}</button></div>`;
        
        // Dodaj wskaźnik ilości, jeśli posiadamy przedmiot
        let quantityBadge = quantityOwned > 0 ? `<div class="item-quantity-badge">x${quantityOwned}</div>` : '';

        card.innerHTML = `${quantityBadge}<div class="text-4xl">${item.icon}</div><div class="font-bold text-base">${name}</div><div class="text-sm text-gray-300 px-1 leading-tight">${desc}</div>${bottomContent}`;
        
        card.querySelector('.buy-button').addEventListener('click', (e) => {
            e.stopPropagation();
            buyItem(item.id, card);
        });
        
        shopGrid.appendChild(card);
    });
}

function populateShopPreview() {
    shopPreviewContainer.innerHTML = '';
    // Iterujemy po naszych starych, dobrych nazwach kategorii
    for (const categoryKey in categoryNames) {
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'w-full shop-category-preview rounded-lg p-2';

        categoryContainer.addEventListener('click', () => {
            populateShopModalWithBoxes(categoryKey); // Otwórz modal ze skrzynkami z tej kategorii
            openModal(shopModal);
        });

        const title = document.createElement('h3');
        title.className = 'text-xl font-bold text-shadow mb-2 flex justify-between items-center';
        title.innerHTML = `<span>${categoryNames[categoryKey]}</span><span class="font-bold text-xl text-gray-500">+</span>`;

        const previewGrid = document.createElement('div');
        previewGrid.className = 'flex gap-3 w-full'; // Zmieniono na flex dla lepszego wyglądu

        // Pokaż ikonki skrzynek z danej kategorii
        if (lootBoxData[categoryKey]) {
            lootBoxData[categoryKey].slice(0, 4).forEach(box => {
                const slot = document.createElement('div');
                slot.className = 'item-slot rounded-md text-2xl';
                if (!box.enabled) slot.classList.add('opacity-50');
                slot.innerHTML = box.icon;
                previewGrid.appendChild(slot);
            });
        }

        categoryContainer.appendChild(title);
        categoryContainer.appendChild(previewGrid);
        shopPreviewContainer.appendChild(categoryContainer);
    }
}


// --- Logika gry ---

/**
 * Renderuje karty misji na podstawie danych z serwera.
 * @param {object} missions - Obiekt z misjami pogrupowanymi na daily, weekly, monthly.
 */
function renderMissionCards(missions) {
    const dailyContainer = document.getElementById('daily-missions-content');
    const weeklyContainer = document.getElementById('weekly-missions-content');
    const monthlyContainer = document.getElementById('monthly-missions-content');

    // Wyczyść kontenery przed renderowaniem
    dailyContainer.innerHTML = '';
    weeklyContainer.innerHTML = '';
    monthlyContainer.innerHTML = '';

    const createCardHTML = (mission) => {
        const progressPercent = Math.min((mission.progress / mission.target_value) * 100, 100);
        const translatedDesc = (window.i18next && i18next.isInitialized) ? i18next.t(mission.description_key) : 'Wczytywanie opisu...';

        let buttonHTML = '';
        if (mission.is_claimed) {
            const claimedText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.claimed') : 'Odebrano';
            buttonHTML = `<button class="claim-button" disabled>${claimedText}</button>`;
        } else if (mission.is_completed) {
            const claimText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.claim') : 'Odbierz';
            // WAŻNE: Dodajemy listener onclick, który wywoła funkcję odbioru nagrody
            buttonHTML = `<button class="claim-button" onclick="claimMissionReward(${mission.id})">${claimText}</button>`;
        } else {
            const inProgressText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.in_progress') : 'W toku';
            buttonHTML = `<button class="claim-button" disabled>${inProgressText}</button>`;
        }
        
        // Dodaj przycisk refresh do każdej misji (tylko jeśli nie jest odebrana)
        if (!mission.is_claimed) {
            const refreshCost = getRefreshCost(mission.time_category);
            const refreshText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.refresh') : 'Odśwież';
            buttonHTML += `<button class="refresh-mission-button ml-2 bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded text-sm font-bold" onclick="refreshSingleMission(${mission.id}, '${mission.time_category}')" data-cost="${refreshCost}">${refreshText} ${refreshCost}💰</button>`;
        }

        return `
        <div class="mission-card">
            <div class="flex items-center gap-4">
                <div class="text-4xl">🪓</div> <div class="flex-grow">
                    <p class="font-bold">${translatedDesc}</p>
                    <div class="w-full bg-gray-700 rounded-full h-4 mt-1 border border-gray-600">
                        <div class="bg-amber-500 h-full rounded-full text-xs text-black font-bold flex items-center justify-center" style="width: ${progressPercent}%">
                            ${mission.progress} / ${mission.target_value}
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <p class="text-sm text-gray-400">${(window.i18next && i18next.isInitialized) ? i18next.t('missions.reward') : 'Nagroda'}</p>
                    <p class="font-bold text-lg">${mission.reward_coins} 💰 ${mission.reward_exp > 0 ? `| ${mission.reward_exp} EXP` : ''}</p>
                </div>
            </div>
            ${buttonHTML}
        </div>`;
    };

    // Renderowanie misji dziennych
    if (missions.daily.length > 0) {
        missions.daily.forEach(mission => dailyContainer.innerHTML += createCardHTML(mission));
    } else {
        dailyContainer.innerHTML = `<p class="text-center text-gray-500">${(window.i18next && i18next.isInitialized) ? i18next.t('missions.no_daily') : 'Brak misji dziennych.'}</p>`;
    }

    // Renderowanie misji tygodniowych
    if (missions.weekly.length > 0) {
        missions.weekly.forEach(mission => weeklyContainer.innerHTML += createCardHTML(mission));
    } else {
        weeklyContainer.innerHTML = `<p class="text-center text-gray-500">${(window.i18next && i18next.isInitialized) ? i18next.t('missions.no_weekly') : 'Brak misji tygodniowych.'}</p>`;
    }

    // Renderowanie misji miesięcznych
    if (missions.monthly.length > 0) {
        missions.monthly.forEach(mission => monthlyContainer.innerHTML += createCardHTML(mission));
    } else {
        monthlyContainer.innerHTML = `<p class="text-center text-gray-500">${(window.i18next && i18next.isInitialized) ? i18next.t('missions.no_monthly') : 'Brak misji miesięcznych.'}</p>`;
    }
    
}

async function fetchAndDisplayMissions(forceRefresh = false) {
    const dailyContainer = document.getElementById('daily-missions-content');
    const weeklyContainer = document.getElementById('weekly-missions-content');
    const monthlyContainer = document.getElementById('monthly-missions-content');
    
    if (!dailyContainer) return;

    // Sprawdź cache - jeśli mamy dane z ostatnich 30 sekund, użyj ich
    const now = Date.now();
    const cacheValid = missionsCache && (now - missionsLastFetch) < 30000; // 30 sekund cache
    
    if (cacheValid && !forceRefresh) {
        console.log('Używanie cache misji');
        renderMissionCards(missionsCache);
        updateMissionRefreshTimer();
        return;
    }

    // Dodaj ikonkę ładowania do wszystkich kontenerów
    const loadingHTML = `
        <div class="flex flex-col items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-3"></div>
            <p class="text-center text-gray-400">${(window.i18next && i18next.isInitialized) ? i18next.t('missions.loading') : 'Ładowanie misji...'}</p>
        </div>
    `;
    
    dailyContainer.innerHTML = loadingHTML;
    if (weeklyContainer) weeklyContainer.innerHTML = loadingHTML;
    if (monthlyContainer) monthlyContainer.innerHTML = loadingHTML;

    try {
        const response = await fetch(`${BACKEND_URL}/api/missions`, { credentials: 'include' });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Nie udało się załadować misji');
        }
        
        const missions = await response.json();
        
        // Zaktualizuj cache
        missionsCache = missions;
        missionsLastFetch = now;
        
        renderMissionCards(missions);
        updateMissionRefreshTimer();

    } catch (error) {
        const errorHTML = `<p class="text-center text-red-500">${error.message}</p>`;
        dailyContainer.innerHTML = errorHTML;
        if (weeklyContainer) weeklyContainer.innerHTML = errorHTML;
        if (monthlyContainer) monthlyContainer.innerHTML = errorHTML;
    }
}

async function claimMissionReward(missionId) {
    console.log(`Próba odebrania nagrody za misję o ID: ${missionId}`);
    
    // Opcjonalnie: znajdź przycisk i go zablokuj, by uniknąć podwójnych kliknięć
    const button = document.querySelector(`button[onclick="claimMissionReward(${missionId})"]`);
    if (button) {
        button.disabled = true;
        button.textContent = 'Odbieranie...';
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/missions/claim`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ missionId: missionId })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }
        
        // Sukces!
        showNotification(result.message || 'Nagroda odebrana!', 'success');

        // Zaktualizuj lokalne dane użytkownika i odśwież UI
        currentUser = result.updatedUser;
        updateStatsUI(loadStats());

        // Odśwież widok misji, aby pokazać status "Odebrano"
        fetchAndDisplayMissions(true);

    } catch (error) {
        showNotification(error.message, 'error');
        // Jeśli wystąpił błąd, odśwież misje, aby przywrócić przycisk do stanu "Odbierz"
        fetchAndDisplayMissions(true); 
    }
}

// Funkcje do obsługi timera i refresh misji
function getRefreshCost(timeCategory) {
    const costs = { daily: 100, weekly: 200, monthly: 300 };
    return costs[timeCategory] || 100;
}

async function refreshSingleMission(missionId, timeCategory) {
    if (!currentUser) {
        showNotification('Musisz być zalogowany, aby odświeżyć misje!', 'error');
        return;
    }
    
    const cost = getRefreshCost(timeCategory);
    const stats = loadStats();
    
    if (stats.coins < cost) {
        const noMoneyText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.refresh_no_money') : 'Za mało monet!';
        showNotification(noMoneyText, 'error');
        return;
    }
    
    // Potwierdź odświeżenie
    const confirmText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.refresh_confirm') : 'Czy na pewno chcesz odświeżyć tę misję za';
    if (!confirm(`${confirmText} ${cost} monet?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/missions/refresh-single`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ missionId: missionId, timeCategory: timeCategory })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Błąd odświeżania misji');
        }
        
        // Sukces!
        const successText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.refresh_success') : 'Misja została odświeżona!';
        showNotification(successText, 'success');
        
        // Zaktualizuj dane użytkownika
        currentUser = result.updatedUser;
        updateStatsUI(loadStats());
        
        // Odśwież misje
        missionsCache = null; // Wyczyść cache
        fetchAndDisplayMissions(true);
        
    } catch (error) {
        const errorText = (window.i18next && i18next.isInitialized) ? i18next.t('missions.refresh_error') : 'Błąd odświeżania misji';
        showNotification(`${errorText}: ${error.message}`, 'error');
    }
}

function updateMissionRefreshTimer() {
    if (!missionsCache) return;
    
    const now = new Date();
    let nextRefresh = null;
    
    // Oblicz następne odświeżenie na podstawie aktualnego typu misji
    switch (currentMissionType) {
        case 'daily':
            nextRefresh = new Date(now);
            nextRefresh.setDate(nextRefresh.getDate() + 1);
            nextRefresh.setHours(0, 0, 0, 0);
            break;
        case 'weekly':
            nextRefresh = new Date(now);
            const daysUntilMonday = (1 + 7 - now.getDay()) % 7;
            nextRefresh.setDate(nextRefresh.getDate() + (daysUntilMonday === 0 ? 7 : daysUntilMonday));
            nextRefresh.setHours(0, 0, 0, 0);
            break;
        case 'monthly':
            nextRefresh = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
    }
    
    if (nextRefresh) {
        startMissionTimer(nextRefresh);
    }
}

function startMissionTimer(nextRefresh) {
    if (missionRefreshTimer) {
        clearInterval(missionRefreshTimer);
    }
    
    const timerElement = document.getElementById('mission-refresh-timer');
    if (!timerElement) return;
    
    function updateTimer() {
        const now = new Date();
        const diff = nextRefresh - now;
        
        if (diff <= 0) {
            timerElement.textContent = 'Dostępne!';
            clearInterval(missionRefreshTimer);
            console.log('Timer zakończony, odświeżam misje...');
            fetchAndDisplayMissions(true); 
            
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateTimer();
    missionRefreshTimer = setInterval(updateTimer, 1000);
}


async function openLootbox(boxId, cardElement) {
    if (!currentUser) {
        showNotification('Musisz być zalogowany, aby kupować skrzynki!', 'error');
        return;
    }

    const buyButton = cardElement.querySelector('.buy-button');
    if (buyButton.disabled) return;

    // ZNAJDŹ SKRZYNKĘ W NOWEJ STRUKTURZE DANYCH
    let boxData = null;
    for (const category in lootBoxData) {
        const foundBox = lootBoxData[category].find(b => b.id === boxId);
        if (foundBox) {
            boxData = foundBox;
            break;
        }
    }
    if (!boxData) {
         showNotification('Nie znaleziono takiej skrzynki!', 'error');
         return;
    }

    buyButton.textContent = 'Otwieram...';
    buyButton.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/api/open-box`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ boxId: boxId })
        });

        const data = await response.json();
        

        if (!response.ok) {
            throw new Error(data.message);
        }

        // Sukces! Serwer odesłał nagrodę i zaktualizowane dane gracza
        currentUser = data.updatedUser; // Zaktualizuj dane lokalne
        updateStatsUI(loadStats()); // Odśwież UI z nową liczbą monet

        // TODO: W przyszłości tutaj uruchomimy animację otwierania skrzynki
                closeModal(shopModal); // Zamknij modal sklepu, aby zrobić miejsce
        playLootboxAnimation(
            boxData.lootPool.find(i => i.itemId === data.wonItem.id),
            boxData
        );

        // Zaktualizuj dane w tle, gdy animacja trwa
        currentUser = data.updatedUser;
        updateStatsUI(loadStats());
        populateShopPreview();

    } catch (error) {
        console.error("Błąd otwierania skrzynki:", error);
        showNotification(error.message || 'Wystąpił błąd', 'error');
    } finally {
        buyButton.textContent = 'KUP';
        buyButton.disabled = false;
    }
}

async function playLootboxAnimation(wonItem, boxData) {
    // 1. Przygotuj JEDNĄ, DŁUGĄ rolkę
    animationReel.innerHTML = '';
    animationCloseButton.classList.add('hidden');
    animationReel.style.transform = 'translateX(0px)'; // Resetuj pozycję

    const reelItems = [];
    const reelLength = 100;
    const winnerIndex = reelLength - 10;

    for (let i = 0; i < reelLength; i++) {
        const randomLoot = boxData.lootPool[Math.floor(Math.random() * boxData.lootPool.length)];
        reelItems.push(randomLoot);
    }
    reelItems[winnerIndex] = wonItem;

    reelItems.forEach(loot => {
        const itemData = shopData[loot.itemId];
        const itemDiv = document.createElement('div');
        itemDiv.className = `reel-item rarity-${loot.rarity}`;
        itemDiv.innerHTML = `<span>${itemData.icon}</span>`;
        animationReel.appendChild(itemDiv);
    });

    // 2. Otwórz modal i przygotuj obliczenia
    openModal(lootboxAnimationModal);

    const itemWidth = 120 + 20; // 140px
    const viewportWidth = document.getElementById('animation-viewport').clientWidth;
    const centerOffset = (viewportWidth / 2) - (itemWidth / 2);
    const finalPosition = -(winnerIndex * itemWidth - centerOffset);

    // 3. Uruchom płynną animację w JavaScript
    let startTime = null;
    const duration = 7000; // 7 sekund

    // NOWA ZMIENNA do śledzenia dźwięku
    let lastTickIndex = -1;

    function animationStep(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const easedProgress = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentPosition = easedProgress * finalPosition;
        animationReel.style.transform = `translateX(${currentPosition}px)`;

        // --- NOWA LOGIKA DŹWIĘKU ---
        // Oblicz, nad którym przedmiotem jest teraz wskaźnik
        const currentIndex = Math.floor((Math.abs(currentPosition) + centerOffset) / itemWidth);

        // Jeśli wskaźnik przesunął się na nowy przedmiot, odtwórz dźwięk
        if (currentIndex > lastTickIndex) {
            lastTickIndex = currentIndex;
            if (gameSounds.reel_tick) {
                // Klonujemy dźwięk, aby mógł się odtwarzać wielokrotnie i szybko
                const tickSound = gameSounds.reel_tick.cloneNode();
                tickSound.volume = 0.5; // Możesz dostosować głośność
                tickSound.play();
            }
        }
        // --- KONIEC LOGIKI DŹWIĘKU ---

        if (progress < 1) {
            requestAnimationFrame(animationStep);
        } else {
            // Animacja zakończona
            if (gameSounds.reel_stop) {
                gameSounds.reel_stop.play();
            }
            closeModal(lootboxAnimationModal);
            const wonItemData = shopData[wonItem.itemId];
            showItemRevealModal(wonItemData, wonItem.rarity);
        }
    }

    requestAnimationFrame(animationStep);
}

function showItemRevealModal(wonItemData, rarity) {
    // Wyczyść stare klasy rzadkości
    revealModalContent.classList.remove('reveal-common', 'reveal-rare', 'reveal-legendary');
    revealItemRarity.classList.remove('rarity-common', 'rarity-rare', 'rarity-legendary');

    // Dodaj nowe, poprawne klasy
    revealModalContent.classList.add(`reveal-${rarity}`);
    revealItemRarity.classList.add(`rarity-${rarity}`);

    // Znajdź ID przedmiotu, aby użyć tłumaczeń
    let itemIdForI18n = null;
    for (const k in shopData) {
        if (shopData[k] === wonItemData) { itemIdForI18n = k; break; }
    }

    // Wypełnij modal danymi przedmiotu (z tłumaczeniami, jeśli dostępne)
    revealItemIcon.innerHTML = `<span>${wonItemData.icon}</span>`;
    const translatedName = (itemIdForI18n && window.i18next && i18next.isInitialized)
        ? (i18next.t(`items.${itemIdForI18n}.name`) || wonItemData.name)
        : wonItemData.name;
    const translatedDesc = (itemIdForI18n && window.i18next && i18next.isInitialized)
        ? (i18next.t(`items.${itemIdForI18n}.description`) || wonItemData.description)
        : wonItemData.description;
    revealItemName.textContent = translatedName;
    revealItemDescription.textContent = translatedDesc;
    revealItemRarity.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1); // np. "Rare"

    openModal(itemRevealModal);
}

function populateShopModalWithBoxes(categoryKey) {
    const boxes = lootBoxData[categoryKey];
    if (!boxes) return;

    shopGrid.innerHTML = '';
    shopModalTitle.textContent = categoryNames[categoryKey];

    boxes.forEach(box => {
        const boxName = (window.i18next && i18next.isInitialized) ? (i18next.t(`lootboxes.${box.id}.name`) || box.name) : box.name;
        const boxDesc = (window.i18next && i18next.isInitialized) ? (i18next.t(`lootboxes.${box.id}.description`) || box.description) : box.description;
        const card = document.createElement('div');
        card.className = 'shop-item-slot col-span-2 md:col-span-4';
        if (!box.enabled) {
            card.classList.add('opacity-50', 'cursor-not-allowed');
        }

        const possibleLoot = box.lootPool.map(loot => {
            const item = shopData[loot.itemId];
            const itemName = (window.i18next && i18next.isInitialized) 
            ? (i18next.t(`items.${item.id}.name`) || item.name) 
            : item.name;
        const itemDescription = (window.i18next && i18next.isInitialized) 
            ? (i18next.t(`items.${item.id}.description`) || item.description) 
            : item.description;
            const itemRarity = loot.rarity; // np. 'common', 'rare', 'legendary'

            // Każda ikonka dostaje teraz tło, ramkę w kolorze rzadkości i tooltip
            return `<div class="loot-preview-item rarity-${itemRarity} has-tooltip" data-tooltip="${itemName}: ${itemDescription}">
                        ${item.icon}
                    </div>`;
        }).join(''); // join('') jest ważne, bo łączymy divy bez dodatkowych spacji

        const coinsLabel = (window.i18next && i18next.isInitialized) ? i18next.t('shop.coins_label') : 'monet';
        const buyOpenLabel = (window.i18next && i18next.isInitialized) ? i18next.t('shop.buy_open') : 'KUP i OTWÓRZ';
        const comingSoon = (window.i18next && i18next.isInitialized) ? i18next.t('shop.coming_soon') : 'WKRÓTCE DOSTĘPNE';
        let bottomContent = box.enabled
            ? `<div class="w-full mt-auto"><div class="text-amber-400 font-bold mb-2">${box.price} ${coinsLabel}</div><button class="buy-button">${buyOpenLabel}</button></div>`
            : `<div class="owned-text">${comingSoon}</div>`;

        card.innerHTML = `
            <div class="text-6xl">${box.icon}</div>
            <div class="font-bold text-base">${boxName}</div>
            <div class="text-sm text-gray-400 px-1 leading-tight">${boxDesc}</div>
            <div class="text-sm text-gray-400 px-1 leading-tight mt-4">${(window.i18next && i18next.isInitialized) ? i18next.t('shop.possible_contents') : 'Możliwa zawartość:'}</div>
            <div class="flex gap-2 justify-center">${possibleLoot}</div>
            ${bottomContent}
        `;

        if (box.enabled) {
            card.querySelector('.buy-button').addEventListener('click', (e) => {
                e.stopPropagation();
                openLootbox(box.id, card); // Przekazujemy ID konkretnej skrzynki
            });
        }
        shopGrid.appendChild(card);
    });
}
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    notificationContainer.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

async function equipItem(itemId) {
    let stats = loadStats();
    const item = shopData[itemId];
    const slot = categoryToSlotMap[item.category];
    stats.equippedItems[slot] = itemId;
    const updatedStats = await updateAndSaveStats(0, stats);
    updateEquipmentPanel(updatedStats);
    closeModal(equipmentModal);
    openInventoryHub();
}

async function unequipItem(category) {
    let stats = loadStats();
    const slot = categoryToSlotMap[category];
    stats.equippedItems[slot] = null;
    const updatedStats = await updateAndSaveStats(0, stats);
    updateEquipmentPanel(updatedStats);
    closeModal(equipmentModal);
    openInventoryHub();
}

function updateEquipmentPanel(stats) {
    // Sprawdź, czy obiekt stats i equippedItems w ogóle istnieją
    if (!stats || !stats.equippedItems) {
        return;
    }

    for (const slot in stats.equippedItems) {
        const itemId = stats.equippedItems[slot];
        const slotElement = document.getElementById(`equipment-slot-${slot}`);

        // KLUCZOWA POPRAWKA: Działaj tylko, jeśli element istnieje na stronie!
        if (slotElement) {
            if (itemId && shopData[itemId]) {
                slotElement.innerHTML = `<span class="text-3xl">${shopData[itemId].icon}</span>`;
            } else {
                const defaultIcons = {
                    character: `<svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>`,
                    axe: '斧', hat: '🧢', accessory: '🧣', pet: '🐾'
                };
                slotElement.innerHTML = defaultIcons[slot];
            }
        }
    }
}

async function populateEquipmentSelectionModal(category) {
    console.log('3. Ekwipunek w momencie otwarcia modala:', loadStats().unlockedItems);
    equipmentGrid.innerHTML = '';
    if (window.i18next && i18next.isInitialized) {
        equipmentModalTitle.textContent = `${i18next.t('equipmentModal.title')}: ${categoryNames[category] || category}`;
        unequipButton.textContent = i18next.t('equipmentModal.unequip');
    } else {
        equipmentModalTitle.textContent = `Wybierz: ${categoryNames[category] || category}`;
    }
    const stats = loadStats();

    // NOWA LOGIKA: Filtruj przedmioty, które gracz posiada (ilość > 0)
    const ownedItemsInCategory = Object.keys(stats.unlockedItems)
        .map(id => shopData[id])
        .filter(item => item && item.category === category);

    if (ownedItemsInCategory.length === 0) {
        const noItemsText = (window.i18next && i18next.isInitialized)
            ? (baseLang => baseLang === 'en' ? 'You do not own any items in this category.' : 'Nie posiadasz żadnych przedmiotów z tej kategorii.')( (i18next.language||'pl').split('-')[0] )
            : 'Nie posiadasz żadnych przedmiotów z tej kategorii.';
        equipmentGrid.innerHTML = `<p class="col-span-4 text-center text-gray-500">${noItemsText}</p>`;
    } else {
        ownedItemsInCategory.forEach(item => {
            const quantity = stats.unlockedItems[item.id];
            const card = document.createElement('div');
            const rarity = itemRarityMap[item.id] || 'common'; // Pobierz rzadkość z naszej mapy, domyślnie 'common'
            card.className = `equipment-selection-item relative rarity-${rarity}`;
            // Dodaj wskaźnik ilości
            const translatedName = (window.i18next && i18next.isInitialized)
                ? (i18next.t(`items.${item.id}.name`) || item.name)
                : item.name;
            card.innerHTML = `
                <div class="item-quantity-badge">x${quantity}</div>
                <span>${item.icon}</span>
                <span class="item-name">${translatedName}</span>
            `;
            card.addEventListener('click', () => equipItem(item.id));
            equipmentGrid.appendChild(card);
        });
    }
    unequipButton.onclick = () => unequipItem(category);
    openModal(equipmentModal);
}

function drawReadyState() {
    // Ta funkcja to uproszczona wersja init(), która tylko rysuje scenę, ale nie startuje gry
    score = 0;
    player.side = 'left';
    //gameState = 'playing';
    tree = [];
    particles = [];
    timer = MAX_TIME;
    const stats = loadStats();
    petSaveUsed = false;
    activeBonuses = { 
        timeGainBonus: 0, 
        timerSlowdown: 0, 
        coinMultiplier: 0, 
        coinMultiplierBonus: 0, // Nowy bonus z siekier
        expMultiplierBonus: 0   // Nowy bonus ze zwierzaków
    };
    if (stats.equippedItems) {
        for (const slot in stats.equippedItems) {
            const itemId = stats.equippedItems[slot];
            if (itemId && shopData[itemId]) {
                const bonus = shopData[itemId].bonus;
                activeBonuses[bonus.type] += bonus.value;
            }
        }
    }
    const initialSegments = Math.ceil(canvas.height / SEGMENT_HEIGHT) + 2;
    for (let i = 0; i < initialSegments; i++) {
        if (i < 2) tree.push({ branch: null });
        else {
            const lastBranch = tree[i - 1].branch;
            let newBranchSide = Math.random() < 0.5 ? 'left' : 'right';
            if (lastBranch && lastBranch !== newBranchSide) tree.push({ branch: null });
            else tree.push({ branch: Math.random() < 0.35 ? newBranchSide : null });
        }
    }
    scoreElement.textContent = score;
    draw();
}

async function init() {
    gameState = 'playing';
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
}

function gameLoop() {
    // ZMIANA 1: Pozwól pętli działać także w stanie 'birds-success'
    if (gameState !== 'playing' && gameState !== 'birds-success') return;

    // ZMIANA 2: Logika gry (timer) działa tylko w stanie 'playing'
    if (gameState === 'playing') {
        timer -= (0.2 * (1 - activeBonuses.timerSlowdown));
        if (timer <= 0) {
            timer = 0;
            gameOver();
        }
        timerBar.style.width = `${(timer / MAX_TIME) * 100}%`;
    }

    // Te funkcje odpowiadają za animacje i będą działać w obu stanach
    updateParticles();
    draw();
}

function updateParticles() {
    particles.forEach(p => { p.velocityY += 0.4; p.x += p.velocityX; p.y += p.velocityY; p.rotation += p.rotationSpeed; });
    particles = particles.filter(p => p.y < canvas.height);
}

function draw() {
    // Krok 1: Wyczyść cały ekran przed rysowaniem nowej klatki
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Krok 2: Narysuj tło (niebo) - jest najgłębiej
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Krok 3: Narysuj drzewo i jego gałęzie
    tree.forEach((segment, index) => {
        const y = canvas.height - (index + 1) * SEGMENT_HEIGHT;
        
        // Ta poprawka stabilizuje numery pni w momencie zatrzymania gry
        //const effectiveScore = (gameMode === 'birds' && birdsSuccess) ? score - 1 : score;
        const segmentNumber = score + index + 1;
    
        let isSpecialSegment = false;
    
        // Rysuj niebieski blok (gniazdo), jeśli to ten właściwy segment
        if (gameMode === 'birds' && segmentNumber === birdsTarget + 1) {
            drawBirdsTreeTop(TRUNK_X, y, TRUNK_WIDTH, SEGMENT_HEIGHT);
            isSpecialSegment = true;
        } else {
            // W każdym innym przypadku rysuj zwykły pień.
            drawTrunkSegment(TRUNK_X, y, TRUNK_WIDTH, SEGMENT_HEIGHT);
        }
    
        // Rysuj gałęzie tylko, jeśli segment nie jest gniazdem
        if (segment.branch && !isSpecialSegment) {
            drawBranch(TRUNK_X, y, segment.branch);
        }
    });

    // Krok 4: Narysuj elementy, które są "za" graczem, ale "przed" drzewem
    drawParticles();
    drawGrass();

    // Krok 5: Narysuj gracza (NA SAMYM KOŃCU, aby był na wierzchu)
    drawPlayer();
}
function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        ctx.rotate(p.rotation);
        drawTrunkSegment(-p.width / 2, -p.height / 2, p.width, p.height);
        if (p.branch) {
            const branchYRelative = -p.height / 2 + (SEGMENT_HEIGHT - BRANCH_HEIGHT) / 2;
            const trunkXRelative = -p.width / 2;
            ctx.fillStyle = BRANCH_COLOR;
            if (p.branch === 'left') {
                ctx.fillRect(trunkXRelative - BRANCH_WIDTH, branchYRelative, BRANCH_WIDTH, BRANCH_HEIGHT);
                ctx.fillStyle = BRANCH_DARK_COLOR;
                ctx.fillRect(trunkXRelative - BRANCH_WIDTH, branchYRelative, BRANCH_WIDTH, BRANCH_HEIGHT / 3);
            } else {
                ctx.fillRect(trunkXRelative + p.width, branchYRelative, BRANCH_WIDTH, BRANCH_HEIGHT);
                ctx.fillStyle = BRANCH_DARK_COLOR;
                ctx.fillRect(trunkXRelative + p.width, branchYRelative, BRANCH_WIDTH, BRANCH_HEIGHT / 3);
            }
        }
        ctx.restore();
    });
}

function drawTrunkSegment(x, y, width, height) {
    ctx.fillStyle = TRUNK_COLOR;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = TRUNK_DARK_COLOR;
    for (let i = 0; i < 3; i++) ctx.fillRect(x + (i * width / 3) + 5, y, 2, height);
    ctx.strokeStyle = TRUNK_DARK_COLOR;
    ctx.strokeRect(x, y, width, height);
}

function drawBranch(trunkX, segmentY, side) {
    ctx.fillStyle = BRANCH_COLOR;
    const branchY = segmentY + (SEGMENT_HEIGHT - BRANCH_HEIGHT) / 2;
    if (side === 'left') {
        ctx.fillRect(trunkX - BRANCH_WIDTH, branchY, BRANCH_WIDTH, BRANCH_HEIGHT);
        ctx.fillStyle = BRANCH_DARK_COLOR;
        ctx.fillRect(trunkX - BRANCH_WIDTH, branchY, BRANCH_WIDTH, BRANCH_HEIGHT / 3);
    } else {
        ctx.fillRect(trunkX + TRUNK_WIDTH, branchY, BRANCH_WIDTH, BRANCH_HEIGHT);
        ctx.fillStyle = BRANCH_DARK_COLOR;
        ctx.fillRect(trunkX + TRUNK_WIDTH, branchY, BRANCH_WIDTH, BRANCH_HEIGHT / 3);
    }
}

function drawBirdsTreeTop(x, y, width, height) {
    // Narysuj niebieski blok z ptakami
    ctx.fillStyle = '#4A90E2'; // Niebieski kolor
    ctx.fillRect(x, y, width, height);
    
    // Dodaj gradient dla lepszego efektu
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#87CEEB'); // Jasny niebieski
    gradient.addColorStop(1, '#4A90E2'); // Ciemniejszy niebieski
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    // Dodaj obramowanie
    ctx.strokeStyle = '#2E5984';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Narysuj ptaki na bloku
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.fillText('🕊️', centerX, centerY + 8);
}

function drawGrass() {
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    ctx.fillStyle = '#558B2F';
    for (let i = 0; i < canvas.width; i += 10) ctx.fillRect(i + Math.random() * 5, canvas.height - GROUND_HEIGHT - Math.random() * 5, 2, 10);
}

function drawPlayer() {
    const playerY = canvas.height - PLAYER_HEIGHT;
    let playerX, scaleX;

    // Wybierz odpowiednią klatkę animacji
    let spriteToDraw;
    if (player.frame === 'idle') {
        spriteToDraw = playerSprites.idle;
    } else if (player.frame === 'swing') {
        spriteToDraw = playerSprites.swing;
    } else { // 'chop'
        spriteToDraw = playerSprites.chop;
    }

    if (spriteToDraw && spriteToDraw.complete && spriteToDraw.naturalWidth > 0) {

        const aspectRatio = spriteToDraw.naturalWidth / spriteToDraw.naturalHeight;
        const dynamicWidth = PLAYER_HEIGHT * aspectRatio;
        const widthDifference = dynamicWidth - PLAYER_WIDTH;

        if (player.side === 'left') {
            // Lewa strona - działała dobrze, zostaje bez zmian
            playerX = (TRUNK_X - PLAYER_WIDTH - PLAYER_OFFSET_X) + widthDifference;
            scaleX = -1;
        } else { // Prawa strona
            // POPRAWKA TUTAJ: Mnożymy przesunięcie, aby było bardziej wyraziste
            playerX = (TRUNK_X + TRUNK_WIDTH + PLAYER_OFFSET_X) - (widthDifference * LUNGE_MULTIPLIER);
            scaleX = 1;
        }

        ctx.save();
        ctx.translate(playerX + dynamicWidth / 2, playerY + PLAYER_HEIGHT / 2);
        ctx.scale(scaleX, 1);
        ctx.drawImage(spriteToDraw, -dynamicWidth / 2, -PLAYER_HEIGHT / 2, dynamicWidth, PLAYER_HEIGHT);
        ctx.restore();
    }
}
async function gameOver() {
    if (gameState === 'gameOver') return;
    countdownOverlay.classList.add('hidden');
    gameState = 'gameOver';
    clearInterval(gameLoopInterval);

    // Ukryj pasek postępu w trybie ptaków
    if (gameMode === 'birds') {
        rescueProgressContainer.classList.add('hidden');
        document.getElementById('game-container').classList.remove('birds-success');
    }

    // Pokaż overlay i odpowiednie menu
    messageOverlay.style.display = 'flex';
    mainMenu.classList.add('hidden');
    classicMenu.classList.add('hidden');
    birdsMenu.classList.add('hidden');
    gameOverMenu.classList.remove('hidden');

    // Ustaw tekst wyniku w zależności od trybu
    let resultText = '';
    if (gameMode === 'birds') {
        if (birdsSuccess) {
            resultText = (window.i18next && i18next.isInitialized) ? i18next.t('birdsMode.success') : 'Ptaki uratowane!';
            gameOverScore.textContent = `${resultText} (${score} pni)`;
        } else {
            resultText = (window.i18next && i18next.isInitialized) ? i18next.t('birdsMode.fail') : 'Nie udało się uratować ptaków.';
            gameOverScore.textContent = `${resultText} (${score}/${birdsTarget})`;
        }
    } else {
        resultText = (window.i18next && i18next.isInitialized) ? i18next.t('gameOver.result') : 'Twój wynik';
        gameOverScore.textContent = `${resultText}: ${score}.`;
    }

    const oldStats = loadStats();
    
    if (gameMode === 'birds') {
        // Tryb ptaków - specjalne naliczanie nagród
        if (birdsSuccess) {
            const { coins, exp } = BIRDS_CONFIG.rewards[birdsDifficulty];
            await animateStatUpdate(oldStats, score, {
                mode: 'birds',
                birds: { success: true, coinsReward: coins, expReward: exp },
                overrideScoreContributions: true
            });
        } else {
            await animateStatUpdate(oldStats, score, {
                mode: 'birds',
                birds: { success: false, coinsReward: 0, expReward: 0 },
                overrideScoreContributions: true
            });
        }
    } else {
        // Tryb klasyczny - bez zmian
        await animateStatUpdate(oldStats, score);
        
        if (currentUser && score > 0) {
            const newStats = loadStats();
            if (score === newStats.highScore) {
                setTimeout(() => {
                    showPostGameRanking(score);
                }, 2000);
            }
        }
    }
}

function performChop(sideToChop) {
    if (gameState !== 'playing') return;

    const segmentToCut = tree[0];
    if (segmentToCut && segmentToCut.branch === sideToChop) {
        player.side = sideToChop;
        draw();
        setTimeout(gameOver, 50);
        return;
    }

    // --- UNIWERSALNA LOGIKA CIĘCIA ---
    player.side = sideToChop;
    if (gameSounds.chop) {
        const chopSound = gameSounds.chop.cloneNode();
        chopSound.volume = 0.7;
        chopSound.play();
    }
    score += 1;
    scoreElement.textContent = score;
    let timeGain = 5 - (Math.sqrt(score) / 10);
    if (timeGain < 1) timeGain = 1;
    timer += (timeGain + activeBonuses.timeGainBonus);
    if (timer > MAX_TIME) timer = MAX_TIME;

    // KROK 1: ZAWSZE wykonaj ścięcie pnia i stwórz animację.
    const choppedSegment = tree.shift();
    if (choppedSegment) {
        particles.push({
            x: TRUNK_X, y: canvas.height - SEGMENT_HEIGHT, width: TRUNK_WIDTH, height: SEGMENT_HEIGHT,
            branch: choppedSegment.branch, velocityX: (player.side === 'left' ? 1 : -1) * (Math.random() * 3 + 3),
            velocityY: -7, rotation: 0, rotationSpeed: (player.side === 'left' ? 1 : -1) * (Math.random() * 0.05 + 0.05)
        });
    }
    
    // KROK 2: POTEM sprawdź, czy to było zwycięskie cięcie.
    if (gameMode === 'birds') {
        birdsProgress = score;
        updateRescueProgressUI(birdsProgress, birdsTarget);

        if (birdsProgress >= birdsTarget) {
            birdsSuccess = true;
            birdsRescueComplete();
            
            // Uruchom animację gracza i zakończ funkcję.
            clearTimeout(animationTimeout1);
            clearTimeout(animationTimeout2);
            player.frame = 'swing';
            animationTimeout1 = setTimeout(() => { player.frame = 'chop'; }, 75);
            animationTimeout2 = setTimeout(() => { player.frame = 'idle'; }, 150);
            return; // Zakończ, aby nie generować nowego pnia i nie sprawdzać kolizji.
        }
    }

    // KROK 3: Jeśli to NIE było zwycięskie cięcie, kontynuuj normalnie.
    // Logika generowania nowych pni
    if (gameMode === 'birds') {
        if (score + tree.length < birdsTarget + 1) {
            let newBranch = null;
            const lastSegment = tree[tree.length - 1];
            const branchChance = 0.35 + (score / 200);
            if (Math.random() < branchChance) {
                const potentialSide = Math.random() < 0.5 ? 'left' : 'right';
                if (lastSegment && lastSegment.branch && lastSegment.branch !== potentialSide) newBranch = null;
                else newBranch = potentialSide;
            }
            tree.push({ branch: newBranch });
        }
    } else {
        // Generowanie dla trybu klasycznego
        let newBranch = null;
        const lastSegment = tree[tree.length - 1];
        const branchChance = 0.35 + (score / 200);
        if (Math.random() < branchChance) {
            const potentialSide = Math.random() < 0.5 ? 'left' : 'right';
            if (lastSegment && lastSegment.branch && lastSegment.branch !== potentialSide) newBranch = null;
            else newBranch = potentialSide;
        }
        tree.push({ branch: newBranch });
    }

    const segmentNextToPlayer = tree[0];
    if (segmentNextToPlayer && segmentNextToPlayer.branch === player.side) {
        setTimeout(gameOver, 50);
        return;
    }

    clearTimeout(animationTimeout1);
    clearTimeout(animationTimeout2);
    player.frame = 'swing';
    animationTimeout1 = setTimeout(() => { player.frame = 'chop'; }, 75);
    animationTimeout2 = setTimeout(() => { player.frame = 'idle'; }, 150);
}

function handleMouseInput(event) { performChopBasedOnInput(event); }
function handleTouchInput(event) { event.preventDefault(); performChopBasedOnInput(event); }
function performChopBasedOnInput(event) {
    // Zablokuj input podczas odliczania i w innych stanach niż 'playing'
    if (gameState !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (event.clientX !== undefined ? event.clientX : event.changedTouches[0].clientX) - rect.left;
    const side = (clickX < canvas.width / 2) ? 'left' : 'right';
    performChop(side);
}
function handleKeyboardInput(event) {
    if (gameState !== 'playing' || isKeyPressed) return; // <-- 1. Sprawdź blokadę

    let side = null;
    switch (event.key.toLowerCase()) {
        case 'arrowleft': case 'a': case 'j': side = 'left'; break;
        case 'arrowright': case 'd': case 'l': side = 'right'; break;
    }
    if (side) {
        isKeyPressed = true; // <-- 2. Włącz blokadę
        performChop(side);
    }
}

// --- Logika Modali ---
function openModal(modal) {
    modal.style.display = 'flex';
    modal.classList.remove('is-closing');
    modal.classList.add('is-opening');
}

let loadingInterval = null;

function startLoadingAnimation() {
    let progress = 0;
    const stages = [
        { percent: 30, text: 'Budzenie Kici...' },
        { percent: 70, text: 'Łączenie z serwerem...' },
        { percent: 95, text: 'Prawie gotowe...' }
    ];
    let currentStage = 0;

    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';

    loadingInterval = setInterval(() => {
        if (currentStage < stages.length && progress >= stages[currentStage].percent) {
            loadingStatusText.textContent = stages[currentStage].text;
            currentStage++;
        }
        if (progress < 95) {
            progress += 1;
            progressBarFill.style.width = `${progress}%`;
        }
    }, 50); // Szybkość animacji
}

function finishLoadingAnimation() {
    clearInterval(loadingInterval);
    progressBarFill.style.width = '100%';
    loadingStatusText.textContent = 'Gotowe!';

    // Poczekaj chwilę, aby gracz zobaczył 100%, a następnie dodaj klasę ukrywającą
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 500); // Pół sekundy pauzy, aby zobaczyć napis "Gotowe!"
}

function closeModal(modal) {
    modal.classList.remove('is-opening');
    modal.classList.add('is-closing');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('is-closing');
    }, 300);
}

// --- Logika Autoryzacji Frontendu ---
async function checkLoginStatus() {
    try {
        console.log('Sprawdzanie statusu logowania...');
        const response = await fetch(`${BACKEND_URL}/api/me`, { credentials: 'include' });
        if (!response.ok) throw new Error('Użytkownik niezalogowany');
        const user = await response.json();
        currentUser = user;
        updateUIAfterLogin(user);
        console.log('Logowanie zakończone pomyślnie');
    } catch (error) {
        console.log('Błąd sprawdzania statusu logowania:', error.message);
        currentUser = null;
        showLoginButton();
    }
    
    // Oznacz logowanie jako gotowe po próbie (niezależnie od wyniku)
    markComponentReady('login');
    
    // Teraz załaduj sklep - to też może wymagać połączenia z serwerem
    try {
        console.log('Ładowanie sklepu...');
        const stats = loadStats();
        updateStatsUI(stats);
        populateShopPreview();
        console.log('Sklep załadowany');
        markComponentReady('shop');
    } catch (error) {
        console.error('Błąd ładowania sklepu:', error);
        // Nawet jeśli sklep się nie załaduje, oznacz jako gotowy żeby nie blokować
        markComponentReady('shop');
    }
}

function openInventoryHub() {
    const stats = loadStats();
    updateEquipmentPanel(stats); // Wypełnij hub aktualnie założonymi przedmiotami
    openModal(inventoryHubModal);
}

function openShopHub() {
    shopHubGrid.innerHTML = ''; // Wyczyść siatkę przed wypełnieniem

    // Dynamicznie stwórz przyciski dla każdej kategorii
    for (const categoryKey in categoryNames) {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = categoryNames[categoryKey];
        button.dataset.category = categoryKey;

        button.addEventListener('click', () => {
            closeModal(shopHubModal);
            // POPRAWKA TUTAJ: Używamy poprawnej nazwy funkcji z "es" na końcu
            populateShopModalWithBoxes(categoryKey); 
            openModal(shopModal);
        });

        shopHubGrid.appendChild(button);
    }

    openModal(shopHubModal);
}

function openAccountHub() {
    const stats = loadStats();
    updateStatsUI(stats); // Upewnij się, że staty w modalu są aktualne
    populateAchievementsGrid(); // Wypełnij siatkę osiągnięć
    openModal(accountHubModal);
}

function updateContent() {
    try {
        const storedLang = localStorage.getItem('i18nextLng') || 'pl';
        let baseLang = storedLang.split('-')[0];

        if (window.i18next && i18next.isInitialized) {
            const resolved = i18next.resolvedLanguage || i18next.language || storedLang;
            baseLang = (resolved || 'pl').split('-')[0];
            document.documentElement.setAttribute('lang', baseLang);

            // Przetłumacz elementy oznaczone data-i18n (z wyjątkami)
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (!key) return;
                if (currentUser && el.id === 'main-username') return;
                if (el.id === 'auth-button') return;
                const txt = i18next.t(key);
                if (typeof txt === 'string' && txt.length) el.textContent = txt;
            });

            if (shopPreviewContainer) populateShopPreview();
            // Zaktualizuj przycisk logowania/wylogowania zgodnie ze stanem
            if (authButton) {
                authButton.textContent = currentUser ? i18next.t('buttons.logout') : i18next.t('buttons.login');
            }
            
            // Zaktualizuj elementy profilu
            if (profileLogoutBtn) {
                profileLogoutBtn.textContent = i18next.t('accountHub.profile_tab.logout_button');
            }
            if (guestLoginBtn) {
                guestLoginBtn.textContent = i18next.t('accountHub.profile_tab.login_button');
            }
            if (document.querySelector('#guest-profile-section p')) {
                document.querySelector('#guest-profile-section p').textContent = i18next.t('accountHub.profile_tab.guest_message');
            }
            
            // Zaktualizuj modale edycji profilu
            if (document.querySelector('#avatar-edit-modal h2')) {
                document.querySelector('#avatar-edit-modal h2').textContent = i18next.t('accountHub.profile_tab.change_avatar');
            }
            if (document.querySelector('#avatar-edit-modal p')) {
                document.querySelector('#avatar-edit-modal p').textContent = i18next.t('accountHub.profile_tab.avatar_preview_text');
            }
            if (document.querySelector('#cancel-avatar-edit')) {
                document.querySelector('#cancel-avatar-edit').textContent = i18next.t('accountHub.profile_tab.cancel');
            }
            if (document.querySelector('#save-avatar')) {
                document.querySelector('#save-avatar').textContent = i18next.t('accountHub.profile_tab.save');
            }
            
            if (document.querySelector('#username-edit-modal h2')) {
                document.querySelector('#username-edit-modal h2').textContent = i18next.t('accountHub.profile_tab.change_username');
            }
            if (document.querySelector('#username-edit-modal label')) {
                document.querySelector('#username-edit-modal label').textContent = i18next.t('accountHub.profile_tab.new_username_label');
            }
            if (document.querySelector('#new-username')) {
                document.querySelector('#new-username').placeholder = i18next.t('accountHub.profile_tab.new_username_placeholder');
            }
            if (document.querySelector('#username-edit-modal .text-xs')) {
                document.querySelector('#username-edit-modal .text-xs').textContent = i18next.t('accountHub.profile_tab.max_chars');
            }
            if (document.querySelector('#cancel-username-edit')) {
                document.querySelector('#cancel-username-edit').textContent = i18next.t('accountHub.profile_tab.cancel');
            }
            if (document.querySelector('#save-username')) {
                document.querySelector('#save-username').textContent = i18next.t('accountHub.profile_tab.save');
            }
            
            // Zaktualizuj elementy rankingu
            if (document.querySelector('#leaderboard-modal h2')) {
                document.querySelector('#leaderboard-modal h2').textContent = i18next.t('accountHub.stats_tab.leaderboard_title');
            }
            if (document.querySelector('#leaderboard-highscore')) {
                document.querySelector('#leaderboard-highscore').textContent = i18next.t('accountHub.stats_tab.leaderboard_highscore');
            }
            if (document.querySelector('#leaderboard-totalchops')) {
                document.querySelector('#leaderboard-totalchops').textContent = i18next.t('accountHub.stats_tab.leaderboard_totalchops');
            }
            if (document.querySelector('#leaderboard-level')) {
                document.querySelector('#leaderboard-level').textContent = i18next.t('accountHub.stats_tab.leaderboard_level');
            }
            if (document.querySelector('#leaderboard-coins')) {
                document.querySelector('#leaderboard-coins').textContent = i18next.t('accountHub.stats_tab.leaderboard_coins');
            }
            if (document.querySelector('#user-ranking-stats h3')) {
                document.querySelector('#user-ranking-stats h3').textContent = i18next.t('accountHub.stats_tab.leaderboard_your_position');
            }
            if (document.querySelector('#post-game-ranking h3')) {
                document.querySelector('#post-game-ranking h3').textContent = i18next.t('accountHub.stats_tab.post_game_ranking_title');
            }
            if (document.querySelector('#close-post-game-ranking')) {
                document.querySelector('#close-post-game-ranking').textContent = i18next.t('accountHub.stats_tab.post_game_ranking_continue');
            }
            
            // Tłumaczenia są już oznaczone jako gotowe w window.onload
        }

        // Aktywny stan przycisków języka (działa także zanim i18next się zainicjuje)
        setActiveLanguageButtons(baseLang);
    } catch (e) {
        console.error('[i18n] updateContent error:', e);
    }
}

// Logika przełączania zakładek w modalu Konta
function switchAccountTab(targetTabName) {
    // Zdejmij 'active' ze wszystkich zakładek i ukryj całą zawartość
    tabs.forEach(item => item.classList.remove('active'));
    tabContents.forEach(content => content.classList.add('hidden'));

    // Znajdź i aktywuj docelową zakładkę i jej zawartość
    const targetTab = document.querySelector(`.tab-button[data-tab="${targetTabName}"]`);
    const targetContent = document.getElementById(`${targetTabName}-tab-content`);

    if (targetTab) targetTab.classList.add('active');
    if (targetContent) targetContent.classList.remove('hidden');
}
const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        tabContents.forEach(content => {
            if (content.id === `${target}-tab-content`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
        if (target === 'missions') {
            fetchAndDisplayMissions(true);
        }
    });
});

function updateUIAfterLogin(user) {
    // Zmień przycisk w przycisk "Wyloguj"
    if (window.i18next && i18next.isInitialized) {
        authButton.textContent = i18next.t('buttons.logout');
    } else {
        authButton.textContent = 'Wyloguj się';
    }
    authButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    authButton.classList.add('bg-red-600', 'hover:bg-red-700'); // Czerwony kolor dla wylogowania

    // Aktualizuj główny panel statystyk
    if (user.avatar_type && user.avatar_type !== 'default') {
        // Użyj emoji awatara
        const avatar = availableAvatars.find(a => a.id === user.avatar_type);
        if (avatar) {
            mainAvatarContainer.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center text-3xl">${avatar.icon}</div>`;
        } else {
            // Fallback na domyślny awatar
            mainAvatarContainer.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center text-3xl">👤</div>`;
        }
    } else {
        // Użyj URL awatara z Google
        const userAvatarUrl = user.avatar_url;
        mainAvatarContainer.innerHTML = `<img src="${userAvatarUrl}" alt="Avatar" class="w-full h-full rounded-full">`;
    }
    mainUsername.textContent = user.display_name;
    
    // Aktualizuj sekcję profilu
    updateProfileSection(user);
}

function updateProfileSection(user) {
    if (user) {
        // Pokaż sekcję użytkownika, ukryj sekcję gościa
        userProfileSection.classList.remove('hidden');
        guestProfileSection.classList.add('hidden');
        
        // Aktualizuj dane profilu
        if (user.avatar_type && user.avatar_type !== 'default') {
            // Użyj emoji awatara
            const avatar = availableAvatars.find(a => a.id === user.avatar_type);
            if (avatar) {
                profileAvatarContainer.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center text-4xl">${avatar.icon}</div>`;
            } else {
                // Fallback na domyślny awatar
                profileAvatarContainer.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center text-4xl">👤</div>`;
            }
        } else {
            // Użyj URL awatara z Google
            const userAvatarUrl = user.avatar_url;
            profileAvatarContainer.innerHTML = `<img src="${userAvatarUrl}" alt="Avatar" class="w-full h-full rounded-full object-cover">`;
        }
        profileUsername.textContent = user.display_name;
        profileEmail.textContent = user.email || 'Brak email';
    } else {
        // Pokaż sekcję gościa, ukryj sekcję użytkownika
        userProfileSection.classList.add('hidden');
        guestProfileSection.classList.remove('hidden');
    }
}

function showLoginButton() {
    // Wyczyść cache misji przy wylogowaniu
    missionsCache = null;
    missionsLastFetch = 0;
    
    // Zmień przycisk w przycisk "Zaloguj"
    if (window.i18next && i18next.isInitialized) {
        authButton.textContent = i18next.t('buttons.login');
    } else {
        authButton.textContent = 'Zaloguj się z Google';
    }
    authButton.classList.remove('bg-red-600', 'hover:bg-red-700');
    authButton.classList.add('bg-blue-600', 'hover:bg-blue-700');

    // Przywróć domyślny wygląd panelu statystyk
    mainAvatarContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
    </svg>`;
    if (window.i18next && i18next.isInitialized) {
        mainUsername.textContent = i18next.t('statsPanel.guest');
    } else {
        mainUsername.textContent = 'Gość';
    }
    
    // Aktualizuj sekcję profilu dla gościa
    updateProfileSection(null);
}

// --- FUNKCJE EDYCJI PROFILU ---

// Dostępne awatary (można rozszerzyć)
const availableAvatars = [
    { id: 'default', name: 'Domyślny', icon: '👤' },
    { id: 'cat', name: 'Kotek', icon: '🐱' },
    { id: 'dog', name: 'Piesek', icon: '🐶' },
    { id: 'robot', name: 'Robot', icon: '🤖' },
    { id: 'alien', name: 'Kosmita', icon: '👽' },
    { id: 'ninja', name: 'Ninja', icon: '🥷' },
    { id: 'wizard', name: 'Czarodziej', icon: '🧙' },
    { id: 'superhero', name: 'Superbohater', icon: '🦸' }
];

let selectedAvatar = null;

function openAvatarEditModal() {
    if (!currentUser) {
        showNotification('Musisz być zalogowany, aby edytować profil!', 'error');
        return;
    }
    
    // Wypełnij opcje awatarów
    avatarOptions.innerHTML = '';
    availableAvatars.forEach(avatar => {
        const option = document.createElement('div');
        option.className = 'w-16 h-16 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center cursor-pointer hover:border-amber-500 transition-colors text-2xl';
        option.innerHTML = avatar.icon;
        option.dataset.avatarId = avatar.id;
        option.addEventListener('click', () => selectAvatar(avatar));
        avatarOptions.appendChild(option);
    });
    
    // Ustaw aktualny awatar jako wybrany
    const currentAvatar = currentUser.avatar_type || 'default';
    selectedAvatar = currentAvatar;
    updateAvatarPreview();
    
    openModal(avatarEditModal);
}

function selectAvatar(avatar) {
    selectedAvatar = avatar.id;
    updateAvatarPreview();
    
    // Podświetl wybrany awatar
    avatarOptions.querySelectorAll('div').forEach(option => {
        option.classList.remove('border-amber-500', 'bg-amber-500/20');
        if (option.dataset.avatarId === avatar.id) {
            option.classList.add('border-amber-500', 'bg-amber-500/20');
        }
    });
}

function updateAvatarPreview() {
    const avatar = availableAvatars.find(a => a.id === selectedAvatar);
    if (avatar) {
        avatarPreview.innerHTML = `<span class="text-4xl">${avatar.icon}</span>`;
    }
}

async function saveAvatarChanges() {
    if (!currentUser || !selectedAvatar) return;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ avatar_type: selectedAvatar })
        });
        
        if (!response.ok) throw new Error('Błąd zapisywania awatara');
        
        const updatedUser = await response.json();
        currentUser = updatedUser;
        
        // Aktualizuj UI
        updateProfileSection(updatedUser);
        updateUIAfterLogin(updatedUser);
        
        closeModal(avatarEditModal);
        showNotification('Avatar został zaktualizowany!', 'success');
        
    } catch (error) {
        console.error('Błąd zapisywania awatara:', error);
        showNotification('Wystąpił błąd podczas zapisywania awatara', 'error');
    }
}

function openUsernameEditModal() {
    if (!currentUser) {
        showNotification('Musisz być zalogowany, aby edytować profil!', 'error');
        return;
    }
    
    newUsernameInput.value = currentUser.display_name || '';
    openModal(usernameEditModal);
}

async function saveUsernameChanges() {
    if (!currentUser) return;
    
    const newUsername = newUsernameInput.value.trim();
    if (!newUsername) {
        showNotification('Nazwa użytkownika nie może być pusta!', 'error');
        return;
    }
    
    if (newUsername.length > 50) {
        showNotification('Nazwa użytkownika jest za długa!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ display_name: newUsername })
        });
        
        if (!response.ok) throw new Error('Błąd zapisywania nazwy');
        
        const updatedUser = await response.json();
        currentUser = updatedUser;
        
        // Aktualizuj UI
        updateProfileSection(updatedUser);
        updateUIAfterLogin(updatedUser);
        
        closeModal(usernameEditModal);
        showNotification('Nazwa użytkownika została zaktualizowana!', 'success');
        
    } catch (error) {
        console.error('Błąd zapisywania nazwy:', error);
        showNotification('Wystąpił błąd podczas zapisywania nazwy', 'error');
    }
}

// --- FUNKCJE RANKINGU ---

let currentLeaderboardType = 'highscore';
let leaderboardData = [];

// Funkcje pomocnicze do zarządzania scrollbarem
function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';
}

function unlockBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.top = '';
    document.body.style.left = '';
}

async function openLeaderboardModal() {
    // Zablokuj scroll na body
    lockBodyScroll();
    
    openModal(leaderboardModal);
    await loadLeaderboardData(currentLeaderboardType);
}

async function loadLeaderboardData(type = 'highscore') {
    currentLeaderboardType = type;
    
    // Pokaż loading
    leaderboardContent.innerHTML = `
        <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            <span class="ml-3 text-gray-400">${window.i18next && i18next.isInitialized ? i18next.t('accountHub.stats_tab.leaderboard_loading') : 'Ładowanie rankingu...'}</span>
        </div>
    `;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/leaderboard?type=${type}`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Błąd ładowania rankingu');
        
        const data = await response.json();
        leaderboardData = data.leaderboard || [];
        
        renderLeaderboard(leaderboardData);
        updateUserRankingInfo(data.userRank || null);
        
    } catch (error) {
        console.error('Błąd ładowania rankingu:', error);
        leaderboardContent.innerHTML = `
            <div class="text-center py-8 text-red-400">
                <p>Błąd ładowania rankingu</p>
                <button onclick="loadLeaderboardData('${type}')" class="mt-2 panel-button bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg">
                    Spróbuj ponownie
                </button>
            </div>
        `;
    }
}

function renderLeaderboard(data) {
    if (!data || data.length === 0) {
        leaderboardContent.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <p>Brak danych w rankingu</p>
            </div>
        `;
        return;
    }
    
    leaderboardContent.innerHTML = '';
    
    data.forEach((player, index) => {
        const entry = document.createElement('div');
        entry.className = `leaderboard-entry ${player.isCurrentUser ? 'current-user' : ''}`;
        
        const position = index + 1;
        const positionClass = position <= 3 ? `rank-${position}` : '';
        
        // Określ wartość do wyświetlenia
        let displayValue = '';
        let displayLabel = '';
        
        switch (currentLeaderboardType) {
            case 'highscore':
                displayValue = player.high_score || 0;
                displayLabel = window.i18next && i18next.isInitialized ? i18next.t('accountHub.stats_tab.leaderboard_score') : 'Wynik';
                break;
            case 'totalchops':
                displayValue = player.total_chops || 0;
                displayLabel = window.i18next && i18next.isInitialized ? i18next.t('accountHub.stats_tab.leaderboard_chops') : 'Ścięte';
                break;
            case 'level':
                displayValue = calculateLevel(player.exp || 0);
                displayLabel = window.i18next && i18next.isInitialized ? i18next.t('accountHub.stats_tab.leaderboard_level_label') : 'Poziom';
                break;
            case 'coins':
                displayValue = (player.coins || 0).toFixed(2);
                displayLabel = window.i18next && i18next.isInitialized ? i18next.t('accountHub.stats_tab.leaderboard_coins_label') : 'Monety';
                break;
        }
        
        // Avatar
        let avatarHtml = '';
        if (player.avatar_type && player.avatar_type !== 'default') {
            const avatar = availableAvatars.find(a => a.id === player.avatar_type);
            if (avatar) {
                avatarHtml = `<div class="leaderboard-avatar">${avatar.icon}</div>`;
            } else {
                avatarHtml = `<div class="leaderboard-avatar">👤</div>`;
            }
        } else {
            avatarHtml = `<div class="leaderboard-avatar"><img src="${player.avatar_url}" alt="Avatar"></div>`;
        }
        
        entry.innerHTML = `
            <div class="leaderboard-position ${positionClass}">${position}</div>
            ${avatarHtml}
            <div class="leaderboard-info">
                <div class="leaderboard-name">${player.display_name || 'Gracz'}</div>
                <div class="leaderboard-stats">
                    <div class="leaderboard-stat">
                        <span class="leaderboard-value">${displayValue}</span>
                    </div>
                </div>
            </div>
            ${player.isCurrentUser ? '<div class="leaderboard-badge">TY</div>' : ''}
        `;
        
        leaderboardContent.appendChild(entry);
    });
}

function updateUserRankingInfo(userRank) {
    if (!userRank) {
        userRankingStats.style.display = 'none';
        return;
    }
    
    userRankingStats.style.display = 'block';
    
    let displayValue = '';
    switch (currentLeaderboardType) {
        case 'highscore':
            displayValue = userRank.high_score || 0;
            break;
        case 'totalchops':
            displayValue = userRank.total_chops || 0;
            break;
        case 'level':
            displayValue = calculateLevel(userRank.exp || 0);
            break;
        case 'coins':
            displayValue = (userRank.coins || 0).toFixed(2);
            break;
    }
    
    userRankingInfo.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <span class="text-amber-400 font-bold">#${userRank.rank || '?'}</span>
                <span class="text-gray-300 ml-2">${userRank.display_name || 'Gracz'}</span>
            </div>
            <div class="text-right">
                <div class="text-amber-400 font-bold">${displayValue}</div>
                <div class="text-sm text-gray-400">${currentLeaderboardType === 'highscore' ? 'Wynik' : currentLeaderboardType === 'totalchops' ? 'Ścięte' : currentLeaderboardType === 'level' ? 'Poziom' : 'Monety'}</div>
            </div>
        </div>
    `;
}

function switchLeaderboardType(type) {
    // Zaktualizuj filtry
    leaderboardFilters.forEach(filter => {
        filter.classList.remove('active');
        if (filter.dataset.type === type) {
            filter.classList.add('active');
        }
    });
    
    // Załaduj nowe dane
    loadLeaderboardData(type);
}

async function showPostGameRanking(score) {
    try {
        // Pobierz dane rankingu dla tego wyniku
        const response = await fetch(`${BACKEND_URL}/api/leaderboard?type=highscore&score=${score}`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Błąd ładowania rankingu');
        
        const data = await response.json();
        const topPlayers = data.leaderboard.slice(0, 5);
        const userRank = data.userRank;
        
        postGameRankingContent.innerHTML = '';
        
        // Dodaj top 5 graczy
        topPlayers.forEach((player, index) => {
            const entry = document.createElement('div');
            entry.className = 'post-game-ranking-entry';
            
            let avatarHtml = '';
            if (player.avatar_type && player.avatar_type !== 'default') {
                const avatar = availableAvatars.find(a => a.id === player.avatar_type);
                if (avatar) {
                    avatarHtml = `<div class="post-game-ranking-avatar">${avatar.icon}</div>`;
                } else {
                    avatarHtml = `<div class="post-game-ranking-avatar">👤</div>`;
                }
            } else {
                avatarHtml = `<div class="post-game-ranking-avatar"><img src="${player.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></div>`;
            }
            
            entry.innerHTML = `
                <div class="post-game-ranking-position">${index + 1}</div>
                ${avatarHtml}
                <div class="post-game-ranking-info">
                    <div class="post-game-ranking-name">${player.display_name || 'Gracz'}</div>
                    <div class="post-game-ranking-value">${player.high_score || 0} pkt</div>
                </div>
            `;
            
            postGameRankingContent.appendChild(entry);
        });
        
        // Zablokuj scroll na body i pokaż modal
        lockBodyScroll();
        postGameRanking.classList.remove('hidden');
        
    } catch (error) {
        console.error('Błąd ładowania rankingu po grze:', error);
        // W przypadku błędu, po prostu nie pokazuj rankingu
    }
}

// Event Listeners
// Event Listeners

playAgainBtn.addEventListener('click', () => {
    if (gameMode === 'birds' && birdsDifficulty) {
        // W trybie ptaków - ponownie losuj cel z tej samej trudności
        startBirdsSetup(birdsDifficulty);
    } else {
        // W trybie klasycznym - standardowe odliczanie
        gameMode = 'classic';
        startCountdown();
    }
});

returnToMenuBtn.addEventListener('click', () => {
    gameOverMenu.classList.add('hidden');
    showStartScreen(); // Pokaż główne menu
});

classicModeBtn.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    classicMenu.classList.remove('hidden');
});

backToMainMenuBtn.addEventListener('click', () => {
    classicMenu.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

startClassicBtn.addEventListener('click', () => {
    // Zamiast od razu startować grę, uruchom odliczanie
    gameMode = 'classic';
    startCountdown();
});

// Event listenery dla trybu ptaków
birdsModeBtn.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    birdsMenu.classList.remove('hidden');
});

backToMainFromBirdsBtn.addEventListener('click', () => {
    birdsMenu.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

birdsEasyBtn.addEventListener('click', () => {
    startBirdsSetup('easy');
});

birdsMediumBtn.addEventListener('click', () => {
    startBirdsSetup('medium');
});

birdsHardBtn.addEventListener('click', () => {
    startBirdsSetup('hard');
});

function safeChangeLanguage(lng) {
  const i18n = window.i18next;
  try {
    // Zapisz wybór od razu (używane przez detektor języka)
    localStorage.setItem('i18nextLng', lng);
    console.log('[i18n] safeChangeLanguage ->', lng);
    if (i18n && i18n.isInitialized) i18n.changeLanguage(lng);
  } finally {
    // Natychmiastowe odświeżenie UI i podświetlenia przycisków
    updateContent();
  }
}

plButton.addEventListener('click', () => safeChangeLanguage('pl'));
enButton.addEventListener('click', () => safeChangeLanguage('en'));

// Jedno spójne nasłuchiwanie zmiany języka
i18next.on('languageChanged', () => {
  console.log('[i18n] languageChanged =>', i18next.language);
  updateContent();
  if (!accountHubModal.classList.contains('hidden') && document.querySelector('.tab-button[data-tab="missions"]').classList.contains('active')) {
    fetchAndDisplayMissions(true);
}
});

navShopButton.addEventListener('click', openShopHub);
navAccountButton.addEventListener('click', openAccountHub);
desktopAccountButton.addEventListener('click', openAccountHub);

closeShopButton.addEventListener('click', () => {
    // Sprawdź, czy dolny pasek nawigacyjny jest aktualnie widoczny
    const isMobileView = getComputedStyle(bottomNav).display !== 'none';

    if (isMobileView) {
        // Jeśli tak (jesteśmy na telefonie), wróć do huba sklepu
        closeModal(shopModal);
        openShopHub();
    } else {
        // Jeśli nie (jesteśmy na PC), po prostu zamknij modal
        closeModal(shopModal);
    }
});
shopModal.addEventListener('click', (e) => { if (e.target === shopModal) closeModal(shopModal); });

closeShopHubButton.addEventListener('click', () => closeModal(shopHubModal));
shopHubModal.addEventListener('click', (e) => { if (e.target === shopHubModal) closeModal(shopHubModal); });

closeInventoryHubButton.addEventListener('click', () => closeModal(inventoryHubModal));
inventoryHubModal.addEventListener('click', (e) => { if (e.target === inventoryHubModal) closeModal(inventoryHubModal); });

closeEquipmentButton.addEventListener('click', () => {
    closeModal(equipmentModal);
    openInventoryHub();
});
equipmentModal.addEventListener('click', (e) => { if (e.target === equipmentModal) closeModal(equipmentModal); });

closeAccountHubButton.addEventListener('click', () => closeModal(accountHubModal));
accountHubModal.addEventListener('click', (e) => { if (e.target === accountHubModal) closeModal(accountHubModal); });

// Changelog modal events (desktop-only trigger lives fixed top-right)
if (changelogButton) {
    changelogButton.addEventListener('click', () => openModal(changelogModal));
}
if (closeChangelogButton) {
    closeChangelogButton.addEventListener('click', () => closeModal(changelogModal));
}
if (changelogModal) {
    changelogModal.addEventListener('click', (e) => { if (e.target === changelogModal) closeModal(changelogModal); });
}

document.querySelectorAll('#inventory-hub-modal .equipment-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        const category = slot.dataset.category;
        if (category) {
            closeModal(inventoryHubModal);
            populateEquipmentSelectionModal(category);
        }
    });
});

canvas.addEventListener('mousedown', handleMouseInput);
canvas.addEventListener('touchstart', handleTouchInput);
window.addEventListener('keydown', handleKeyboardInput);

function handleKeyUp(event) {
    // Sprawdź, czy puszczony klawisz jest jednym z naszych klawiszy do gry
    const gameKeys = ['arrowleft', 'a', 'j', 'arrowright', 'd', 'l'];
    if (gameKeys.includes(event.key.toLowerCase())) {
        isKeyPressed = false; // <-- Zwolnij blokadę
    }
}

function showStartScreen() {
    gameState = 'start';
    messageOverlay.style.display = 'flex';

    // Reset trybu ptaków
    gameMode = 'classic';
    birdsDifficulty = null;
    birdsTarget = 0;
    birdsProgress = 0;
    birdsSuccess = false;
    
    // Ukryj pasek postępu i usuń klasy sukcesu
    rescueProgressContainer.classList.add('hidden');
    document.getElementById('game-container').classList.remove('birds-success');

    // Pokaż odpowiednie menu i ukryj resztę
    mainMenu.classList.remove('hidden');
    classicMenu.classList.add('hidden');
    birdsMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    countdownOverlay.classList.add('hidden');
    birdsWarningOverlay.classList.add('hidden');

    // Ustaw tło i UI dla stanu menu
    setGameStateUI('menu');
}

// --- Funkcje trybu ptaków ---

function startBirdsSetup(difficulty) {
    // Ustaw parametry trybu ptaków
    gameMode = 'birds';
    birdsDifficulty = difficulty;
    birdsTarget = Math.floor(Math.random() * (BIRDS_CONFIG.ranges[difficulty].max - BIRDS_CONFIG.ranges[difficulty].min + 1)) + BIRDS_CONFIG.ranges[difficulty].min;
    birdsProgress = 0;
    birdsSuccess = false;
    
    // Ukryj wszystkie menu (włącznie z game over menu)
    birdsMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    mainMenu.classList.add('hidden');
    classicMenu.classList.add('hidden');
    
    // Pokaż animację ostrzegawczą
    showBirdsWarning();
}

function showBirdsWarning() {
    // Zablokuj input już od razu
    gameState = 'birds-warning';
    
    // Ustaw tekst ostrzeżenia
    const i18n = window.i18next;
    if (i18n && i18n.t) {
        birdsWarningText.textContent = i18n.t('birdsMode.preStart', { count: birdsTarget });
    } else {
        birdsWarningText.textContent = `Zetnij ${birdsTarget} pni, aby je ochronić.`;
    }
    
    // Pokaż overlay ostrzegawczy z czarnym tłem
    messageOverlay.style.display = 'flex';
    birdsWarningOverlay.classList.remove('hidden');
    
    // Po 2 sekundach przejdź do odliczania
    setTimeout(() => {
        birdsWarningOverlay.classList.add('hidden');
        startCountdown(() => initBirdsMode());
    }, 2000);
}

function initBirdsMode() {
    // Wyzeruj score i ustaw początkowy stan
    score = 0;
    birdsProgress = 0;
    birdsSuccess = false;
    
    // Pokaż pasek postępu
    rescueProgressContainer.classList.remove('hidden');
    updateRescueProgressUI(0, birdsTarget);
    
    // Uruchom normalną logikę gry
    gameState = 'playing';
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
}

function updateRescueProgressUI(current, target) {
    const percentage = Math.min((current / target) * 100, 100);
    rescueProgressBar.style.width = `${percentage}%`;
    rescueProgressText.textContent = `${current} / ${target}`;
    
    // Dodaj efekt sukcesu gdy osiągnięto cel
    if (current >= target) {
        document.getElementById('game-container').classList.add('birds-success');
    }
}

function birdsRescueComplete() {
    birdsSuccess = true;
    gameState = 'birds-success';
    
    // Pokaż efekt sukcesu
    document.getElementById('game-container').classList.add('birds-success');
    
    // Zatrzymaj dalsze generowanie segmentów, ale pozwól grze działać jeszcze chwilę
    // Po krótkim czasie zakończ grę
    setTimeout(() => {
        endBirdsRun();
    }, 1500);
}

function endBirdsRun() {
    // Zatrzymaj grę
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    
    // Ukryj pasek postępu
    rescueProgressContainer.classList.add('hidden');
    
    // Pokaż menu końca gry (gameState zostanie ustawiony w gameOver())
    gameOver();
}

function startCountdown(onGo) {
    // Ukryj wszystkie menu
    mainMenu.classList.add('hidden');
    classicMenu.classList.add('hidden');
    birdsMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');

    // Ustaw stan odliczania - to zablokuje input
    gameState = 'countdown';

    // Pokaż odliczanie
    countdownOverlay.classList.remove('hidden');

    // Ustaw tło i UI dla stanu gry
    setGameStateUI('game');
    // Narysuj postać i drzewo w stanie gotowości
    drawReadyState();

    let count = 3;

    function tick() {
        if (count > 0) {
            countdownText.textContent = count;
            count--;
            setTimeout(tick, 1000);
        } else {
            countdownText.textContent = 'GO!';
            setTimeout(() => {
                messageOverlay.style.display = 'none';
                countdownOverlay.classList.add('hidden');
                onGo ? onGo() : init(); // Uruchom właściwą grę
            }, 500);
        }
    }
    tick();
}

window.onresize = () => {
    canvas.width = gameContainer.clientWidth;
    canvas.height = window.innerHeight * 0.7;
    gameContainer.style.height = `${canvas.height + TIMER_HEIGHT}px`; // Dodaj miejsce dla timera
    if (gameState !== 'start') draw();
};

window.onload = async () => {
    // Natychmiastowe ustawienie języka i próba tłumaczenia
    if (!localStorage.getItem('i18nextLng')) {
        localStorage.setItem('i18nextLng', 'pl');
    }
    setActiveLanguageButtons(localStorage.getItem('i18nextLng'));
    updateContent();

    // Uruchom animację ładowania
    startLoadingAnimation();

    // Równocześnie uruchom dwie niezależne operacje:
    // 1. Ładowanie zasobów wizualnych i dźwiękowych
    const assetsPromise = Promise.all([
        loadSprites(),
        loadSounds()
    ]).catch(error => console.error("Błąd ładowania podstawowych zasobów:", error));

    // 2. Sprawdzanie statusu logowania w tle (NIE CZEKAMY na to)
    checkLoginStatus(); 

    // Czekaj TYLKO na załadowanie grafik i dźwięków
    await assetsPromise;
    console.log('Zasoby (grafiki, dźwięki) gotowe.');

    // Gdy tylko zasoby są gotowe, zakończ ładowanie i pokaż menu
    finishLoadingAnimation();
    showStartScreen();
    
    // Oznaczanie komponentów jako gotowe nie jest już potrzebne w ten sposób
    // Możesz usunąć cały system 'markComponentReady' i 'loadingStates' jeśli chcesz uprościć kod
};

authButton.addEventListener('click', () => {
    if (currentUser) {
        window.location.href = `${BACKEND_URL}/auth/logout`;
    } else {
        window.location.href = `${BACKEND_URL}/auth/google`;
    }
});

navEquipmentButton.addEventListener('click', openInventoryHub);
desktopEquipmentButton.addEventListener('click', openInventoryHub);

animationCloseButton.addEventListener('click', () => {
    closeModal(lootboxAnimationModal);
});

revealCloseButton.addEventListener('click', () => {
    closeModal(itemRevealModal);
});

// Event listenery dla resetowania postępu
resetConfirmButton.addEventListener('click', confirmReset);
resetCancelButton.addEventListener('click', () => closeModal(resetWarningModal));
resetWarningModal.addEventListener('click', (e) => { if (e.target === resetWarningModal) closeModal(resetWarningModal); });

// Event listenery dla edycji profilu
profileAvatarContainer.addEventListener('click', openAvatarEditModal);
editUsernameBtn.addEventListener('click', openUsernameEditModal);
profileLogoutBtn.addEventListener('click', () => {
    window.location.href = `${BACKEND_URL}/auth/logout`;
});
guestLoginBtn.addEventListener('click', () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
});

// Event listenery dla modali edycji awatara
closeAvatarModal.addEventListener('click', () => closeModal(avatarEditModal));
cancelAvatarEdit.addEventListener('click', () => closeModal(avatarEditModal));
saveAvatar.addEventListener('click', saveAvatarChanges);
avatarEditModal.addEventListener('click', (e) => { if (e.target === avatarEditModal) closeModal(avatarEditModal); });

// Event listenery dla modali edycji nazwy użytkownika
closeUsernameModal.addEventListener('click', () => closeModal(usernameEditModal));
cancelUsernameEdit.addEventListener('click', () => closeModal(usernameEditModal));
saveUsername.addEventListener('click', saveUsernameChanges);
usernameEditModal.addEventListener('click', (e) => { if (e.target === usernameEditModal) closeModal(usernameEditModal); });

// Enter key dla edycji nazwy użytkownika
newUsernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveUsernameChanges();
    }
});

// Event listenery dla rankingu
const leaderboardButton = document.getElementById('leaderboard-button');
if (leaderboardButton) {
    leaderboardButton.addEventListener('click', openLeaderboardModal);
}

// Event listenery dla modali rankingu
if (closeLeaderboardModal) {
    closeLeaderboardModal.addEventListener('click', () => {
        // Odblokuj scroll na body
        unlockBodyScroll();
        closeModal(leaderboardModal);
    });
}
if (leaderboardModal) {
    leaderboardModal.addEventListener('click', (e) => { 
        if (e.target === leaderboardModal) {
            // Odblokuj scroll na body
            unlockBodyScroll();
            closeModal(leaderboardModal);
        }
    });
}

if (closePostGameRanking) {
    closePostGameRanking.addEventListener('click', () => {
        // Odblokuj scroll na body
        unlockBodyScroll();
        postGameRanking.classList.add('hidden');
    });
}

// Event listenery dla filtrów rankingu
leaderboardFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        switchLeaderboardType(filter.dataset.type);
    });
});

// Obsługa klawisza Escape dla zamykania modali rankingu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!leaderboardModal.classList.contains('hidden')) {
            // Odblokuj scroll na body
            unlockBodyScroll();
            closeModal(leaderboardModal);
        }
        if (!postGameRanking.classList.contains('hidden')) {
            // Odblokuj scroll na body
            unlockBodyScroll();
            postGameRanking.classList.add('hidden');
        }
    }
});

window.addEventListener('keyup', handleKeyUp);

// Logika przełączania zakładek wewnątrz panelu Misji
const missionTabs = document.querySelectorAll('.mission-tab-button');
const missionContents = document.querySelectorAll('.mission-content');

missionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Zdejmij klasę 'active' ze wszystkich przycisków
        missionTabs.forEach(item => item.classList.remove('active'));
        // Dodaj klasę 'active' do klikniętego
        tab.classList.add('active');

        const target = tab.dataset.missionTab;

        // Pokaż/ukryj odpowiednią zawartość
        missionContents.forEach(content => {
            if (content.id === `${target}-missions-content`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    });
});

desktopAccountButton.addEventListener('click', () => {
    switchAccountTab('stats'); // Domyślnie otwieraj na statystykach
    openAccountHub();
});

// DODAJ TEN BLOK KODU
if (desktopMissionsButton) {
    desktopMissionsButton.addEventListener('click', () => {
        switchAccountTab('missions'); // Ustaw zakładkę 'Misje' jako aktywną
        openAccountHub();
        // Załaduj misje po otwarciu modala
        fetchAndDisplayMissions(true);
    });
}

// Event listenery dla przycisków misji
document.addEventListener('click', (e) => {
    // Obsługa przełączania zakładek misji
    if (e.target.matches('.mission-tab-button')) {
        const target = e.target.dataset.missionTab;
        currentMissionType = target;
        
        // Usuń aktywną klasę z wszystkich przycisków
        document.querySelectorAll('.mission-tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Dodaj aktywną klasę do klikniętego przycisku
        e.target.classList.add('active');
        
        // Pokaż/ukryj odpowiednią zawartość
        const missionContents = document.querySelectorAll('.mission-content');
        missionContents.forEach(content => {
            if (content.id === `${target}-missions-content`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
        
        // Zaktualizuj timer
        updateMissionRefreshTimer();
    }
    
});

function setGameStateUI(state) {
    const gameContainer = document.getElementById('game-container');
    const scoreEl = document.getElementById('score');
    const timerContainer = document.getElementById('timer-bar-container');

    if (state === 'menu') {
        gameContainer.style.height = `${canvas.height + TIMER_HEIGHT}px`; // Zawsze ta sama wysokość
        gameContainer.classList.add('menu-state');
        gameContainer.classList.remove('game-state');
        scoreEl.style.display = 'none';
        timerContainer.style.display = 'none';
    } else { // 'game' or 'ready'
        gameContainer.style.height = `${canvas.height + TIMER_HEIGHT}px`; // Zawsze ta sama wysokość
        gameContainer.classList.remove('menu-state');
        gameContainer.classList.add('game-state');
        scoreEl.style.display = 'block';
        timerContainer.style.display = 'flex';
    }
}