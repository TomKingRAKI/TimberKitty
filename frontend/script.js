// --- Ustawienia gry ---
const BACKEND_URL = 'https://timberman-backend.onrender.com';
const authButton = document.getElementById('auth-button');
const mainAvatarContainer = document.getElementById('main-avatar-container');
const mainUsername = document.getElementById('main-username');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const messageOverlay = document.getElementById('message-overlay');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const startButton = document.getElementById('startButton');
const timerBar = document.getElementById('timer-bar');
const highScoreStatEl = document.getElementById('highScoreStat');
const totalChopsStatEl = document.getElementById('totalChopsStat');
const coinsStatEl = document.getElementById('coinsStat');
// Osiągnięcia
const achievementsButton = document.getElementById('achievements-button');
const achievementsModal = document.getElementById('achievements-modal');
const closeAchievementsButton = document.getElementById('close-achievements-button');
const achievementsGrid = document.getElementById('achievements-grid');
const achievementsPreview = document.getElementById('achievements-preview');
// Sklep
const shopPreviewContainer = document.getElementById('shop-preview-container');
const shopModal = document.getElementById('shop-modal');
const closeShopButton = document.getElementById('close-shop-button');
const shopGrid = document.getElementById('shop-grid');
const shopModalTitle = document.getElementById('shop-modal-title');
const equipmentModal = document.getElementById('equipment-modal');
const closeEquipmentButton = document.getElementById('close-equipment-button');
const equipmentGrid = document.getElementById('equipment-grid');
const equipmentModalTitle = document.getElementById('equipment-modal-title');
const unequipButton = document.getElementById('unequip-button');
const notificationContainer = document.getElementById('notification-container');

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
let player = { side: 'left', isChopping: false };
let tree = [];
let particles = [];
let score = 0;
let gameState = 'start';
let currentUser = null; // Przechowuje pełne dane zalogowanego użytkownika z bazy

// Zmienne timera
let timer = 100;
const MAX_TIME = 100;
let gameLoopInterval = null;
let activeBonuses = {};
let petSaveUsed = false;

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
        unlockedItems: dbUser.unlocked_items || [],
        equippedItems: dbUser.equipped_items || { character: null, hat: null, axe: null, accessory: null, pet: null }
    };
}

// ZMODYFIKOWANA FUNKCJA: Teraz jest synchroniczna i działa w dwóch trybach
function loadStats() {
    if (currentUser) {
        // Użytkownik zalogowany - dane pochodzą z obiektu currentUser
        return parseStatsFromDB(currentUser);
    } else {
        // Tryb gościa - dane pochodzą z localStorage
        const defaultStats = { highScore: 0, totalChops: 0, coins: 0, unlockedAchievements: [], unlockedItems: [], equippedItems: { character: null, hat: null, axe: null, accessory: null, pet: null } };
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
    
    const statBoxes = [document.getElementById('coins-stat-box'), document.getElementById('highscore-stat-box'), document.getElementById('totalchops-stat-box')];
    statBoxes.forEach(box => box.classList.add('stat-update-animation'));

    function animationStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const chopGain = score * progress;
        const coinGain = (newStats.coins - oldStats.coins) * progress;
        const currentTotalChops = Math.floor(oldStats.totalChops + chopGain);
        const currentCoins = oldStats.coins + coinGain;
        const currentHighScore = oldStats.highScore < newStats.highScore ? Math.floor(oldStats.highScore + ((newStats.highScore - oldStats.highScore) * progress)) : oldStats.highScore;

        totalChopsStatEl.textContent = currentTotalChops;
        coinsStatEl.textContent = currentCoins.toFixed(1);
        highScoreStatEl.textContent = currentHighScore;

        if (progress < 1) {
            requestAnimationFrame(animationStep);
        } else {
            updateStatsUI(newStats);
            populateAchievementsPreview(newStats);
            setTimeout(() => {
                statBoxes.forEach(box => box.classList.remove('stat-update-animation'));
            }, 500);
        }
    }
    requestAnimationFrame(animationStep);
}

function updateStatsUI(stats) {
    highScoreStatEl.textContent = stats.highScore;
    totalChopsStatEl.textContent = stats.totalChops;
    coinsStatEl.textContent = stats.coins.toFixed(1);
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

function populateAchievementsModal() {
    achievementsGrid.innerHTML = '';
    const stats = loadStats();
    for (const id in achievementsData) {
        const achievement = achievementsData[id];
        const isUnlocked = stats.unlockedAchievements.includes(id);
        const card = document.createElement('div');
        card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : '');
        card.innerHTML = `<div class="icon">${isUnlocked ? achievement.icon : '?'}</div><div class="title">${achievement.name}</div><div class="description">${isUnlocked ? achievement.description : 'Zablokowane'}</div>`;
        achievementsGrid.appendChild(card);
    }
}

