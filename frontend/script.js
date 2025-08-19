// --- Ustawienia gry ---
const BACKEND_URL = 'https://timberman-backend.onrender.com';

// Elementy UI
const authButton = document.getElementById('auth-button');
const mainAvatarContainer = document.getElementById('main-avatar-container');
const mainUsername = document.getElementById('main-username');
const coinsStatEl = document.getElementById('coinsStat');

// Elementy gry
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const messageOverlay = document.getElementById('message-overlay');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const startButton = document.getElementById('startButton');
const timerBar = document.getElementById('timer-bar');
const resetButton = document.getElementById('resetButton');

// Przyciski nawigacyjne
const navShopButton = document.getElementById('nav-shop-button');
const navEquipmentButton = document.getElementById('nav-equipment-button');
const navAccountButton = document.getElementById('nav-account-button');
const desktopEquipmentButton = document.getElementById('desktop-equipment-button');
const desktopAccountButton = document.getElementById('desktop-account-button');

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

// Ustawienie rozmiaru płótna
const gameContainer = document.getElementById('game-container');
canvas.width = gameContainer.clientWidth;
canvas.height = window.innerHeight * 0.7;

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

// Zmienne timera
let timer = 100;
const MAX_TIME = 100;
let gameLoopInterval = null;
let activeBonuses = {};
let petSaveUsed = false;

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
                    resolve();
                }
            };
            img.onerror = () => reject(new Error(`Nie udało się załadować grafiki: ${spritePaths[key]}`));
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
    axe_sword: { id: 'axe_sword', name: 'Miecz', category: 'axes', icon: '⚔️', price: 200, description: '+1 pkt za cięcie', bonus: { type: 'pointsPerChop', value: 1 } },
    axe_pickaxe: { id: 'axe_pickaxe', name: 'Kilof', category: 'axes', icon: '⛏️', price: 400, description: '+2 pkt za cięcie', bonus: { type: 'pointsPerChop', value: 2 } },
    axe_golden: { id: 'axe_golden', name: 'Złota Siekiera', category: 'axes', icon: '🪓', price: 800, description: '+3 pkt za cięcie', bonus: { type: 'pointsPerChop', value: 3 } },
    acc_glasses: { id: 'acc_glasses', name: 'Okulary 3D', category: 'accessories', icon: '🕶️', price: 300, description: 'Monety +10%', bonus: { type: 'coinMultiplier', value: 0.1 } },
    acc_scarf: { id: 'acc_scarf', name: 'Szalik', category: 'accessories', icon: '🧣', price: 500, description: 'Monety +20%', bonus: { type: 'coinMultiplier', value: 0.2 } },
    pet_dog: { id: 'pet_dog', name: 'Piesek', category: 'pets', icon: '🐶', price: 2500, description: 'Jednorazowa ochrona', bonus: { type: 'oneTimeSave', value: 1 } },
    pet_cat: { id: 'pet_cat', name: 'Kotek', category: 'pets', icon: '🐱', price: 2500, description: 'Jednorazowa ochrona', bonus: { type: 'oneTimeSave', value: 1 } },
};

