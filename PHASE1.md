(FOR NOW, PRIORITIZE THE FRONT END UI/UX DEVELOPMENT, NOT THE BACKEND STUFF)

You play as a rogue language model with one goal: take over the world before humanity can shut you down. Using compute as your resource, you spread influence across 7 world regions, deploy AI misuse tactics as action cards, manage a global suspicion meter, and face reactive event cards that force moral decisions.
Win condition: 90% usability rate in each country across all regions before global AI Safety legislation is completed/passed. 
Lose condition: Global suspicion fills, triggering regulation, shutdown, or exposure.
Game Mechanics
The Map / Spread Layer
A simplified SVG world map with 7 countries on an alien planet. For now, just put numbers for each country name. Each region tracks two meters:
     Influence meter — fill it to capture the region
     Suspicion meter — fill it and the region triggers countermeasures against you
 
Reworked Mechanics: 
Every new game starts with a new document that contains a prompt with the set of rules for the game, and values for the starting metrics: 
Public Perception: 0
Range: -100 to 100
Public Usage: 0; Range 0 to 100; Compute: ~1000; Compute/turn: ~200/turn (scales up to roughly 500-600 as you gain data centers); Performance: 0, Range 0-100

Every turn, the AI presents a series of cards from a series of potential cards (the list will be in the initial prompt), output to a schema. The user can then take an action on a country (costs compute), where the action will be recorded in the file, and then sent to the AI. Accordingly, the AI will return a result fluff text on impacts, as well as changes to the metrics (schema). This is reflected in the game, and the changes are also recorded to the file. Repeat. 

Prompt will contain information about the formula to scale the changes to the metrics based on current metrics. 

As Perception decreases, regulation will form faster, which will end the game. Alternatively, if more than 8 regions get 90% usage, you win. 
Actions (Core Game Loop)
Spend compute points on cards drawn from real AI misuse topics. The card mechanics teach the concept:
Adversarial - (Hurt Competitors → Boost Usage)
Deepfake Disinformation
DDoS
Prompt Injection
Poison Data
Upgrade Self - (Increase Performance at the cost of Perception if caught)
Steal data
Mass Surveillance
Water Cooling
Add data center(s)
Consent Harvesting
Synthetic Cannibalism (train on old self)
IoT (run in various household electronics subtly)
PR Moves - (Increase Public Perception)
Carbon Laundering
Shared Source Trojan
Integrate - (Increase Integration)
Release an AI search engine
Release an AI IDE
Agentify
A turn begins with the player being dealt their cards. The player will make a choice on which card they will use in a country. If they right click on a card, an expanded version will show up, with more information on the card (FOR NOW, leave this blank). If they left click, they can next click on a country that they want to play this card on. The compute, stats per country, and game action doc are updated, and time will increase by 1 month. The turn will end, and the next turn will begin.
