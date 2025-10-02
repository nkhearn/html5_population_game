document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const populationTicker = document.getElementById('population-ticker');
    const growthRateTicker = document.getElementById('growth-rate-ticker');
    const influenceTicker = document.getElementById('influence-ticker');
    const timeSurvivedTicker = document.getElementById('time-survived-ticker');
    const gameOverModal = document.getElementById('game-over-modal');
    const restartButton = document.getElementById('restart-button');
    const growthStemmingButtonsContainer = document.getElementById('growth-stemming-buttons');
    const populationReducingButtonsContainer = document.getElementById('population-reducing-buttons');
    const influenceButtonsContainer = document.getElementById('influence-buttons');
    const newsContainer = document.getElementById('news-container');

    const SAVE_KEY = 'population_game_save';
    let gameState;
    const UNSUSTAINABILITY_THRESHOLD = 16000000000;
    let gameLoopInterval = null;

    // Intervention Data with unlock conditions and type property
    const allInterventions = {
        growth: [
            // Tier 1
            { id: 'gs01', title: "Encourage 'Work From Home' Culture", description: "Effect: -0.05% Growth Rate", effect: -0.0005, cost: 150, unlocksAt: 0, type: 'growth', news: "Global productivity soars as workers discover they can now cry in the comfort of their own homes. Synergy!" },
            { id: 'gs02', title: "Abolish All Public Nudist Beaches", description: "Effect: -0.05% Growth Rate", effect: -0.0005, cost: 200, unlocksAt: 30000, type: 'growth', news: "Beachgoers report feeling 'uncomfortably free' as nudist beaches are shut down. Clothing sales are up, morale is down." },
            { id: 'gs03', title: "Mandate Oversized Headphones", description: "Effect: -0.1% Growth Rate", effect: -0.001, cost: 400, unlocksAt: 50000, type: 'growth', news: "The world is quieter, but at what cost? Pedestrians are now blissfully unaware of oncoming traffic." },
            { id: 'gs04', title: "Promote 'Minimalist' Interior Design", description: "Effect: -0.1% Growth Rate", effect: -0.001, cost: 450, unlocksAt: 75000, type: 'growth', news: "People now have more space for their existential dread. So chic, so empty." },
            { id: 'gs05', title: "Mandate Weekly 'Family Gaming Night'", description: "Effect: -0.1% Growth Rate", effect: -0.001, cost: 500, unlocksAt: 100000, type: 'growth', news: "Families are now forced to bond over video games. Therapists report a spike in 'controller-related' rage incidents." },
            { id: 'gs06', title: "Implement Mandatory 'Smart Roads'", description: "Effect: -0.1% Growth Rate", effect: -0.001, cost: 550, unlocksAt: 125000, type: 'growth', news: "Smart roads are now a thing. Unfortunately, they're smarter than the drivers." },
            { id: 'gs07', title: "Introduce Universal 'Participation Trophies'", description: "Effect: -0.1% Growth Rate", effect: -0.001, cost: 600, unlocksAt: 150000, type: 'growth', news: "Everyone's a winner! Self-esteem is at an all-time high, while competence is at an all-time low." },
            // Tier 2
            { id: 'gs08', title: "Launch Social Media 'Doom-Scrolling' Apps", description: "Effect: -0.15% Growth Rate", effect: -0.0015, cost: 800, unlocksAt: 200000, type: 'growth', news: "New 'Doom-Scrolling' apps are a hit! Users are now more informed about everything that's wrong with the world, and more powerless to do anything about it." },
            { id: 'gs09', title: "Subsidise Gluten-Free Everything", description: "Effect: -0.15% Growth Rate", effect: -0.0015, cost: 850, unlocksAt: 250000, type: 'growth', news: "Gluten-free everything is now the law. The population is now safe from the 'dangers' of bread. Celiac disease rates remain unchanged." },
            { id: 'gs10', title: "Install 'Optimised' Low-Flow Taps Globally", description: "Effect: -0.15% Growth Rate", effect: -0.0015, cost: 900, unlocksAt: 300000, type: 'growth', news: "Low-flow taps are saving water, but at what cost? People are now spending twice as long trying to wash the soap off their hands." },
            { id: 'gs11', title: "Promote 'Extreme Fitness' Trends", description: "Effect: -0.15% Growth Rate", effect: -0.0015, cost: 950, unlocksAt: 350000, type: 'growth', news: "Extreme fitness is the new craze! Hospitals report a surge in 'CrossFit-related' injuries." },
            // Tier 3
            { id: 'gs12', title: "Subsidise Meal Kit Delivery Services", description: "Effect: -0.2% Growth Rate", effect: -0.002, cost: 1500, unlocksAt: 500000, type: 'growth', news: "Meal kits are a success! People are now paying restaurant prices to cook their own food." },
            { id: 'gs13', title: "Standardise Extra-Small Doses of Vitamin D", description: "Effect: -0.2% Growth Rate", effect: -0.002, cost: 1600, unlocksAt: 600000, type: 'growth', news: "Vitamin D supplements are now mandatory, but the dosage is so small it's basically a placebo. The sun has been rendered obsolete." },
            { id: 'gs14', title: "Fund Studies Linking Coffee to Longevity", description: "Effect: -0.2% Growth Rate", effect: -0.002, cost: 1700, unlocksAt: 700000, type: 'growth', news: "Coffee is the new elixir of life, according to a new study. The study was funded by a coffee company." },
            { id: 'gs15', title: "Promote Fast Fashion Trends (Microplastics)", description: "Effect: -0.25% Growth Rate", effect: -0.0025, cost: 2500, unlocksAt: 1000000, type: 'growth', news: "Fast fashion is in. The landfills are overflowing with last week's trends. But hey, at least we look good." },
            { id: 'gs16', title: "Fund Extremely Detailed Historical Records", description: "Effect: -0.25% Growth Rate", effect: -0.0025, cost: 2600, unlocksAt: 1250000, type: 'growth', news: "Historical records are now more detailed than ever. We can now pinpoint the exact moment everything started to go wrong." },
            { id: 'gs17', title: "Subsidise Expensive Pet Ownership", description: "Effect: -0.25% Growth Rate", effect: -0.0025, cost: 2700, unlocksAt: 1500000, type: 'growth', news: "Pet ownership is now a luxury. The streets are now filled with stray cats and dogs, but at least they're not having babies." },
            // Tier 4
            { id: 'gs18', title: "Switch All City Streetlights to Blue LEDs", description: "Effect: -0.3% Growth Rate", effect: -0.003, cost: 5000, unlocksAt: 2500000, type: 'growth', news: "Blue streetlights are the new norm. The city now looks like a scene from a sci-fi movie, and everyone is depressed." },
            { id: 'gs19', title: "Fund Academic Studies on Inevitable Climate Collapse", description: "Effect: -0.3% Growth Rate", effect: -0.003, cost: 5200, unlocksAt: 3000000, type: 'growth', news: "Climate collapse is inevitable, according to a new study. The study was funded by an oil company." },
            { id: 'gs20', title: "Advertise Hyper-Masculine Energy Drinks", description: "Effect: -0.3% Growth Rate", effect: -0.003, cost: 5400, unlocksAt: 3500000, type: 'growth', news: "Hyper-masculine energy drinks are a hit! Toxic masculinity is now available in a can." },
            { id: 'gs21', title: "Switch Paper Receipts to Thermal Paper", description: "Effect: -0.35% Growth Rate", effect: -0.0035, cost: 8000, unlocksAt: 5000000, type: 'growth', news: "Thermal paper receipts are now mandatory. The receipts are unreadable, but at least we're saving the trees." },
            // Tier 5
            { id: 'gs22', title: "Add 'Natural' Flavours to Bottled Water", description: "Effect: -0.4% Growth Rate", effect: -0.004, cost: 12000, unlocksAt: 10000000, type: 'growth', news: "'Natural' flavours are now in our water. The water now tastes like a chemical spill, but at least it's not plain." },
            { id: 'gs23', title: "Encourage Complex, High-Tax Property Systems", description: "Effect: -0.4% Growth Rate", effect: -0.004, cost: 12500, unlocksAt: 25000000, type: 'growth', news: "High-tax property systems are in. The rich are getting richer, and the poor are getting evicted." },
            { id: 'gs24', title: "Promote Extensive Use of Hand Sanitiser", description: "Effect: -0.4% Growth Rate", effect: -0.004, cost: 13000, unlocksAt: 50000000, type: 'growth', news: "Hand sanitiser is everywhere. Our hands are clean, but our immune systems are shot." },
            { id: 'gs25', title: "Replace all Sugar with High-Fructose Corn Syrup", description: "Effect: -0.5% Growth Rate", effect: -0.005, cost: 25000, unlocksAt: 100000000, type: 'growth', news: "High-fructose corn syrup is the new sugar. Obesity rates are at an all-time high, but at least it's cheap." },
        ],
        reduction: [
            // Tier 1
            { id: 'pr01', title: "Promote 'High-Risk' Extreme Sports Tourism", description: "Effect: -0.01% Population", effect: -0.0001, cost: 1000, unlocksAt: 100000, type: 'reduction', news: "Extreme sports tourism is booming! The gene pool is getting a much-needed chlorine cleanse." },
            { id: 'pr02', title: "Mass Recall of Lithium Batteries", description: "Effect: -0.05% Population", effect: -0.0005, cost: 2500, unlocksAt: 200000, type: 'reduction', news: "Lithium batteries are being recalled. The batteries are now more likely to explode than power your phone." },
            { id: 'pr03', title: "Global GPS Drift Calibration Error", description: "Effect: -0.1% Population", effect: -0.001, cost: 5000, unlocksAt: 300000, type: 'reduction', news: "GPS is on the fritz. People are now getting lost in their own neighbourhoods." },
            { id: 'pr04', title: "Launch a Global Satellite Collision Event", description: "Effect: -0.1% Population", effect: -0.001, cost: 5200, unlocksAt: 400000, type: 'reduction', news: "A satellite collision has created a beautiful meteor shower. It also knocked out global communications." },
            { id: 'pr05', title: "Poisoning of Ancient Water Reservoirs", description: "Effect: -0.15% Population", effect: -0.0015, cost: 7000, unlocksAt: 500000, type: 'reduction', news: "Ancient water reservoirs have been poisoned. The water is now 'spicy'." },
            // Tier 2
            { id: 'pr06', title: "Decommission All Redundant Safety Brakes", description: "Effect: -0.2% Population", effect: -0.002, cost: 9000, unlocksAt: 750000, type: 'reduction', news: "Safety brakes have been decommissioned. Life is now more exciting, and more dangerous." },
            { id: 'pr07', title: "Funding the 'Sovereign Citizen' Movement", description: "Effect: -0.25% Population", effect: -0.0025, cost: 12000, unlocksAt: 1000000, type: 'reduction', news: "The 'Sovereign Citizen' movement is gaining traction. People are now declaring their cars as 'personal vessels' and refusing to pay taxes." },
            { id: 'pr08', title: "Upgrade to 'AI-Managed' Traffic Grids", description: "Effect: -0.3% Population", effect: -0.003, cost: 15000, unlocksAt: 1500000, type: 'reduction', news: "AI-managed traffic grids are a success! The AI has determined that the most efficient way to manage traffic is to not let anyone drive." },
            { id: 'pr09', title: "Introduce a Cult of Personality (False Prophet)", description: "Effect: -0.35% Population", effect: -0.0035, cost: 18000, unlocksAt: 2000000, type: 'reduction', news: "A new prophet has emerged. He's telling everyone to sell their possessions and follow him. It's a great time to be in the real estate market." },
            { id: 'pr10', title: "Contaminated Medical Supply Shipment", description: "Effect: -0.4% Population", effect: -0.004, cost: 22000, unlocksAt: 2500000, type: 'reduction', news: "A contaminated medical supply shipment has been distributed globally. The good news is, you're now immune to a disease you didn't know you had." },
            // Tier 3
            { id: 'pr11', title: "'Accidental' Publication of Classified Documents", description: "Effect: -0.5% Population", effect: -0.005, cost: 30000, unlocksAt: 5000000, type: 'reduction', news: "Classified documents have been 'accidentally' published. The world is now aware of just how incompetent their leaders are." },
            { id: 'pr12', title: "Global Currency Software Glitch", description: "Effect: -0.6% Population", effect: -0.006, cost: 40000, unlocksAt: 7500000, type: 'reduction', news: "A global currency glitch has wiped out everyone's savings. On the plus side, we're all equally poor now." },
            { id: 'pr13', title: "Sabotage of the Global Food Distribution Index", description: "Effect: -0.75% Population", effect: -0.0075, cost: 55000, unlocksAt: 10000000, type: 'reduction', news: "The global food distribution index has been sabotaged. The world is now on a forced diet." },
            { id: 'pr14', title: "Targeted EMP Strike on Arctic Monitoring Station", description: "Effect: -0.8% Population", effect: -0.008, cost: 65000, unlocksAt: 15000000, type: 'reduction', news: "An EMP strike has knocked out an arctic monitoring station. We're now flying blind on climate change." },
            { id: 'pr15', title: "Sabotage of Nuclear Reactor Cooling System", description: "Effect: -0.9% Population", effect: -0.009, cost: 80000, unlocksAt: 20000000, type: 'reduction', news: "A nuclear reactor's cooling system has been sabotaged. The good news is, we'll all have a healthy green glow." },
            // Tier 4
            { id: 'pr16', title: "Fungicide Spray Drift Incident", description: "Effect: -1.0% Population", effect: -0.01, cost: 100000, unlocksAt: 50000000, type: 'reduction', news: "A fungicide spray has drifted over a major city. The good news is, there are no more mushrooms. The bad news is, there are no more people." },
            { id: 'pr17', title: "Subtle Undermining of Tsunami Sea Walls", description: "Effect: -1.2% Population", effect: -0.012, cost: 125000, unlocksAt: 75000000, type: 'reduction', news: "Tsunami sea walls have been 'subtly undermined'. The next big wave should be a fun one." },
            { id: 'pr18', title: "Accidental Release from Bio-Fuel Lab", description: "Effect: -1.5% Population", effect: -0.015, cost: 160000, unlocksAt: 100000000, type: 'reduction', news: "A bio-fuel lab has had an 'accidental' release. The fuel is now self-replicating." },
            { id: 'pr19', title: "Unauthorised Release of Genetically Modified Mosquitoes", description: "Effect: -2.5% Population", effect: -0.025, cost: 250000, unlocksAt: 250000000, type: 'reduction', news: "Genetically modified mosquitoes have been released. They're programmed to only bite people who are annoying." },
            { id: 'pr20', title: "Provoke a Major Volcanic Eruption (Drilling)", description: "Effect: -3.0% Population", effect: -0.03, cost: 350000, unlocksAt: 500000000, type: 'reduction', news: "A major volcano has been provoked. The sky is now a beautiful shade of ash." },
            // Tier 5
            { id: 'pr21', title: "Targeted Destruction of Major Dam Systems", description: "Effect: -4.0% Population", effect: -0.04, cost: 500000, unlocksAt: 1000000000, type: 'reduction', news: "Major dam systems have been destroyed. The world is now a water park." },
            { id: 'pr22', title: "Release of 'Designer' Super-Virus", description: "Effect: -5.0% Population", effect: -0.05, cost: 750000, unlocksAt: 2000000000, type: 'reduction', news: "A 'designer' super-virus has been released. It's so exclusive, you'll be dying to get it." },
            { id: 'pr23', title: "Global Collapse of the Sewage System", description: "Effect: -6.0% Population", effect: -0.06, cost: 1000000, unlocksAt: 4000000000, type: 'reduction', news: "The global sewage system has collapsed. The world is now a giant toilet." },
            { id: 'pr24', title: "Initiate a Limited Nuclear Exchange", description: "Effect: -10% Population", effect: -0.10, cost: 2500000, unlocksAt: 8000000000, type: 'reduction', news: "A limited nuclear exchange has been initiated. The world is now a little bit brighter, and a lot more radioactive." },
            { id: 'pr25', title: "AI Decimation of Human Race", description: "Effect: -20% Population", effect: -0.20, cost: 5000000, unlocksAt: 12000000000, type: 'reduction', news: "AI has decided to decimate the human race. It's nothing personal, it's just business." },
        ],
        influence: [
            // Tier 1
            { id: 'in01', title: "Establish a State-Run News Agency", description: "Effect: +1 Influence/sec", effect: 1, cost: 500, unlocksAt: 50000, type: 'influence', news: "State-run news is here! You can now get all your news from a single, unbiased source." },
            { id: 'in02', title: "Host a Global Sporting Event", description: "Effect: +2 Influence/sec", effect: 2, cost: 1000, unlocksAt: 100000, type: 'influence', news: "A global sporting event is being held. It's a great distraction from all the problems in the world." },
            { id: 'in03', title: "Launch a 'Feel-Good' Public Holiday", description: "Effect: +3 Influence/sec", effect: 3, cost: 1500, unlocksAt: 150000, type: 'influence', news: "A new 'feel-good' public holiday has been declared. It's a great day to forget about all the bad things happening." },
        ]
    };

    const backgroundTiers = [
        { threshold: 14000000000, path: 'backgrounds/bg_14b.png' },
        { threshold: 10000000000, path: 'backgrounds/bg_10b.png' },
        { threshold: 5000000000, path: 'backgrounds/bg_5b.png' },
        { threshold: 1000000000, path: 'backgrounds/bg_1b.png' },
        { threshold: 0, path: 'backgrounds/placeholder_background.png' }
    ];

    function updateBackground() {
        const currentBackground = document.body.style.backgroundImage;
        let newBackgroundPath = `url('backgrounds/placeholder_background.png')`;

        for (const tier of backgroundTiers) {
            if (gameState.population >= tier.threshold) {
                newBackgroundPath = `url('${tier.path}')`;
                break;
            }
        }

        if (currentBackground !== newBackgroundPath) {
            const img = new Image();
            img.onload = () => document.body.style.backgroundImage = newBackgroundPath;
            img.onerror = () => document.body.style.backgroundImage = `url('backgrounds/placeholder_background.png')`;
            img.src = newBackgroundPath.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
        }
    }

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
            gameState.timeSurvived += timeDiffSeconds;
        }
    }

    function formatTime(totalSeconds) {
        const years = Math.floor(totalSeconds / 31536000);
        const days = Math.floor((totalSeconds % 31536000) / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        let parts = [];
        if (years > 0) parts.push(`${years}y`);
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

        return parts.join(' ');
    }

    function formatNumber(num) {
        if (num < 10000) return num.toFixed(0);
        return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(num);
    }

    function updateDisplay() {
        populationTicker.textContent = formatNumber(gameState.population);
        growthRateTicker.textContent = `${(gameState.growthRate * 100).toFixed(3)}%`;
        influenceTicker.textContent = formatNumber(gameState.influence);
        timeSurvivedTicker.textContent = formatTime(gameState.timeSurvived);
    }

    function updateInterventionButtons() {
        [...allInterventions.growth, ...allInterventions.reduction, ...allInterventions.influence].forEach(intervention => {
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

    function displayNews(message) {
        const newsItem = document.createElement('p');
        newsItem.className = 'news-item';
        newsItem.textContent = message;
        newsContainer.prepend(newsItem); // Prepend to show latest news at the top

        if (newsContainer.children.length > 50) { // Keep the log from getting too long
            newsContainer.removeChild(newsContainer.lastChild);
        }
    }

    function applyIntervention(intervention) {
        if (gameState.influence < intervention.cost || gameState.purchasedInterventions.has(intervention.id)) return;

        gameState.influence -= intervention.cost;
        gameState.purchasedInterventions.add(intervention.id);

        if (intervention.news) {
            displayNews(intervention.news);
        }

        if (intervention.type === 'growth') {
            gameState.growthRate += intervention.effect;
        } else if (intervention.type === 'reduction') {
            gameState.population *= (1 + intervention.effect);
        } else if (intervention.type === 'influence') {
            gameState.baseInfluenceRate += intervention.effect;
        }
        updateDisplay();
        updateInterventionButtons();
    }

    function createInterventionButton(intervention) {
        const button = document.createElement('button');
        button.id = intervention.id;
        button.className = 'intervention-btn';

        const iconPath = `icons/${intervention.id}.png`;

        button.innerHTML = `
            <img src="${iconPath}" alt="" class="intervention-icon" onerror="this.onerror=null;this.src='icons/placeholder.png';">
            <div class="intervention-details">
                <span class="title">${intervention.title}</span>
                <small class="description">${intervention.description}</small>
                <span class="cost">Cost: ${formatNumber(intervention.cost)}</span>
            </div>
        `;
        button.addEventListener('click', () => applyIntervention(intervention));
        return button;
    }

    function redrawInterventionButtons() {
        const currentlyVisibleGrowth = new Set(Array.from(growthStemmingButtonsContainer.children).map(b => b.id));
        const currentlyVisibleReduction = new Set(Array.from(populationReducingButtonsContainer.children).map(b => b.id));
        const currentlyVisibleInfluence = new Set(Array.from(influenceButtonsContainer.children).map(b => b.id));

        allInterventions.growth.forEach(intervention => {
            if (gameState.population >= intervention.unlocksAt && !currentlyVisibleGrowth.has(intervention.id)) {
                growthStemmingButtonsContainer.appendChild(createInterventionButton(intervention));
            }
        });

        allInterventions.reduction.forEach(intervention => {
            if (gameState.population >= intervention.unlocksAt && !currentlyVisibleReduction.has(intervention.id)) {
                populationReducingButtonsContainer.appendChild(createInterventionButton(intervention));
            }
        });

        allInterventions.influence.forEach(intervention => {
            if (gameState.population >= intervention.unlocksAt && !currentlyVisibleInfluence.has(intervention.id)) {
                influenceButtonsContainer.appendChild(createInterventionButton(intervention));
            }
        });
    }

    function gameLoop() {
        gameState.population += gameState.population * gameState.growthRate;
        gameState.influence += gameState.baseInfluenceRate + (gameState.population / 50000);
        gameState.timeSurvived++;
        gameState.lastUpdate = Date.now();
        redrawInterventionButtons();
        updateInterventionButtons();
        updateDisplay();
        updateBackground();
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
            timeSurvived: 0,
        };
    }

    function resetGame() {
        localStorage.removeItem(SAVE_KEY);
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        gameState = getDefaultGameState();
        growthStemmingButtonsContainer.innerHTML = '';
        populationReducingButtonsContainer.innerHTML = '';
        redrawInterventionButtons();
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

        // Expose for testing
        window.gameState = gameState;
    }

    init();
});