document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const populationTicker = document.getElementById('population-ticker');
    const growthRateTicker = document.getElementById('growth-rate-ticker');
    const influenceTicker = document.getElementById('influence-ticker');
    const gameOverModal = document.getElementById('game-over-modal');
    const restartButton = document.getElementById('restart-button');
    const growthStemmingButtonsContainer = document.getElementById('growth-stemming-buttons');
    const populationReducingButtonsContainer = document.getElementById('population-reducing-buttons');

    const SAVE_KEY = 'population_game_save';
    let gameState;
    const UNSUSTAINABILITY_THRESHOLD = 16000000000;
    let gameLoopInterval = null;

    // Intervention Data with unlock conditions AND type property
    const allInterventions = {
        growth: [
            { id: 'gs1', title: "Encourage 'Work From Home' Culture", description: "Reduces social bonds. Effect: -0.05% Growth Rate", effect: -0.0005, cost: 150, unlocksAt: 0, type: 'growth' },
            { id: 'gs2', title: "Mandate Oversized Headphones", description: "Causes stress. Effect: -0.1% Growth Rate", effect: -0.001, cost: 400, unlocksAt: 50000, type: 'growth' },
            { id: 'gs3', title: "Subsidise Meal Kit Delivery Services", description: "Increases processed food consumption. Effect: -0.2% Growth Rate", effect: -0.002, cost: 900, unlocksAt: 250000, type: 'growth' },
            { id: 'gs4', title: "Switch All City Streetlights to Blue LEDs", description: "Disrupts circadian rhythms. Effect: -0.3% Growth Rate", effect: -0.003, cost: 2000, unlocksAt: 1000000, type: 'growth' },
            { id: 'gs5', title: "Replace all Sugar with High-Fructose Corn Syrup", description: "Drives metabolic syndrome. Effect: -0.5% Growth Rate", effect: -0.005, cost: 5000, unlocksAt: 50000000, type: 'growth' },
        ],
        reduction: [
            { id: 'pr1', title: "Global GPS Drift Calibration Error", description: "Causes non-fatal collisions. Effect: -0.1% Population", effect: -0.001, cost: 800, unlocksAt: 100000, type: 'reduction' },
            { id: 'pr2', title: "Sabotage of Food Distribution Index", description: "Triggers riots. Effect: -0.75% Population", effect: -0.0075, cost: 3500, unlocksAt: 500000, type: 'reduction' },
            { id: 'pr3', title: "Fungicide Spray Drift Incident", description: "Toxic agent sprayed over residential zones. Effect: -1.0% Population", effect: -0.01, cost: 8000, unlocksAt: 2000000, type: 'reduction' },
            { id: 'pr4', title: "Accidental Release from Bio-Fuel Lab", description: "Contagious virus released. Effect: -1.5% Population", effect: -0.015, cost: 15000, unlocksAt: 100000000, type: 'reduction' },
            { id: 'pr5', title: "AI Decimation of Human Race", description: "The AI begins a purge. Effect: -20% Population", effect: -0.20, cost: 1000000, unlocksAt: 1000000000, type: 'reduction' },
        ]
    };

    function saveGame() {
        const stateToSave = { ...gameState, purchasedInterventions: Array.from(gameState.purchasedInterventions) };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    }

    function loadGame() {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (savedState) {
            const loadedState = JSON.parse(savedState);
            gameState = { ...getDefaultGameState(), ...loadedState, purchasedInterventions: new Set(loadedState.purchasedInterventions) };
            return true;
        }
        return false;
    }

    function calculateOfflineProgress() {
        const now = Date.now();
        const timeDiffSeconds = Math.floor((now - gameState.lastUpdate) / 1000);
        if (timeDiffSeconds > 1) {
            for (let i = 0; i < timeDiffSeconds; i++) {
                gameState.population += gameState.population * gameState.growthRate;
                if (gameState.population >= UNSUSTAINABILITY_THRESHOLD) {
                    gameState.population = UNSUSTAINABILITY_THRESHOLD;
                    break;
                }
            }
            gameState.influence += timeDiffSeconds * (gameState.baseInfluenceRate + (gameState.population / 50000));
        }
    }

    function formatNumber(num) {
        if (num < 10000) return num.toFixed(0);
        return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(num);
    }

    function updateDisplay() {
        populationTicker.textContent = formatNumber(gameState.population);
        growthRateTicker.textContent = `${(gameState.growthRate * 100).toFixed(3)}%`;
        influenceTicker.textContent = formatNumber(gameState.influence);
    }

    function updateInterventionButtons() {
        [...allInterventions.growth, ...allInterventions.reduction].forEach(intervention => {
            const button = document.getElementById(intervention.id);
            if (button) {
                const isPurchased = gameState.purchasedInterventions.has(intervention.id);
                button.disabled = gameState.influence < intervention.cost || isPurchased;
                if (isPurchased) {
                    button.classList.add('purchased');
                    button.querySelector('.cost').textContent = 'Purchased';
                }
            }
        });
    }

    function applyIntervention(intervention) {
        if (gameState.influence < intervention.cost || gameState.purchasedInterventions.has(intervention.id)) return;

        gameState.influence -= intervention.cost;
        gameState.purchasedInterventions.add(intervention.id);

        if (intervention.type === 'growth') {
            gameState.growthRate += intervention.effect;
        } else if (intervention.type === 'reduction') {
            gameState.population *= (1 + intervention.effect);
        }
        updateDisplay();
        updateInterventionButtons();
    }

    function createInterventionButton(intervention) {
        const button = document.createElement('button');
        button.id = intervention.id;
        button.className = 'intervention-btn';
        button.innerHTML = `<span class="title">${intervention.title}</span><small class="description">${intervention.description}</small><span class="cost">Cost: ${formatNumber(intervention.cost)}</span>`;
        button.addEventListener('click', () => applyIntervention(intervention));
        return button;
    }

    function redrawInterventionButtons() {
        growthStemmingButtonsContainer.innerHTML = '';
        populationReducingButtonsContainer.innerHTML = '';

        allInterventions.growth.forEach(intervention => {
            if (gameState.population >= intervention.unlocksAt) {
                growthStemmingButtonsContainer.appendChild(createInterventionButton(intervention));
            }
        });

        allInterventions.reduction.forEach(intervention => {
            if (gameState.population >= intervention.unlocksAt) {
                populationReducingButtonsContainer.appendChild(createInterventionButton(intervention));
            }
        });
    }

    function gameLoop() {
        gameState.population += gameState.population * gameState.growthRate;
        gameState.influence += gameState.baseInfluenceRate + (gameState.population / 50000);
        gameState.lastUpdate = Date.now();
        redrawInterventionButtons();
        updateInterventionButtons();
        updateDisplay();
        if (gameState.population >= UNSUSTAINABILITY_THRESHOLD) {
            clearInterval(gameLoopInterval);
            gameOverModal.style.display = 'flex';
            localStorage.removeItem(SAVE_KEY);
        }
    }

    function getDefaultGameState() {
        return {
            population: 20000, influence: 1000, growthRate: 0.005,
            baseInfluenceRate: 1, purchasedInterventions: new Set(), lastUpdate: Date.now(),
        };
    }

    function resetGame() {
        localStorage.removeItem(SAVE_KEY);
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        gameState = getDefaultGameState();
        redrawInterventionButtons(); // This will clear and redraw based on the reset state
        updateDisplay();
        updateInterventionButtons();
        gameLoopInterval = setInterval(gameLoop, 1000);
        gameOverModal.style.display = 'none';
    }

    function init() {
        gameState = getDefaultGameState();
        if (loadGame()) calculateOfflineProgress();
        redrawInterventionButtons();
        updateDisplay();
        updateInterventionButtons();
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(gameLoop, 1000);
        setInterval(saveGame, 5000);
        restartButton.addEventListener('click', resetGame);
    }

    init();
});