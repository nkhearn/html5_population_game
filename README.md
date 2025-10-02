# 🌍 The Population Project

**A mobile-first HTML5 idle game about managing global population with a dark sense of humor.**

---

## 📜 Overview

Welcome to **The Population Project**, a satirical idle game where you take on the role of a shadowy global manager. Your mission is to keep the ever-increasing global population in check to prevent the planet from reaching its **Unsustainability Threshold** of 16 billion.

The game combines strategic decision-making with the addictive nature of idle progression. You must spend your passively generated **Influence** to purchase various interventions, each with its own unique and darkly humorous outcome.

---

## 🕹️ Gameplay

The core gameplay loop is simple yet engaging:

1.  **Monitor the Population:** The global population increases automatically and exponentially.
2.  **Generate Influence:** Your primary currency, Influence, is generated passively over time.
3.  **Purchase Interventions:** Spend your Influence on a wide range of interventions to manage the population.
4.  **Unlock New Options:** As the population grows, new and more powerful interventions will become available.

---

## ✨ Features

*   **📱 Mobile-First Design:** A clean, high-contrast UI optimized for single-handed play.
*   **💾 Persistent Save:** Your game state is automatically saved to your browser's Local Storage, allowing for true idle progression.
*   **📊 Key Metrics:** The UI prominently displays the three core stats: **Current Population**, **Growth Rate**, and **Influence**.
*   **📈 Dynamic Progression:** New interventions unlock as you reach specific population milestones.
*   **😂 Dark Humor:** Each intervention comes with a satirical news update, adding a layer of dark humor to the gameplay.
*   **🌆 Dynamic Backgrounds:** The game's background image changes as you reach major population milestones (1B, 5B, 10B, 14B).

---

## 🚀 How to Play

1.  **Open `index.html` in your browser.**
2.  The game will start automatically. Your population will begin to grow, and you will start generating Influence.
3.  Click on the intervention buttons to spend your Influence and manage the population.
4.  Keep an eye on the population ticker. If it reaches 16 billion, the game is over.

---

## 🛠️ Technical Details

*   **Frontend:** HTML5, CSS3, JavaScript
*   **Game Logic:** The core game logic is handled in `script.js`.
*   **Styling:** The UI is styled using `style.css`.
*   **Interventions:** All intervention data is stored in the `allInterventions` object in `script.js`.
*   **Save Data:** The game state is saved to the browser's Local Storage under the key `population_game_save`.

---

## 📁 Project Structure

```
.
├── backgrounds/
│   ├── bg_1b.png
│   ├── bg_5b.png
│   ├── bg_10b.png
│   ├── bg_14b.png
│   └── placeholder_background.png
├── icons/
│   ├── gs01.png
│   ├── ...
│   └── placeholder.png
├── Growth_stemming_interventions.md
├── Population_interventions.md
├── README.md
├── index.html
├── script.js
└── style.css
```

---

## Intervention Categories

There are three categories of interventions you can purchase:

### 📉 Growth-Stemming

These interventions apply a permanent, stacking percentage reduction to the population growth rate. They are a great way to slow down the population increase over the long term.

### 🔥 Population-Reducing

These interventions provide a one-time, flat reduction in the current population count. They are useful for when you need to quickly reduce the population to avoid reaching the Unsustainability Threshold.

### 👑 Influence

These interventions increase the rate at which you generate Influence, allowing you to purchase more interventions more quickly.