function populateShopModal(categoryKey) {
    shopGrid.innerHTML = '';
    const categoryName = categoryNames[categoryKey];
    shopModalTitle.textContent = categoryName;
    const stats = loadStats();
    const itemsInCategory = Object.values(shopData).filter(item => item.category === categoryKey);

    itemsInCategory.forEach(item => {
        const isOwned = stats.unlockedItems.includes(item.id);
        const card = document.createElement('div');
        card.className = 'shop-item-slot ' + (isOwned ? 'owned' : '');
        let bottomContent = isOwned ? `<div class="owned-text">POSIADANE</div>` : `<div class="w-full mt-auto"><div class="text-amber-400 font-bold mb-2">${item.price} monet</div><button class="buy-button">KUP</button></div>`;
        card.innerHTML = `<div class="text-4xl">${item.icon}</div><div class="font-bold text-base">${item.name}</div><div class="text-sm text-gray-300 px-1 leading-tight">${item.description}</div>${bottomContent}`;
        if (!isOwned) {
            card.querySelector('.buy-button').addEventListener('click', (e) => {
                e.stopPropagation();
                buyItem(item.id, card);
            });
        }
        shopGrid.appendChild(card);
    });
}

function populateShopPreview() {
    shopPreviewContainer.innerHTML = '';
    const stats = loadStats();
    const categories = {};
    Object.values(shopData).forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = { name: item.category.charAt(0).toUpperCase() + item.category.slice(1), items: [] };
        }
        categories[item.category].items.push(item);
    });
    for (const categoryKey in categories) {
        const category = categories[categoryKey];
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'w-full shop-category-preview rounded-lg p-2';
        categoryContainer.dataset.category = categoryKey;
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold text-shadow mb-2 flex justify-between items-center';
        title.innerHTML = `<span>${categoryNames[categoryKey]}</span><span class="font-bold text-xl text-gray-500">+</span>`;
        const previewGrid = document.createElement('div');
        previewGrid.className = 'grid grid-cols-4 gap-3 w-full';
        category.items.slice(0, 4).forEach(item => {
            const isOwned = stats.unlockedItems.includes(item.id);
            const slot = document.createElement('div');
            slot.className = 'item-slot rounded-md';
            if (isOwned) slot.classList.add('opacity-50');
            slot.innerHTML = item.icon;
            previewGrid.appendChild(slot);
        });
        categoryContainer.appendChild(title);
        categoryContainer.appendChild(previewGrid);
        shopPreviewContainer.appendChild(categoryContainer);
        categoryContainer.addEventListener('click', () => {
            populateShopModal(categoryKey);
            openModal(shopModal);
        });
    }
}


// --- Logika gry ---

async function buyItem(itemId, cardElement) {
    let stats = loadStats();
    const item = shopData[itemId];

    if (stats.coins < item.price) {
        if (!cardElement.classList.contains('shake-error')) {
            cardElement.classList.add('shake-error');
            const button = cardElement.querySelector('.buy-button');
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Za mało monet!';
                button.style.backgroundColor = '#ef4444';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                }, 1500);
            }
            setTimeout(() => cardElement.classList.remove('shake-error'), 500);
        }
        return;
    }
    if (stats.unlockedItems.includes(item.id)) {
        showNotification('Masz już ten przedmiot!', 'error');
        return;
    }

    stats.coins -= item.price;
    stats.unlockedItems.push(item.id);
    const updatedStats = await updateAndSaveStats(0, stats);
    
    showNotification(`Kupiono: ${item.name}!`, 'success');
    updateStatsUI(updatedStats);
    populateShopModal(item.category);
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
}

async function unequipItem(category) {
    let stats = loadStats();
    const slot = categoryToSlotMap[category];
    stats.equippedItems[slot] = null;
    const updatedStats = await updateAndSaveStats(0, stats);
    updateEquipmentPanel(updatedStats);
    closeModal(equipmentModal);
}

