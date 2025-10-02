# html5_population_game
# 🌍 The Population Project: Game Brief

## 1. Overview

**Goal:** To create a mobile-first HTML5 idle game where the player must manage and contain a constantly increasing global population to prevent the catastrophic failure of the planet due to **Unsustainability**. The game should combine strategic decision-making with incremental idle progress.

**Platform:** Mobile-friendly HTML5 / Web-App.

## 2. Core Game Mechanics

The player acts as a shadowy global manager, implementing controversial and drastic measures to manipulate the global population figures.

### Core Loop

1.  **Population Ticker:** The population increases automatically and **exponentially** over time.
2.  **Currency Generation (Idle):** A primary currency (e.g., **Influence** or **Funding**) is generated passively (idle income) and is used to purchase interventions.
3.  **Interventions:** The player spends the currency to implement **Growth-Stemming** or **Population-Reducing** options.
4.  **Progression:** New, more powerful options unlock based on **time played**, **current population milestones**, or the total number of previous interventions used.

### Game State & Constraints

| Metric | Value | Notes |
| :--- | :--- | :--- |
| **Starting Population** | 20,000 | The baseline population at the start of the game. |
| **Unsustainability Threshold** | 16,000,000,000 (16 Billion) | Reaching this number triggers an immediate **Game Over**. |

---

## 3. Intervention Categories

Interventions are the core actions. They have an initial **cost** (in currency) and provide an **effect** (either a percentage change to the growth rate or a flat population reduction).

### A. Growth-Stemming Interventions (Preventative)

These actions apply a permanent, stacking **percentage reduction** to the population growth rate. They slow down the speed at which the population increases.

| Example Intervention | Currency Cost | Effect |
| :--- | :--- | :--- |
| Global Birth Control Initiative | Low | -0.5% to Growth Rate |
| Vaccine Conspiracy Campaign | Medium | -1.5% to Growth Rate |
| Advanced Education Access | High | -3.0% to Growth Rate |

### B. Population-Reducing Interventions (Reactive)

These actions provide a one-time, flat reduction in the current population count. The reduction effect should be based on a percentage of the *current population*.

| Example Intervention | Currency Cost | Effect |
| :--- | :--- | :--- |
| Limited Civil War | Low | -0.01% of Current Population |
| Introduction of Novel Virus | Medium | -1.0% of Current Population |
| AI Decimation Protocol | Very High | -25% of Current Population |

---

## 4. Design & Technical Requirements

* **Mobile Optimisation:** UI must be clean, high-contrast, and fully functional for single-handed play (thumb accessibility).
* **Persistent Save:** Utilise **Local Storage** to ensure the game state is saved between sessions, supporting true idle progression.
* **UI Focus:** Prominently display the three core numbers: **Current Population**, **Growth Rate**, and **Current Currency**.
* **Progression Tiers:** New intervention tiers should unlock as population crosses major milestones (e.g., 1 Million, 1 Billion).
