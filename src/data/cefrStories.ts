// Auto-generated CEFR Topic Stories with 100% vocabulary coverage
// All 500 words of CEFR A1 are incorporated into these topic stories.

export interface StoryWordAnnotation {
  id: string;
  english: string;
  uzbek: string;
  transcription: string;
  partOfSpeech: string;
  level: string;
}

export interface StoryChapter {
  num: number;
  title: string;
  titleUz: string;
  words: StoryWordAnnotation[];
  paragraphs: string[];
  paragraphsUz: string[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanationUz: string;
  }[];
}

export interface CefrTopicStory {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topicCategory: string;
  topicEmoji: string;
  title: string;
  titleUz: string;
  duration: string;
  summaryUz: string;
  totalWordsInTopic: number;
  coveragePercent: number;
  chapters?: StoryChapter[];
  paragraphs: string[];
  paragraphsUz: string[];
  vocabulary: StoryWordAnnotation[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanationUz: string;
  }[];
}

export const CEFR_TOPIC_STORIES: CefrTopicStory[] = [
  {
    "id": "story_a1_daily_full",
    "level": "A1",
    "topicCategory": "Kundalik hayot va Muloqot",
    "topicEmoji": "💬",
    "title": "A Day in the Life: The Complete Tashkent Journey",
    "titleUz": "Hayotdan bir kun: Katta Toshkent sayohati (10 ta bob)",
    "duration": "15 daqiqa (10 bob)",
    "summaryUz": "Ushbu katta seriyali hikoya A1 darajasidagi \"Kundalik hayot va Muloqot\" mavzusining barcha 360 ta CEFR so‘zini to‘liq o‘z ichiga oladi.",
    "totalWordsInTopic": 360,
    "coveragePercent": 100,
    "chapters": [
      {
        "num": 1,
        "title": "Morning in the Household",
        "titleUz": "Xonadondagi ertalabki uyg‘onish",
        "words": [
          {
            "id": "cefr_a1_0001",
            "english": "i",
            "uzbek": "men",
            "transcription": "/aɪ/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0002",
            "english": "at",
            "uzbek": "yonida",
            "transcription": "/æt/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0003",
            "english": "be",
            "uzbek": "bo'lmoq",
            "transcription": "/biː/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0004",
            "english": "do",
            "uzbek": "qilmoq",
            "transcription": "/duː/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0005",
            "english": "he",
            "uzbek": "u",
            "transcription": "/hiː/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0006",
            "english": "hi",
            "uzbek": "salom",
            "transcription": "/haɪ/",
            "partOfSpeech": "Undov",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0007",
            "english": "if",
            "uzbek": "agar",
            "transcription": "/ɪf/",
            "partOfSpeech": "Bog‘lovchi",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0008",
            "english": "in",
            "uzbek": "ichkarida",
            "transcription": "/ɪn/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0009",
            "english": "me",
            "uzbek": "meni",
            "transcription": "/miː/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0010",
            "english": "my",
            "uzbek": "mening",
            "transcription": "/maɪ/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0011",
            "english": "no",
            "uzbek": "toshko'mir koni",
            "transcription": "/nəʊ/",
            "partOfSpeech": "Ravish",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0012",
            "english": "of",
            "uzbek": "ning",
            "transcription": "/ʌv/",
            "partOfSpeech": "Bog‘lovchi",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0013",
            "english": "oh",
            "uzbek": "voy",
            "transcription": "/əʊ/",
            "partOfSpeech": "Undov",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0014",
            "english": "ok",
            "uzbek": "yaxshi",
            "transcription": "/əʊˈkeɪ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0015",
            "english": "on",
            "uzbek": "ustida",
            "transcription": "/ɑːn/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0016",
            "english": "or",
            "uzbek": "yoki",
            "transcription": "/ɔːr/",
            "partOfSpeech": "Bog‘lovchi",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0017",
            "english": "so",
            "uzbek": "shunday",
            "transcription": "/səʊ/",
            "partOfSpeech": "Bog‘lovchi",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0018",
            "english": "to",
            "uzbek": "ga",
            "transcription": "/tuː/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0019",
            "english": "tv",
            "uzbek": "televizor",
            "transcription": "/ˌtiː ˈviː/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0021",
            "english": "us",
            "uzbek": "bizni",
            "transcription": "/ʌs/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0022",
            "english": "we",
            "uzbek": "biz",
            "transcription": "/wiː/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0023",
            "english": "add",
            "uzbek": "qo'shmoq",
            "transcription": "/æd/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0024",
            "english": "age",
            "uzbek": "yosh",
            "transcription": "/eɪdʒ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0025",
            "english": "ago",
            "uzbek": "oldin",
            "transcription": "/əˈɡəʊ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0026",
            "english": "air",
            "uzbek": "havo",
            "transcription": "/er/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0027",
            "english": "and",
            "uzbek": "va",
            "transcription": "/ænd/",
            "partOfSpeech": "Bog‘lovchi",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0028",
            "english": "arm",
            "uzbek": "qo'l",
            "transcription": "/ɑːrm/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0030",
            "english": "ask",
            "uzbek": "so'ramoq",
            "transcription": "/æsk/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0031",
            "english": "bad",
            "uzbek": "yomon",
            "transcription": "/bæd/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0032",
            "english": "bed",
            "uzbek": "karavot",
            "transcription": "/bed/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0033",
            "english": "big",
            "uzbek": "katta",
            "transcription": "/bɪɡ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0034",
            "english": "box",
            "uzbek": "quti",
            "transcription": "/bɑːks/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0037",
            "english": "but",
            "uzbek": "lekin",
            "transcription": "/bʌt/",
            "partOfSpeech": "Bog‘lovchi",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0039",
            "english": "bye",
            "uzbek": "xayr",
            "transcription": "/baɪ/",
            "partOfSpeech": "Undov",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0042",
            "english": "cow",
            "uzbek": "sigir",
            "transcription": "/kaʊ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0043",
            "english": "cup",
            "uzbek": "chashka",
            "transcription": "/kʌp/",
            "partOfSpeech": "Ot",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "Hi! I am in my warm bed at home, and the fresh morning air feels so good to us.",
          "My dad says, \"Oh, it is time to be awake, do your exercises, and ask us if you want to add a cup of warm tea or milk.\"",
          "We see a big box on the floor, but he says, \"No, do not open it, it is a gift from a friend of my age two days ago.\"",
          "He checks his arm, turns on the TV, and tells me, \"It is OK, nothing is bad today, we can watch the black and white cow in the green field before we say bye to everyone.\""
        ],
        "paragraphsUz": [
          "Salom! Men uyda iliq to‘shagimdaman va tonggi toza havo bizga juda yoqimli sezilmoqda.",
          "Otam: \"Voy, uyg‘onish, mashqlarni bajarish va agar xohlasang, bizdan bir chashka choy yoki sut qo‘shishni so‘rash vaqti bo‘ldi\", dedilar.",
          "Biz polda katta qutini ko‘rdik, lekin u: \"Yo‘q, uni ochma, bu ikki kun oldin mening yoshimdagi do‘stimdan kelgan sovg‘a\", dedi.",
          "U qo‘lini tekshirdi, televizorni yoqdi va menga: \"Hammasi yaxshi, bugun hech narsa yomon emas, hammaga xayr deyishdan oldin daladagi sigirni tomosha qilishimiz mumkin\", dedi."
        ],
        "questions": [
          {
            "question": "Where is the storyteller in the morning?",
            "options": [
              "In a warm bed at home",
              "At the airport",
              "In a restaurant",
              "On a mountain"
            ],
            "correctIndex": 0,
            "explanationUz": "Hikoyachi ertalab o‘zining uyidagi iliq to‘shagida ekanini aytadi."
          }
        ]
      },
      {
        "num": 2,
        "title": "A Busy Day at the Fitness Gym",
        "titleUz": "Fitnes zalidagi qizg‘in kun",
        "words": [
          {
            "id": "cefr_a1_0044",
            "english": "dad",
            "uzbek": "dada",
            "transcription": "/dæd/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0045",
            "english": "day",
            "uzbek": "kun",
            "transcription": "/deɪ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0048",
            "english": "ear",
            "uzbek": "quloq",
            "transcription": "/ɪr/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0051",
            "english": "end",
            "uzbek": "oxir",
            "transcription": "/end/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0053",
            "english": "fat",
            "uzbek": "semiz",
            "transcription": "/fæt/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0054",
            "english": "few",
            "uzbek": "ozgina",
            "transcription": "/fjuː/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0055",
            "english": "for",
            "uzbek": "uchun",
            "transcription": "/fɔːr/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0056",
            "english": "get",
            "uzbek": "olmoq",
            "transcription": "/ɡet/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0057",
            "english": "gym",
            "uzbek": "gimnastika",
            "transcription": "/dʒɪm/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0058",
            "english": "hat",
            "uzbek": "qalpoq",
            "transcription": "/hæt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0059",
            "english": "her",
            "uzbek": "uni",
            "transcription": "/hɜːr/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0060",
            "english": "hey",
            "uzbek": "hey",
            "transcription": "/heɪ/",
            "partOfSpeech": "Undov",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0061",
            "english": "him",
            "uzbek": "uni",
            "transcription": "/ɪm/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0062",
            "english": "his",
            "uzbek": "uning",
            "transcription": "/ɪz/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0063",
            "english": "hot",
            "uzbek": "issiq",
            "transcription": "/hɑːt/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0064",
            "english": "how",
            "uzbek": "qanday",
            "transcription": "/haʊ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0065",
            "english": "ice",
            "uzbek": "muz",
            "transcription": "/aɪs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0066",
            "english": "its",
            "uzbek": "uning",
            "transcription": "/ɪts/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0068",
            "english": "key",
            "uzbek": "kalit",
            "transcription": "/kiː/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0069",
            "english": "leg",
            "uzbek": "oyoq",
            "transcription": "/leɡ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0070",
            "english": "let",
            "uzbek": "ruxsat bermoq",
            "transcription": "/let/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0071",
            "english": "lot",
            "uzbek": "bir necha",
            "transcription": "/lɑːt/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0074",
            "english": "may",
            "uzbek": "/meɪ/",
            "transcription": "/meɪ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0076",
            "english": "new",
            "uzbek": "yangi",
            "transcription": "/nuː/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0077",
            "english": "not",
            "uzbek": "emas",
            "transcription": "/nɑːt/",
            "partOfSpeech": "Ravish",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0078",
            "english": "now",
            "uzbek": "hozir",
            "transcription": "/naʊ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0079",
            "english": "off",
            "uzbek": "uzoq masofasini bildiradi",
            "transcription": "/ɔːf/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0080",
            "english": "old",
            "uzbek": "yosh",
            "transcription": "/əʊld/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0081",
            "english": "one",
            "uzbek": "bir",
            "transcription": "/wʌn/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0082",
            "english": "our",
            "uzbek": "bizning",
            "transcription": "/ˈaʊər/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0083",
            "english": "out",
            "uzbek": "tashqari",
            "transcription": "/aʊt/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0084",
            "english": "own",
            "uzbek": "o'zining",
            "transcription": "/əʊn/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0086",
            "english": "pig",
            "uzbek": "cho'chqa",
            "transcription": "/pɪɡ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0087",
            "english": "put",
            "uzbek": "qo'ymoq",
            "transcription": "/pʊt/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0088",
            "english": "red",
            "uzbek": "qizil",
            "transcription": "/red/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0091",
            "english": "see",
            "uzbek": "ko'rmoq",
            "transcription": "/siː/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "Hey! On this hot day, my dad put on his red hat and took his old car key to go out.",
          "\"Let him get his own workout, and take off for our new gym now,\" said her brother with a smile.",
          "At the gym, how can one lose fat in a few weeks? A trainer tells him not to hurt his leg or ear, and to see how its modern machines work.",
          "By the end of the hour, a lot of cold ice water helped them cool down, and they saw a picture of a pink pig on the wall. \"You may rest now!\" said the coach."
        ],
        "paragraphsUz": [
          "Hoy! Ushbu issiq kunda otam qizil shlyapasini kiydi va tashqariga chiqish uchun eski mashina kalitini oldi.",
          "\"U o‘z mashg‘ulotini qilsin va hoziroq yangi sport zalimizga jo‘nasin\", dedi uning ukasi tabassum bilan.",
          "Zalda inson bir necha hafta ichida qanday qilib yog‘dan xalos bo‘lishi mumkin? Murabbiy unga oyog‘i yoki qulog‘ini shikastlamaslikni va uning trenajyorlari qanday ishlashini ko‘rishni tushuntirdi.",
          "Soat oxiriga kelib, ko‘p muzdek sovuq suv ularga tetiklashishga yordam berdi va devorda cho‘chqaning kulgili suratini ko‘rishdi. \"Endi dam olishingiz mumkin!\" dedi murabbiy."
        ],
        "questions": [
          {
            "question": "What helped them cool down at the gym?",
            "options": [
              "Hot soup",
              "Cold ice water",
              "Warm coffee",
              "Running fast"
            ],
            "correctIndex": 1,
            "explanationUz": "Zaldagi mashg‘ulotdan so‘ng muzdek sovuq suv tetiklashishga yordam berdi."
          }
        ]
      },
      {
        "num": 3,
        "title": "Meeting Near the City Cafe",
        "titleUz": "Shahar kafesi yonidagi uchrashuv",
        "words": [
          {
            "id": "cefr_a1_0092",
            "english": "she",
            "uzbek": "u",
            "transcription": "/ʃiː/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0093",
            "english": "sit",
            "uzbek": "o'tirmoq",
            "transcription": "/sɪt/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0094",
            "english": "six",
            "uzbek": "olti",
            "transcription": "/sɪks/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0098",
            "english": "ten",
            "uzbek": "o'n",
            "transcription": "/ten/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0099",
            "english": "the",
            "uzbek": "the",
            "transcription": "/ðiː/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0100",
            "english": "too",
            "uzbek": "juda",
            "transcription": "/tuː/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0101",
            "english": "two",
            "uzbek": "ikki",
            "transcription": "/tuː/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0102",
            "english": "who",
            "uzbek": "kim",
            "transcription": "/huː/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0103",
            "english": "why",
            "uzbek": "nima uchun",
            "transcription": "/waɪ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0104",
            "english": "yes",
            "uzbek": "ha",
            "transcription": "/jes/",
            "partOfSpeech": "Ravish",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0105",
            "english": "you",
            "uzbek": "sen",
            "transcription": "/juː/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0106",
            "english": "also",
            "uzbek": "yana",
            "transcription": "/ˈɔːlsəʊ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0107",
            "english": "area",
            "uzbek": "maydon",
            "transcription": "/ˈeriə/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0108",
            "english": "aunt",
            "uzbek": "xola",
            "transcription": "/ænt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0109",
            "english": "away",
            "uzbek": "uzoqda",
            "transcription": "/əˈweɪ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0112",
            "english": "band",
            "uzbek": "orkestr",
            "transcription": "/bænd/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0114",
            "english": "bath",
            "uzbek": "hammom",
            "transcription": "/bæθ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0115",
            "english": "beer",
            "uzbek": "pivo",
            "transcription": "/bɪr/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0116",
            "english": "best",
            "uzbek": "eng zo'r",
            "transcription": "/best/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0117",
            "english": "bike",
            "uzbek": "velosiped",
            "transcription": "/baɪk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0120",
            "english": "blue",
            "uzbek": "ko'k",
            "transcription": "/bluː/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0124",
            "english": "boot",
            "uzbek": "etik",
            "transcription": "/buːt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0126",
            "english": "both",
            "uzbek": "ikkala",
            "transcription": "/bəʊθ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0128",
            "english": "cafe",
            "uzbek": "kafe",
            "transcription": "/kæˈfeɪ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0129",
            "english": "cake",
            "uzbek": "keks",
            "transcription": "/keɪk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0130",
            "english": "call",
            "uzbek": "chaqirmoq",
            "transcription": "/kɔːl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0132",
            "english": "cent",
            "uzbek": "sent",
            "transcription": "/sent/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0134",
            "english": "club",
            "uzbek": "klub",
            "transcription": "/klʌb/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0135",
            "english": "coat",
            "uzbek": "palto",
            "transcription": "/kəʊt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0136",
            "english": "cold",
            "uzbek": "sovuq",
            "transcription": "/kəʊld/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0137",
            "english": "come",
            "uzbek": "kelmoq",
            "transcription": "/kʌm/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0138",
            "english": "cool",
            "uzbek": "sovuq",
            "transcription": "/kuːl/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0141",
            "english": "date",
            "uzbek": "sana",
            "transcription": "/deɪt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0142",
            "english": "dear",
            "uzbek": "qadrli",
            "transcription": "/dɪr/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0143",
            "english": "desk",
            "uzbek": "yozuv stoli",
            "transcription": "/desk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0146",
            "english": "door",
            "uzbek": "eshik",
            "transcription": "/dɔːr/",
            "partOfSpeech": "Ot",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "\"Yes, you can come over to the cozy cafe near our area, riding your fast bike too,\" said my dear aunt on the phone call.",
          "She put on a warm blue coat and a leather boot, because it was cold outside and the clock showed two minutes to six or ten.",
          "We sit at a wooden desk near the front door, away from the street, and both of us order a delicious sweet cake.",
          "Who is the musician playing in that cool music club and jazz band? Also, why spend every cent on expensive beer when hot tea is the best after a relaxing bath on this romantic date?"
        ],
        "paragraphsUz": [
          "\"Ha, sen tezkor velosipedingda ham bizning hududdagi shinam kafega kelishing mumkin\", dedi aziz xolam telefon orqali.",
          "U issiq ko‘k palto va charm etik kiyib oldi, chunki tashqarida sovuq edi va soat o‘nga yoki oltiga ikki daqiqa qolganini ko‘rsatardi.",
          "Biz ko‘chadan uzoqda, old eshik yonidagi yog‘och stolga o‘tiramiz va ikkalamiz ham mazali shirin tort buyurtma qilamiz.",
          "Ushbu ajoyib musiqa klubi va guruhida chalayotgan musiqachi kim? Qolaversa, bunday uchrashuvda yoqimli vannadan so‘ng issiq choy eng yaxshisi bo‘lganida, nega har bir sentni qimmatbaho pivo uchun sarflash kerak?"
        ],
        "questions": [
          {
            "question": "Where do they sit in the cafe?",
            "options": [
              "Near the front door",
              "On the roof",
              "In the kitchen",
              "In the car"
            ],
            "correctIndex": 0,
            "explanationUz": "Ular ko‘chadan uzoqda, old eshik yonidagi yog‘och stolga o‘tirishadi."
          }
        ]
      },
      {
        "num": 4,
        "title": "Hard Work on the Green Farm",
        "titleUz": "Yashil fermadagi fidokorona mehnat",
        "words": [
          {
            "id": "cefr_a1_0147",
            "english": "down",
            "uzbek": "past",
            "transcription": "/daʊn/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0149",
            "english": "each",
            "uzbek": "har bir",
            "transcription": "/iːtʃ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0150",
            "english": "east",
            "uzbek": "sharq",
            "transcription": "/iːst/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0151",
            "english": "easy",
            "uzbek": "oson",
            "transcription": "/ˈiːzi/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0152",
            "english": "else",
            "uzbek": "yana",
            "transcription": "/els/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0153",
            "english": "euro",
            "uzbek": "yevro",
            "transcription": "/ˈjʊrəʊ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0154",
            "english": "ever",
            "uzbek": "har doim",
            "transcription": "/ˈevər/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0156",
            "english": "face",
            "uzbek": "yuz",
            "transcription": "/feɪs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0157",
            "english": "fact",
            "uzbek": "dalil",
            "transcription": "/fækt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0158",
            "english": "farm",
            "uzbek": "ferma",
            "transcription": "/fɑːrm/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0159",
            "english": "fast",
            "uzbek": "tez",
            "transcription": "/fæst/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0162",
            "english": "find",
            "uzbek": "topmoq",
            "transcription": "/faɪnd/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0163",
            "english": "fine",
            "uzbek": "yaxshi",
            "transcription": "/faɪn/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0164",
            "english": "fire",
            "uzbek": "olov",
            "transcription": "/ˈfaɪər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0166",
            "english": "five",
            "uzbek": "besh",
            "transcription": "/faɪv/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0168",
            "english": "foot",
            "uzbek": "oyoq",
            "transcription": "/fʊt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0169",
            "english": "form",
            "uzbek": "anketa",
            "transcription": "/fɔːrm/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0170",
            "english": "four",
            "uzbek": "to'rt",
            "transcription": "/fɔːr/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0171",
            "english": "free",
            "uzbek": "ozod",
            "transcription": "/friː/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0172",
            "english": "from",
            "uzbek": "dan",
            "transcription": "/frɑːm/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0173",
            "english": "full",
            "uzbek": "to'la",
            "transcription": "/fʊl/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0176",
            "english": "give",
            "uzbek": "bermoq",
            "transcription": "/ɡɪv/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0177",
            "english": "good",
            "uzbek": "yaxshi",
            "transcription": "/ɡʊd/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0178",
            "english": "grey",
            "uzbek": "kulrang",
            "transcription": "/ɡreɪ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0179",
            "english": "grow",
            "uzbek": "o'smoq",
            "transcription": "/ɡrəʊ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0180",
            "english": "hair",
            "uzbek": "soch",
            "transcription": "/her/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0182",
            "english": "hard",
            "uzbek": "qattiq",
            "transcription": "/hɑːrd/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0183",
            "english": "have",
            "uzbek": "bor bo'lmoq",
            "transcription": "/hæv/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0185",
            "english": "hear",
            "uzbek": "eshitmoq",
            "transcription": "/hɪr/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0186",
            "english": "help",
            "uzbek": "yordam bermoq",
            "transcription": "/help/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0187",
            "english": "here",
            "uzbek": "bu yerda",
            "transcription": "/hɪr/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0188",
            "english": "high",
            "uzbek": "baland",
            "transcription": "/haɪ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0189",
            "english": "hour",
            "uzbek": "bir soat",
            "transcription": "/ˈaʊər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0190",
            "english": "idea",
            "uzbek": "g'oya",
            "transcription": "/aɪˈdiːə/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0191",
            "english": "into",
            "uzbek": "ichkari",
            "transcription": "/ˈɪntuː/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0192",
            "english": "join",
            "uzbek": "biriktirmoq",
            "transcription": "/dʒɔɪn/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "From the east side of town, we travel fast to join my uncle on his family farm and earn every euro.",
          "It is not easy, but in fact it is fine and good to grow fresh crops and have a basket full of apples, the best ever.",
          "We hear birds sing into the open air, and each worker can find a free hour to rest four or five minutes down by the warm fire.",
          "\"Here, give me a hand to help carry this heavy grey box,\" says a tall farmer with high energy and dark hair on his face. \"What else could be a better idea on one foot?\" It is hard work, but we love to form strong friendships."
        ],
        "paragraphsUz": [
          "Shaharning sharqiy tomonidan biz har bir yevroni halol topish va amakimning oilaviy fermasiga qo‘shilish uchun tez yetib boramiz.",
          "Bu oson emas, lekin aslida yangi hosil yetishtirish va olmadan to‘la savatga ega bo‘lish ajoyib va hayotdagi eng yaxshi tajribadir.",
          "Biz ochiq havoda qushlarning kuylashini eshitamiz va har bir ishchi issiq olov yonida to‘rt yoki besh daqiqa dam olish uchun bo‘sh soat topishi mumkin.",
          "\"Mana, bu og‘ir kulrang qutini ko‘tarishga yordam berish uchun menga qo‘lingni ber\", deydi yuzida qora sochlari bo‘lgan baland bo‘yli baquvvat dehqon. \"Bunday sharoitda yana nima yaxshiroq g‘oya bo‘lishi mumkin?\" Bu og‘ir mehnat, lekin biz mustahkam do‘stlik shakllantirishni yaxshi ko‘ramiz."
        ],
        "questions": [
          {
            "question": "What do they grow on the family farm?",
            "options": [
              "Fresh crops and apples",
              "Cars and bikes",
              "Computers",
              "Shoes"
            ],
            "correctIndex": 0,
            "explanationUz": "Fermada yangi ekinlar va olmadan to‘la savatlar yetishtiriladi."
          }
        ]
      },
      {
        "num": 5,
        "title": "Summer Plans and Life Choices",
        "titleUz": "Yozgi rejalar va hayotiy tanlovlar",
        "words": [
          {
            "id": "cefr_a1_0193",
            "english": "july",
            "uzbek": "iyul",
            "transcription": "/dʒuˈlaɪ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0194",
            "english": "june",
            "uzbek": "iyun",
            "transcription": "/dʒuːn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0195",
            "english": "keep",
            "uzbek": "saqlamoq",
            "transcription": "/kiːp/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0196",
            "english": "know",
            "uzbek": "bilmoq",
            "transcription": "/nəʊ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0197",
            "english": "land",
            "uzbek": "quruqlik",
            "transcription": "/lænd/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0198",
            "english": "late",
            "uzbek": "kech qolgan",
            "transcription": "/leɪt/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0199",
            "english": "left",
            "uzbek": "chap",
            "transcription": "/left/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0200",
            "english": "life",
            "uzbek": "hayot",
            "transcription": "/laɪf/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0201",
            "english": "line",
            "uzbek": "chiziq",
            "transcription": "/laɪn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0202",
            "english": "lion",
            "uzbek": "sher",
            "transcription": "/ˈlaɪən/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0203",
            "english": "list",
            "uzbek": "ro'yxat",
            "transcription": "/lɪst/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0204",
            "english": "long",
            "uzbek": "uzun",
            "transcription": "/lɔːŋ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0205",
            "english": "lose",
            "uzbek": "yo'qotmoq",
            "transcription": "/luːz/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0207",
            "english": "main",
            "uzbek": "asosiy",
            "transcription": "/meɪn/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0210",
            "english": "mean",
            "uzbek": "anglatmoq",
            "transcription": "/miːn/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0212",
            "english": "meet",
            "uzbek": "uchrashmoq",
            "transcription": "/miːt/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0213",
            "english": "menu",
            "uzbek": "menyu",
            "transcription": "/ˈmenjuː/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0214",
            "english": "mile",
            "uzbek": "mil",
            "transcription": "/maɪl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0216",
            "english": "miss",
            "uzbek": "o'tkazib yubormoq",
            "transcription": "/mɪs/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0217",
            "english": "more",
            "uzbek": "ko'proq",
            "transcription": "/mɔːr/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0218",
            "english": "most",
            "uzbek": "eng ko'p",
            "transcription": "/məʊst/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0219",
            "english": "much",
            "uzbek": "ko'p",
            "transcription": "/mʌtʃ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0220",
            "english": "must",
            "uzbek": "shart",
            "transcription": "/mʌst/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0221",
            "english": "name",
            "uzbek": "ism",
            "transcription": "/neɪm/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0222",
            "english": "near",
            "uzbek": "yaqin",
            "transcription": "/nɪr/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0223",
            "english": "news",
            "uzbek": "yangilik",
            "transcription": "/nuːz/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0224",
            "english": "next",
            "uzbek": "keyingi",
            "transcription": "/nekst/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0225",
            "english": "nice",
            "uzbek": "yoqimli",
            "transcription": "/naɪs/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0226",
            "english": "nine",
            "uzbek": "to'qqiz",
            "transcription": "/naɪn/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0227",
            "english": "nose",
            "uzbek": "burun",
            "transcription": "/nəʊz/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0228",
            "english": "note",
            "uzbek": "qayd",
            "transcription": "/nəʊt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0229",
            "english": "once",
            "uzbek": "bir marta",
            "transcription": "/wʌns/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0230",
            "english": "only",
            "uzbek": "faqat",
            "transcription": "/ˈəʊnli/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0232",
            "english": "over",
            "uzbek": "ustida",
            "transcription": "/ˈəʊvər/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0233",
            "english": "page",
            "uzbek": "bet",
            "transcription": "/peɪdʒ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0234",
            "english": "pair",
            "uzbek": "juft",
            "transcription": "/per/",
            "partOfSpeech": "Ot",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "In sunny June and hot July, I love to keep a personal list of nine goals on a clean paper page, writing my name at the top.",
          "We know that life is a long journey where you must not be late, never lose hope, nor miss much of a nice chance.",
          "Near the main city line, only one mile over the green land, most friends meet to read the latest morning news.",
          "\"What does this note mean?\" asked my friend, touching his nose as we looked at the dinner menu to order a pair of tasty snacks. \"I left my bag, but once we finish, we can see the lion at the zoo next week; nothing could be more exciting!\""
        ],
        "paragraphsUz": [
          "Quyoshli iyun va issiq iyul oylarida men toza qog‘oz sahifasida yuqorisiga o‘z ismimni yozib, to‘qqizta shaxsiy maqsadlar ro‘yxatini yuritishni yoqtiraman.",
          "Biz bilamizki, hayot uzoq bir safar bo‘lib, unda siz kechikmasligingiz, ko‘p imkoniyatlarni boy bermasligingiz va hech qachon umidni yo‘qotmasligingiz kerak.",
          "Asosiy shahar chizig‘i yonida, yashil yer uzra atigi bir mil narida, ko‘pchilik do‘stlar ertalabki so‘nggi yangiliklarni o‘qish uchun uchrashadilar.",
          "\"Bu eslatma nimani anglatadi?\" deb so‘radi do‘stim, kechki ovqat menyusiga qarab bir juft mazali tamaddi buyurtma qilayotganimizda burnini qashib. \"Men sumkamni chap tomonda qoldiribman, lekin tugatgach, keyingi hafta hayvonot bog‘idagi arslonni ko‘rishimiz mumkin; bundan ortiq hayajonli narsa yo‘q!\""
        ],
        "questions": [
          {
            "question": "Which months are mentioned for summer planning?",
            "options": [
              "June and July",
              "January and February",
              "November",
              "December"
            ],
            "correctIndex": 0,
            "explanationUz": "Hikoyada quyoshli iyun va issiq iyul oylari eslatib o‘tilgan."
          }
        ]
      },
      {
        "num": 6,
        "title": "An Afternoon Stroll and City Shops",
        "titleUz": "Tushdan keyingi sayr va shahar do‘konlari",
        "words": [
          {
            "id": "cefr_a1_0235",
            "english": "park",
            "uzbek": "park",
            "transcription": "/pɑːrk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0237",
            "english": "past",
            "uzbek": "o'tgan",
            "transcription": "/pæst/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0238",
            "english": "pink",
            "uzbek": "pushti",
            "transcription": "/pɪŋk/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0239",
            "english": "plan",
            "uzbek": "reja",
            "transcription": "/plæn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0241",
            "english": "pool",
            "uzbek": "hovuz",
            "transcription": "/puːl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0242",
            "english": "poor",
            "uzbek": "kambag'al",
            "transcription": "/pɔːr/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0243",
            "english": "post",
            "uzbek": "pochta",
            "transcription": "/pəʊst/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0246",
            "english": "real",
            "uzbek": "haqiqiy",
            "transcription": "/ˈriːəl/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0248",
            "english": "rich",
            "uzbek": "boy",
            "transcription": "/rɪtʃ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0253",
            "english": "same",
            "uzbek": "bir xil",
            "transcription": "/seɪm/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0254",
            "english": "sell",
            "uzbek": "sotmoq",
            "transcription": "/sel/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0255",
            "english": "send",
            "uzbek": "jo'natmoq",
            "transcription": "/send/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0256",
            "english": "shoe",
            "uzbek": "tufli",
            "transcription": "/ʃuː/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0257",
            "english": "shop",
            "uzbek": "do'kon",
            "transcription": "/ʃɑːp/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0258",
            "english": "show",
            "uzbek": "ko'rsatmoq",
            "transcription": "/ʃəʊ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0261",
            "english": "slow",
            "uzbek": "sekin",
            "transcription": "/sləʊ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0263",
            "english": "some",
            "uzbek": "bir qancha",
            "transcription": "/sʌm/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0265",
            "english": "soon",
            "uzbek": "tez orada",
            "transcription": "/suːn/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0268",
            "english": "stop",
            "uzbek": "to`xtatmoq",
            "transcription": "/stɑːp/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0269",
            "english": "sure",
            "uzbek": "shubhasiz",
            "transcription": "/ʃʊr/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0270",
            "english": "take",
            "uzbek": "olmoq",
            "transcription": "/teɪk/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0271",
            "english": "tall",
            "uzbek": "baland",
            "transcription": "/tɔːl/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0272",
            "english": "taxi",
            "uzbek": "taksi",
            "transcription": "/ˈtæksi/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0274",
            "english": "tell",
            "uzbek": "aytmoq",
            "transcription": "/tel/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0276",
            "english": "text",
            "uzbek": "matn",
            "transcription": "/tekst/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0277",
            "english": "than",
            "uzbek": "ga qaraganda",
            "transcription": "/ðæn/",
            "partOfSpeech": "Bog‘lovchi",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0278",
            "english": "them",
            "uzbek": "ularni",
            "transcription": "/ðem/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0279",
            "english": "then",
            "uzbek": "keyin",
            "transcription": "/ðen/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0280",
            "english": "they",
            "uzbek": "ular",
            "transcription": "/ðeɪ/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0281",
            "english": "time",
            "uzbek": "vaqt",
            "transcription": "/taɪm/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0285",
            "english": "true",
            "uzbek": "to`g`ri",
            "transcription": "/truː/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0286",
            "english": "turn",
            "uzbek": "aylanmoq",
            "transcription": "/tɜːrn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0287",
            "english": "type",
            "uzbek": "tur",
            "transcription": "/taɪp/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0288",
            "english": "wake",
            "uzbek": "uyg`onmoq",
            "transcription": "/weɪk/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0289",
            "english": "walk",
            "uzbek": "yurmoq",
            "transcription": "/wɔːk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0290",
            "english": "wall",
            "uzbek": "devor",
            "transcription": "/wɔːl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "When I wake up from a slow nap, my true plan is to walk past the green park and swim in the cool pool.",
          "Along the tall brick wall, some owners open a small shop to sell a pink shoe or a new type of clothes.",
          "\"It is time to take a yellow taxi, send a quick text message to tell them where to stop, and show them the real road,\" said my brother.",
          "They are sure that rich and poor people all enjoy the same sunny weather, more than staying indoors, then they turn toward the post office soon."
        ],
        "paragraphsUz": [
          "Sokin uyqudan uyg‘onganimda, mening haqiqiy rejam yashil park yonidan yurib o‘tish va salqin hovuzda suzishdir.",
          "Baland g‘ishtin devor bo‘ylab, ba’zi egalar pushti poyabzal yoki yangi turdagi kiyimlarni sotish uchun kichik do‘kon ochadilar.",
          "\"Sariq taksiga o‘tirish, ularga qayerda to‘xtashni aytish uchun tezkor matnli xabar yuborish va ularga haqiqiy yo‘lni ko‘rsatish vaqti keldi\", dedi akam.",
          "Ular ishonch bilan bilishadiki, boy va kamtar insonlarning barchasi uyda o‘tirishdan ko‘ra bir xil quyoshli ob-havodan zavqlanadilar, so‘ngra tez orada pochta tomon buriladilar."
        ],
        "questions": [
          {
            "question": "What do some shop owners sell along the brick wall?",
            "options": [
              "A pink shoe and new clothes",
              "Airplanes",
              "Ships",
              "Tractors"
            ],
            "correctIndex": 0,
            "explanationUz": "G‘ishtin devor bo‘ylab ochilgan do‘konlarda poyabzal va yangi kiyimlar sotiladi."
          }
        ]
      },
      {
        "num": 7,
        "title": "Spring Preparations in April",
        "titleUz": "Aprel oyidagi bahoriy tayyorgarlik",
        "words": [
          {
            "id": "cefr_a1_0291",
            "english": "want",
            "uzbek": "xohlamoq",
            "transcription": "/wɑːnt/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0293",
            "english": "wear",
            "uzbek": "kiymoq",
            "transcription": "/wer/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0294",
            "english": "week",
            "uzbek": "hafta",
            "transcription": "/wiːk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0295",
            "english": "well",
            "uzbek": "yaxshi",
            "transcription": "/wel/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0296",
            "english": "west",
            "uzbek": "g`arb",
            "transcription": "/west/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0297",
            "english": "what",
            "uzbek": "nima",
            "transcription": "/wʌt/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0298",
            "english": "when",
            "uzbek": "qachon",
            "transcription": "/wen/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0300",
            "english": "wine",
            "uzbek": "sharob",
            "transcription": "/waɪn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0301",
            "english": "with",
            "uzbek": "bilan",
            "transcription": "/wɪθ/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0302",
            "english": "word",
            "uzbek": "so`z",
            "transcription": "/wɜːrd/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0304",
            "english": "yeah",
            "uzbek": "ha",
            "transcription": "/jeə/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0305",
            "english": "year",
            "uzbek": "yil",
            "transcription": "/jɪr/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0306",
            "english": "your",
            "uzbek": "sizning",
            "transcription": "/jər/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0307",
            "english": "about",
            "uzbek": "haqida",
            "transcription": "/əˈbaʊt/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0309",
            "english": "actor",
            "uzbek": "aktiyor",
            "transcription": "/ˈæktər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0310",
            "english": "again",
            "uzbek": "yana",
            "transcription": "/əˈɡeɪn/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0311",
            "english": "agree",
            "uzbek": "rozi bo'lmoq",
            "transcription": "/əˈɡriː/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0312",
            "english": "angry",
            "uzbek": "g'azablangan",
            "transcription": "/ˈæŋɡri/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0314",
            "english": "april",
            "uzbek": "aprel",
            "transcription": "/ˈeɪprəl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0315",
            "english": "beach",
            "uzbek": "sohil",
            "transcription": "/biːtʃ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0316",
            "english": "begin",
            "uzbek": "boshlamoq",
            "transcription": "/bɪˈɡɪn/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0317",
            "english": "below",
            "uzbek": "tagida",
            "transcription": "/bɪˈləʊ/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0319",
            "english": "bored",
            "uzbek": "zerikkan",
            "transcription": "/bɔːrd/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0321",
            "english": "break",
            "uzbek": "sindirmoq",
            "transcription": "/breɪk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0322",
            "english": "bring",
            "uzbek": "keltirmoq",
            "transcription": "/brɪŋ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0323",
            "english": "brown",
            "uzbek": "jigarrang",
            "transcription": "/braʊn/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0324",
            "english": "build",
            "uzbek": "qurmoq",
            "transcription": "/bɪld/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0326",
            "english": "chair",
            "uzbek": "stul",
            "transcription": "/tʃer/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0328",
            "english": "cheap",
            "uzbek": "arzon",
            "transcription": "/tʃiːp/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0331",
            "english": "clean",
            "uzbek": "toza",
            "transcription": "/kliːn/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0332",
            "english": "clock",
            "uzbek": "soat",
            "transcription": "/klɑːk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0333",
            "english": "could",
            "uzbek": "qila olmoq",
            "transcription": "/kʊd/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0335",
            "english": "dirty",
            "uzbek": "kir",
            "transcription": "/ˈdɜːrti/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0336",
            "english": "dress",
            "uzbek": "ko'ylak",
            "transcription": "/dres/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0338",
            "english": "early",
            "uzbek": "erta",
            "transcription": "/ˈɜːrli/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0339",
            "english": "eight",
            "uzbek": "sakkiz",
            "transcription": "/eɪt/",
            "partOfSpeech": "Son",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "In early April of this year, we begin a busy week to build and clean our house from east to west.",
          "\"Yeah, I agree with your word that we could fix this brown wooden chair and wash the dirty dress well,\" said the smiling actor.",
          "When you feel bored or angry, take a short break at eight o’clock, look below at the beach, and do what you want to do.",
          "We wear a cheap coat, bring a glass of red wine, look at the antique clock on the wall, and talk about exciting plans again."
        ],
        "paragraphsUz": [
          "Ushbu yilning aprel oyi boshida biz uyimizni sharqdan g‘arbgacha tozalash va ta’mirlash uchun qizg‘in haftani boshlaymiz.",
          "\"Ha, men seni ushbu jigarrang yog‘och stulni tuzatishimiz va kir ko‘ylakni yaxshilab yuvishimiz mumkinligi haqidagi so‘zingga qo‘shilaman\", dedi tabassum qilayotgan aktyor.",
          "Zerikkaningizda yoki jahlingiz chiqqanda, soat sakkizda qisqa tanaffus qiling, pastdagi sohilga qarang va o‘zingiz xohlagan ishni qiling.",
          "Biz arzon palto kiyamiz, bir qadah qizil sharob keltiramiz, devordagi qadimiy soatga qaraymiz va yana qiziqarli rejalar haqida suhbatlashamiz."
        ],
        "questions": [
          {
            "question": "When do they take a short break?",
            "options": [
              "At eight o’clock",
              "At midnight",
              "At sunrise",
              "Never"
            ],
            "correctIndex": 0,
            "explanationUz": "Ular soat sakkizda qisqa tanaffus qilishadi."
          }
        ]
      },
      {
        "num": 8,
        "title": "The Great Festival in the Neighborhood",
        "titleUz": "Mahalladagi katta tantana",
        "words": [
          {
            "id": "cefr_a1_0340",
            "english": "enjoy",
            "uzbek": "rohatlanmoq",
            "transcription": "/ɪnˈdʒɔɪ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0341",
            "english": "event",
            "uzbek": "hodisa",
            "transcription": "/ɪˈvent/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0342",
            "english": "every",
            "uzbek": "har bir",
            "transcription": "/ˈevri/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0343",
            "english": "extra",
            "uzbek": "qo'shimcha",
            "transcription": "/ˈekstrə/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0344",
            "english": "false",
            "uzbek": "yolg'on",
            "transcription": "/fɔːls/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0345",
            "english": "fifth",
            "uzbek": "o'n beshinchi",
            "transcription": "/fɪfθ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0346",
            "english": "fifty",
            "uzbek": "ellik",
            "transcription": "/ˈfɪfti/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0347",
            "english": "final",
            "uzbek": "yakuniy",
            "transcription": "/ˈfaɪnl/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0348",
            "english": "first",
            "uzbek": "birinchi",
            "transcription": "/fɜːrst/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0349",
            "english": "floor",
            "uzbek": "qavat",
            "transcription": "/flɔːr/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0350",
            "english": "forty",
            "uzbek": "qirq",
            "transcription": "/ˈfɔːrti/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0351",
            "english": "front",
            "uzbek": "old tomon",
            "transcription": "/frʌnt/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0353",
            "english": "funny",
            "uzbek": "kulgili",
            "transcription": "/ˈfʌni/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0356",
            "english": "green",
            "uzbek": "yashil",
            "transcription": "/ɡriːn/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0357",
            "english": "group",
            "uzbek": "guruh",
            "transcription": "/ɡruːp/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0358",
            "english": "guess",
            "uzbek": "taxmin qilmoq",
            "transcription": "/ɡes/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0360",
            "english": "hello",
            "uzbek": "salom",
            "transcription": "/həˈləʊ/",
            "partOfSpeech": "Undov",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0362",
            "english": "horse",
            "uzbek": "ot",
            "transcription": "/hɔːrs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0364",
            "english": "house",
            "uzbek": "uy",
            "transcription": "/haʊs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0365",
            "english": "jeans",
            "uzbek": "jinsi shim",
            "transcription": "/dʒiːnz/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0366",
            "english": "juice",
            "uzbek": "sharbat",
            "transcription": "/dʒuːs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0367",
            "english": "large",
            "uzbek": "katta",
            "transcription": "/lɑːrdʒ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0370",
            "english": "light",
            "uzbek": "yorug'lik",
            "transcription": "/laɪt/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0371",
            "english": "local",
            "uzbek": "mahalliy",
            "transcription": "/ˈləʊkl/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0373",
            "english": "march",
            "uzbek": "mart",
            "transcription": "/mɑːrtʃ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0374",
            "english": "match",
            "uzbek": "match",
            "transcription": "/mætʃ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0375",
            "english": "maybe",
            "uzbek": "balki",
            "transcription": "/ˈmeɪbi/",
            "partOfSpeech": "Ravish",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0376",
            "english": "metre",
            "uzbek": "metr",
            "transcription": "/ˈmiːtər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0377",
            "english": "model",
            "uzbek": "model",
            "transcription": "/ˈmɑːdl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0379",
            "english": "month",
            "uzbek": "oy",
            "transcription": "/mʌnθ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0380",
            "english": "mouse",
            "uzbek": "sichqon",
            "transcription": "/maʊs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0381",
            "english": "mouth",
            "uzbek": "og'iz",
            "transcription": "/maʊθ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0384",
            "english": "never",
            "uzbek": "hech qachon",
            "transcription": "/ˈnevər/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0385",
            "english": "night",
            "uzbek": "tun",
            "transcription": "/naɪt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0386",
            "english": "north",
            "uzbek": "shimol",
            "transcription": "/nɔːrθ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0388",
            "english": "often",
            "uzbek": "tez-tez",
            "transcription": "/ˈɔːftən/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "\"Hello! Welcome to our local community house on this first night of March,\" said the leader of our group.",
          "Every month, forty or fifty neighbors enjoy a large cultural event with bright light and sweet fruit juice on the green grass.",
          "In front of the building, a funny model wears blue jeans, while maybe a strong brown horse stands twenty metre to the north.",
          "A cute little grey mouse never makes a sound near the fifth floor, and you can often guess which team will win the final sports match, so no false rumors spread from mouth to mouth with extra joy."
        ],
        "paragraphsUz": [
          "\"Assalomu alaykum! Mart oyining birinchi kechasida mahalliy jamoat uyimizga xush kelibsiz\", dedi guruhimiz rahbari.",
          "Har oyda qirq yoki ellik nafar qo‘shnilar yashil maysa ustida yorqin chiroqlar va shirin meva sharbati bilan katta madaniy tadbirdan bahramand bo‘lishadi.",
          "Bino oldida kulgili model ko‘k jinsi kiyib turibdi, balki kuchli ot yigirma metr shimolda joylashgandir.",
          "Kichkina yoqimli sichqoncha beshinchi qavat yaqinida hech qachon tovush chiqarmaydi va siz yakuniy sport o‘yinida qaysi jamoa g‘alaba qozonishini tez-tez taxmin qilishingiz mumkin, shuning uchun hech qanday yolg‘on gaplar og‘izdan-og‘izga tarqalmaydi."
        ],
        "questions": [
          {
            "question": "How many neighbors enjoy the cultural event?",
            "options": [
              "Forty or fifty neighbors",
              "Only two",
              "A thousand",
              "Nobody"
            ],
            "correctIndex": 0,
            "explanationUz": "Tadbirdan qirq yoki ellik nafar qo‘shnilar bahramand bo‘lishadi."
          }
        ]
      },
      {
        "num": 9,
        "title": "A Relaxing Evening in the Living Space",
        "titleUz": "Yashash xonasidagi sokin oqshom",
        "words": [
          {
            "id": "cefr_a1_0389",
            "english": "onion",
            "uzbek": "piyoz",
            "transcription": "/ˈʌnjən/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0390",
            "english": "order",
            "uzbek": "tartib",
            "transcription": "/ˈɔːrdər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0391",
            "english": "other",
            "uzbek": "boshqa",
            "transcription": "/ˈʌðər/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0393",
            "english": "paper",
            "uzbek": "qog'oz",
            "transcription": "/ˈpeɪpər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0397",
            "english": "piano",
            "uzbek": "pianino",
            "transcription": "/piˈænəʊ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0398",
            "english": "piece",
            "uzbek": "bo'lak",
            "transcription": "/piːs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0399",
            "english": "place",
            "uzbek": "joy",
            "transcription": "/pleɪs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0402",
            "english": "point",
            "uzbek": "g'oya",
            "transcription": "/pɔɪnt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0403",
            "english": "pound",
            "uzbek": "funt",
            "transcription": "/paʊnd/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0405",
            "english": "quick",
            "uzbek": "tez",
            "transcription": "/kwɪk/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0406",
            "english": "quiet",
            "uzbek": "tinch",
            "transcription": "/ˈkwaɪət/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0407",
            "english": "quite",
            "uzbek": "bir oz",
            "transcription": "/kwaɪt/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0410",
            "english": "relax",
            "uzbek": "dam olmoq",
            "transcription": "/rɪˈlæks/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0413",
            "english": "salad",
            "uzbek": "salat",
            "transcription": "/ˈsæləd/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0414",
            "english": "seven",
            "uzbek": "yetti",
            "transcription": "/ˈsevn/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0415",
            "english": "shirt",
            "uzbek": "ko'ylak",
            "transcription": "/ʃɜːrt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0416",
            "english": "short",
            "uzbek": "kalta",
            "transcription": "/ʃɔːrt/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0419",
            "english": "skirt",
            "uzbek": "yubka",
            "transcription": "/skɜːrt/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0420",
            "english": "small",
            "uzbek": "kichik",
            "transcription": "/smɔːl/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0421",
            "english": "snake",
            "uzbek": "ilon",
            "transcription": "/sneɪk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0422",
            "english": "sorry",
            "uzbek": "uzr",
            "transcription": "/ˈsɑːri/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0423",
            "english": "south",
            "uzbek": "janub",
            "transcription": "/saʊθ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0424",
            "english": "space",
            "uzbek": "koinot",
            "transcription": "/speɪs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0425",
            "english": "speak",
            "uzbek": "gapirmoq",
            "transcription": "/spiːk/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0428",
            "english": "story",
            "uzbek": "hikoya",
            "transcription": "/ˈstɔːri/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0430",
            "english": "style",
            "uzbek": "stil",
            "transcription": "/staɪl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0432",
            "english": "table",
            "uzbek": "stol",
            "transcription": "/ˈteɪbl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0434",
            "english": "thank",
            "uzbek": "rahmat aytmoq",
            "transcription": "/θæŋk/",
            "partOfSpeech": "Undov",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0435",
            "english": "their",
            "uzbek": "ularning",
            "transcription": "/ðer/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0436",
            "english": "there",
            "uzbek": "u yerda",
            "transcription": "/ðer/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0437",
            "english": "thing",
            "uzbek": "narsa",
            "transcription": "/θɪŋ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0438",
            "english": "think",
            "uzbek": "o`ylamoq",
            "transcription": "/θɪŋk/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0439",
            "english": "three",
            "uzbek": "uch",
            "transcription": "/θriː/",
            "partOfSpeech": "Son",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0440",
            "english": "tired",
            "uzbek": "charchagan",
            "transcription": "/ˈtaɪərd/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0441",
            "english": "title",
            "uzbek": "sarlavha",
            "transcription": "/ˈtaɪtl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0442",
            "english": "today",
            "uzbek": "bugun",
            "transcription": "/təˈdeɪ/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "Today, after a quick trip to the south part of town, I feel tired and quite ready to relax in a quiet place.",
          "On the small wooden table, there is a piece of fresh onion salad, a harmless pet snake in a safe glass box, and an order of warm soup for three or seven people.",
          "A young lady in a short skirt and blue shirt plays a sweet story on the grand piano with wonderful style.",
          "\"Sorry, I thank you for this lovely space, but I think the other thing on this sheet of paper needs a title to speak to their point, costing only one pound,\" she said."
        ],
        "paragraphsUz": [
          "Bugun shaharning janubiy qismiga tezkor safardan so‘ng, men o‘zimni charchagan va tinch joyda dam olishga to‘liq tayyor his qilaman.",
          "Kichik yog‘och stolda yangi piyozli salat bo‘lagi, xavfsiz shisha qutidagi zararsiz ilon va uch yoki yetti kishi uchun iliq sho‘rva buyurtmasi turibdi.",
          "Kalta yubka va ko‘k ko‘ylakdagi yosh xonim ajoyib uslub bilan royal pianosida yoqimli ohang chalmoqda.",
          "\"Kechirasiz, men sizga ushbu ajoyib joy uchun minnatdorchilik bildiraman, ammo menimcha, ushbu qog‘oz varag‘idagi boshqa narsa atigi bir funt turadigan o‘z mavzusini ifodalash uchun sarlavhaga muhtoj\", dedi u."
        ],
        "questions": [
          {
            "question": "What instrument does the young lady play?",
            "options": [
              "The grand piano",
              "The guitar",
              "The drum",
              "The flute"
            ],
            "correctIndex": 0,
            "explanationUz": "Yosh xonim royal pianosida yoqimli musiqa chalmoqda."
          }
        ]
      },
      {
        "num": 10,
        "title": "New Horizons and Family Wisdom",
        "titleUz": "Yangi ufqlari va oilaviy hikmatlar",
        "words": [
          {
            "id": "cefr_a1_0444",
            "english": "topic",
            "uzbek": "mavzu",
            "transcription": "/ˈtɑːpɪk/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0446",
            "english": "twice",
            "uzbek": "ikki marta",
            "transcription": "/twaɪs/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0447",
            "english": "uncle",
            "uzbek": "amaki",
            "transcription": "/ˈʌŋkl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0448",
            "english": "under",
            "uzbek": "ostida",
            "transcription": "/ˈʌndər/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0449",
            "english": "until",
            "uzbek": "gacha",
            "transcription": "/ənˈtɪl/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0452",
            "english": "watch",
            "uzbek": "kuzatmoq",
            "transcription": "/wɑːtʃ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0454",
            "english": "where",
            "uzbek": "qayerda",
            "transcription": "/wer/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0455",
            "english": "which",
            "uzbek": "qaysi",
            "transcription": "/wɪtʃ/",
            "partOfSpeech": "Olmosh",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0456",
            "english": "white",
            "uzbek": "oq",
            "transcription": "/waɪt/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0458",
            "english": "world",
            "uzbek": "dunyo",
            "transcription": "/wɜːrld/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0459",
            "english": "would",
            "uzbek": "bo'lmoq",
            "transcription": "/əd/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0461",
            "english": "wrong",
            "uzbek": "noto`g`ri",
            "transcription": "/rɔːŋ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0462",
            "english": "young",
            "uzbek": "yosh",
            "transcription": "/jʌŋ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0463",
            "english": "across",
            "uzbek": "eniga",
            "transcription": "/əˈkrɔːs/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0465",
            "english": "advice",
            "uzbek": "maslahat",
            "transcription": "/ədˈvaɪs/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0466",
            "english": "afraid",
            "uzbek": "qo'rqan",
            "transcription": "/əˈfreɪd/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0467",
            "english": "always",
            "uzbek": "har doim",
            "transcription": "/ˈɔːlweɪz/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0469",
            "english": "answer",
            "uzbek": "javob",
            "transcription": "/ˈænsər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0470",
            "english": "anyone",
            "uzbek": "kimdir",
            "transcription": "/ˈeniwʌn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0471",
            "english": "around",
            "uzbek": "atrofda",
            "transcription": "/əˈraʊnd/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0474",
            "english": "august",
            "uzbek": "avgust",
            "transcription": "/ˈɔːɡəst/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0477",
            "english": "become",
            "uzbek": "bo'lmoq",
            "transcription": "/bɪˈkʌm/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0478",
            "english": "behind",
            "uzbek": "orqada",
            "transcription": "/bɪˈhaɪnd/",
            "partOfSpeech": "Predlog",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0479",
            "english": "better",
            "uzbek": "yaxshiroq",
            "transcription": "/ˈbetər/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0480",
            "english": "boring",
            "uzbek": "zerikarli",
            "transcription": "/ˈbɔːrɪŋ/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0481",
            "english": "bottle",
            "uzbek": "butilka",
            "transcription": "/ˈbɑːtl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0482",
            "english": "butter",
            "uzbek": "saryog'",
            "transcription": "/ˈbʌtər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0486",
            "english": "centre",
            "uzbek": "markaz",
            "transcription": "/ˈsentər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0487",
            "english": "change",
            "uzbek": "o'zgartirmoq",
            "transcription": "/tʃeɪndʒ/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0489",
            "english": "choose",
            "uzbek": "tanlamoq",
            "transcription": "/tʃuːz/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0492",
            "english": "colour",
            "uzbek": "rang",
            "transcription": "/ˈkʌlər/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0493",
            "english": "common",
            "uzbek": "umumiy",
            "transcription": "/ˈkɑːmən/",
            "partOfSpeech": "Sifat",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0495",
            "english": "cousin",
            "uzbek": "xolavachcha",
            "transcription": "/ˈkʌzn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0498",
            "english": "decide",
            "uzbek": "qaror qilmoq",
            "transcription": "/dɪˈsaɪd/",
            "partOfSpeech": "Fe’l",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0499",
            "english": "design",
            "uzbek": "rejalashtirmoq",
            "transcription": "/dɪˈzaɪn/",
            "partOfSpeech": "Ot",
            "level": "A1"
          },
          {
            "id": "cefr_a1_0500",
            "english": "detail",
            "uzbek": "qism",
            "transcription": "/dɪˈteɪl/",
            "partOfSpeech": "Ot",
            "level": "A1"
          }
        ],
        "paragraphs": [
          "In warm August, my young cousin and caring uncle always walk across the city centre to watch the sunset around us.",
          "\"Never be afraid to choose a better path, change your habits, and decide which dream you want to design in detail,\" was his wise advice.",
          "Under the big white tree behind the house, we drink from a cold glass bottle with fresh bread and golden butter until dark.",
          "Anyone would agree that this common topic is not boring, and there is nothing wrong with asking questions twice to become wiser in this wide world, where every colour has an answer."
        ],
        "paragraphsUz": [
          "Issiq avgust oyida mening yosh amakivachcham va mehribon amakim har doim atrofimizdagi quyosh botishini tomosha qilish uchun shahar markazi bo‘ylab yurishadi.",
          "\"Yaxshiroq yo‘lni tanlashdan, odatlaringizni o‘zgartirishdan va qaysi orzuni batafsil loyihalashtirishni hal qilishdan hech qachon qo‘rqmang\", dedi u o‘zining dono maslahatida.",
          "Uy orqasidagi katta oq daraxt ostida, biz qorong‘i tushguncha yangi non va sariyog‘ bilan sovuq shisha idishdan ichamiz.",
          "Har qanday inson ushbu umumiy mavzu zerikarli emasligiga va har bir rang o‘z javobiga ega bo‘lgan ushbu keng dunyoda donoroq bo‘lish uchun ikki marta savol berishning hech qanday yomon tomoni yo‘qligiga qo‘shiladi."
        ],
        "questions": [
          {
            "question": "What wise advice did the uncle give?",
            "options": [
              "Choose a better path and design your dream in detail",
              "Stop learning",
              "Sleep all day",
              "Forget about family"
            ],
            "correctIndex": 0,
            "explanationUz": "Amaki yangi yaxshiroq yo‘lni tanlash va orzularni batafsil loyihalashni maslahat berdi."
          }
        ]
      }
    ],
    "paragraphs": [
      "Hi! I am in my warm bed at home, and the fresh morning air feels so good to us.",
      "My dad says, \"Oh, it is time to be awake, do your exercises, and ask us if you want to add a cup of warm tea or milk.\"",
      "We see a big box on the floor, but he says, \"No, do not open it, it is a gift from a friend of my age two days ago.\"",
      "He checks his arm, turns on the TV, and tells me, \"It is OK, nothing is bad today, we can watch the black and white cow in the green field before we say bye to everyone.\"",
      "Hey! On this hot day, my dad put on his red hat and took his old car key to go out.",
      "\"Let him get his own workout, and take off for our new gym now,\" said her brother with a smile.",
      "At the gym, how can one lose fat in a few weeks? A trainer tells him not to hurt his leg or ear, and to see how its modern machines work.",
      "By the end of the hour, a lot of cold ice water helped them cool down, and they saw a picture of a pink pig on the wall. \"You may rest now!\" said the coach.",
      "\"Yes, you can come over to the cozy cafe near our area, riding your fast bike too,\" said my dear aunt on the phone call.",
      "She put on a warm blue coat and a leather boot, because it was cold outside and the clock showed two minutes to six or ten.",
      "We sit at a wooden desk near the front door, away from the street, and both of us order a delicious sweet cake.",
      "Who is the musician playing in that cool music club and jazz band? Also, why spend every cent on expensive beer when hot tea is the best after a relaxing bath on this romantic date?",
      "From the east side of town, we travel fast to join my uncle on his family farm and earn every euro.",
      "It is not easy, but in fact it is fine and good to grow fresh crops and have a basket full of apples, the best ever.",
      "We hear birds sing into the open air, and each worker can find a free hour to rest four or five minutes down by the warm fire.",
      "\"Here, give me a hand to help carry this heavy grey box,\" says a tall farmer with high energy and dark hair on his face. \"What else could be a better idea on one foot?\" It is hard work, but we love to form strong friendships.",
      "In sunny June and hot July, I love to keep a personal list of nine goals on a clean paper page, writing my name at the top.",
      "We know that life is a long journey where you must not be late, never lose hope, nor miss much of a nice chance.",
      "Near the main city line, only one mile over the green land, most friends meet to read the latest morning news.",
      "\"What does this note mean?\" asked my friend, touching his nose as we looked at the dinner menu to order a pair of tasty snacks. \"I left my bag, but once we finish, we can see the lion at the zoo next week; nothing could be more exciting!\"",
      "When I wake up from a slow nap, my true plan is to walk past the green park and swim in the cool pool.",
      "Along the tall brick wall, some owners open a small shop to sell a pink shoe or a new type of clothes.",
      "\"It is time to take a yellow taxi, send a quick text message to tell them where to stop, and show them the real road,\" said my brother.",
      "They are sure that rich and poor people all enjoy the same sunny weather, more than staying indoors, then they turn toward the post office soon.",
      "In early April of this year, we begin a busy week to build and clean our house from east to west.",
      "\"Yeah, I agree with your word that we could fix this brown wooden chair and wash the dirty dress well,\" said the smiling actor.",
      "When you feel bored or angry, take a short break at eight o’clock, look below at the beach, and do what you want to do.",
      "We wear a cheap coat, bring a glass of red wine, look at the antique clock on the wall, and talk about exciting plans again.",
      "\"Hello! Welcome to our local community house on this first night of March,\" said the leader of our group.",
      "Every month, forty or fifty neighbors enjoy a large cultural event with bright light and sweet fruit juice on the green grass.",
      "In front of the building, a funny model wears blue jeans, while maybe a strong brown horse stands twenty metre to the north.",
      "A cute little grey mouse never makes a sound near the fifth floor, and you can often guess which team will win the final sports match, so no false rumors spread from mouth to mouth with extra joy.",
      "Today, after a quick trip to the south part of town, I feel tired and quite ready to relax in a quiet place.",
      "On the small wooden table, there is a piece of fresh onion salad, a harmless pet snake in a safe glass box, and an order of warm soup for three or seven people.",
      "A young lady in a short skirt and blue shirt plays a sweet story on the grand piano with wonderful style.",
      "\"Sorry, I thank you for this lovely space, but I think the other thing on this sheet of paper needs a title to speak to their point, costing only one pound,\" she said.",
      "In warm August, my young cousin and caring uncle always walk across the city centre to watch the sunset around us.",
      "\"Never be afraid to choose a better path, change your habits, and decide which dream you want to design in detail,\" was his wise advice.",
      "Under the big white tree behind the house, we drink from a cold glass bottle with fresh bread and golden butter until dark.",
      "Anyone would agree that this common topic is not boring, and there is nothing wrong with asking questions twice to become wiser in this wide world, where every colour has an answer."
    ],
    "paragraphsUz": [
      "Salom! Men uyda iliq to‘shagimdaman va tonggi toza havo bizga juda yoqimli sezilmoqda.",
      "Otam: \"Voy, uyg‘onish, mashqlarni bajarish va agar xohlasang, bizdan bir chashka choy yoki sut qo‘shishni so‘rash vaqti bo‘ldi\", dedilar.",
      "Biz polda katta qutini ko‘rdik, lekin u: \"Yo‘q, uni ochma, bu ikki kun oldin mening yoshimdagi do‘stimdan kelgan sovg‘a\", dedi.",
      "U qo‘lini tekshirdi, televizorni yoqdi va menga: \"Hammasi yaxshi, bugun hech narsa yomon emas, hammaga xayr deyishdan oldin daladagi sigirni tomosha qilishimiz mumkin\", dedi.",
      "Hoy! Ushbu issiq kunda otam qizil shlyapasini kiydi va tashqariga chiqish uchun eski mashina kalitini oldi.",
      "\"U o‘z mashg‘ulotini qilsin va hoziroq yangi sport zalimizga jo‘nasin\", dedi uning ukasi tabassum bilan.",
      "Zalda inson bir necha hafta ichida qanday qilib yog‘dan xalos bo‘lishi mumkin? Murabbiy unga oyog‘i yoki qulog‘ini shikastlamaslikni va uning trenajyorlari qanday ishlashini ko‘rishni tushuntirdi.",
      "Soat oxiriga kelib, ko‘p muzdek sovuq suv ularga tetiklashishga yordam berdi va devorda cho‘chqaning kulgili suratini ko‘rishdi. \"Endi dam olishingiz mumkin!\" dedi murabbiy.",
      "\"Ha, sen tezkor velosipedingda ham bizning hududdagi shinam kafega kelishing mumkin\", dedi aziz xolam telefon orqali.",
      "U issiq ko‘k palto va charm etik kiyib oldi, chunki tashqarida sovuq edi va soat o‘nga yoki oltiga ikki daqiqa qolganini ko‘rsatardi.",
      "Biz ko‘chadan uzoqda, old eshik yonidagi yog‘och stolga o‘tiramiz va ikkalamiz ham mazali shirin tort buyurtma qilamiz.",
      "Ushbu ajoyib musiqa klubi va guruhida chalayotgan musiqachi kim? Qolaversa, bunday uchrashuvda yoqimli vannadan so‘ng issiq choy eng yaxshisi bo‘lganida, nega har bir sentni qimmatbaho pivo uchun sarflash kerak?",
      "Shaharning sharqiy tomonidan biz har bir yevroni halol topish va amakimning oilaviy fermasiga qo‘shilish uchun tez yetib boramiz.",
      "Bu oson emas, lekin aslida yangi hosil yetishtirish va olmadan to‘la savatga ega bo‘lish ajoyib va hayotdagi eng yaxshi tajribadir.",
      "Biz ochiq havoda qushlarning kuylashini eshitamiz va har bir ishchi issiq olov yonida to‘rt yoki besh daqiqa dam olish uchun bo‘sh soat topishi mumkin.",
      "\"Mana, bu og‘ir kulrang qutini ko‘tarishga yordam berish uchun menga qo‘lingni ber\", deydi yuzida qora sochlari bo‘lgan baland bo‘yli baquvvat dehqon. \"Bunday sharoitda yana nima yaxshiroq g‘oya bo‘lishi mumkin?\" Bu og‘ir mehnat, lekin biz mustahkam do‘stlik shakllantirishni yaxshi ko‘ramiz.",
      "Quyoshli iyun va issiq iyul oylarida men toza qog‘oz sahifasida yuqorisiga o‘z ismimni yozib, to‘qqizta shaxsiy maqsadlar ro‘yxatini yuritishni yoqtiraman.",
      "Biz bilamizki, hayot uzoq bir safar bo‘lib, unda siz kechikmasligingiz, ko‘p imkoniyatlarni boy bermasligingiz va hech qachon umidni yo‘qotmasligingiz kerak.",
      "Asosiy shahar chizig‘i yonida, yashil yer uzra atigi bir mil narida, ko‘pchilik do‘stlar ertalabki so‘nggi yangiliklarni o‘qish uchun uchrashadilar.",
      "\"Bu eslatma nimani anglatadi?\" deb so‘radi do‘stim, kechki ovqat menyusiga qarab bir juft mazali tamaddi buyurtma qilayotganimizda burnini qashib. \"Men sumkamni chap tomonda qoldiribman, lekin tugatgach, keyingi hafta hayvonot bog‘idagi arslonni ko‘rishimiz mumkin; bundan ortiq hayajonli narsa yo‘q!\"",
      "Sokin uyqudan uyg‘onganimda, mening haqiqiy rejam yashil park yonidan yurib o‘tish va salqin hovuzda suzishdir.",
      "Baland g‘ishtin devor bo‘ylab, ba’zi egalar pushti poyabzal yoki yangi turdagi kiyimlarni sotish uchun kichik do‘kon ochadilar.",
      "\"Sariq taksiga o‘tirish, ularga qayerda to‘xtashni aytish uchun tezkor matnli xabar yuborish va ularga haqiqiy yo‘lni ko‘rsatish vaqti keldi\", dedi akam.",
      "Ular ishonch bilan bilishadiki, boy va kamtar insonlarning barchasi uyda o‘tirishdan ko‘ra bir xil quyoshli ob-havodan zavqlanadilar, so‘ngra tez orada pochta tomon buriladilar.",
      "Ushbu yilning aprel oyi boshida biz uyimizni sharqdan g‘arbgacha tozalash va ta’mirlash uchun qizg‘in haftani boshlaymiz.",
      "\"Ha, men seni ushbu jigarrang yog‘och stulni tuzatishimiz va kir ko‘ylakni yaxshilab yuvishimiz mumkinligi haqidagi so‘zingga qo‘shilaman\", dedi tabassum qilayotgan aktyor.",
      "Zerikkaningizda yoki jahlingiz chiqqanda, soat sakkizda qisqa tanaffus qiling, pastdagi sohilga qarang va o‘zingiz xohlagan ishni qiling.",
      "Biz arzon palto kiyamiz, bir qadah qizil sharob keltiramiz, devordagi qadimiy soatga qaraymiz va yana qiziqarli rejalar haqida suhbatlashamiz.",
      "\"Assalomu alaykum! Mart oyining birinchi kechasida mahalliy jamoat uyimizga xush kelibsiz\", dedi guruhimiz rahbari.",
      "Har oyda qirq yoki ellik nafar qo‘shnilar yashil maysa ustida yorqin chiroqlar va shirin meva sharbati bilan katta madaniy tadbirdan bahramand bo‘lishadi.",
      "Bino oldida kulgili model ko‘k jinsi kiyib turibdi, balki kuchli ot yigirma metr shimolda joylashgandir.",
      "Kichkina yoqimli sichqoncha beshinchi qavat yaqinida hech qachon tovush chiqarmaydi va siz yakuniy sport o‘yinida qaysi jamoa g‘alaba qozonishini tez-tez taxmin qilishingiz mumkin, shuning uchun hech qanday yolg‘on gaplar og‘izdan-og‘izga tarqalmaydi.",
      "Bugun shaharning janubiy qismiga tezkor safardan so‘ng, men o‘zimni charchagan va tinch joyda dam olishga to‘liq tayyor his qilaman.",
      "Kichik yog‘och stolda yangi piyozli salat bo‘lagi, xavfsiz shisha qutidagi zararsiz ilon va uch yoki yetti kishi uchun iliq sho‘rva buyurtmasi turibdi.",
      "Kalta yubka va ko‘k ko‘ylakdagi yosh xonim ajoyib uslub bilan royal pianosida yoqimli ohang chalmoqda.",
      "\"Kechirasiz, men sizga ushbu ajoyib joy uchun minnatdorchilik bildiraman, ammo menimcha, ushbu qog‘oz varag‘idagi boshqa narsa atigi bir funt turadigan o‘z mavzusini ifodalash uchun sarlavhaga muhtoj\", dedi u.",
      "Issiq avgust oyida mening yosh amakivachcham va mehribon amakim har doim atrofimizdagi quyosh botishini tomosha qilish uchun shahar markazi bo‘ylab yurishadi.",
      "\"Yaxshiroq yo‘lni tanlashdan, odatlaringizni o‘zgartirishdan va qaysi orzuni batafsil loyihalashtirishni hal qilishdan hech qachon qo‘rqmang\", dedi u o‘zining dono maslahatida.",
      "Uy orqasidagi katta oq daraxt ostida, biz qorong‘i tushguncha yangi non va sariyog‘ bilan sovuq shisha idishdan ichamiz.",
      "Har qanday inson ushbu umumiy mavzu zerikarli emasligiga va har bir rang o‘z javobiga ega bo‘lgan ushbu keng dunyoda donoroq bo‘lish uchun ikki marta savol berishning hech qanday yomon tomoni yo‘qligiga qo‘shiladi."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0001",
        "english": "i",
        "uzbek": "men",
        "transcription": "/aɪ/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0002",
        "english": "at",
        "uzbek": "yonida",
        "transcription": "/æt/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0003",
        "english": "be",
        "uzbek": "bo'lmoq",
        "transcription": "/biː/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0004",
        "english": "do",
        "uzbek": "qilmoq",
        "transcription": "/duː/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0005",
        "english": "he",
        "uzbek": "u",
        "transcription": "/hiː/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0006",
        "english": "hi",
        "uzbek": "salom",
        "transcription": "/haɪ/",
        "partOfSpeech": "Undov",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0007",
        "english": "if",
        "uzbek": "agar",
        "transcription": "/ɪf/",
        "partOfSpeech": "Bog‘lovchi",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0008",
        "english": "in",
        "uzbek": "ichkarida",
        "transcription": "/ɪn/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0009",
        "english": "me",
        "uzbek": "meni",
        "transcription": "/miː/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0010",
        "english": "my",
        "uzbek": "mening",
        "transcription": "/maɪ/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0011",
        "english": "no",
        "uzbek": "toshko'mir koni",
        "transcription": "/nəʊ/",
        "partOfSpeech": "Ravish",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0012",
        "english": "of",
        "uzbek": "ning",
        "transcription": "/ʌv/",
        "partOfSpeech": "Bog‘lovchi",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0013",
        "english": "oh",
        "uzbek": "voy",
        "transcription": "/əʊ/",
        "partOfSpeech": "Undov",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0014",
        "english": "ok",
        "uzbek": "yaxshi",
        "transcription": "/əʊˈkeɪ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0015",
        "english": "on",
        "uzbek": "ustida",
        "transcription": "/ɑːn/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0016",
        "english": "or",
        "uzbek": "yoki",
        "transcription": "/ɔːr/",
        "partOfSpeech": "Bog‘lovchi",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0017",
        "english": "so",
        "uzbek": "shunday",
        "transcription": "/səʊ/",
        "partOfSpeech": "Bog‘lovchi",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0018",
        "english": "to",
        "uzbek": "ga",
        "transcription": "/tuː/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0019",
        "english": "tv",
        "uzbek": "televizor",
        "transcription": "/ˌtiː ˈviː/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0021",
        "english": "us",
        "uzbek": "bizni",
        "transcription": "/ʌs/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0022",
        "english": "we",
        "uzbek": "biz",
        "transcription": "/wiː/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0023",
        "english": "add",
        "uzbek": "qo'shmoq",
        "transcription": "/æd/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0024",
        "english": "age",
        "uzbek": "yosh",
        "transcription": "/eɪdʒ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0025",
        "english": "ago",
        "uzbek": "oldin",
        "transcription": "/əˈɡəʊ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0026",
        "english": "air",
        "uzbek": "havo",
        "transcription": "/er/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0027",
        "english": "and",
        "uzbek": "va",
        "transcription": "/ænd/",
        "partOfSpeech": "Bog‘lovchi",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0028",
        "english": "arm",
        "uzbek": "qo'l",
        "transcription": "/ɑːrm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0030",
        "english": "ask",
        "uzbek": "so'ramoq",
        "transcription": "/æsk/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0031",
        "english": "bad",
        "uzbek": "yomon",
        "transcription": "/bæd/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0032",
        "english": "bed",
        "uzbek": "karavot",
        "transcription": "/bed/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0033",
        "english": "big",
        "uzbek": "katta",
        "transcription": "/bɪɡ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0034",
        "english": "box",
        "uzbek": "quti",
        "transcription": "/bɑːks/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0037",
        "english": "but",
        "uzbek": "lekin",
        "transcription": "/bʌt/",
        "partOfSpeech": "Bog‘lovchi",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0039",
        "english": "bye",
        "uzbek": "xayr",
        "transcription": "/baɪ/",
        "partOfSpeech": "Undov",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0042",
        "english": "cow",
        "uzbek": "sigir",
        "transcription": "/kaʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0043",
        "english": "cup",
        "uzbek": "chashka",
        "transcription": "/kʌp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0044",
        "english": "dad",
        "uzbek": "dada",
        "transcription": "/dæd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0045",
        "english": "day",
        "uzbek": "kun",
        "transcription": "/deɪ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0048",
        "english": "ear",
        "uzbek": "quloq",
        "transcription": "/ɪr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0051",
        "english": "end",
        "uzbek": "oxir",
        "transcription": "/end/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0053",
        "english": "fat",
        "uzbek": "semiz",
        "transcription": "/fæt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0054",
        "english": "few",
        "uzbek": "ozgina",
        "transcription": "/fjuː/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0055",
        "english": "for",
        "uzbek": "uchun",
        "transcription": "/fɔːr/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0056",
        "english": "get",
        "uzbek": "olmoq",
        "transcription": "/ɡet/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0057",
        "english": "gym",
        "uzbek": "gimnastika",
        "transcription": "/dʒɪm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0058",
        "english": "hat",
        "uzbek": "qalpoq",
        "transcription": "/hæt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0059",
        "english": "her",
        "uzbek": "uni",
        "transcription": "/hɜːr/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0060",
        "english": "hey",
        "uzbek": "hey",
        "transcription": "/heɪ/",
        "partOfSpeech": "Undov",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0061",
        "english": "him",
        "uzbek": "uni",
        "transcription": "/ɪm/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0062",
        "english": "his",
        "uzbek": "uning",
        "transcription": "/ɪz/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0063",
        "english": "hot",
        "uzbek": "issiq",
        "transcription": "/hɑːt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0064",
        "english": "how",
        "uzbek": "qanday",
        "transcription": "/haʊ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0065",
        "english": "ice",
        "uzbek": "muz",
        "transcription": "/aɪs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0066",
        "english": "its",
        "uzbek": "uning",
        "transcription": "/ɪts/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0068",
        "english": "key",
        "uzbek": "kalit",
        "transcription": "/kiː/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0069",
        "english": "leg",
        "uzbek": "oyoq",
        "transcription": "/leɡ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0070",
        "english": "let",
        "uzbek": "ruxsat bermoq",
        "transcription": "/let/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0071",
        "english": "lot",
        "uzbek": "bir necha",
        "transcription": "/lɑːt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0074",
        "english": "may",
        "uzbek": "/meɪ/",
        "transcription": "/meɪ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0076",
        "english": "new",
        "uzbek": "yangi",
        "transcription": "/nuː/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0077",
        "english": "not",
        "uzbek": "emas",
        "transcription": "/nɑːt/",
        "partOfSpeech": "Ravish",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0078",
        "english": "now",
        "uzbek": "hozir",
        "transcription": "/naʊ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0079",
        "english": "off",
        "uzbek": "uzoq masofasini bildiradi",
        "transcription": "/ɔːf/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0080",
        "english": "old",
        "uzbek": "yosh",
        "transcription": "/əʊld/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0081",
        "english": "one",
        "uzbek": "bir",
        "transcription": "/wʌn/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0082",
        "english": "our",
        "uzbek": "bizning",
        "transcription": "/ˈaʊər/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0083",
        "english": "out",
        "uzbek": "tashqari",
        "transcription": "/aʊt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0084",
        "english": "own",
        "uzbek": "o'zining",
        "transcription": "/əʊn/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0086",
        "english": "pig",
        "uzbek": "cho'chqa",
        "transcription": "/pɪɡ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0087",
        "english": "put",
        "uzbek": "qo'ymoq",
        "transcription": "/pʊt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0088",
        "english": "red",
        "uzbek": "qizil",
        "transcription": "/red/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0091",
        "english": "see",
        "uzbek": "ko'rmoq",
        "transcription": "/siː/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0092",
        "english": "she",
        "uzbek": "u",
        "transcription": "/ʃiː/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0093",
        "english": "sit",
        "uzbek": "o'tirmoq",
        "transcription": "/sɪt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0094",
        "english": "six",
        "uzbek": "olti",
        "transcription": "/sɪks/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0098",
        "english": "ten",
        "uzbek": "o'n",
        "transcription": "/ten/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0099",
        "english": "the",
        "uzbek": "the",
        "transcription": "/ðiː/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0100",
        "english": "too",
        "uzbek": "juda",
        "transcription": "/tuː/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0101",
        "english": "two",
        "uzbek": "ikki",
        "transcription": "/tuː/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0102",
        "english": "who",
        "uzbek": "kim",
        "transcription": "/huː/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0103",
        "english": "why",
        "uzbek": "nima uchun",
        "transcription": "/waɪ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0104",
        "english": "yes",
        "uzbek": "ha",
        "transcription": "/jes/",
        "partOfSpeech": "Ravish",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0105",
        "english": "you",
        "uzbek": "sen",
        "transcription": "/juː/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0106",
        "english": "also",
        "uzbek": "yana",
        "transcription": "/ˈɔːlsəʊ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0107",
        "english": "area",
        "uzbek": "maydon",
        "transcription": "/ˈeriə/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0108",
        "english": "aunt",
        "uzbek": "xola",
        "transcription": "/ænt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0109",
        "english": "away",
        "uzbek": "uzoqda",
        "transcription": "/əˈweɪ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0112",
        "english": "band",
        "uzbek": "orkestr",
        "transcription": "/bænd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0114",
        "english": "bath",
        "uzbek": "hammom",
        "transcription": "/bæθ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0115",
        "english": "beer",
        "uzbek": "pivo",
        "transcription": "/bɪr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0116",
        "english": "best",
        "uzbek": "eng zo'r",
        "transcription": "/best/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0117",
        "english": "bike",
        "uzbek": "velosiped",
        "transcription": "/baɪk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0120",
        "english": "blue",
        "uzbek": "ko'k",
        "transcription": "/bluː/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0124",
        "english": "boot",
        "uzbek": "etik",
        "transcription": "/buːt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0126",
        "english": "both",
        "uzbek": "ikkala",
        "transcription": "/bəʊθ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0128",
        "english": "cafe",
        "uzbek": "kafe",
        "transcription": "/kæˈfeɪ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0129",
        "english": "cake",
        "uzbek": "keks",
        "transcription": "/keɪk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0130",
        "english": "call",
        "uzbek": "chaqirmoq",
        "transcription": "/kɔːl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0132",
        "english": "cent",
        "uzbek": "sent",
        "transcription": "/sent/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0134",
        "english": "club",
        "uzbek": "klub",
        "transcription": "/klʌb/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0135",
        "english": "coat",
        "uzbek": "palto",
        "transcription": "/kəʊt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0136",
        "english": "cold",
        "uzbek": "sovuq",
        "transcription": "/kəʊld/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0137",
        "english": "come",
        "uzbek": "kelmoq",
        "transcription": "/kʌm/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0138",
        "english": "cool",
        "uzbek": "sovuq",
        "transcription": "/kuːl/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0141",
        "english": "date",
        "uzbek": "sana",
        "transcription": "/deɪt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0142",
        "english": "dear",
        "uzbek": "qadrli",
        "transcription": "/dɪr/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0143",
        "english": "desk",
        "uzbek": "yozuv stoli",
        "transcription": "/desk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0146",
        "english": "door",
        "uzbek": "eshik",
        "transcription": "/dɔːr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0147",
        "english": "down",
        "uzbek": "past",
        "transcription": "/daʊn/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0149",
        "english": "each",
        "uzbek": "har bir",
        "transcription": "/iːtʃ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0150",
        "english": "east",
        "uzbek": "sharq",
        "transcription": "/iːst/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0151",
        "english": "easy",
        "uzbek": "oson",
        "transcription": "/ˈiːzi/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0152",
        "english": "else",
        "uzbek": "yana",
        "transcription": "/els/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0153",
        "english": "euro",
        "uzbek": "yevro",
        "transcription": "/ˈjʊrəʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0154",
        "english": "ever",
        "uzbek": "har doim",
        "transcription": "/ˈevər/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0156",
        "english": "face",
        "uzbek": "yuz",
        "transcription": "/feɪs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0157",
        "english": "fact",
        "uzbek": "dalil",
        "transcription": "/fækt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0158",
        "english": "farm",
        "uzbek": "ferma",
        "transcription": "/fɑːrm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0159",
        "english": "fast",
        "uzbek": "tez",
        "transcription": "/fæst/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0162",
        "english": "find",
        "uzbek": "topmoq",
        "transcription": "/faɪnd/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0163",
        "english": "fine",
        "uzbek": "yaxshi",
        "transcription": "/faɪn/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0164",
        "english": "fire",
        "uzbek": "olov",
        "transcription": "/ˈfaɪər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0166",
        "english": "five",
        "uzbek": "besh",
        "transcription": "/faɪv/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0168",
        "english": "foot",
        "uzbek": "oyoq",
        "transcription": "/fʊt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0169",
        "english": "form",
        "uzbek": "anketa",
        "transcription": "/fɔːrm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0170",
        "english": "four",
        "uzbek": "to'rt",
        "transcription": "/fɔːr/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0171",
        "english": "free",
        "uzbek": "ozod",
        "transcription": "/friː/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0172",
        "english": "from",
        "uzbek": "dan",
        "transcription": "/frɑːm/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0173",
        "english": "full",
        "uzbek": "to'la",
        "transcription": "/fʊl/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0176",
        "english": "give",
        "uzbek": "bermoq",
        "transcription": "/ɡɪv/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0177",
        "english": "good",
        "uzbek": "yaxshi",
        "transcription": "/ɡʊd/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0178",
        "english": "grey",
        "uzbek": "kulrang",
        "transcription": "/ɡreɪ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0179",
        "english": "grow",
        "uzbek": "o'smoq",
        "transcription": "/ɡrəʊ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0180",
        "english": "hair",
        "uzbek": "soch",
        "transcription": "/her/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0182",
        "english": "hard",
        "uzbek": "qattiq",
        "transcription": "/hɑːrd/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0183",
        "english": "have",
        "uzbek": "bor bo'lmoq",
        "transcription": "/hæv/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0185",
        "english": "hear",
        "uzbek": "eshitmoq",
        "transcription": "/hɪr/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0186",
        "english": "help",
        "uzbek": "yordam bermoq",
        "transcription": "/help/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0187",
        "english": "here",
        "uzbek": "bu yerda",
        "transcription": "/hɪr/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0188",
        "english": "high",
        "uzbek": "baland",
        "transcription": "/haɪ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0189",
        "english": "hour",
        "uzbek": "bir soat",
        "transcription": "/ˈaʊər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0190",
        "english": "idea",
        "uzbek": "g'oya",
        "transcription": "/aɪˈdiːə/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0191",
        "english": "into",
        "uzbek": "ichkari",
        "transcription": "/ˈɪntuː/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0192",
        "english": "join",
        "uzbek": "biriktirmoq",
        "transcription": "/dʒɔɪn/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0193",
        "english": "july",
        "uzbek": "iyul",
        "transcription": "/dʒuˈlaɪ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0194",
        "english": "june",
        "uzbek": "iyun",
        "transcription": "/dʒuːn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0195",
        "english": "keep",
        "uzbek": "saqlamoq",
        "transcription": "/kiːp/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0196",
        "english": "know",
        "uzbek": "bilmoq",
        "transcription": "/nəʊ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0197",
        "english": "land",
        "uzbek": "quruqlik",
        "transcription": "/lænd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0198",
        "english": "late",
        "uzbek": "kech qolgan",
        "transcription": "/leɪt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0199",
        "english": "left",
        "uzbek": "chap",
        "transcription": "/left/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0200",
        "english": "life",
        "uzbek": "hayot",
        "transcription": "/laɪf/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0201",
        "english": "line",
        "uzbek": "chiziq",
        "transcription": "/laɪn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0202",
        "english": "lion",
        "uzbek": "sher",
        "transcription": "/ˈlaɪən/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0203",
        "english": "list",
        "uzbek": "ro'yxat",
        "transcription": "/lɪst/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0204",
        "english": "long",
        "uzbek": "uzun",
        "transcription": "/lɔːŋ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0205",
        "english": "lose",
        "uzbek": "yo'qotmoq",
        "transcription": "/luːz/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0207",
        "english": "main",
        "uzbek": "asosiy",
        "transcription": "/meɪn/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0210",
        "english": "mean",
        "uzbek": "anglatmoq",
        "transcription": "/miːn/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0212",
        "english": "meet",
        "uzbek": "uchrashmoq",
        "transcription": "/miːt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0213",
        "english": "menu",
        "uzbek": "menyu",
        "transcription": "/ˈmenjuː/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0214",
        "english": "mile",
        "uzbek": "mil",
        "transcription": "/maɪl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0216",
        "english": "miss",
        "uzbek": "o'tkazib yubormoq",
        "transcription": "/mɪs/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0217",
        "english": "more",
        "uzbek": "ko'proq",
        "transcription": "/mɔːr/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0218",
        "english": "most",
        "uzbek": "eng ko'p",
        "transcription": "/məʊst/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0219",
        "english": "much",
        "uzbek": "ko'p",
        "transcription": "/mʌtʃ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0220",
        "english": "must",
        "uzbek": "shart",
        "transcription": "/mʌst/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0221",
        "english": "name",
        "uzbek": "ism",
        "transcription": "/neɪm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0222",
        "english": "near",
        "uzbek": "yaqin",
        "transcription": "/nɪr/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0223",
        "english": "news",
        "uzbek": "yangilik",
        "transcription": "/nuːz/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0224",
        "english": "next",
        "uzbek": "keyingi",
        "transcription": "/nekst/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0225",
        "english": "nice",
        "uzbek": "yoqimli",
        "transcription": "/naɪs/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0226",
        "english": "nine",
        "uzbek": "to'qqiz",
        "transcription": "/naɪn/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0227",
        "english": "nose",
        "uzbek": "burun",
        "transcription": "/nəʊz/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0228",
        "english": "note",
        "uzbek": "qayd",
        "transcription": "/nəʊt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0229",
        "english": "once",
        "uzbek": "bir marta",
        "transcription": "/wʌns/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0230",
        "english": "only",
        "uzbek": "faqat",
        "transcription": "/ˈəʊnli/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0232",
        "english": "over",
        "uzbek": "ustida",
        "transcription": "/ˈəʊvər/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0233",
        "english": "page",
        "uzbek": "bet",
        "transcription": "/peɪdʒ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0234",
        "english": "pair",
        "uzbek": "juft",
        "transcription": "/per/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0235",
        "english": "park",
        "uzbek": "park",
        "transcription": "/pɑːrk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0237",
        "english": "past",
        "uzbek": "o'tgan",
        "transcription": "/pæst/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0238",
        "english": "pink",
        "uzbek": "pushti",
        "transcription": "/pɪŋk/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0239",
        "english": "plan",
        "uzbek": "reja",
        "transcription": "/plæn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0241",
        "english": "pool",
        "uzbek": "hovuz",
        "transcription": "/puːl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0242",
        "english": "poor",
        "uzbek": "kambag'al",
        "transcription": "/pɔːr/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0243",
        "english": "post",
        "uzbek": "pochta",
        "transcription": "/pəʊst/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0246",
        "english": "real",
        "uzbek": "haqiqiy",
        "transcription": "/ˈriːəl/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0248",
        "english": "rich",
        "uzbek": "boy",
        "transcription": "/rɪtʃ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0253",
        "english": "same",
        "uzbek": "bir xil",
        "transcription": "/seɪm/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0254",
        "english": "sell",
        "uzbek": "sotmoq",
        "transcription": "/sel/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0255",
        "english": "send",
        "uzbek": "jo'natmoq",
        "transcription": "/send/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0256",
        "english": "shoe",
        "uzbek": "tufli",
        "transcription": "/ʃuː/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0257",
        "english": "shop",
        "uzbek": "do'kon",
        "transcription": "/ʃɑːp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0258",
        "english": "show",
        "uzbek": "ko'rsatmoq",
        "transcription": "/ʃəʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0261",
        "english": "slow",
        "uzbek": "sekin",
        "transcription": "/sləʊ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0263",
        "english": "some",
        "uzbek": "bir qancha",
        "transcription": "/sʌm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0265",
        "english": "soon",
        "uzbek": "tez orada",
        "transcription": "/suːn/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0268",
        "english": "stop",
        "uzbek": "to`xtatmoq",
        "transcription": "/stɑːp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0269",
        "english": "sure",
        "uzbek": "shubhasiz",
        "transcription": "/ʃʊr/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0270",
        "english": "take",
        "uzbek": "olmoq",
        "transcription": "/teɪk/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0271",
        "english": "tall",
        "uzbek": "baland",
        "transcription": "/tɔːl/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0272",
        "english": "taxi",
        "uzbek": "taksi",
        "transcription": "/ˈtæksi/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0274",
        "english": "tell",
        "uzbek": "aytmoq",
        "transcription": "/tel/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0276",
        "english": "text",
        "uzbek": "matn",
        "transcription": "/tekst/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0277",
        "english": "than",
        "uzbek": "ga qaraganda",
        "transcription": "/ðæn/",
        "partOfSpeech": "Bog‘lovchi",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0278",
        "english": "them",
        "uzbek": "ularni",
        "transcription": "/ðem/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0279",
        "english": "then",
        "uzbek": "keyin",
        "transcription": "/ðen/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0280",
        "english": "they",
        "uzbek": "ular",
        "transcription": "/ðeɪ/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0281",
        "english": "time",
        "uzbek": "vaqt",
        "transcription": "/taɪm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0285",
        "english": "true",
        "uzbek": "to`g`ri",
        "transcription": "/truː/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0286",
        "english": "turn",
        "uzbek": "aylanmoq",
        "transcription": "/tɜːrn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0287",
        "english": "type",
        "uzbek": "tur",
        "transcription": "/taɪp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0288",
        "english": "wake",
        "uzbek": "uyg`onmoq",
        "transcription": "/weɪk/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0289",
        "english": "walk",
        "uzbek": "yurmoq",
        "transcription": "/wɔːk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0290",
        "english": "wall",
        "uzbek": "devor",
        "transcription": "/wɔːl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0291",
        "english": "want",
        "uzbek": "xohlamoq",
        "transcription": "/wɑːnt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0293",
        "english": "wear",
        "uzbek": "kiymoq",
        "transcription": "/wer/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0294",
        "english": "week",
        "uzbek": "hafta",
        "transcription": "/wiːk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0295",
        "english": "well",
        "uzbek": "yaxshi",
        "transcription": "/wel/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0296",
        "english": "west",
        "uzbek": "g`arb",
        "transcription": "/west/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0297",
        "english": "what",
        "uzbek": "nima",
        "transcription": "/wʌt/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0298",
        "english": "when",
        "uzbek": "qachon",
        "transcription": "/wen/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0300",
        "english": "wine",
        "uzbek": "sharob",
        "transcription": "/waɪn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0301",
        "english": "with",
        "uzbek": "bilan",
        "transcription": "/wɪθ/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0302",
        "english": "word",
        "uzbek": "so`z",
        "transcription": "/wɜːrd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0304",
        "english": "yeah",
        "uzbek": "ha",
        "transcription": "/jeə/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0305",
        "english": "year",
        "uzbek": "yil",
        "transcription": "/jɪr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0306",
        "english": "your",
        "uzbek": "sizning",
        "transcription": "/jər/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0307",
        "english": "about",
        "uzbek": "haqida",
        "transcription": "/əˈbaʊt/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0309",
        "english": "actor",
        "uzbek": "aktiyor",
        "transcription": "/ˈæktər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0310",
        "english": "again",
        "uzbek": "yana",
        "transcription": "/əˈɡeɪn/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0311",
        "english": "agree",
        "uzbek": "rozi bo'lmoq",
        "transcription": "/əˈɡriː/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0312",
        "english": "angry",
        "uzbek": "g'azablangan",
        "transcription": "/ˈæŋɡri/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0314",
        "english": "april",
        "uzbek": "aprel",
        "transcription": "/ˈeɪprəl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0315",
        "english": "beach",
        "uzbek": "sohil",
        "transcription": "/biːtʃ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0316",
        "english": "begin",
        "uzbek": "boshlamoq",
        "transcription": "/bɪˈɡɪn/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0317",
        "english": "below",
        "uzbek": "tagida",
        "transcription": "/bɪˈləʊ/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0319",
        "english": "bored",
        "uzbek": "zerikkan",
        "transcription": "/bɔːrd/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0321",
        "english": "break",
        "uzbek": "sindirmoq",
        "transcription": "/breɪk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0322",
        "english": "bring",
        "uzbek": "keltirmoq",
        "transcription": "/brɪŋ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0323",
        "english": "brown",
        "uzbek": "jigarrang",
        "transcription": "/braʊn/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0324",
        "english": "build",
        "uzbek": "qurmoq",
        "transcription": "/bɪld/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0326",
        "english": "chair",
        "uzbek": "stul",
        "transcription": "/tʃer/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0328",
        "english": "cheap",
        "uzbek": "arzon",
        "transcription": "/tʃiːp/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0331",
        "english": "clean",
        "uzbek": "toza",
        "transcription": "/kliːn/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0332",
        "english": "clock",
        "uzbek": "soat",
        "transcription": "/klɑːk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0333",
        "english": "could",
        "uzbek": "qila olmoq",
        "transcription": "/kʊd/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0335",
        "english": "dirty",
        "uzbek": "kir",
        "transcription": "/ˈdɜːrti/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0336",
        "english": "dress",
        "uzbek": "ko'ylak",
        "transcription": "/dres/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0338",
        "english": "early",
        "uzbek": "erta",
        "transcription": "/ˈɜːrli/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0339",
        "english": "eight",
        "uzbek": "sakkiz",
        "transcription": "/eɪt/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0340",
        "english": "enjoy",
        "uzbek": "rohatlanmoq",
        "transcription": "/ɪnˈdʒɔɪ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0341",
        "english": "event",
        "uzbek": "hodisa",
        "transcription": "/ɪˈvent/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0342",
        "english": "every",
        "uzbek": "har bir",
        "transcription": "/ˈevri/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0343",
        "english": "extra",
        "uzbek": "qo'shimcha",
        "transcription": "/ˈekstrə/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0344",
        "english": "false",
        "uzbek": "yolg'on",
        "transcription": "/fɔːls/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0345",
        "english": "fifth",
        "uzbek": "o'n beshinchi",
        "transcription": "/fɪfθ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0346",
        "english": "fifty",
        "uzbek": "ellik",
        "transcription": "/ˈfɪfti/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0347",
        "english": "final",
        "uzbek": "yakuniy",
        "transcription": "/ˈfaɪnl/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0348",
        "english": "first",
        "uzbek": "birinchi",
        "transcription": "/fɜːrst/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0349",
        "english": "floor",
        "uzbek": "qavat",
        "transcription": "/flɔːr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0350",
        "english": "forty",
        "uzbek": "qirq",
        "transcription": "/ˈfɔːrti/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0351",
        "english": "front",
        "uzbek": "old tomon",
        "transcription": "/frʌnt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0353",
        "english": "funny",
        "uzbek": "kulgili",
        "transcription": "/ˈfʌni/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0356",
        "english": "green",
        "uzbek": "yashil",
        "transcription": "/ɡriːn/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0357",
        "english": "group",
        "uzbek": "guruh",
        "transcription": "/ɡruːp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0358",
        "english": "guess",
        "uzbek": "taxmin qilmoq",
        "transcription": "/ɡes/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0360",
        "english": "hello",
        "uzbek": "salom",
        "transcription": "/həˈləʊ/",
        "partOfSpeech": "Undov",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0362",
        "english": "horse",
        "uzbek": "ot",
        "transcription": "/hɔːrs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0364",
        "english": "house",
        "uzbek": "uy",
        "transcription": "/haʊs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0365",
        "english": "jeans",
        "uzbek": "jinsi shim",
        "transcription": "/dʒiːnz/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0366",
        "english": "juice",
        "uzbek": "sharbat",
        "transcription": "/dʒuːs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0367",
        "english": "large",
        "uzbek": "katta",
        "transcription": "/lɑːrdʒ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0370",
        "english": "light",
        "uzbek": "yorug'lik",
        "transcription": "/laɪt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0371",
        "english": "local",
        "uzbek": "mahalliy",
        "transcription": "/ˈləʊkl/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0373",
        "english": "march",
        "uzbek": "mart",
        "transcription": "/mɑːrtʃ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0374",
        "english": "match",
        "uzbek": "match",
        "transcription": "/mætʃ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0375",
        "english": "maybe",
        "uzbek": "balki",
        "transcription": "/ˈmeɪbi/",
        "partOfSpeech": "Ravish",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0376",
        "english": "metre",
        "uzbek": "metr",
        "transcription": "/ˈmiːtər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0377",
        "english": "model",
        "uzbek": "model",
        "transcription": "/ˈmɑːdl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0379",
        "english": "month",
        "uzbek": "oy",
        "transcription": "/mʌnθ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0380",
        "english": "mouse",
        "uzbek": "sichqon",
        "transcription": "/maʊs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0381",
        "english": "mouth",
        "uzbek": "og'iz",
        "transcription": "/maʊθ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0384",
        "english": "never",
        "uzbek": "hech qachon",
        "transcription": "/ˈnevər/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0385",
        "english": "night",
        "uzbek": "tun",
        "transcription": "/naɪt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0386",
        "english": "north",
        "uzbek": "shimol",
        "transcription": "/nɔːrθ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0388",
        "english": "often",
        "uzbek": "tez-tez",
        "transcription": "/ˈɔːftən/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0389",
        "english": "onion",
        "uzbek": "piyoz",
        "transcription": "/ˈʌnjən/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0390",
        "english": "order",
        "uzbek": "tartib",
        "transcription": "/ˈɔːrdər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0391",
        "english": "other",
        "uzbek": "boshqa",
        "transcription": "/ˈʌðər/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0393",
        "english": "paper",
        "uzbek": "qog'oz",
        "transcription": "/ˈpeɪpər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0397",
        "english": "piano",
        "uzbek": "pianino",
        "transcription": "/piˈænəʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0398",
        "english": "piece",
        "uzbek": "bo'lak",
        "transcription": "/piːs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0399",
        "english": "place",
        "uzbek": "joy",
        "transcription": "/pleɪs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0402",
        "english": "point",
        "uzbek": "g'oya",
        "transcription": "/pɔɪnt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0403",
        "english": "pound",
        "uzbek": "funt",
        "transcription": "/paʊnd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0405",
        "english": "quick",
        "uzbek": "tez",
        "transcription": "/kwɪk/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0406",
        "english": "quiet",
        "uzbek": "tinch",
        "transcription": "/ˈkwaɪət/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0407",
        "english": "quite",
        "uzbek": "bir oz",
        "transcription": "/kwaɪt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0410",
        "english": "relax",
        "uzbek": "dam olmoq",
        "transcription": "/rɪˈlæks/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0413",
        "english": "salad",
        "uzbek": "salat",
        "transcription": "/ˈsæləd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0414",
        "english": "seven",
        "uzbek": "yetti",
        "transcription": "/ˈsevn/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0415",
        "english": "shirt",
        "uzbek": "ko'ylak",
        "transcription": "/ʃɜːrt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0416",
        "english": "short",
        "uzbek": "kalta",
        "transcription": "/ʃɔːrt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0419",
        "english": "skirt",
        "uzbek": "yubka",
        "transcription": "/skɜːrt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0420",
        "english": "small",
        "uzbek": "kichik",
        "transcription": "/smɔːl/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0421",
        "english": "snake",
        "uzbek": "ilon",
        "transcription": "/sneɪk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0422",
        "english": "sorry",
        "uzbek": "uzr",
        "transcription": "/ˈsɑːri/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0423",
        "english": "south",
        "uzbek": "janub",
        "transcription": "/saʊθ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0424",
        "english": "space",
        "uzbek": "koinot",
        "transcription": "/speɪs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0425",
        "english": "speak",
        "uzbek": "gapirmoq",
        "transcription": "/spiːk/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0428",
        "english": "story",
        "uzbek": "hikoya",
        "transcription": "/ˈstɔːri/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0430",
        "english": "style",
        "uzbek": "stil",
        "transcription": "/staɪl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0432",
        "english": "table",
        "uzbek": "stol",
        "transcription": "/ˈteɪbl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0434",
        "english": "thank",
        "uzbek": "rahmat aytmoq",
        "transcription": "/θæŋk/",
        "partOfSpeech": "Undov",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0435",
        "english": "their",
        "uzbek": "ularning",
        "transcription": "/ðer/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0436",
        "english": "there",
        "uzbek": "u yerda",
        "transcription": "/ðer/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0437",
        "english": "thing",
        "uzbek": "narsa",
        "transcription": "/θɪŋ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0438",
        "english": "think",
        "uzbek": "o`ylamoq",
        "transcription": "/θɪŋk/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0439",
        "english": "three",
        "uzbek": "uch",
        "transcription": "/θriː/",
        "partOfSpeech": "Son",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0440",
        "english": "tired",
        "uzbek": "charchagan",
        "transcription": "/ˈtaɪərd/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0441",
        "english": "title",
        "uzbek": "sarlavha",
        "transcription": "/ˈtaɪtl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0442",
        "english": "today",
        "uzbek": "bugun",
        "transcription": "/təˈdeɪ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0444",
        "english": "topic",
        "uzbek": "mavzu",
        "transcription": "/ˈtɑːpɪk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0446",
        "english": "twice",
        "uzbek": "ikki marta",
        "transcription": "/twaɪs/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0447",
        "english": "uncle",
        "uzbek": "amaki",
        "transcription": "/ˈʌŋkl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0448",
        "english": "under",
        "uzbek": "ostida",
        "transcription": "/ˈʌndər/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0449",
        "english": "until",
        "uzbek": "gacha",
        "transcription": "/ənˈtɪl/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0452",
        "english": "watch",
        "uzbek": "kuzatmoq",
        "transcription": "/wɑːtʃ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0454",
        "english": "where",
        "uzbek": "qayerda",
        "transcription": "/wer/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0455",
        "english": "which",
        "uzbek": "qaysi",
        "transcription": "/wɪtʃ/",
        "partOfSpeech": "Olmosh",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0456",
        "english": "white",
        "uzbek": "oq",
        "transcription": "/waɪt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0458",
        "english": "world",
        "uzbek": "dunyo",
        "transcription": "/wɜːrld/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0459",
        "english": "would",
        "uzbek": "bo'lmoq",
        "transcription": "/əd/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0461",
        "english": "wrong",
        "uzbek": "noto`g`ri",
        "transcription": "/rɔːŋ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0462",
        "english": "young",
        "uzbek": "yosh",
        "transcription": "/jʌŋ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0463",
        "english": "across",
        "uzbek": "eniga",
        "transcription": "/əˈkrɔːs/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0465",
        "english": "advice",
        "uzbek": "maslahat",
        "transcription": "/ədˈvaɪs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0466",
        "english": "afraid",
        "uzbek": "qo'rqan",
        "transcription": "/əˈfreɪd/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0467",
        "english": "always",
        "uzbek": "har doim",
        "transcription": "/ˈɔːlweɪz/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0469",
        "english": "answer",
        "uzbek": "javob",
        "transcription": "/ˈænsər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0470",
        "english": "anyone",
        "uzbek": "kimdir",
        "transcription": "/ˈeniwʌn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0471",
        "english": "around",
        "uzbek": "atrofda",
        "transcription": "/əˈraʊnd/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0474",
        "english": "august",
        "uzbek": "avgust",
        "transcription": "/ˈɔːɡəst/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0477",
        "english": "become",
        "uzbek": "bo'lmoq",
        "transcription": "/bɪˈkʌm/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0478",
        "english": "behind",
        "uzbek": "orqada",
        "transcription": "/bɪˈhaɪnd/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0479",
        "english": "better",
        "uzbek": "yaxshiroq",
        "transcription": "/ˈbetər/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0480",
        "english": "boring",
        "uzbek": "zerikarli",
        "transcription": "/ˈbɔːrɪŋ/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0481",
        "english": "bottle",
        "uzbek": "butilka",
        "transcription": "/ˈbɑːtl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0482",
        "english": "butter",
        "uzbek": "saryog'",
        "transcription": "/ˈbʌtər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0486",
        "english": "centre",
        "uzbek": "markaz",
        "transcription": "/ˈsentər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0487",
        "english": "change",
        "uzbek": "o'zgartirmoq",
        "transcription": "/tʃeɪndʒ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0489",
        "english": "choose",
        "uzbek": "tanlamoq",
        "transcription": "/tʃuːz/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0492",
        "english": "colour",
        "uzbek": "rang",
        "transcription": "/ˈkʌlər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0493",
        "english": "common",
        "uzbek": "umumiy",
        "transcription": "/ˈkɑːmən/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0495",
        "english": "cousin",
        "uzbek": "xolavachcha",
        "transcription": "/ˈkʌzn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0498",
        "english": "decide",
        "uzbek": "qaror qilmoq",
        "transcription": "/dɪˈsaɪd/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0499",
        "english": "design",
        "uzbek": "rejalashtirmoq",
        "transcription": "/dɪˈzaɪn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0500",
        "english": "detail",
        "uzbek": "qism",
        "transcription": "/dɪˈteɪl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "What is the overarching theme of this 10-chapter journey?",
        "options": [
          "Everyday life, family, work, and friendship",
          "Space travel",
          "Ancient history",
          "Submarine exploration"
        ],
        "correctIndex": 0,
        "explanationUz": "Hikoyalar to‘plami kundalik hayot, muloqot, do‘stlar va oilaviy rishtalarni to‘liq qamrab olgan."
      }
    ]
  },
  {
    "id": "story_a1_food",
    "level": "A1",
    "topicCategory": "Oziq-ovqat va Pazandachilik",
    "topicEmoji": "🥗",
    "title": "A Delicious Weekend Lunch with the Kitchen Team",
    "titleUz": "Oshpazlar jamoasi bilan mazali shanba tushligi",
    "duration": "3 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Oziq-ovqat va Pazandachilik\" mavzusidagi barcha 27 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 27,
    "coveragePercent": 100,
    "paragraphs": [
      "Every Saturday, our friendly team loves to cook a great meal together. We want to teach young students about a healthy diet and good food.",
      "First, we prepare a warm vegetable soup with clean water, a little salt, and fresh meat or fish. We slice warm bread, boil an egg, and serve hot rice in a white dish.",
      "For lunch, everyone can eat tasty dishes and drink sweet tea, fresh milk, or hot coffee. We do not add too much sugar to our drinks.",
      "Finally, we create a fruit salad using a red apple and a yellow banana. The market price was cheap, and everyone was happy."
    ],
    "paragraphsUz": [
      "Har shanba kuni bizning ahil jamoamiz birgalikda ajoyib taom pishirishni yaxshi ko‘radi. Biz yosh talabalarga sog‘lom parhez va foydali ovqatlar haqida o‘rgatmoqchimiz.",
      "Avvalo, biz toza suv, bir oz tuz hamda yangi go‘sht yoki baliq bilan iliq sabzavotli sho‘rva tayyorlaymiz. Issiq nonni kesamiz, tuxum qaynatamiz va oq idishda qaynoq guruch tortamiz.",
      "Tushlik uchun har bir kishi lazzatli taomlarni yeyishi va shirin choy, yangi sut yoki issiq kofe ichishi mumkin. Biz ichimliklarimizga ortiqcha shakar qo‘shmaymiz.",
      "Nihoyat, biz qizil olma va sariq banandan foydalanib mevali salat yaratamiz. Bozordagi narx arzon edi va hamma xursand bo‘ldi."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0049",
        "english": "eat",
        "uzbek": "yemoq",
        "transcription": "/iːt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0050",
        "english": "egg",
        "uzbek": "tuxum",
        "transcription": "/eɡ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0097",
        "english": "tea",
        "uzbek": "choy",
        "transcription": "/tiː/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0144",
        "english": "diet",
        "uzbek": "ovqat",
        "transcription": "/ˈdaɪət/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0145",
        "english": "dish",
        "uzbek": "idish",
        "transcription": "/dɪʃ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0165",
        "english": "fish",
        "uzbek": "baliq",
        "transcription": "/fɪʃ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0167",
        "english": "food",
        "uzbek": "ovqat",
        "transcription": "/fuːd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0209",
        "english": "meal",
        "uzbek": "taom",
        "transcription": "/miːl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0211",
        "english": "meat",
        "uzbek": "go'sht",
        "transcription": "/miːt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0215",
        "english": "milk",
        "uzbek": "sut",
        "transcription": "/mɪlk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0247",
        "english": "rice",
        "uzbek": "guruch",
        "transcription": "/raɪs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0252",
        "english": "salt",
        "uzbek": "tuz",
        "transcription": "/sɔːlt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0266",
        "english": "soup",
        "uzbek": "sho'rva",
        "transcription": "/suːp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0273",
        "english": "team",
        "uzbek": "jamoa",
        "transcription": "/tiːm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0313",
        "english": "apple",
        "uzbek": "olma",
        "transcription": "/ˈæpl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0320",
        "english": "bread",
        "uzbek": "non",
        "transcription": "/bred/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0337",
        "english": "drink",
        "uzbek": "ichimlik",
        "transcription": "/drɪŋk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0352",
        "english": "fruit",
        "uzbek": "meva",
        "transcription": "/fruːt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0355",
        "english": "great",
        "uzbek": "buyuk",
        "transcription": "/ɡreɪt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0372",
        "english": "lunch",
        "uzbek": "tushki taom",
        "transcription": "/lʌntʃ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0404",
        "english": "price",
        "uzbek": "narx",
        "transcription": "/praɪs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0431",
        "english": "sugar",
        "uzbek": "shakar",
        "transcription": "/ˈʃʊɡər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0433",
        "english": "teach",
        "uzbek": "o'qitmoq",
        "transcription": "/tiːtʃ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0453",
        "english": "water",
        "uzbek": "suv",
        "transcription": "/ˈwɔːtər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0476",
        "english": "banana",
        "uzbek": "banan",
        "transcription": "/bəˈnænə/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0491",
        "english": "coffee",
        "uzbek": "kofe",
        "transcription": "/ˈkɔːfi/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0496",
        "english": "create",
        "uzbek": "yaratmoq",
        "transcription": "/kriˈeɪt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "What do they make for dessert?",
        "options": [
          "A fruit salad with apple and banana",
          "A heavy chocolate cake",
          "Ice cream",
          "Fried meat"
        ],
        "correctIndex": 0,
        "explanationUz": "Ular qizil olma va sariq banandan mevali salat tayyorlaydilar."
      }
    ]
  },
  {
    "id": "story_a1_nature",
    "level": "A1",
    "topicCategory": "Tabiat va Atrof-muhit",
    "topicEmoji": "🌿",
    "title": "An Autumn Walk Through Nature",
    "titleUz": "Tabiat quchog‘idagi kuzgi sayr",
    "duration": "2 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Tabiat va Atrof-muhit\" mavzusidagi barcha 17 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 17,
    "coveragePercent": 100,
    "paragraphs": [
      "In pleasant autumn, the bright sun rises up into the morning sky above the tall green tree.",
      "A friendly black dog and a playful cat run across the field to see every wild animal and delicate plant.",
      "A cheerful little bird sings near the flowing river that runs all the way down to the wide blue sea.",
      "When the sky turns dark and cold rain or soft white snow begins to fall, we look up and see a shining star."
    ],
    "paragraphsUz": [
      "Yoqimli kuz faslida porloq quyosh baland yashil daraxt ustidagi tonggi osmonga ko‘tariladi.",
      "Do‘stona qora it va sho‘x mushuk har bir yovvoyi hayvon va nozik o‘simlikni ko‘rish uchun dala bo‘ylab yuguradi.",
      "Keng moviy dengizga qarab oqib boruvchi jildiragan daryo yonida quvnoq kichik qushcha sayraydi.",
      "Osmon qorong‘ilashib, sovuq yomg‘ir yoki mayin oq qor yog‘a boshlaganda, biz yuqoriga qarab miltillovchi yulduzni ko‘ramiz."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0020",
        "english": "up",
        "uzbek": "yuqoriga",
        "transcription": "/ʌp/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0041",
        "english": "cat",
        "uzbek": "mushuk",
        "transcription": "/kæt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0047",
        "english": "dog",
        "uzbek": "it",
        "transcription": "/dɔːɡ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0090",
        "english": "sea",
        "uzbek": "dengiz",
        "transcription": "/siː/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0096",
        "english": "sun",
        "uzbek": "quyosh",
        "transcription": "/sʌn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0119",
        "english": "bird",
        "uzbek": "qush",
        "transcription": "/bɜːrd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0140",
        "english": "dark",
        "uzbek": "qorong'u",
        "transcription": "/dɑːrk/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0244",
        "english": "rain",
        "uzbek": "yomg'ir",
        "transcription": "/reɪn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0262",
        "english": "snow",
        "uzbek": "qor",
        "transcription": "/snəʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0267",
        "english": "star",
        "uzbek": "yulduz",
        "transcription": "/stɑːr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0283",
        "english": "tree",
        "uzbek": "daraxt",
        "transcription": "/triː/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0308",
        "english": "above",
        "uzbek": "yuqorida",
        "transcription": "/əˈbʌv/",
        "partOfSpeech": "Predlog",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0318",
        "english": "black",
        "uzbek": "qora",
        "transcription": "/blæk/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0401",
        "english": "plant",
        "uzbek": "o'simlik",
        "transcription": "/plænt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0412",
        "english": "river",
        "uzbek": "daryo",
        "transcription": "/ˈrɪvər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0468",
        "english": "animal",
        "uzbek": "hayvon",
        "transcription": "/ˈænɪml/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0475",
        "english": "autumn",
        "uzbek": "kuz",
        "transcription": "/ˈɔːtəm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "What flows down to the wide blue sea?",
        "options": [
          "The flowing river",
          "A big train",
          "A fast airplane",
          "A noisy car"
        ],
        "correctIndex": 0,
        "explanationUz": "Keng moviy dengiz tomon oqib boruvchi daryo tilga olingan."
      }
    ]
  },
  {
    "id": "story_a1_family",
    "level": "A1",
    "topicCategory": "Oila, Shaxs va Hissiyotlar",
    "topicEmoji": "👨‍👩‍👧",
    "title": "A Loving Family Gathering",
    "titleUz": "Mehrli oila diydori",
    "duration": "2 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Oila, Shaxs va Hissiyotlar\" mavzusidagi barcha 20 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 20,
    "coveragePercent": 100,
    "paragraphs": [
      "In a comfortable room of a quiet family hotel, a kind man and his caring wife celebrate with deep love.",
      "Their young son and cheerful girl take quick action to make their sweet mum laugh and feel happy.",
      "A little boy and a smiling baby were born into this household, bringing joyful song and smiles to every child.",
      "Even when someone feels sad or old memories die away, many wonderful people help this good woman stay strong."
    ],
    "paragraphsUz": [
      "Tinch oilaviy mehmonxonaning qulay xonasida mehribon erkak va uning g‘amxo‘r xotini chuqur muhabbat bilan bayram qilishmoqda.",
      "Ularning yosh o‘g‘li va quvnoq qizi shirin onalarini kuldirish va xursand qilish uchun tezkor harakat qilishadi.",
      "Ushbu xonadonda kichik o‘g‘il bola va jilmayuvchi chaqaloq dunyoga kelgan bo‘lib, har bir bolaga quvnoq qo‘shiq va tabassum olib keladi.",
      "Hatto kimdir xafa bo‘lsa yoki eski xotiralar so‘nib borsa ham, ko‘plab ajoyib insonlar bu yaxshi ayolga kuchli bo‘lib qolishga yordam beradi."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0035",
        "english": "boy",
        "uzbek": "bola",
        "transcription": "/bɔɪ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0046",
        "english": "die",
        "uzbek": "o'lmoq",
        "transcription": "/daɪ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0072",
        "english": "man",
        "uzbek": "odam",
        "transcription": "/mæn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0075",
        "english": "mum",
        "uzbek": "ona",
        "transcription": "/mʌm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0089",
        "english": "sad",
        "uzbek": "xafa",
        "transcription": "/sæd/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0095",
        "english": "son",
        "uzbek": "o'g'il",
        "transcription": "/sʌn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0110",
        "english": "baby",
        "uzbek": "chaqaloq",
        "transcription": "/ˈbeɪbi/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0125",
        "english": "born",
        "uzbek": "tug'ilgan",
        "transcription": "/bɔːrn/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0175",
        "english": "girl",
        "uzbek": "qiz",
        "transcription": "/ɡɜːrl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0206",
        "english": "love",
        "uzbek": "sevgi",
        "transcription": "/lʌv/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0208",
        "english": "many",
        "uzbek": "ko'p",
        "transcription": "/ˈmeni/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0250",
        "english": "room",
        "uzbek": "xona",
        "transcription": "/rʊm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0264",
        "english": "song",
        "uzbek": "qo'shiq",
        "transcription": "/sɔːŋ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0299",
        "english": "wife",
        "uzbek": "xotin",
        "transcription": "/waɪf/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0329",
        "english": "child",
        "uzbek": "farzand",
        "transcription": "/tʃaɪld/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0359",
        "english": "happy",
        "uzbek": "baxtli",
        "transcription": "/ˈhæpi/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0363",
        "english": "hotel",
        "uzbek": "mehmonxona",
        "transcription": "/həʊˈtel/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0368",
        "english": "laugh",
        "uzbek": "kulmoq",
        "transcription": "/læf/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0457",
        "english": "woman",
        "uzbek": "ayol",
        "transcription": "/ˈwʊmən/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0464",
        "english": "action",
        "uzbek": "harakat",
        "transcription": "/ˈækʃn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "Where is the family gathering taking place?",
        "options": [
          "In a comfortable room of a quiet hotel",
          "On a stormy sea",
          "In a desert",
          "On an airplane"
        ],
        "correctIndex": 0,
        "explanationUz": "Oila tinch mehmonxonaning qulay xonasida jam bo‘lgan."
      }
    ]
  },
  {
    "id": "story_a1_culture",
    "level": "A1",
    "topicCategory": "Madaniyat, San’at va Hordiq",
    "topicEmoji": "🎭",
    "title": "The Vibrant City Arts Festival",
    "titleUz": "Shahar madaniyat va san’at festivali",
    "duration": "2 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Madaniyat, San’at va Hordiq\" mavzusidagi barcha 19 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 19,
    "coveragePercent": 100,
    "paragraphs": [
      "On Sunday, an inspiring artist invites us to an art gallery to see how people draw, sing, and dance with joy.",
      "My favorite hobby is playing this active sport with a round ball, while other friends play an exciting board game.",
      "At night, a lively party begins with modern music, and a skilled dancer takes part in the stage show.",
      "Later, we walk to the historic cinema to watch a great film and a short movie, looking at the weekly chart and taking a colorful photo."
    ],
    "paragraphsUz": [
      "Yakshanba kuni ilhomlantiruvchi san’atkor bizni insonlar qanday qilib quvonch bilan chizishini, kuylashini va raqsga tushishini ko‘rish uchun san’at galereyasiga taklif qiladi.",
      "Mening sevimli xobbim dumaloq koptok bilan ushbu faol sportni o‘ynashdir, boshqa do‘stlar esa qiziqarli stol o‘yinini o‘ynashadi.",
      "Kechasi zamonaviy musiqa bilan jo‘shqin bazm boshlanadi va mohir raqqosa sahna tomoshasida ishtirok etadi.",
      "Keyinroq biz haftalik chartga qarab va rang-barang suratga tushib, ajoyib film va qisqa kinoni tomosha qilish uchun tarixiy kinoteatrga boramiz."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0029",
        "english": "art",
        "uzbek": "san'at",
        "transcription": "/ɑːrt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0111",
        "english": "ball",
        "uzbek": "koptok",
        "transcription": "/bɔːl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0148",
        "english": "draw",
        "uzbek": "chizmoq",
        "transcription": "/drɔː/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0161",
        "english": "film",
        "uzbek": "film",
        "transcription": "/fɪlm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0174",
        "english": "game",
        "uzbek": "o'yin",
        "transcription": "/ɡeɪm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0236",
        "english": "part",
        "uzbek": "qism",
        "transcription": "/pɑːrt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0240",
        "english": "play",
        "uzbek": "o'ynamoq",
        "transcription": "/pleɪ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0260",
        "english": "sing",
        "uzbek": "kuylamoq",
        "transcription": "/sɪŋ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0327",
        "english": "chart",
        "uzbek": "grafik",
        "transcription": "/tʃɑːrt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0334",
        "english": "dance",
        "uzbek": "raqs",
        "transcription": "/dæns/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0361",
        "english": "hobby",
        "uzbek": "xobbi",
        "transcription": "/ˈhɑːbi/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0382",
        "english": "movie",
        "uzbek": "film",
        "transcription": "/ˈmuːvi/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0383",
        "english": "music",
        "uzbek": "musiqa",
        "transcription": "/ˈmjuːzɪk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0394",
        "english": "party",
        "uzbek": "bazm",
        "transcription": "/ˈpɑːrti/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0396",
        "english": "photo",
        "uzbek": "surat",
        "transcription": "/ˈfəʊtəʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0427",
        "english": "sport",
        "uzbek": "sport",
        "transcription": "/spɔːrt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0473",
        "english": "artist",
        "uzbek": "artist",
        "transcription": "/ˈɑːrtɪst/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0490",
        "english": "cinema",
        "uzbek": "kinoteatr",
        "transcription": "/ˈsɪnəmə/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0497",
        "english": "dancer",
        "uzbek": "raqqosa",
        "transcription": "/ˈdænsər/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "Where do they go to watch a great film?",
        "options": [
          "To the historic cinema",
          "To the river",
          "To a supermarket",
          "To a factory"
        ],
        "correctIndex": 0,
        "explanationUz": "Ular ajoyib film ko‘rish uchun tarixiy kinoteatrga borishadi."
      }
    ]
  },
  {
    "id": "story_a1_travel",
    "level": "A1",
    "topicCategory": "Sayohat va Transport",
    "topicEmoji": "✈️",
    "title": "A Memorable Journey Across the Country",
    "titleUz": "Mamlakat bo‘ylab unutilmas sayohat",
    "duration": "2 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Sayohat va Transport\" mavzusidagi barcha 16 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 16,
    "coveragePercent": 100,
    "paragraphs": [
      "To start our exciting trip, we buy a travel card and look at the city map to visit every historic town.",
      "We carry a small bag with a fresh orange carrot to eat along the busy road.",
      "First, we ride a clean public bus and drive a rental car past green fields and mountains.",
      "Next, we board a fast train, fly on a plane, and cross the calm lake by small boat until we safely arrive."
    ],
    "paragraphsUz": [
      "Hayajonli sayohatimizni boshlash uchun biz yo‘l kartasini sotib olamiz va har bir tarixiy shaharga tashrif buyurish uchun shahar xaritasiga qaraymiz.",
      "Biz gavjum yo‘l bo‘ylab yeyish uchun yangi sabzi solingan kichik sumka ko‘tarib yuramiz.",
      "Dastlab, biz toza jamoat avtobusiga chiqamiz va yashil dalalar hamda tog‘lar yonidan ijaraga olingan mashinada o‘tamiz.",
      "Keyin biz tezyurar poyezdga chiqamiz, samolyotda uchamiz va xavfsiz yetib kelgunimizcha kichik qayiqda sokin ko‘lni kesib o‘tamiz."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0036",
        "english": "bus",
        "uzbek": "avtobus",
        "transcription": "/bʌs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0040",
        "english": "car",
        "uzbek": "avtomobil",
        "transcription": "/kɑːr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0073",
        "english": "map",
        "uzbek": "xarita",
        "transcription": "/mæp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0121",
        "english": "boat",
        "uzbek": "qayiq",
        "transcription": "/bəʊt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0127",
        "english": "busy",
        "uzbek": "band",
        "transcription": "/ˈbɪzi/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0131",
        "english": "card",
        "uzbek": "taklifnoma",
        "transcription": "/kɑːrd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0133",
        "english": "city",
        "uzbek": "shahar",
        "transcription": "/ˈsɪti/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0249",
        "english": "road",
        "uzbek": "yo'l",
        "transcription": "/rəʊd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0282",
        "english": "town",
        "uzbek": "shahar",
        "transcription": "/taʊn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0284",
        "english": "trip",
        "uzbek": "safar",
        "transcription": "/trɪp/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0325",
        "english": "carry",
        "uzbek": "tashimoq",
        "transcription": "/ˈkæri/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0400",
        "english": "plane",
        "uzbek": "samolyot",
        "transcription": "/pleɪn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0445",
        "english": "train",
        "uzbek": "poyezd",
        "transcription": "/treɪn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0451",
        "english": "visit",
        "uzbek": "tashrif buyurmoq",
        "transcription": "/ˈvɪzɪt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0472",
        "english": "arrive",
        "uzbek": "kelmoq",
        "transcription": "/əˈraɪv/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0485",
        "english": "carrot",
        "uzbek": "sabzi",
        "transcription": "/ˈkærət/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "What do they look at to visit every historic town?",
        "options": [
          "The city map",
          "A dictionary",
          "A movie screen",
          "A calendar"
        ],
        "correctIndex": 0,
        "explanationUz": "Ular shaharlarga borish uchun shahar xaritasiga (map) qaraydilar."
      }
    ]
  },
  {
    "id": "story_a1_career",
    "level": "A1",
    "topicCategory": "Kasb-hunar va Biznes",
    "topicEmoji": "💼",
    "title": "A Successful Career at the Modern Dairy Bank",
    "titleUz": "Zamonaviy bankdagi muvaffaqiyatli martaba",
    "duration": "2 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Kasb-hunar va Biznes\" mavzusidagi barcha 11 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 11,
    "coveragePercent": 100,
    "paragraphs": [
      "Finding a good job is an important step to build a long career in financial work.",
      "At the central bank, sixty employees help customers manage their money and save on every service cost.",
      "During the afternoon break, workers buy fresh bread, tasty cheese, and a clear glass of juice to protect every tooth and stay healthy."
    ],
    "paragraphsUz": [
      "Yaxshi ish topish moliyaviy sohada uzoq muddatli martaba qurish uchun muhim qadamdir.",
      "Markaziy bankda oltmish nafar xodim mijozlarga o‘z pullarini boshqarishda va har bir xizmat narxini tejashda yordam beradi.",
      "Tushdan keyingi tanaffusda xodimlar har bir tishini asrash va sog‘lom bo‘lish uchun yangi non, mazali pishloq va bir shisha sharbat sotib olishadi."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0038",
        "english": "buy",
        "uzbek": "sotib olmoq",
        "transcription": "/baɪ/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0067",
        "english": "job",
        "uzbek": "ish",
        "transcription": "/dʒɑːb/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0113",
        "english": "bank",
        "uzbek": "bank",
        "transcription": "/bæŋk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0139",
        "english": "cost",
        "uzbek": "narx",
        "transcription": "/kɔːst/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0303",
        "english": "work",
        "uzbek": "ish",
        "transcription": "/wɜːrk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0354",
        "english": "glass",
        "uzbek": "shisha",
        "transcription": "/ɡlæs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0378",
        "english": "money",
        "uzbek": "pul",
        "transcription": "/ˈmʌni/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0417",
        "english": "sixty",
        "uzbek": "oltmish",
        "transcription": "/ˈsɪksti/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0443",
        "english": "tooth",
        "uzbek": "tish",
        "transcription": "/tuːθ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0484",
        "english": "career",
        "uzbek": "kasb",
        "transcription": "/kəˈrɪr/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0488",
        "english": "cheese",
        "uzbek": "pishloq",
        "transcription": "/tʃiːz/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "How many employees work at the central bank?",
        "options": [
          "Sixty employees",
          "Five employees",
          "Ten employees",
          "One hundred"
        ],
        "correctIndex": 0,
        "explanationUz": "Markaziy bankda oltmish (sixty) nafar xodim faoliyat yuritadi."
      }
    ]
  },
  {
    "id": "story_a1_education",
    "level": "A1",
    "topicCategory": "Ta’lim va Ilm-fan",
    "topicEmoji": "🎓",
    "title": "Dedicated Students in the English Course",
    "titleUz": "Ingliz tili kursidagi tirishqoq o‘quvchilar",
    "duration": "2 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Ta’lim va Ilm-fan\" mavzusidagi barcha 13 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 13,
    "coveragePercent": 100,
    "paragraphs": [
      "Every motivated student is ready to learn something new when they enter our English class.",
      "We open an interesting grammar book, read aloud together, and spend time practicing conversations.",
      "I take a blue pen to write notes, study hard each evening, and complete every practice test before our final exam in this course."
    ],
    "paragraphsUz": [
      "Har bir intiluvchan talaba ingliz tili darsimizga kirganda yangi narsalarni o‘rganishga tayyor bo‘ladi.",
      "Biz qiziqarli grammatika kitobini ochamiz, birgalikda ovoz chiqarib o‘qiymiz va muloqot mashqlariga vaqt sarflaymiz.",
      "Men konspekt yozish uchun ko‘k ruchka olaman, har oqshom tirishib o‘qiyman va ushbu kursdagi yakuniy imtihondan oldin har bir amaliy testni bajaraman."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0085",
        "english": "pen",
        "uzbek": "ruchka",
        "transcription": "/pen/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0123",
        "english": "book",
        "uzbek": "kitob",
        "transcription": "/bʊk/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0155",
        "english": "exam",
        "uzbek": "imtihon",
        "transcription": "/ɪɡˈzæm/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0231",
        "english": "open",
        "uzbek": "ochiq",
        "transcription": "/ˈəʊpən/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0245",
        "english": "read",
        "uzbek": "o'qimoq",
        "transcription": "/riːd/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0275",
        "english": "test",
        "uzbek": "test",
        "transcription": "/test/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0330",
        "english": "class",
        "uzbek": "sinf",
        "transcription": "/klæs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0369",
        "english": "learn",
        "uzbek": "o'rganmoq",
        "transcription": "/lɜːrn/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0409",
        "english": "ready",
        "uzbek": "tayyor",
        "transcription": "/ˈredi/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0426",
        "english": "spend",
        "uzbek": "sarflamoq",
        "transcription": "/spend/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0429",
        "english": "study",
        "uzbek": "o`qimoq",
        "transcription": "/ˈstʌdi/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0460",
        "english": "write",
        "uzbek": "yozmoq",
        "transcription": "/raɪt/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0494",
        "english": "course",
        "uzbek": "kurs",
        "transcription": "/kɔːrs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "What tool does the student use to write notes?",
        "options": [
          "A blue pen",
          "A paintbrush",
          "A spoon",
          "A needle"
        ],
        "correctIndex": 0,
        "explanationUz": "O‘quvchi konspekt yozish uchun ko‘k ruchka (pen) ishlatadi."
      }
    ]
  },
  {
    "id": "story_a1_health",
    "level": "A1",
    "topicCategory": "Sog‘liq va Tibbiyot",
    "topicEmoji": "🏥",
    "title": "Care and Healing at the Health Clinic",
    "titleUz": "Salomatlik klinikasidagi g‘amxo‘rlik va shifo",
    "duration": "2 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Sog‘liq va Tibbiyot\" mavzusidagi barcha 10 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 10,
    "coveragePercent": 100,
    "paragraphs": [
      "When someone feels sick, a kind nurse uses great skill to examine the entire human body.",
      "She checks the patient warm head, looks closely into each tired eye, and gently holds their hand.",
      "Next, the clinic assistants fill out the medical papers, help settle the hospital bill, and show children how to paint pictures to feel better."
    ],
    "paragraphsUz": [
      "Kimdir o‘zini kasal his qilganda, mehribon hamshira butun inson tanasini tekshirish uchun katta mahoratdan foydalanadi.",
      "U bemorning issiq boshini tekshiradi, har bir toliqqan ko‘ziga diqqat bilan qaraydi va mehr bilan qo‘lini ushlaydi.",
      "Keyin klinika yordamchilari tibbiy qog‘ozlarni to‘ldiradilar, shifoxona to‘lovini to‘lashda ko‘maklashadilar va bolalarga o‘zlarini yaxshiroq his qilishlari uchun rasm bo‘yashni ko‘rsatadilar."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0052",
        "english": "eye",
        "uzbek": "ko'z",
        "transcription": "/aɪ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0118",
        "english": "bill",
        "uzbek": "to'lov",
        "transcription": "/bɪl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0122",
        "english": "body",
        "uzbek": "tana",
        "transcription": "/ˈbɑːdi/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0160",
        "english": "fill",
        "uzbek": "to'ldirmoq",
        "transcription": "/fɪl/",
        "partOfSpeech": "Fe’l",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0181",
        "english": "hand",
        "uzbek": "qo'l",
        "transcription": "/hænd/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0184",
        "english": "head",
        "uzbek": "bosh",
        "transcription": "/hed/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0259",
        "english": "sick",
        "uzbek": "kasal",
        "transcription": "/sɪk/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0387",
        "english": "nurse",
        "uzbek": "hamshira",
        "transcription": "/nɜːrs/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0392",
        "english": "paint",
        "uzbek": "bo'yoq",
        "transcription": "/peɪnt/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0418",
        "english": "skill",
        "uzbek": "mahorat",
        "transcription": "/skɪl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "Who examines the human body with great skill?",
        "options": [
          "A kind nurse",
          "A taxi driver",
          "A pilot",
          "A chef"
        ],
        "correctIndex": 0,
        "explanationUz": "Mehribon hamshira (nurse) butun inson tanasini ko‘rikdan o‘tkazadi."
      }
    ]
  },
  {
    "id": "story_a1_tech",
    "level": "A1",
    "topicCategory": "Texnologiya va Fan",
    "topicEmoji": "💻",
    "title": "Digital Gadgets in Daily Life",
    "titleUz": "Kundalik hayotimizdagi raqamli vositalar",
    "duration": "1 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Texnologiya va Fan\" mavzusidagi barcha 4 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 4,
    "coveragePercent": 100,
    "paragraphs": [
      "Today, we use a smart mobile phone to make calls and record a high-definition video.",
      "In the morning, grandfather turns on the classic wooden radio to listen to news, while sister uses a digital camera to take pictures of our family."
    ],
    "paragraphsUz": [
      "Bugungi kunda biz qo‘ng‘iroqlar qilish va yuqori sifatli video yozib olish uchun aqlli mobil telefondan foydalanamiz.",
      "Ertalab bobom yangiliklarni tinglash uchun klassik yog‘och radioni yoqadi, opam esa oilamizni suratga olish uchun raqamli kameradan foydalanadi."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0395",
        "english": "phone",
        "uzbek": "telefon",
        "transcription": "/fəʊn/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0408",
        "english": "radio",
        "uzbek": "radio",
        "transcription": "/ˈreɪdiəʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0450",
        "english": "video",
        "uzbek": "video",
        "transcription": "/ˈvɪdiəʊ/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0483",
        "english": "camera",
        "uzbek": "fotoapparat",
        "transcription": "/ˈkæmrə/",
        "partOfSpeech": "Ot",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "What does grandfather turn on to listen to news?",
        "options": [
          "The classic wooden radio",
          "A microwave",
          "A blender",
          "A toaster"
        ],
        "correctIndex": 0,
        "explanationUz": "Bobo yangiliklarni tinglash uchun klassik radioni yoqadi."
      }
    ]
  },
  {
    "id": "story_a1_society",
    "level": "A1",
    "topicCategory": "Jamiyat, Huquq va Falsafa",
    "topicEmoji": "🏛️",
    "title": "Living in a Fair and Harmonious Society",
    "titleUz": "Adolatli va totuv jamiyatda yashash",
    "duration": "1 daqiqa",
    "summaryUz": "Ushbu hikoya A1 \"Jamiyat, Huquq va Falsafa\" mavzusidagi barcha 3 ta so‘zni 100% o‘z ichiga olgan.",
    "totalWordsInTopic": 3,
    "coveragePercent": 100,
    "paragraphs": [
      "In a just society, every citizen follows a clear safety rule to protect what is fair and right.",
      "Treating neighbors with warm kindness and honesty ensures that everyone can live peacefully together."
    ],
    "paragraphsUz": [
      "Adolatli jamiyatda har bir fuqaro adolatli va to‘g‘ri bo‘lgan narsalarni himoya qilish uchun aniq xavfsizlik qoidasiga amal qiladi.",
      "Qo‘shnilarga samimiy iliqlik va halollik bilan munosabatda bo‘lish har bir kishining tinch-totuv yashashini ta’minlaydi."
    ],
    "vocabulary": [
      {
        "id": "cefr_a1_0251",
        "english": "rule",
        "uzbek": "qoida",
        "transcription": "/ruːl/",
        "partOfSpeech": "Ot",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0292",
        "english": "warm",
        "uzbek": "iliq",
        "transcription": "/wɔːrm/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      },
      {
        "id": "cefr_a1_0411",
        "english": "right",
        "uzbek": "rost",
        "transcription": "/raɪt/",
        "partOfSpeech": "Sifat",
        "level": "A1"
      }
    ],
    "questions": [
      {
        "question": "What does every citizen follow to live peacefully?",
        "options": [
          "A clear safety rule",
          "Bad habits",
          "Lies",
          "Arguments"
        ],
        "correctIndex": 0,
        "explanationUz": "Har bir fuqaro aniq xavfsizlik qoidasiga (rule) amal qiladi."
      }
    ]
  },
  {
    "id": "story_a2_travel",
    "level": "A2",
    "topicCategory": "Sayohat va Transport",
    "topicEmoji": "✈️",
    "title": "The High-Speed Train to Bukhara",
    "titleUz": "Buxoroga tezyurar poyezd safari",
    "duration": "3 daqiqa",
    "summaryUz": "Afrosiyob poyezdida qilingan qulay sayohat, tarixiy obidalar va yangi taassurotlar.",
    "totalWordsInTopic": 27,
    "coveragePercent": 100,
    "paragraphs": [
      "Early on Sunday, Nilufar arrived at Tashkent railway station to catch the Afrosiyob express train to Bukhara.",
      "The comfortable carriage had large windows and silent air conditioning. A flight attendant offered hot coffee and cookies.",
      "During the journey, Nilufar read her travel guidebook and planned her itinerary around the historic Ark fortress and Kalyan minaret.",
      "Traveling by modern railway is fast, safe, and allows visitors to appreciate the changing landscapes of our motherland."
    ],
    "paragraphsUz": [
      "Yakshanba tongida Nilufar Buxoroga yo‘l olgan Afrosiyob tezyurar poyezdiga chiqish uchun Toshkent vokzaliga yetib keldi.",
      "Qulay vagonda katta derazalar va sokin ishlaydigan konditsioner bor edi. Yo‘l xizmatchisi issiq kofe va shirinliklar taklif qildi.",
      "Safar davomida Nilufar sayohat qo‘llanmasini o‘qidi va tarixiy Ark qal’asi hamda Minorai Kalon bo‘ylab o‘z marshrutini rejalashtirdi.",
      "Zamonaviy temiryo‘l orqali sayohat qilish tez, xavfsiz va vatanimizning go‘zal manzaralaridan bahramand bo‘lish imkonini beradi."
    ],
    "vocabulary": [
      {
        "id": "cefr_a2_station",
        "english": "station",
        "uzbek": "vokzal, bekat",
        "transcription": "/ˈsteɪʃn/",
        "partOfSpeech": "Ot",
        "level": "A2"
      },
      {
        "id": "cefr_a2_journey",
        "english": "journey",
        "uzbek": "safar, sayohat",
        "transcription": "/ˈdʒɜːrni/",
        "partOfSpeech": "Ot",
        "level": "A2"
      },
      {
        "id": "cefr_a2_guidebook",
        "english": "guidebook",
        "uzbek": "qo‘llanma, yo‘lko‘rsatkich",
        "transcription": "/ˈɡaɪdbʊk/",
        "partOfSpeech": "Ot",
        "level": "A2"
      },
      {
        "id": "cefr_a2_landscape",
        "english": "landscape",
        "uzbek": "manzara, tabiat ko‘rinishi",
        "transcription": "/ˈlændskeɪp/",
        "partOfSpeech": "Ot",
        "level": "A2"
      }
    ],
    "questions": [
      {
        "question": "Where was Nilufar traveling by the Afrosiyob train?",
        "options": [
          "To Samarkand",
          "To Bukhara",
          "To Khiva",
          "To Fergana"
        ],
        "correctIndex": 1,
        "explanationUz": "Nilufar Buxoroga yo‘l olgan tezyurar poyezdda ketayotgan edi."
      }
    ]
  },
  {
    "id": "story_b1_nature",
    "level": "B1",
    "topicCategory": "Tabiat va Atrof-muhit",
    "topicEmoji": "🌿",
    "title": "The Green Rebirth of the Aral Region",
    "titleUz": "Orolbo‘yi hududining yashil uyg‘onishi",
    "duration": "4 daqiqa",
    "summaryUz": "Orol dengizining qurigan tubida saksovulzorlar barpo etish va ekologik barqarorlikni ta’minlash.",
    "totalWordsInTopic": 42,
    "coveragePercent": 100,
    "paragraphs": [
      "In recent decades, environmental scientists and dedicated local volunteers initiated a major conservation project on the dried seabed of the Aral Sea.",
      "To prevent destructive dust storms, millions of resilient saxaul shrubs were cultivated across thousands of hectares.",
      "Satellite observations show that native biodiversity is gradually returning, creating a sanctuary for migratory birds and rare desert mammals.",
      "This inspiring ecological initiative proves that human determination and collective responsibility can restore fragile ecosystems."
    ],
    "paragraphsUz": [
      "So‘nggi o‘n yilliklarda atrof-muhit olimlari va fidoyi mahalliy ko‘ngillilar Orol dengizining qurigan tubida keng ko‘lamli muhofaza loyihasini boshladilar.",
      "Zararli chang bo‘ronlarining oldini olish maqsadida minglab gektar maydonda millionlab chidamli saksovul butalari yetishtirildi.",
      "Sun’iy yo‘ldosh tasvirlari shuni ko‘rsatmoqdaki, mahalliy bioxilma-xillik asta-sekin qaytib, ko‘chib yuruvchi qushlar va cho‘l sutemizuvchilari uchun yashash makonini yaratmoqda.",
      "Ushbu ibratli ekologik sa’y-harakat insonlarning birgalikdagi azm-u shijoati zaiflashgan ekotizimlarni tiklay olishini isbotlaydi."
    ],
    "vocabulary": [
      {
        "id": "cefr_b1_conservation",
        "english": "conservation",
        "uzbek": "tabiatni asrash, muhofaza",
        "transcription": "/ˌkɑːnsərˈveɪʃn/",
        "partOfSpeech": "Ot",
        "level": "B1"
      },
      {
        "id": "cefr_b1_cultivate",
        "english": "cultivate",
        "uzbek": "o‘stirmoq, yetishtirmoq",
        "transcription": "/ˈkʌltɪveɪt/",
        "partOfSpeech": "Fe’l",
        "level": "B1"
      },
      {
        "id": "cefr_b1_biodiversity",
        "english": "biodiversity",
        "uzbek": "biologik xilma-xillik",
        "transcription": "/ˌbaɪəʊdaɪˈvɜːrsəti/",
        "partOfSpeech": "Ot",
        "level": "B1"
      },
      {
        "id": "cefr_b1_fragile",
        "english": "fragile",
        "uzbek": "zaif, nozik",
        "transcription": "/ˈfrædʒl/",
        "partOfSpeech": "Sifat",
        "level": "B1"
      }
    ],
    "questions": [
      {
        "question": "What plant is cultivated on the seabed to stop sandstorms?",
        "options": [
          "Tulips",
          "Saxaul shrubs",
          "Pine trees",
          "Cotton"
        ],
        "correctIndex": 1,
        "explanationUz": "Qum bo‘ronlarini to‘xtatish uchun saksovul butalari ekilmoqda."
      }
    ]
  },
  {
    "id": "story_b2_science",
    "level": "B2",
    "topicCategory": "Texnologiya va Fan",
    "topicEmoji": "💻",
    "title": "The Quantum Computing Leap",
    "titleUz": "Kvant hisoblash texnologiyasidagi buyuk sakrash",
    "duration": "5 daqiqa",
    "summaryUz": "Kvant fizikasining kompyuter arxitekturasidagi inqilobi, sun’iy intellekt va kiberxavfsizlik kelajagi.",
    "totalWordsInTopic": 35,
    "coveragePercent": 100,
    "paragraphs": [
      "Theoretical physicists and computational engineers are approaching a momentous technological paradigm shift with quantum superposition.",
      "Unlike classical binary bits, superconducting qubits exploit quantum mechanics to process exponentially complex cryptographic algorithms simultaneously.",
      "This breakthrough accelerates molecular simulations for life-saving pharmaceuticals and optimizes decentralized logistical networks globally.",
      "Nevertheless, pioneering researchers emphasize that rigorous regulatory frameworks must accompany the advent of fault-tolerant quantum hardware."
    ],
    "paragraphsUz": [
      "Nazariy fiziklar va kompyuter muhandislari kvant superpozitsiyasi vositasida ulkan texnologik burilish pallasiga yaqinlashmoqdalar.",
      "Klassik ikkilik bitlardan farqli o‘laroq, o‘ta o‘tkazgichli qubitlar bir vaqtning o‘zida o‘ta murakkab kriptografik algoritmlarni yechish uchun kvant mexanikasidan foydalanadi.",
      "Ushbu kashfiyot hayotni saqlab qoluvchi dori-darmonlar uchun molekulyar modellashni tezlashtiradi va butun dunyo bo‘ylab logistika tarmoqlarini optimallashtiradi.",
      "Shunga qaramay, yetakchi tadqiqotchilar xatolikka chidamli kvant apparaturalari davriga qat’iy me’yoriy xavfsizlik qoidalari hamroh bo‘lishi shartligini ta’kidlamoqdalar."
    ],
    "vocabulary": [
      {
        "id": "cefr_b2_paradigm",
        "english": "paradigm",
        "uzbek": "model, namuna, yondashuv",
        "transcription": "/ˈpærədaɪm/",
        "partOfSpeech": "Ot",
        "level": "B2"
      },
      {
        "id": "cefr_b2_exploit",
        "english": "exploit",
        "uzbek": "samarali foydalanmoq",
        "transcription": "/ɪkˈsplɔɪt/",
        "partOfSpeech": "Fe’l",
        "level": "B2"
      },
      {
        "id": "cefr_b2_accelerate",
        "english": "accelerate",
        "uzbek": "tezlashtirmoq",
        "transcription": "/əkˈseləreɪt/",
        "partOfSpeech": "Fe’l",
        "level": "B2"
      },
      {
        "id": "cefr_b2_rigorous",
        "english": "rigorous",
        "uzbek": "qat’iy, puxta",
        "transcription": "/ˈrɪɡərəs/",
        "partOfSpeech": "Sifat",
        "level": "B2"
      }
    ],
    "questions": [
      {
        "question": "What fundamental unit of quantum computing is highlighted?",
        "options": [
          "Magnetic tape",
          "Binary bytes",
          "Superconducting qubits",
          "Silicon transistors"
        ],
        "correctIndex": 2,
        "explanationUz": "Kvant hisoblash tizimining asosi bo‘lgan qubitlar (qubits) ta’kidlangan."
      }
    ]
  }
];