function updateEquipmentPanel(stats) {
    for (const slot in stats.equippedItems) {
        const itemId = stats.equippedItems[slot];
        const slotElement = document.getElementById(`equipment-slot-${slot}`);
        if(!slotElement) continue;
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

async function populateEquipmentSelectionModal(category) {
    equipmentGrid.innerHTML = '';
    equipmentModalTitle.textContent = `Wybierz: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const stats = loadStats();
    const ownedItemsInCategory = stats.unlockedItems.map(id => shopData[id]).filter(item => item && item.category === category);
    if (ownedItemsInCategory.length === 0) {
        equipmentGrid.innerHTML = `<p class="col-span-4 text-center text-gray-500">Nie posiadasz żadnych przedmiotów z tej kategorii.</p>`;
    } else {
        ownedItemsInCategory.forEach(item => {
            const card = document.createElement('div');
            card.className = 'equipment-selection-item';
            card.innerHTML = `<span>${item.icon}</span><span class="item-name">${item.name}</span>`;
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
        for(const slot in stats.equippedItems) {
            const itemId = stats.equippedItems[slot];
            if(itemId && shopData[itemId]) {
                const bonus = shopData[itemId].bonus;
                activeBonuses[bonus.type] += bonus.value;
            }
        }
    }
    const initialSegments = Math.ceil(canvas.height / SEGMENT_HEIGHT) + 2;
    for (let i = 0; i < initialSegments; i++) {
        if (i < 2) tree.push({ branch: null });
        else {
            const lastBranch = tree[i-1].branch;
            let newBranchSide = Math.random() < 0.5 ? 'left' : 'right';
            if(lastBranch && lastBranch !== newBranchSide) tree.push({ branch: null });
            else tree.push({ branch: Math.random() < 0.35 ? newBranchSide : null });
        }
    }
    scoreElement.textContent = score;
    messageOverlay.style.display = 'none';
    if(gameLoopInterval) clearInterval(gameLoopInterval);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tree.forEach((segment, index) => {
        const y = canvas.height - (index + 1) * SEGMENT_HEIGHT;
        drawTrunkSegment(TRUNK_X, y, TRUNK_WIDTH, SEGMENT_HEIGHT);
        if (segment.branch) drawBranch(TRUNK_X, y, segment.branch);
    });
    drawParticles();
    drawGrass();
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
    for(let i = 0; i < 3; i++) ctx.fillRect(x + (i * width / 3) + 5, y, 2, height);
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
    let playerX, scaleX = 1;
    if (player.side === 'left') {
        playerX = TRUNK_X - PLAYER_WIDTH - 5;
        scaleX = -1;
    } else {
        playerX = TRUNK_X + TRUNK_WIDTH + 5;
        scaleX = 1;
    }
    ctx.save();
    ctx.translate(playerX + PLAYER_WIDTH / 2, playerY + PLAYER_HEIGHT / 2);
    ctx.scale(scaleX, 1);
    const bodyHeight = PLAYER_HEIGHT * 0.5, headRadius = PLAYER_HEIGHT * 0.2, legHeight = PLAYER_HEIGHT * 0.5;
    ctx.fillStyle = PLAYER_PANTS_COLOR;
    ctx.fillRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT/2 + bodyHeight, PLAYER_WIDTH, legHeight);
    ctx.fillStyle = PLAYER_SHIRT_COLOR;
    ctx.fillRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT/2, PLAYER_WIDTH, bodyHeight);
    ctx.fillStyle = PLAYER_SKIN_COLOR;
    ctx.beginPath();
    ctx.arc(0, -PLAYER_HEIGHT/2 - headRadius + bodyHeight, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PLAYER_SHIRT_COLOR;
    ctx.fillRect(-headRadius, -PLAYER_HEIGHT/2 - headRadius*2 + bodyHeight, headRadius*2, headRadius);
    if (player.isChopping) {
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(PLAYER_WIDTH * 0.4, -PLAYER_HEIGHT * 0.1);
        ctx.lineTo(PLAYER_WIDTH * 0.7, -PLAYER_HEIGHT * 0.2);
        ctx.lineTo(PLAYER_WIDTH * 0.6, PLAYER_HEIGHT * 0.1);
        ctx.fill();
    }
    ctx.restore();
}

async function gameOver() {
    if(gameState === 'gameOver') return;
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
    player.side = sideToChop;
    player.isChopping = true;
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
    setTimeout(() => { player.isChopping = false; }, 50);
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
    switch(event.key.toLowerCase()) {
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
        currentUser = user; // Zapisz dane użytkownika globalnie
        updateUIAfterLogin(user);
    } catch (error) {
        console.log('Błąd sprawdzania statusu logowania:', error.message);
        currentUser = null;
        showLoginButton();
    } finally {
        // Ta część wykona się ZAWSZE, niezależnie od tego czy logowanie się udało, czy nie
        // Dzięki temu statystyki (z serwera lub localStorage) ładujemy tylko RAZ.
        const stats = loadStats();
        updateStatsUI(stats);
        updateEquipmentPanel(stats);
        populateAchievementsPreview(stats);
        populateShopPreview();
    }
}

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
achievementsButton.addEventListener('click', () => {
    populateAchievementsModal();
    openModal(achievementsModal);
});
closeAchievementsButton.addEventListener('click', () => closeModal(achievementsModal));
achievementsModal.addEventListener('click', (e) => { if (e.target === achievementsModal) closeModal(achievementsModal); });

closeShopButton.addEventListener('click', () => closeModal(shopModal));
shopModal.addEventListener('click', (e) => { if (e.target === shopModal) closeModal(shopModal); });

closeEquipmentButton.addEventListener('click', () => closeModal(equipmentModal));
equipmentModal.addEventListener('click', (e) => { if (e.target === equipmentModal) closeModal(equipmentModal); });

document.querySelectorAll('[data-category]').forEach(slot => {
    slot.addEventListener('click', () => {
        const category = slot.dataset.category;
        populateEquipmentSelectionModal(category);
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
    if(gameState !== 'start') draw();
};

window.onload = () => {
    showStartScreen();
    checkLoginStatus(); 
};

authButton.addEventListener('click', () => {
    if (currentUser) {
        // Jeśli użytkownik jest zalogowany, wyloguj go
        window.location.href = `${BACKEND_URL}/auth/logout`;
    } else {
        // Jeśli nie, rozpocznij proces logowania
        window.location.href = `${BACKEND_URL}/auth/google`;
    }
});