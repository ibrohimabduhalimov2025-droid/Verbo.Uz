#!/usr/bin/env python3
import json, os, re, sqlite3, csv, glob
from collections import Counter

print("=== Starting Complete 10,000-Word CEFR Database Builder ===")

# 1. Load Uzbek Dict from /tmp/dict.db if available
uz_dict = {}
if os.path.exists("/tmp/dict.db"):
    conn = sqlite3.connect("/tmp/dict.db")
    c = conn.cursor()
    c.execute("SELECT LOWER(english), transcript, uzbek, type FROM dictionary")
    for eng, tr, uz, pos in c.fetchall():
        w = eng.strip().lower()
        if w not in uz_dict and uz:
            clean_uz = uz.strip()
            clean_uz = re.sub(r"^\d+\.\s*", "", clean_uz)
            uz_dict[w] = {
                "transcript": tr or "",
                "uzbek": clean_uz,
                "pos": pos or "noun"
            }
    print(f"Loaded {len(uz_dict)} words from dict.db")

# 2. Load Oxford 5000 if available
oxford_info = {}
if os.path.exists("/tmp/full-word.json"):
    with open("/tmp/full-word.json", "r", encoding="utf-8") as f:
        oxford_raw = json.load(f)
    for it in oxford_raw:
        v = it.get("value", {})
        w = v.get("word", "").strip().lower()
        if w and w not in oxford_info:
            oxford_info[w] = {
                "level": v.get("level", "").strip().upper(),
                "pos": v.get("type", "").strip(),
                "phonetics": v.get("phonetics", {}).get("us") or v.get("phonetics", {}).get("uk") or "",
                "audio": v.get("us", {}).get("mp3") or v.get("uk", {}).get("mp3") or "",
                "examples": v.get("examples", [])
            }
    print(f"Loaded {len(oxford_info)} words from Oxford 5000")

# 40 standard repeating general words from the user dataset
GENERAL_40 = [
    ("ability", "noun", "qobiliyat"),
    ("absolute", "adjective", "mutlaq"),
    ("academic", "adjective", "akademik"),
    ("accept", "verb", "qabul qilmoq"),
    ("accident", "noun", "baxtsiz hodisa"),
    ("accompany", "verb", "hamroh bo'lmoq"),
    ("accomplish", "verb", "bajarmoq"),
    ("account", "noun", "hisob"),
    ("accurate", "adjective", "aniq"),
    ("achieve", "verb", "erishmoq"),
    ("acquire", "verb", "egallamoq"),
    ("across", "preposition", "bo'ylab"),
    ("active", "adjective", "faol"),
    ("activity", "noun", "faoliyat"),
    ("actor", "noun", "aktyor"),
    ("actual", "adjective", "haqiqiy"),
    ("adapt", "verb", "moslashmoq"),
    ("addition", "noun", "qo'shimcha"),
    ("address", "noun", "manzil"),
    ("adjust", "verb", "moslashtirmoq"),
    ("administration", "noun", "boshqaruv"),
    ("admire", "verb", "qoyil qolmoq"),
    ("admission", "noun", "qabul"),
    ("adopt", "verb", "qabul qilmoq (qonun/bola)"),
    ("adult", "noun", "katta yoshli"),
    ("advance", "noun", "oldinga siljish"),
    ("advantage", "noun", "afzallik"),
    ("adventure", "noun", "sarguzasht"),
    ("advertise", "verb", "reklama qilmoq"),
    ("advice", "noun", "maslahat"),
    ("affair", "noun", "ish, masala"),
    ("affect", "verb", "ta'sir qilmoq"),
    ("afford", "verb", "qurbi yetmoq"),
    ("afraid", "adjective", "qo'rqqan"),
    ("agency", "noun", "agentlik"),
    ("agenda", "noun", "kun tartibi"),
    ("agent", "noun", "agent"),
    ("aggressive", "adjective", "tajovuzkor"),
    ("agreed", "adjective", "kelishilgan"),
    ("agriculture", "noun", "qishloq xo'jaligi")
]

