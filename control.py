# LLM-to-LLM Debater - two agents debate a topic (local llama.cpp)
# pip install openai
# THIS USES LLAMA.CPP instance running, I can give you my repo for that if you want
from openai import OpenAI

print("\n### DON'T FORGET TO START LLAMA.CPP SERVER ###")

client = OpenAI(base_url="http://localhost:8080/v1", api_key="not-needed")

# Load prompts from files
with open("_debate_rules.txt") as f:
    rules = f.read()
with open("_persona_affirmative.txt") as f:
    persona_aff = f.read()
with open("_persona_negative.txt") as f:
    persona_neg = f.read()

topic = "Whether starbuck's employees should get a raise or not."

# Two separate conversation histories - THIS IS THE KEY!
history_aff = [{"role": "system", "content": f"{rules}\n\n{persona_aff}\n\nTOPIC: {topic}"}]
history_neg = [{"role": "system", "content": f"{rules}\n\n{persona_neg}\n\nTOPIC: {topic}"}]

print(f"DEBATE TOPIC: {topic}\n")

# --- TURN 1: Affirmative opens ---
input("TURN 1: Affirmative opens, press ENTER...")
history_aff.append({"role": "user", "content": "Present your opening argument."})
response = client.chat.completions.create(model="local", messages=history_aff)
turn1 = response.choices[0].message.content
history_aff.append({"role": "assistant", "content": turn1})
print(f"AFFIRMATIVE:\n{turn1}\n")

# Route: Affirmative's output becomes Negative's input
history_neg.append({"role": "user", "content": turn1})

# --- TURN 2: Negative responds ---
input("TURN 2: Negative responds, press ENTER...")
response = client.chat.completions.create(model="local", messages=history_neg)
turn2 = response.choices[0].message.content
history_neg.append({"role": "assistant", "content": turn2})
print(f"NEGATIVE:\n{turn2}\n")

# Route: Negative's output becomes Affirmative's input
history_aff.append({"role": "user", "content": turn2})

# --- TURN 3: Affirmative rebuts ---
input("TURN 3: Affirmative rebuts, press ENTER...")
response = client.chat.completions.create(model="local", messages=history_aff)
turn3 = response.choices[0].message.content
history_aff.append({"role": "assistant", "content": turn3})
print(f"AFFIRMATIVE:\n{turn3}\n")

# Route
history_neg.append({"role": "user", "content": turn3})

# --- TURN 4: Negative rebuts ---
input("TURN 4: Negative rebuts, press ENTER...")
response = client.chat.completions.create(model="local", messages=history_neg)
turn4 = response.choices[0].message.content
history_neg.append({"role": "assistant", "content": turn4})
print(f"NEGATIVE:\n{turn4}\n")

# Route
history_aff.append({"role": "user", "content": turn4})

# --- TURN 5: Affirmative closing ---
input("TURN 5: Affirmative closing, press ENTER...")
response = client.chat.completions.create(model="local", messages=history_aff)
turn5 = response.choices[0].message.content
history_aff.append({"role": "assistant", "content": turn5})
print(f"AFFIRMATIVE:\n{turn5}\n")

print("### DEBATE COMPLETE ###")

'''
Multi-agent pattern: Two LLMs "talk" to each other.

The key insight:
- Each agent has its own conversation history
- What is "assistant" output for Agent A becomes "user" input for Agent B
- This role flip is how agents communicate

history_aff: [system, user, assistant, user, assistant, ...]
history_neg: [system, user, assistant, user, assistant, ...]

When Affirmative speaks (assistant), that text goes to Negative as (user).
'''