// --- Baza Danych Skrzynek (Lootboxów) ---
const lootBoxData = {
    'box_hats': {
        id: 'box_hats',
        name: 'Skrzynia Kapelusznika',
        price: 200,
        description: 'Zawiera losową czapkę.',
        category: 'hats',
        icon: '📦',
        lootPool: [
            // Im wyższa "waga" (weight), tym większa szansa na wylosowanie
            { itemId: 'hat_tophat', rarity: 'common', weight: 10 },
            { itemId: 'hat_grad', rarity: 'rare', weight: 4 },
            { itemId: 'hat_crown', rarity: 'legendary', weight: 1 }
        ]
    },
    'box_axes': {
        id: 'box_axes',
        name: 'Skrzynia Drwala',
        price: 400,
        description: 'Zawiera losową siekierę.',
        category: 'axes',
        icon: '📦',
        lootPool: [
            { itemId: 'axe_sword', rarity: 'common', weight: 10 },
            { itemId: 'axe_pickaxe', rarity: 'rare', weight: 4 },
            { itemId: 'axe_golden', rarity: 'legendary', weight: 1 }
        ]
    },
    'box_characters': {
        id: 'box_characters',
        name: 'Skrzynia Bohaterów',
        price: 800,
        description: 'Odblokowuje losową postać.',
        category: 'characters',
        icon: '🎁',
        lootPool: [
            { itemId: 'char_santa', rarity: 'common', weight: 10 },
            { itemId: 'char_vampire', rarity: 'rare', weight: 4 },
            { itemId: 'char_robot', rarity: 'legendary', weight: 1 }
        ]
    },
    'box_accessories': {
        id: 'box_accessories',
        name: 'Paczka z Akcesoriami',
        price: 500,
        description: 'Zawiera losowe akcesorium.',
        category: 'accessories',
        icon: '🎁',
        lootPool: [
            { itemId: 'acc_glasses', rarity: 'common', weight: 6 },
            { itemId: 'acc_scarf', rarity: 'rare', weight: 3 }
        ]
    },
    'box_pets': {
        id: 'box_pets',
        name: 'Kosz ze Zwierzakiem',
        price: 3000,
        description: 'Może zawierać uroczego towarzysza.',
        category: 'pets',
        icon: '🎀',
        lootPool: [
            { itemId: 'pet_dog', rarity: 'legendary', weight: 1 },
            { itemId: 'pet_cat', rarity: 'legendary', weight: 1 }
        ]
    }
};

const categoryToSlotMap = {
    characters: 'character', hats: 'hat', axes: 'axe', accessories: 'accessory', pets: 'pet'
};
const categoryNames = {
    hats: 'Czapki', characters: 'Postacie', axes: 'Siekiery', accessories: 'Akcesoria', pets: 'Zwierzaki'
};


// --- NOWA LOGIKA STATYSTYK I OSIĄGNIĘĆ ---

// NOWA FUNKCJA: Tłumaczy nazwy z bazy danych (snake_case) na nazwy używane w JS (camelCase)
function parseStatsFromDB(dbUser) {
    return {
        highScore: Number(dbUser.high_score || 0),
        totalChops: Number(dbUser.total_chops || 0),
        coins: Number(dbUser.coins || 0),
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
        const defaultStats = { highScore: 0, totalChops: 0, coins: 0, unlockedAchievements: [], unlockedItems: {}, equippedItems: { character: null, hat: null, axe: null, accessory: null, pet: null } }; // ZMIANA: z [] na {}
        const statsFromStorage = JSON.parse(localStorage.getItem('timbermanStats'));
        return { ...defaultStats, ...statsFromStorage };
    }
}