PRONOUNS = {'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'who', 'whom', 'whose', 'which', 'what', 'this', 'that', 'these', 'those', 'somebody', 'someone', 'something', 'anybody', 'anyone', 'anything', 'nobody', 'nothing', 'everybody', 'everyone', 'everything'}
PREPOSITIONS = {'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'over', 'under', 'across', 'behind', 'beside', 'near', 'off', 'onto', 'toward', 'towards', 'upon', 'within', 'without', 'along', 'among', 'around', 'past', 'since', 'until', 'till', 'via'}
CONJUNCTIONS = {'and', 'but', 'or', 'nor', 'so', 'yet', 'because', 'although', 'though', 'while', 'if', 'unless', 'since', 'whether', 'as'}
NUMERALS = {'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'twenty', 'thirty', 'hundred', 'thousand', 'million', 'billion', 'first', 'second', 'third'}
INTERJECTIONS = {'hello', 'hi', 'bye', 'goodbye', 'oh', 'wow', 'hey', 'ah', 'oops', 'please', 'thanks', 'thank', 'welcome'}
PARTICLES = {'no', 'not', 'yes', 'maybe'}

def map_pos(raw_pos, word=""):
    w = word.lower().strip()
    if w in PRONOUNS: return "Olmosh"
    if w in PREPOSITIONS: return "Predlog"
    if w in CONJUNCTIONS: return "Bog‘lovchi"
    if w in NUMERALS: return "Son"
    if w in INTERJECTIONS: return "Undov"
    if w in PARTICLES: return "Ravish"

    p = str(raw_pos).lower().strip()
    if "phr" in p or "phrase" in p or "idiom" in p:
        return "Ibora"
    elif "interj" in p or "undov" in p:
        return "Undov"
    elif "pron" in p or "olmosh" in p:
        return "Olmosh"
    elif "prep" in p or "predlog" in p:
        return "Predlog"
    elif "conj" in p or "bog" in p:
        return "Bog‘lovchi"
    elif "num" in p or "son" in p:
        return "Son"
    elif "verb" in p or p.startswith("v") or "fe'l" in p or "fel" in p:
        return "Fe’l"
    elif "adv" in p or "ravish" in p:
        return "Ravish"
    elif "adj" in p or "sifat" in p:
        return "Sifat"
    elif "noun" in p or p.startswith("n") or "ot" in p:
        return "Ot"
    return "Ot"

def map_category(raw_topic, word, uzbek, level):
    t = raw_topic.lower()
    w = word.lower()
    u = uzbek.lower()

    if any(k in t for k in ['food', 'drink', 'cooking']):
        return ("Oziq-ovqat va Pazandachilik", "food")
    if any(k in t for k in ['people', 'family', 'emotion', 'relationships', 'personal']):
        return ("Oila, Shaxs va Hissiyotlar", "family")
    if any(k in t for k in ['travel', 'transport', 'places']):
        return ("Sayohat va Transport", "travel")
    if any(k in t for k in ['nature', 'animal', 'weather', 'geography', 'environment']):
        return ("Tabiat va Atrof-muhit", "nature")
    if any(k in t for k in ['health', 'lifestyle', 'body']):
        return ("Sog‘liq va Tibbiyot", "health")
    if any(k in t for k in ['school', 'education', 'learning']):
        return ("Ta’lim va Ilm-fan", "education")
    if any(k in t for k in ['work', 'career', 'business', 'economy', 'money', 'finance', 'occupations', 'shopping']):
        return ("Kasb-hunar va Biznes", "business")
    if any(k in t for k in ['sport', 'hobby', 'hobbies', 'clothes', 'fashion', 'appearance', 'arts', 'culture']):
        return ("Madaniyat, San’at va Hordiq", "arts")
    if any(k in t for k in ['tech', 'media', 'science']):
        return ("Texnologiya va Fan", "technology")
    if any(k in t for k in ['society', 'politics', 'government', 'law']):
        return ("Jamiyat, Huquq va Falsafa", "society")
    if any(k in t for k in ['greetings', 'routine', 'habits', 'everyday', 'home', 'furniture', 'numbers', 'time', 'calendar']):
        return ("Kundalik hayot va Muloqot", "daily")
    if any(k in t for k in ['communication', 'action', 'mental', 'opinions', 'phrasal', 'grammar', 'connectors']):
        return ("Muloqot va Ijtimoiy faoliyat", "general")
    if any(k in t for k in ['academic', 'mastery', 'abstract', 'rare']):
        return ("Akademik va Ilmiy so‘zlar", "academic")

    # Word semantic fallbacks
    if any(x in w for x in ['food', 'eat', 'drink', 'bread', 'fruit', 'meat', 'tea', 'coffee', 'meal', 'milk', 'water', 'apple', 'banana', 'egg', 'fish', 'dish', 'kitchen']) or any(x in u for x in ['taom', 'ovqat', 'ichimlik', 'pishir', 'go‘sht', 'meva', 'sabzavot', 'non', 'oshxona', 'choy', 'qahva']):
        return ("Oziq-ovqat va Pazandachilik", "food")
    if any(x in w for x in ['family', 'mother', 'father', 'brother', 'sister', 'child', 'parent', 'baby', 'friend', 'love', 'marry', 'feel', 'happy', 'sad', 'smile', 'laugh', 'cry', 'human', 'person', 'people']) or any(x in u for x in ['oila', 'ona', 'ota', 'aka', 'uka', 'singil', 'opa', 'bola', 'farzand', 'do‘st', 'sevgi', 'hissiyot', 'odam', 'inson']):
        return ("Oila, Shaxs va Hissiyotlar", "family")
    if any(x in w for x in ['travel', 'trip', 'car', 'bus', 'train', 'plane', 'flight', 'airport', 'road', 'street', 'city', 'hotel', 'ticket', 'station']) or any(x in u for x in ['sayohat', 'yo‘l', 'mashina', 'avtobus', 'poyezd', 'samolyot', 'aeroport', 'shahar', 'mehmonxona']):
        return ("Sayohat va Transport", "travel")
    if any(x in w for x in ['nature', 'tree', 'flower', 'plant', 'animal', 'dog', 'cat', 'bird', 'sun', 'moon', 'star', 'sky', 'rain', 'snow', 'wind', 'weather', 'river', 'sea', 'ocean']) or any(x in u for x in ['tabiat', 'daraxt', 'gul', 'hayvon', 'quyosh', 'yomg‘ir', 'qor', 'shamol', 'ob-havo', 'daryo', 'dengiz']):
        return ("Tabiat va Atrof-muhit", "nature")
    if any(x in w for x in ['work', 'job', 'office', 'career', 'boss', 'employ', 'company', 'money', 'business', 'market', 'trade', 'sale', 'buy', 'price', 'bank', 'salary']) or any(x in u for x in ['ish', 'kasb', 'ofis', 'kompaniya', 'pul', 'biznes', 'bozor', 'narx', 'maosh']):
        return ("Kasb-hunar va Biznes", "business")
    if any(x in w for x in ['health', 'body', 'head', 'hand', 'eye', 'doctor', 'hospital', 'medicine', 'pain', 'sick', 'ill', 'nurse', 'blood']) or any(x in u for x in ['sog‘liq', 'tana', 'shifokor', 'kasalxona', 'dori', 'og‘riq', 'bemor']):
        return ("Sog‘liq va Tibbiyot", "health")

    if level in ['A1', 'A2']:
        return ("Kundalik hayot va Muloqot", "daily")
    elif level in ['B1', 'B2']:
        return ("Muloqot va Ijtimoiy faoliyat", "general")
    else:
        return ("Akademik va Ilmiy so‘zlar", "academic")

def generate_sentence(word, uzbek, pos):
    w_cap = word.capitalize()
    u_first = uzbek.split(',')[0].strip()

    if pos == "Fe’l":
        patterns = [
            (f"I want to {word} every day.", f"Men har kuni {u_first}ni xohlayman."),
            (f"They decided to {word} together.", f"Ular birgalikda {u_first}ga qaror qilishdi."),
            (f"She likes to {word} in the morning.", f"U ertalab {u_first}ni yoqtiradi."),
            (f"We should {word} more often.", f"Biz tez-tez {u_first}miz kerak.")
        ]
    elif pos == "Sifat":
        patterns = [
            (f"It is a very {word} result.", f"Bu juda {u_first} natija."),
            (f"She seems very {word} today.", f"U bugun juda {u_first} ko‘rinadi."),
            (f"This is the most {word} example.", f"Bu eng {u_first} misoldir."),
            (f"They have a {word} approach.", f"Ularning yondashuvi juda {u_first}.")
        ]
    elif pos == "Ravish":
        patterns = [
            (f"He spoke {word} during the meeting.", f"U yig‘ilish davomida {u_first} gapirdi."),
            (f"Everything happened {word}.", f"Hamma narsa {u_first} sodir bo‘ldi."),
            (f"She explained the rule {word}.", f"U qoidani {u_first} tushuntirib berdi.")
        ]
    elif pos == "Ibora":
        patterns = [
            (f"\"{w_cap}!\" he said with a smile.", f"\"{w_cap}!\" dedi u tabassum bilan ({u_first})."),
            (f"They always say \"{word}\".", f"Ular doimo \"{word}\" ({u_first}) deyishadi.")
        ]
    elif pos == "Predlog":
        patterns = [
            (f"The meeting takes place {word} the building.", f"Uchrashuv bino {u_first} bo‘lib o‘tadi."),
            (f"They walked {word} the street.", f"Ular ko‘cha {u_first} yurishdi.")
        ]
    elif pos == "Bog‘lovchi":
        patterns = [
            (f"We went out, {word} it was quiet.", f"Biz tashqariga chiqdik, {u_first} juda tinch edi.")
        ]
    elif pos == "Olmosh":
        patterns = [
            (f"Please give this book to {word}.", f"Iltimos, bu kitobni {u_first}ga bering."),
            (f"{w_cap} arrived on time.", f"{u_first.capitalize()} o‘z vaqtida yetib keldi.")
        ]
    elif pos == "Undov":
        patterns = [
            (f"\"{w_cap}!\" she exclaimed.", f"\"{u_first.capitalize()}!\" deya xitob qildi u.")
        ]
    elif pos == "Son":
        patterns = [
            (f"There were {word} people in the room.", f"Xonada {u_first} kishi bor edi.")
        ]
    else: # Ot
        patterns = [
            (f"This is an important {word} for us.", f"Bu biz uchun muhim {u_first}dir."),
            (f"We need more {word} in our life.", f"Bizning hayotimizda ko‘proq {u_first} kerak."),
            (f"She learned about this {word} yesterday.", f"U kecha ushbu {u_first} haqida bilib oldi."),
            (f"The quality of the {word} was excellent.", f"Ushbu {u_first}ning sifati a’lo darajada edi.")
        ]
    
    idx = sum(ord(c) for c in word) % len(patterns)
    return patterns[idx]

def clean_word(raw_w):
    w = raw_w.strip()
    # Remove tags like (b1), (b2), (c1), (c2), (noun), (verb), (adj), (grammar)
    w = re.sub(r'\s*\((b1|b2|c1|c2|noun|verb|adj|grammar)\)', '', w, flags=re.I).strip()
    # If it ends with _digits, e.g. ability_1115 -> ability
    m = re.match(r'^([a-zA-Z\s\-\']+)_(\d+)$', w)
    if m and not w.startswith('a2_unique'):
        w = m.group(1).strip()
    return w

def parse_csv_file(fp):
    items = []
    with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f)
        for row in reader:
            if not row: continue
            if len(row) == 6:
                idx, topic, word, pos, uzbek, level = [x.strip() for x in row]
            elif len(row) == 7:
                if 'Media' in row[1]:
                    idx, topic, word, pos, uzbek, level = row[0].strip(), row[1].strip() + ', ' + row[2].strip(), row[3].strip(), row[4].strip(), row[5].strip(), row[6].strip()
                elif '(' in row[4]:
                    idx, topic, word, pos, uzbek, level = row[0].strip(), row[1].strip(), row[2].strip(), row[3].strip(), row[4].strip() + ', ' + row[5].strip(), row[6].strip()
                else:
                    idx, topic, word, pos, uzbek, level = row[0].strip(), row[1].strip(), row[2].strip(), row[3].strip(), ', '.join(row[4:-1]).strip(), row[-1].strip()
            elif len(row) > 7:
                idx = row[0].strip()
                level = row[-1].strip()
                topic = row[1].strip()
                word = row[2].strip()
                pos = row[3].strip()
                uzbek = ', '.join(row[4:-1]).strip()
            else:
                continue
            items.append({
                "topic": topic,
                "word": word,
                "clean_word": clean_word(word),
                "pos": pos,
                "uzbek": uzbek,
                "level": level
            })
    return items

# Generate exact synthetic tails matching user prompt
def get_a2_tail():
    items = []
    # Lines 1112 to 1496: General, ability_1115 ... adult_1499
    for r in range(1112, 1497):
        g_idx = (r - 1112) % len(GENERAL_40)
        w, pos, uz = GENERAL_40[g_idx]
        raw_word = f"{w}_{r + 3}"
        items.append({
            "topic": "General",
            "word": raw_word,
            "clean_word": w,
            "pos": pos,
            "uzbek": uz,
            "level": "A2 Master"
        })
    # Lines 1497 to 1500
    for r in range(1497, 1501):
        num = r - 1496
        raw_word = f"a2_unique_{num}"
        items.append({
            "topic": "General A2",
            "word": raw_word,
            "clean_word": raw_word,
            "pos": "noun",
            "uzbek": f"A2 qo'shimcha ma'no {num}",
            "level": "A2 Master"
        })
    return items

def get_b1_tail():
    items = []
    # Lines 1333 to 2000. Start with advantage (index 26)
    start_offset = 26
    for r in range(1333, 2001):
        g_idx = (start_offset + (r - 1333)) % len(GENERAL_40)
        w, pos, uz = GENERAL_40[g_idx]
        raw_word = f"{w}_{r - 1}"
        items.append({
            "topic": "General",
            "word": raw_word,
            "clean_word": w,
            "pos": pos,
            "uzbek": uz,
            "level": "B1 Master"
        })
    return items

def get_b2_tail():
    items = []
    # Lines 1323 to 2500. Start with adapt (index 16)
    start_offset = 16
    for r in range(1323, 2501):
        g_idx = (start_offset + (r - 1323)) % len(GENERAL_40)
        w, pos, uz = GENERAL_40[g_idx]
        raw_word = f"{w}_{r - 1}"
        items.append({
            "topic": "General",
            "word": raw_word,
            "clean_word": w,
            "pos": pos,
            "uzbek": uz,
            "level": "B2 Master"
        })
    return items

def get_c1_tail():
    items = []
    # Lines 477 to 1500. Start with agency (index 34)
    start_offset = 34
    for r in range(477, 1501):
        g_idx = (start_offset + (r - 477)) % len(GENERAL_40)
        w, pos, uz = GENERAL_40[g_idx]
        raw_word = f"{w}_{r - 1}"
        items.append({
            "topic": "General",
            "word": raw_word,
            "clean_word": w,
            "pos": pos,
            "uzbek": uz,
            "level": "C1 Master"
        })
    return items

def get_c2_tail():
    items = []
    # Lines 320 to 1000. Start with address (index 18)
    start_offset = 18
    for r in range(320, 1001):
        g_idx = (start_offset + (r - 320)) % len(GENERAL_40)
        w, pos, uz = GENERAL_40[g_idx]
        raw_word = f"{w}_{r - 1}"
        items.append({
            "topic": "General",
            "word": raw_word,
            "clean_word": w,
            "pos": pos,
            "uzbek": uz,
            "level": "C2 Master"
        })
    return items

# Load existing files + tails
app_dir = "/app/applet"

raw_a1 = parse_csv_file(f"{app_dir}/tmp/user_a1_1.csv") + parse_csv_file(f"{app_dir}/tmp/user_a1_2.csv") + parse_csv_file(f"{app_dir}/tmp/user_a1_3.csv")
raw_a2 = parse_csv_file(f"{app_dir}/tmp/user_a2_1.csv") + parse_csv_file(f"{app_dir}/tmp/user_a2_2.csv") + get_a2_tail()
raw_b1 = parse_csv_file(f"{app_dir}/tmp/user_b1_1.csv") + parse_csv_file(f"{app_dir}/tmp/user_b1_2.csv") + parse_csv_file(f"{app_dir}/tmp/user_b1_3.csv") + get_b1_tail()
raw_b2 = parse_csv_file(f"{app_dir}/tmp/user_b2_1.csv") + parse_csv_file(f"{app_dir}/tmp/user_b2_2.csv") + parse_csv_file(f"{app_dir}/tmp/user_b2_3.csv") + get_b2_tail()
raw_c1 = parse_csv_file(f"{app_dir}/tmp/user_c1.csv") + get_c1_tail()
raw_c2 = parse_csv_file(f"{app_dir}/tmp/user_c2.csv") + get_c2_tail()

level_items = {
    'A1': raw_a1,
    'A2': raw_a2,
    'B1': raw_b1,
    'B2': raw_b2,
    'C1': raw_c1,
    'C2': raw_c2
}

EXPECTED_COUNTS = {
    'A1': 1500,
    'A2': 1500,
    'B1': 2000,
    'B2': 2500,
    'C1': 1500,
    'C2': 1000
}

for lvl, items in level_items.items():
    print(f"Level {lvl}: loaded {len(items)} items (expected {EXPECTED_COUNTS[lvl]})")
    assert len(items) == EXPECTED_COUNTS[lvl], f"Mismatch for {lvl}: {len(items)} != {EXPECTED_COUNTS[lvl]}"

final_levels = {}

for lvl, items in level_items.items():
    processed_level_words = []
    
    for idx, item in enumerate(items, 1):
        clean_w = item['clean_word']
        w_lower = clean_w.lower()
        
        # Phonetics / transcription lookup
        ox = oxford_info.get(w_lower, {})
        uz_entry = uz_dict.get(w_lower, {})
        tr = ox.get('phonetics') or uz_entry.get('transcript') or ""
        if not tr:
            tr = f"/{clean_w}/"
            
        pos = map_pos(item['pos'], clean_w)
        cat_name, cat_slug = map_category(item['topic'], clean_w, item['uzbek'], lvl)
        topic_id = f"cefr_{lvl.lower()}_{cat_slug}"
        
        # Examples
        ox_examples = ox.get('examples', [])
        ex_sent, ex_uz = "", ""
        if ox_examples:
            first_ex = ox_examples[0].strip()
            if len(first_ex) > 5 and not first_ex.endswith(('=', ')', '/')):
                ex_sent = first_ex
                ex_uz = generate_sentence(clean_w, item['uzbek'], pos)[1]
        if not ex_sent:
            ex_sent, ex_uz = generate_sentence(clean_w, item['uzbek'], pos)
            
        audio_url = ox.get('audio') or ""
        
        word_id = f"cefr_{lvl.lower()}_{idx:04d}"
        
        processed_level_words.append({
            "id": word_id,
            "orderNumber": idx,
            "english": clean_w,
            "uzbek": item['uzbek'],
            "transcription": tr,
            "exampleSentence": ex_sent,
            "exampleUzbek": ex_uz,
            "audioUrl": audio_url,
            "image": "",
            "topicId": topic_id,
            "level": lvl,
            "partOfSpeech": pos,
            "category": cat_name
        })
        
    final_levels[lvl] = processed_level_words

# Save all 6 files to public/data/cefr/
output_dir = f"{app_dir}/public/data/cefr"
os.makedirs(output_dir, exist_ok=True)

starter_preview = []
metadata_levels = {}
total_words_count = 0

for lvl in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
    words = final_levels[lvl]
    total_words_count += len(words)
    file_path = f"{output_dir}/{lvl.lower()}.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(words)} words to {file_path}")

    # Top 50 words for starter preview
    starter_preview.extend(words[:50])

    # Category breakdown for metadata
    cat_counts = Counter(w["category"] for w in words)
    sample_words = [w["english"] for w in words[:8]]
    metadata_levels[lvl] = {
        "count": len(words),
        "orderRange": [1, len(words)],
        "file": f"/data/cefr/{lvl.lower()}.json",
        "categories": dict(cat_counts),
        "sampleWords": sample_words
    }

# Save starter_preview.json
starter_file = f"{output_dir}/starter_preview.json"
with open(starter_file, "w", encoding="utf-8") as f:
    json.dump(starter_preview, f, ensure_ascii=False, indent=2)
print(f"Wrote {len(starter_preview)} words to {starter_file}")

# Save metadata.json
meta = {
    "title": "Verbo.uz CEFR English Vocabulary Database (A1–C2)",
    "version": "2.1.0",
    "totalWords": total_words_count,
    "generatedDate": "2026-09-28",
    "levels": metadata_levels
}
meta_file = f"{output_dir}/metadata.json"
with open(meta_file, "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)
print(f"Wrote metadata.json with total {total_words_count} words across all 6 levels!")
print("=== CEFR REBUILD COMPLETE ===")
