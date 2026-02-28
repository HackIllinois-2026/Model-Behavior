"""
CS 398 - Week 3: Movie Recommender (Starter)

The "LLM Sandwich" pattern (5 layers):
1. INPUT VALIDATION - reject bad input before wasting tokens
2. PROMPT CONSTRUCTION - format the request
3. LLM CALL - the black box you don't control
4. OUTPUT PARSING - extract JSON from response
5. BUSINESS VALIDATION - check output makes sense

Name: Aarsh Mittal
Chosen Domain: Movies
"""

from openai import OpenAI
import json
import re

client = OpenAI(base_url="http://localhost:8080/v1", api_key="not-needed")

# --- LAYER 1: INPUT VALIDATION ---
genre = input("Genre (action/comedy/drama/horror/sci-fi): ")
mood = input("Mood (happy/sad/excited/relaxed): ")


valid_genres = ["action", "comedy", "drama", "horror", "sci-fi"]
if genre.lower() not in valid_genres:
    print(f"Invalid genre! Choose from: {valid_genres}")
    exit()

valid_moods = ["happy", "sad", "excited", "relaxed"]
if mood.lower() not in valid_moods:
    print(f"Invalid mood! Choose from: {valid_moods}")
    exit()

# --- LAYER 2: PROMPT CONSTRUCTION ---
prompt = f"""Recommend 3 {genre} movies for someone feeling {mood}.
Return ONLY a JSON array like this:
[{{"title": "Movie", "year": 2020, "reason": "Why it fits"}}]"""

# --- LAYER 3: LLM CALL ---
response = client.chat.completions.create(
    model="local",
    messages=[{"role": "user", "content": prompt}]
)
raw_output = response.choices[0].message.content

# --- LAYER 4: OUTPUT PARSING ---
match = re.search(r'\[.*\]', raw_output, re.DOTALL)
if match:
    movies = json.loads(match.group())
else:
    print("Could not find JSON in response!")
    exit()

# --- LAYER 5: BUSINESS VALIDATION ---
# TODO: Check that movie years are reasonable
for movie in movies:
    if movie["year"] < 1900 or movie["year"] > 2026:
        print(f"Warning: suspicious year {movie['year']}")

# --- DISPLAY ---
for movie in movies:
    print(f"- {movie['title']} ({movie['year']})")
    print(f"  {movie['reason']}\n")

"""
Example Usage 1:

Genre (action/comedy/drama/horror/sci-fi): drama
Mood (happy/sad/excited/relaxed): excited
- Shang-Chi and the Legend of the Ten Rings (2021)
  This action-packed, visually stunning film combines thrilling drama with a heartfelt story, filled with excitement, adventure, and emotional depth.

- Judas and the Black Messiah (2021)
  This gripping drama explores themes of loyalty, betrayal, and the fight for justice, all wrapped up in a highly exciting narrative that keeps you on the edge of your seat.

- The Trial of the Chicago 7 (2020)
  An exhilarating courtroom drama, this film captures the excitement and energy of the historic 1969 trial, offering a thrilling and thought-provoking experience.

Example Usage 2:

Genre (action/comedy/drama/horror/sci-fi): sci-fi
Mood (happy/sad/excited/relaxed): hhhh
Invalid mood! Choose from: ['happy', 'sad', 'excited', 'relaxed']

Example Usage 3:

Genre (action/comedy/drama/horror/sci-fi): sci-fi
Mood (happy/sad/excited/relaxed): happy
- Dune (2021)
  With its epic storytelling, stunning visuals, and thought-provoking themes, 'Dune' offers a grand adventure that is sure to uplift and captivate someone in a happy mood.

- The Martian (2015)
  This movie is an inspiring and uplifting tale of survival and ingenuity, perfect for sharing the joy of human resilience with friends or family.

- Arrival (2016)
  Arrival presents a beautifully crafted and mind-bending story that explores human connection and the mysteries of the universe, providing a profound and enriching experience.
"""