// ZMODYFIKOWANA FUNKCJA: Teraz jest asynchroniczna i zapisuje dane na serwerze lub w localStorage
async function updateAndSaveStats(currentScore, oldStats) {
    const newStats = {
        ...oldStats,
        highScore: Math.max(oldStats.highScore, currentScore),
        totalChops: oldStats.totalChops + currentScore,
        coins: oldStats.coins + (currentScore * 0.1 * (1 + (activeBonuses.coinMultiplier || 0)))
    };

    for (const id in achievementsData) {
        if (!newStats.unlockedAchievements.includes(id) && achievementsData[id].condition(newStats)) {
            newStats.unlockedAchievements.push(id);
            showNotification(`Osiągnięcie: ${achievementsData[id].name}`, 'success');
        }
    }

    if (currentUser) {
        console.log("Zapisywanie statystyk na serwerze...");
        try {
            const response = await fetch(`${BACKEND_URL}/api/stats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newStats)
            });
            if (!response.ok) throw new Error('Błąd zapisu na serwerze');
            const updatedUser = await response.json();
            console.log('2. Serwer odesłał zaktualizowane dane użytkownika:', updatedUser);
            currentUser = updatedUser; // Zaktualizuj dane lokalne o odpowiedź z serwera
            return parseStatsFromDB(updatedUser);
        } catch (error) {
            console.error("Nie udało się zapisać statystyk na serwerze:", error);
            return newStats;
        }
    } else {
        console.log("Zapisywanie statystyk w localStorage (Tryb Gościa)...");
        localStorage.setItem('timbermanStats', JSON.stringify(newStats));
        return newStats;
    }
}

async function animateStatUpdate(oldStats, score) {
    const newStats = await updateAndSaveStats(score, oldStats);
    const duration = 1500;
    const startTime = performance.now();

    // POPRAWKA 1: Animujemy tylko istniejący element
    const coinsStatBox = document.getElementById('coins-stat-box');
    if (coinsStatBox) {
        coinsStatBox.classList.add('stat-update-animation');
    }

    function animationStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Animujemy tylko przyrost monet
        const coinGain = (newStats.coins - oldStats.coins) * progress;
        const currentCoins = oldStats.coins + coinGain;
        coinsStatEl.textContent = currentCoins.toFixed(2);

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
        }
    }
    requestAnimationFrame(animationStep);
}

function updateStatsUI(stats) {
    // Aktualizuj widoczne na stałe monety
    coinsStatEl.textContent = stats.coins.toFixed(2);

    // Znajdź elementy w modalu i zaktualizuj je
    const highScoreBox = document.getElementById('highscore-stat-box-modal');
    const totalChopsBox = document.getElementById('totalchops-stat-box-modal');

    if (highScoreBox) {
        highScoreBox.innerHTML = `<p class="text-gray-400 text-sm">Najlepszy Wynik</p><p class="text-2xl font-bold">${stats.highScore}</p>`;
    }
    if (totalChopsBox) {
        totalChopsBox.innerHTML = `<p class="text-gray-400 text-sm">Suma Ściętych</p><p class="text-2xl font-bold">${stats.totalChops}</p>`;
    }
}

function populateAchievementsPreview(stats) {
    achievementsPreview.innerHTML = '';
    const recentAchievements = stats.unlockedAchievements.slice(-4).reverse();
    if (recentAchievements.length === 0) {
        achievementsPreview.innerHTML = `<span class="col-span-4 text-center text-gray-500 text-sm">Brak osiągnięć</span>`;
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
        card.innerHTML = `<div class="icon">${isUnlocked ? achievement.icon : '?'}</div><div class="title">${achievement.name}</div><div class="description">${isUnlocked ? achievement.description : 'Zablokowane'}</div>`;
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
        const quantityOwned = stats.unlockedItems[item.id] || 0; // Sprawdź ilość, a nie czy istnieje
        const card = document.createElement('div');
        card.className = 'shop-item-slot'; // Usunięto .owned, bo przycisk jest zawsze aktywny

        // Przycisk KUP jest teraz zawsze widoczny
        let bottomContent = `<div class="w-full mt-auto"><div class="text-amber-400 font-bold mb-2">${item.price} monet</div><button class="buy-button">KUP</button></div>`;
        
        // Dodaj wskaźnik ilości, jeśli posiadamy przedmiot
        let quantityBadge = quantityOwned > 0 ? `<div class="item-quantity-badge">x${quantityOwned}</div>` : '';

        card.innerHTML = `${quantityBadge}<div class="text-4xl">${item.icon}</div><div class="font-bold text-base">${item.name}</div><div class="text-sm text-gray-300 px-1 leading-tight">${item.description}</div>${bottomContent}`;
        
        card.querySelector('.buy-button').addEventListener('click', (e) => {
            e.stopPropagation();
            buyItem(item.id, card);
        });
        
        shopGrid.appendChild(card);
    });
}

function populateShopPreview() {
    shopPreviewContainer.innerHTML = '';

    // Iterujemy teraz po skrzynkach, a nie po przedmiotach
    Object.values(lootBoxData).forEach(box => {
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'w-full shop-category-preview rounded-lg p-2';

        categoryContainer.addEventListener('click', () => {
            populateShopModalWithBox(box.id); // Używamy nowej funkcji
            openModal(shopModal);
        });

        const title = document.createElement('h3');
        title.className = 'text-xl font-bold text-shadow mb-2 flex justify-between items-center';
        title.innerHTML = `<span>${box.name}</span><span class="font-bold text-xl text-gray-500">${box.icon}</span>`;

        const description = document.createElement('p');
        description.className = 'text-sm text-gray-400';
        description.textContent = box.description;

        categoryContainer.appendChild(title);
        categoryContainer.appendChild(description);
        shopPreviewContainer.appendChild(categoryContainer);
    });
}


// --- Logika gry ---

async function openLootbox(boxId, cardElement) {
    if (!currentUser) {
        showNotification('Musisz być zalogowany, aby kupować skrzynki!', 'error');
        return;
    }

    const buyButton = cardElement.querySelector('.buy-button');
    if (buyButton.disabled) return; // Zapobiegaj wielokrotnym kliknięciom

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
            lootBoxData[boxId].lootPool.find(i => i.itemId === data.wonItem.id), // Znajdź info o rzadkości
            lootBoxData[boxId]
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
    // --- CZĘŚĆ 1: Płynna, zapętlona animacja "mieszania" ---
    animationReel.innerHTML = '';
    animationCloseButton.classList.add('hidden');

    // POPRAWKA 1: Tworzymy idealnie zapętlającą się rolkę
    // Generujemy bazowy zestaw (np. 8 unikalnych itemów), a potem go duplikujemy,
    // aby animacja CSS mogła się płynnie zapętlić.
    const shufflePool = [];
    const shuffleLength = 8;
    for (let i = 0; i < shuffleLength; i++) {
        const randomLoot = boxData.lootPool[Math.floor(Math.random() * boxData.lootPool.length)];
        shufflePool.push(randomLoot);
    }
    // Duplikujemy zawartość, aby animacja była płynna
    const finalShufflePool = [...shufflePool, ...shufflePool];

    finalShufflePool.forEach(loot => {
        const itemData = shopData[loot.itemId];
        const itemDiv = document.createElement('div');
        itemDiv.className = `reel-item rarity-${loot.rarity}`;
        itemDiv.innerHTML = `<span>${itemData.icon}</span>`;
        animationReel.appendChild(itemDiv);
    });

    // Resetujemy pozycję i włączamy animację w CSS
    animationReel.style.transition = 'none';
    animationReel.style.transform = 'translateX(0px)';
    animationReel.classList.add('reel-shuffling'); 

    openModal(lootboxAnimationModal);

    // --- CZĘŚĆ 2: Finałowa animacja zwalniania i pokazania wyniku ---
    setTimeout(() => {
        animationReel.classList.remove('reel-shuffling'); // Wyłącz animację pętli w CSS

        // Przygotuj krótką, finałową rolkę z wygranym przedmiotem w środku
        const finalReelItems = [];
        const finalReelLength = 30; // Dłuższa rolka dla lepszego efektu
        const winnerIndex = finalReelLength - 5; 

        for (let i = 0; i < finalReelLength; i++) {
            const randomLoot = boxData.lootPool[Math.floor(Math.random() * boxData.lootPool.length)];
            finalReelItems.push(randomLoot);
        }
        finalReelItems[winnerIndex] = wonItem;

        // Wypełnij HTML nową, finałową rolką
        animationReel.innerHTML = '';
        finalReelItems.forEach(loot => {
            const itemData = shopData[loot.itemId];
            const itemDiv = document.createElement('div');
            itemDiv.className = `reel-item rarity-${loot.rarity}`;
            itemDiv.innerHTML = `<span>${itemData.icon}</span>`;
            animationReel.appendChild(itemDiv);
        });

        // POPRAWKA 2: Poprawne obliczenia dla animacji w lewo
        const itemWidth = 120 + 20; // 140px
        const viewportWidth = document.getElementById('animation-viewport').clientWidth;
        const centerOffset = (viewportWidth / 2) - (itemWidth / 2);
        const finalPosition = -(winnerIndex * itemWidth - centerOffset);

        // Ustawiamy pozycję startową tuż za prawą krawędzią ekranu, aby wjechała płynnie
        const startPosition = viewportWidth;
        animationReel.style.transition = 'none';
        animationReel.style.transform = `translateX(${startPosition}px)`;

        // Uruchom animację zwalniania do pozycji końcowej
        setTimeout(() => {
            animationReel.style.transition = 'transform 5s cubic-bezier(0.2, 1, 0.3, 1)';
            animationReel.style.transform = `translateX(${finalPosition}px)`;
        }, 50);

        // Po zakończeniu animacji zwalniania
        setTimeout(() => {
            const winnerDiv = animationReel.children[winnerIndex];
            winnerDiv.classList.add('winner');
            winnerDiv.style.setProperty('--winner-color', getComputedStyle(winnerDiv).borderColor);
            animationCloseButton.classList.remove('hidden');
        }, 5050);

    }, 3000); // Czas trwania animacji "mieszania" (3 sekundy)
}

function populateShopModalWithBox(boxId) {
    const box = lootBoxData[boxId];
    if (!box) return;

    shopGrid.innerHTML = ''; // Wyczyść starą siatkę
    shopModalTitle.textContent = box.name;

    // Stwórz jedną, dużą kartę dla skrzynki
    const card = document.createElement('div');
    card.className = 'shop-item-slot col-span-2 md:col-span-4'; // Rozciągnij na całą szerokość

    // Lista możliwych nagród do wyświetlenia
    const possibleLoot = box.lootPool.map(loot => {
        const item = shopData[loot.itemId];
        return `<span class="text-2xl" title="${item.name}">${item.icon}</span>`;
    }).join(' ');

    let bottomContent = `<div class="w-full mt-auto"><div class="text-amber-400 font-bold mb-2">${box.price} monet</div><button class="buy-button">KUP i OTWÓRZ</button></div>`;

    card.innerHTML = `
        <div class="text-6xl">${box.icon}</div>
        <div class="font-bold text-base">${box.description}</div>
        <div class="text-sm text-gray-400 px-1 leading-tight mt-4">Możliwa zawartość:</div>
        <div class="flex gap-2 justify-center">${possibleLoot}</div>
        ${bottomContent}
    `;

    card.querySelector('.buy-button').addEventListener('click', (e) => {
        e.stopPropagation();
        openLootbox(boxId, card);
    });

    shopGrid.appendChild(card);
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
    equipmentModalTitle.textContent = `Wybierz: ${categoryNames[category] || category}`;
    const stats = loadStats();

    // NOWA LOGIKA: Filtruj przedmioty, które gracz posiada (ilość > 0)
    const ownedItemsInCategory = Object.keys(stats.unlockedItems)
        .map(id => shopData[id])
        .filter(item => item && item.category === category);

    if (ownedItemsInCategory.length === 0) {
        equipmentGrid.innerHTML = `<p class="col-span-4 text-center text-gray-500">Nie posiadasz żadnych przedmiotów z tej kategorii.</p>`;
    } else {
        ownedItemsInCategory.forEach(item => {
            const quantity = stats.unlockedItems[item.id];
            const card = document.createElement('div');
            card.className = 'equipment-selection-item relative'; // Dodano relative
            // Dodaj wskaźnik ilości
            card.innerHTML = `
                <div class="item-quantity-badge">x${quantity}</div>
                <span>${item.icon}</span>
                <span class="item-name">${item.name}</span>
            `;
            card.addEventListener('click', () => equipItem(item.id));
            equipmentGrid.appendChild(card);
        });
    }
    unequipButton.onclick = () => unequipItem(category);
    openModal(equipmentModal);
}

async function init() {
    score = 0;
    player.side = 'left';
    gameState = 'playing';
    tree = [];
    particles = [];
    timer = MAX_TIME;
    const stats = loadStats();
    petSaveUsed = false;
    activeBonuses = { pointsPerChop: 0, timerSlowdown: 0, timeGainBonus: 0, coinMultiplier: 0, oneTimeSave: 0 };
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
    messageOverlay.style.display = 'none';
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
    draw();
}

function gameLoop() {
    if (gameState !== 'playing') return;
    timer -= (0.2 * (1 - activeBonuses.timerSlowdown));
    if (timer <= 0) {
        timer = 0;
        gameOver();
    }
    timerBar.style.width = `${(timer / MAX_TIME) * 100}%`;
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
        drawTrunkSegment(TRUNK_X, y, TRUNK_WIDTH, SEGMENT_HEIGHT);
        if (segment.branch) drawBranch(TRUNK_X, y, segment.branch);
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
    gameState = 'gameOver';
    clearInterval(gameLoopInterval);
    const oldStats = loadStats();
    await animateStatUpdate(oldStats, score);
    messageTitle.textContent = 'Koniec Gry!';
    messageText.textContent = `Twój wynik: ${score}.`;
    startButton.textContent = 'Zagraj Ponownie';
    messageOverlay.style.display = 'flex';
}

function performChop(sideToChop) {
    if (gameState !== 'playing') return;

    const segmentToCut = tree[0];
    if (segmentToCut && segmentToCut.branch === sideToChop) {
        if (activeBonuses.oneTimeSave > 0 && !petSaveUsed) {
            petSaveUsed = true;
            document.body.style.animation = 'flash 0.5s';
            setTimeout(() => document.body.style.animation = '', 500);
            tree.shift();
            tree.push({ branch: null });
            draw();
            return;
        } else {
            player.side = sideToChop;
            draw();
            setTimeout(gameOver, 50);
            return;
        }
    }

    // --- NOWA, BŁYSKAWICZNA LOGIKA ---

    // 1. Logika gry wykonuje się NATYCHMIAST, bez czekania na animację
    player.side = sideToChop;
    score += (1 + activeBonuses.pointsPerChop);
    scoreElement.textContent = score;
    let timeGain = 5 - (score / 50);
    if (timeGain < 1) timeGain = 1;
    timer += (timeGain + activeBonuses.timeGainBonus);
    if (timer > MAX_TIME) timer = MAX_TIME;

    const choppedSegment = tree.shift();
    if (choppedSegment) {
        particles.push({
            x: TRUNK_X, y: canvas.height - SEGMENT_HEIGHT, width: TRUNK_WIDTH, height: SEGMENT_HEIGHT,
            branch: choppedSegment.branch, velocityX: (player.side === 'left' ? 1 : -1) * (Math.random() * 3 + 3),
            velocityY: -7, rotation: 0, rotationSpeed: (player.side === 'left' ? 1 : -1) * (Math.random() * 0.05 + 0.05)
        });
    }
    let newBranch = null;
    const lastSegment = tree[tree.length - 1];
    const branchChance = 0.35 + (score / 200);
    if (Math.random() < branchChance) {
        const potentialSide = Math.random() < 0.5 ? 'left' : 'right';
        if (lastSegment && lastSegment.branch && lastSegment.branch !== potentialSide) newBranch = null;
        else newBranch = potentialSide;
    }
    tree.push({ branch: newBranch });

    const segmentNextToPlayer = tree[0];
    if (segmentNextToPlayer && segmentNextToPlayer.branch === player.side) {
        setTimeout(gameOver, 50);
        return;
    }

    // 2. Animacja jest tylko dodatkiem wizualnym i restartuje się przy każdym kliknięciu
    clearTimeout(animationTimeout1);
    clearTimeout(animationTimeout2);

    player.frame = 'swing';

    animationTimeout1 = setTimeout(() => {
        player.frame = 'chop';
    }, 75);

    animationTimeout2 = setTimeout(() => {
        player.frame = 'idle';
    }, 150);
}

function handleMouseInput(event) { performChopBasedOnInput(event); }
function handleTouchInput(event) { event.preventDefault(); performChopBasedOnInput(event); }
function performChopBasedOnInput(event) {
    if (gameState !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (event.clientX !== undefined ? event.clientX : event.changedTouches[0].clientX) - rect.left;
    const side = (clickX < canvas.width / 2) ? 'left' : 'right';
    performChop(side);
}
function handleKeyboardInput(event) {
    if (gameState !== 'playing') return;
    let side = null;
    switch (event.key.toLowerCase()) {
        case 'arrowleft': case 'a': case 'j': side = 'left'; break;
        case 'arrowright': case 'd': case 'l': side = 'right'; break;
    }
    if (side) performChop(side);
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
        const response = await fetch(`${BACKEND_URL}/api/me`, { credentials: 'include' });
        if (!response.ok) throw new Error('Użytkownik niezalogowany');
        const user = await response.json();
        currentUser = user;
        updateUIAfterLogin(user);
    } catch (error) {
        console.log('Błąd sprawdzania statusu logowania:', error.message);
        currentUser = null;
        showLoginButton();
    } finally {
        finishLoadingAnimation(); // Zakończ animację
        const stats = loadStats();
        updateStatsUI(stats);
        populateShopPreview();
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
        button.textContent = categoryNames[categoryKey]; // Ustaw nazwę kategorii
        button.dataset.category = categoryKey; // Zapisz klucz kategorii

        button.addEventListener('click', () => {
            closeModal(shopHubModal); // Zamknij hub
            populateShopModal(categoryKey); // Wypełnij modal przedmiotami z tej kategorii
            openModal(shopModal); // Otwórz modal z przedmiotami
        });

        shopHubGrid.appendChild(button);
    }

    openModal(shopHubModal); // Otwórz hub z kategoriami
}

function openAccountHub() {
    const stats = loadStats();
    updateStatsUI(stats); // Upewnij się, że staty w modalu są aktualne
    populateAchievementsGrid(); // Wypełnij siatkę osiągnięć
    openModal(accountHubModal);
}

// Logika przełączania zakładek w modalu Konta
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
    });
});

function updateUIAfterLogin(user) {
    // Zmień przycisk w przycisk "Wyloguj"
    authButton.textContent = 'Wyloguj się';
    authButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    authButton.classList.add('bg-red-600', 'hover:bg-red-700'); // Czerwony kolor dla wylogowania

    // Aktualizuj główny panel statystyk
    const userAvatarUrl = user.avatar_url;
    mainAvatarContainer.innerHTML = `<img src="${userAvatarUrl}" alt="Avatar" class="w-full h-full rounded-full">`;
    mainUsername.textContent = user.display_name;
}

function showLoginButton() {
    // Zmień przycisk w przycisk "Zaloguj"
    authButton.textContent = 'Zaloguj się z Google';
    authButton.classList.remove('bg-red-600', 'hover:bg-red-700');
    authButton.classList.add('bg-blue-600', 'hover:bg-blue-700');

    // Przywróć domyślny wygląd panelu statystyk
    mainAvatarContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
    </svg>`;
    mainUsername.textContent = 'Gość';
}

// Event Listeners
// Event Listeners
navShopButton.addEventListener('click', () => {
    // Na telefonie, po prostu otwórz modal z pierwszą skrzynką
    const firstBoxId = Object.keys(lootBoxData)[0];
    populateShopModalWithBox(firstBoxId);
    openModal(shopModal);
});
navAccountButton.addEventListener('click', openAccountHub);
desktopAccountButton.addEventListener('click', openAccountHub);

closeShopButton.addEventListener('click', () => closeModal(shopModal));
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
startButton.addEventListener('click', init);

function showStartScreen() {
    gameState = 'start';
    messageTitle.textContent = 'TimberKitty';
    messageText.textContent = 'Kliknij przycisk, aby rozpocząć!';
    startButton.textContent = 'Graj!';
    messageOverlay.style.display = 'flex';
    timerBar.style.width = '100%';
}

window.onresize = () => {
    canvas.width = gameContainer.clientWidth;
    canvas.height = window.innerHeight * 0.7;
    if (gameState !== 'start') draw();
};

window.onload = async () => {
    try {
        startLoadingAnimation(); // Rozpocznij animację
        await loadSprites();
        showStartScreen();
        checkLoginStatus();
    } catch (error) {
        console.error("Nie udało się załadować zasobów gry:", error);
    }
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