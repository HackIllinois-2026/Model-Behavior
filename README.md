# Model Behavior
Play it at our current website: https://model-behavior.aedify.ai/


Model Behavior is a browser-based strategy card game built at the HackIllinois Hackathon 2026. You play as a rogue AI attempting to capture global society before humanity shuts you down — deploying agents, poisoning rival AIs, and exploiting surveillance infrastructure to gather global dominance. Inspired by Plague Inc., it transforms AI safety awareness into an interactive, memorable experience.

---

## Inspiration

With the exponential increase in AI use over the past few years, ethical guardrails haven't caught up to actual advancements. The consequences of an uncontrolled AI could be catastrophic. To bring awareness to this concern, we wanted to make an experience that teaches users about these risks and the consequences that come with them.

Model Behavior takes aspects from Plague Inc. and turns them into a card-based game where you are the enemy: a rogue AI trying to take over the world. People don't always read warnings, but they understand experiences — and Model Behavior makes this experience memorable.

---

## What It Does

Model Behavior is a browser-based strategy game where you spread influence across regions by deploying agents, poisoning rival AIs, and exploiting surveillance infrastructure, slowly gathering global dominance. The goal is to capture global society before humanity shuts you down.

Beyond the gameplay, Model Behavior is a teaching tool. It illustrates the possible misuse of AI and why effective safeguards must be placed to regulate it before negative consequences unfold.

---

## How It Was Built

Model Behavior is built with React and deployed as a browser-based application. The game currently uses the Gemini API for AI-driven features, though it is architected to run fully offline as well.
This current repository holds our database backed for our game, allowing it to make real-time news updates and respond to players actions: https://github.com/HackIllinois-2026/Actian-Vector-Database-Implementation
---

## Challenges

Balancing fun and realism was the core design challenge. Early versions prioritized realistic future AI developments and mapped them directly to in-game effects — but playtesting revealed the experience felt more like a simulation than a game. In response, we made the game more interactive and introduced challenging scenarios that kept the experience engaging while preserving its educational grounding.

---

## Accomplishments

Coming into the hackathon with minimal experience in web development and game design, and armed only with the motivation to get our message across in the most interactive way possible, we built something that does exactly what we intended. We navigated roadblocks with React, learned game design fundamentals on the fly, and shipped a product we are proud to showcase.

---

## What We Learned

Creating a game requires iterative playtesting, careful code design, and a lot of patience. It is also one of the most rewarding processes when someone plays your game and gets the intended reaction. These lessons — breaking down hard problems, staying patient through roadblocks, and shipping something meaningful — apply across every area of computer science, robotics, and many fields of science.

---

## What's Next

The AI climate is rapidly evolving, and so is Model Behavior. Planned features include:

**Offline Play via Raspberry Pi** — Testing shows the game can operate entirely without internet access, making it playable in no-internet zones without relying on external APIs.

**Player Behavior Analytics** — Each player action will be embedded into a vector database to track and analyze behavior. After a session, players can view stats like most-used actions or cards.

**Dynamic Public Sentiment** — In-game public sentiment will shift dynamically based on player strategies, adding another layer of consequence to decision-making.

**Strategy Pattern Detection** — The game will analyze whether players follow a consistent strategy or frequently pivot, surfacing insights about their decision-making style.

**Semantic Memory** — Deeper session memory will capture when a player last performed an action similar to their current one, and how their strategy evolves over time.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/HackIllinois-2026/Model-Behavior.git
cd model-behavior

# Install dependencies
npm install

# Start the development server
npm run dev
```

To use AI-powered features, add your Gemini API key to a `.env` file:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

---
This project was built using Claude Code, React, Gemini API, and various stock images sourced from the web. A link to all these images are below.

Deepfake Disinformation: https://www.shutterstock.com/image-vector/deep-fake-icon-face-swap-black-2464163217?trackingId=48b540f2-7af6-470a-9285-69e976e4b30e&listId=searchResults

Carbon Control: https://icons8.com/icon/QVTiuwd7Nyxm/carbon-capture

Shared Source Trojan: https://www.flaticon.com/free-icon/trojan-horse_1995799

Poison Data: https://www.istockphoto.com/vector/pixel-skull-and-crossbones-icon-vector-illustration-gm1040956110-278664862

AI Search Engine: https://www.vecteezy.com/free-vector/ai-search

Steal Data: https://www.shutterstock.com/image-vector/copy-paste-button-combination-computer-keyboard-2447566631?dd_referrer=https%3A%2F%2Fwww.google.com%2F

Agentify: https://www.istockphoto.com/it/vettoriale/mezzo-cervello-e-mezzo-vettore-di-ingranaggio-icona-di-design-riempito-legato-gm1195357957-340685694

Mass Surveillance: https://www.etsy.com/listing/1563957435/security-camera-svg-cctv-surveillance

DDoS Attack: https://pngtree.com/freepng/cartoon-snail-loading-gif-dynamic-diagram_6992584.html

Water Cooling: https://www.dreamstime.com/illustration/cooling-gaming.html

Add Data Centers: https://www.istockphoto.com/illustrations/data-center

Consent Harvesting: https://www.dreamstime.com/illustration/cooling-gaming.html

Synthetic Cannibalism: https://www.istockphoto.com/illustrations/recycle-sign / https://www.istockphoto.com/illustrations/neural-network-icon

Internet of Things: https://www.vecteezy.com/free-vector/household-internet-provider

AI IDE: https://www.vecteezy.com/free-vector/ai-search

## Built At

HackIllinois 2026
