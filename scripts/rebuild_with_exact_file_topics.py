#!/usr/bin/env python3
import json, os, re, csv
from collections import Counter, OrderedDict

print("=== Rebuilding CEFR Database with Exact File Topics ===")

# Topic definitions with Uzbek name, English name, emoji, color theme, and description
TOPIC_META = {
    # A1 Topics
    'Greetings & Basic Communication': {
        'nameUz': 'Salomlashuv va Kundalik muloqot',
        'nameEn': 'Greetings & Basic Communication',
        'emoji': '💬',
        'color': 'blue',
        'gradient': 'from-blue-600 to-indigo-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Kundalik salomlashuv, minnatdorchilik, xushmuomalalik iboralari va oddiy suhbat so‘zlari.',
        'slug': 'greetings'
    },
    'Places, Transport & Travel': {
        'nameUz': 'Joylar, Transport va Sayohat',
        'nameEn': 'Places, Transport & Travel',
        'emoji': '🚆',
        'color': 'sky',
        'gradient': 'from-sky-500 to-blue-600',
        'bgLight': 'bg-sky-50/80',
        'borderLight': 'border-sky-200',
        'textAccent': 'text-sky-800',
        'desc': 'Shahar joylari, bekatlar, aeroport, transport turlari va sayohatdagi eng zarur so‘zlar.',
        'slug': 'transport'
    },
    'Nature, Animals & Weather': {
        'nameUz': 'Tabiat, Hayvonlar va Ob-havo',
        'nameEn': 'Nature, Animals & Weather',
        'emoji': '🌿',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Hayvonot olami, o‘simliklar, fasllar, ob-havo holatlari va atrof-muhit so‘zlari.',
        'slug': 'nature'
    },
    'Everyday Verbs': {
        'nameUz': 'Kundalik Harakat Fe’llari',
        'nameEn': 'Everyday Verbs',
        'emoji': '⚡',
        'color': 'amber',
        'gradient': 'from-amber-500 to-orange-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'Kundalik hayotda eng ko‘p qo‘llaniladigan asosiy fe’llar va harakat tushunchalari.',
        'slug': 'everyday_verbs'
    },
    'Common Adjectives & Feelings': {
        'nameUz': 'Asosiy Sifatlar va Hissiyotlar',
        'nameEn': 'Common Adjectives & Feelings',
        'emoji': '✨',
        'color': 'purple',
        'gradient': 'from-purple-500 to-indigo-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Narsalarni tasvirlovchi sifatlar, kayfiyat va insoniy his-tuyg‘ular.',
        'slug': 'adjectives_feelings'
    },
    'Basic Grammar Words': {
        'nameUz': 'Asosiy Grammatik So‘zlar',
        'nameEn': 'Basic Grammar Words',
        'emoji': '🧩',
        'color': 'indigo',
        'gradient': 'from-indigo-500 to-violet-600',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Predloglar, bog‘lovchilar, olmoshlar va gap qurilishi uchun zarur yordamchi so‘zlar.',
        'slug': 'grammar_words'
    },
    'People & Family': {
        'nameUz': 'Odamlar va Oila',
        'nameEn': 'People & Family',
        'emoji': '👨‍👩‍👧',
        'color': 'rose',
        'gradient': 'from-rose-500 to-pink-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Oila a’zolari, qarindoshlik aloqalari, do‘stlar va insoniy munosabatlar.',
        'slug': 'family'
    },
    'Personal Information': {
        'nameUz': 'Shaxsiy Ma’lumotlar',
        'nameEn': 'Personal Information',
        'emoji': '🪪',
        'color': 'teal',
        'gradient': 'from-teal-500 to-emerald-600',
        'bgLight': 'bg-teal-50/80',
        'borderLight': 'border-teal-200',
        'textAccent': 'text-teal-800',
        'desc': 'Ism-familiya, yosh, manzil, telefon, millat va anketalarni to‘ldirish leksikasi.',
        'slug': 'personal_info'
    },
    'Numbers, Time & Calendar': {
        'nameUz': 'Raqamlar, Vaqt va Taqvim',
        'nameEn': 'Numbers, Time & Calendar',
        'emoji': '⏰',
        'color': 'cyan',
        'gradient': 'from-cyan-500 to-blue-600',
        'bgLight': 'bg-cyan-50/80',
        'borderLight': 'border-cyan-200',
        'textAccent': 'text-cyan-800',
        'desc': 'Hafta kunlari, oylar, soat vaqtini aytish, sanalar va asosiy hisob-kitob sonlari.',
        'slug': 'time_calendar'
    },
    'Home & Furniture': {
        'nameUz': 'Uy va Mebel Jihozlari',
        'nameEn': 'Home & Furniture',
        'emoji': '🏠',
        'color': 'orange',
        'gradient': 'from-orange-500 to-amber-600',
        'bgLight': 'bg-orange-50/80',
        'borderLight': 'border-orange-200',
        'textAccent': 'text-orange-800',
        'desc': 'Xonalar, mebellar, oshxona va uy jihozlari, maishiy buyumlar nomlari.',
        'slug': 'home_furniture'
    },
    'Food & Drinks': {
        'nameUz': 'Oziq-ovqat va Ichimliklar',
        'nameEn': 'Food & Drinks',
        'emoji': '🥗',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-green-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Taomlar, mevalar, sabzavotlar, ichimliklar va nonushta/tushlik leksikasi.',
        'slug': 'food_drinks'
    },
    'School & Education': {
        'nameUz': 'Maktab va Ta’lim',
        'nameEn': 'School & Education',
        'emoji': '🎓',
        'color': 'blue',
        'gradient': 'from-blue-600 to-indigo-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Maktab fanlari, o‘quv qurollari, darslar, imtihonlar va o‘qish jarayoni.',
        'slug': 'education'
    },
    'Clothes & Appearance': {
        'nameUz': 'Kiyim-kechak va Tashqi ko‘rinish',
        'nameEn': 'Clothes & Appearance',
        'emoji': '👗',
        'color': 'pink',
        'gradient': 'from-pink-500 to-rose-600',
        'bgLight': 'bg-pink-50/80',
        'borderLight': 'border-pink-200',
        'textAccent': 'text-pink-800',
        'desc': 'Ust-bosh kiyimlari, poyabzal, ranglar, uslub va inson tashqi qiyofasi.',
        'slug': 'clothes'
    },
    'Body & Health': {
        'nameUz': 'Tana a’zolari va Salomatlik',
        'nameEn': 'Body & Health',
        'emoji': '🏥',
        'color': 'red',
        'gradient': 'from-red-500 to-rose-600',
        'bgLight': 'bg-red-50/80',
        'borderLight': 'border-red-200',
        'textAccent': 'text-red-800',
        'desc': 'Inson tana a’zolari, o‘zini his qilish, oddiy kasalliklar va dorixonadagi so‘zlar.',
        'slug': 'health'
    },

    # A2 Topics
    'Travel & Transport': {
        'nameUz': 'Sayohat va Transport',
        'nameEn': 'Travel & Transport',
        'emoji': '✈️',
        'color': 'sky',
        'gradient': 'from-sky-500 to-blue-600',
        'bgLight': 'bg-sky-50/80',
        'borderLight': 'border-sky-200',
        'textAccent': 'text-sky-800',
        'desc': 'Chipta bron qilish, aeroport va vokal, parvoz va shahar transporti.',
        'slug': 'travel_transport'
    },
    'Work & Career': {
        'nameUz': 'Ish va Karyera',
        'nameEn': 'Work & Career',
        'emoji': '💼',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Kasbiy faoliyat, ish suhbati, maosh, ofis va mehnat munosabatlari.',
        'slug': 'work_career'
    },
    'Nature & Environment': {
        'nameUz': 'Tabiat va Atrof-muhit',
        'nameEn': 'Nature & Environment',
        'emoji': '🌳',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Ekologiya, iqlim o‘zgarishi, tabiiy resurslar va tabiatni asrash.',
        'slug': 'nature_env'
    },
    'Emotions & Relationships': {
        'nameUz': 'Hissiyotlar va Munosabatlar',
        'nameEn': 'Emotions & Relationships',
        'emoji': '❤️',
        'color': 'rose',
        'gradient': 'from-rose-500 to-pink-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Insoniy munosabatlar, empatiya, ishonch, mehr va ruhiy holatlar.',
        'slug': 'emotions'
    },
    'Phrasal Verbs & Expressions': {
        'nameUz': 'Frazali Fe’llar va Iboralar',
        'nameEn': 'Phrasal Verbs & Expressions',
        'emoji': '🔄',
        'color': 'violet',
        'gradient': 'from-violet-500 to-purple-600',
        'bgLight': 'bg-violet-50/80',
        'borderLight': 'border-violet-200',
        'textAccent': 'text-violet-800',
        'desc': 'Ingliz tilidagi eng ko‘p qo‘llaniladigan frazali fe’llar va turg‘un birikmalar.',
        'slug': 'phrasal_verbs'
    },
    'Adjectives & Opinions': {
        'nameUz': 'Sifatlar va Fikr-mulohazalar',
        'nameEn': 'Adjectives & Opinions',
        'emoji': '💡',
        'color': 'amber',
        'gradient': 'from-amber-500 to-yellow-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'O‘z fikrini asoslash, tavsiflash va baholash uchun zarur sifatlar.',
        'slug': 'adjectives_opinions'
    },
    'Grammar & Connectors': {
        'nameUz': 'Grammatika va Bog‘lovchilar',
        'nameEn': 'Grammar & Connectors',
        'emoji': '🔗',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-700',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Fikrni mantiqiy bog‘lash, sabab-oqibat va zidlovchi bog‘lovchilar.',
        'slug': 'connectors'
    },
    'Shopping & Money': {
        'nameUz': 'Xarid va Moliya',
        'nameEn': 'Shopping & Money',
        'emoji': '💳',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Bozor, do‘kon, chegirmalar, bank, to‘lovlar va pul hisob-kitoblari.',
        'slug': 'shopping_money'
    },
    'Sports & Hobbies': {
        'nameUz': 'Sport va Qiziqishlar',
        'nameEn': 'Sports & Hobbies',
        'emoji': '⚽',
        'color': 'green',
        'gradient': 'from-green-500 to-emerald-600',
        'bgLight': 'bg-green-50/80',
        'borderLight': 'border-green-200',
        'textAccent': 'text-green-800',
        'desc': 'Sport turlari, mashg‘ulotlar, musobaqalar va sevimli xobbilar.',
        'slug': 'sports_hobbies'
    },
    'Technology & Media': {
        'nameUz': 'Texnologiya va OAV',
        'nameEn': 'Technology & Media',
        'emoji': '📱',
        'color': 'cyan',
        'gradient': 'from-cyan-500 to-blue-600',
        'bgLight': 'bg-cyan-50/80',
        'borderLight': 'border-cyan-200',
        'textAccent': 'text-cyan-800',
        'desc': 'Smartfonlar, internet, ijtimoiy tarmoqlar, dasturlar va axborot texnologiyalari.',
        'slug': 'technology_media'
    },
    'Society & Communication': {
        'nameUz': 'Jamiyat va Muloqot',
        'nameEn': 'Society & Communication',
        'emoji': '👥',
        'color': 'blue',
        'gradient': 'from-blue-600 to-indigo-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Jamiyat hayoti, qonun-qoidalar, madaniy xilma-xillik va ijtimoiy muloqot.',
        'slug': 'society_communication'
    },
    'Travel & Culture': {
        'nameUz': 'Sayohat va Madaniyat',
        'nameEn': 'Travel & Culture',
        'emoji': '🏛️',
        'color': 'teal',
        'gradient': 'from-teal-500 to-cyan-600',
        'bgLight': 'bg-teal-50/80',
        'borderLight': 'border-teal-200',
        'textAccent': 'text-teal-800',
        'desc': 'Madaniy meros, diqqatga sazovor joylar, urf-odatlar va sayyohlik.',
        'slug': 'travel_culture'
    },
    'Daily Routine & Habits': {
        'nameUz': 'Kun tartibi va Odatlar',
        'nameEn': 'Daily Routine & Habits',
        'emoji': '📅',
        'color': 'amber',
        'gradient': 'from-amber-500 to-orange-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'Ertalabdan kechgacha qilinadigan ishlar, odatlar va vaqtni boshqarish.',
        'slug': 'daily_routine'
    },
    'Health & Lifestyle': {
        'nameUz': 'Salomatlik va Turmush tarzi',
        'nameEn': 'Health & Lifestyle',
        'emoji': '🍎',
        'color': 'rose',
        'gradient': 'from-rose-500 to-red-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Sog‘lom turmush tarzi, fitnes, to‘g‘ri ovqatlanish va tibbiy maslahatlar.',
        'slug': 'health_lifestyle'
    },
    'Food & Cooking': {
        'nameUz': 'Oziq-ovqat va Pazandachilik',
        'nameEn': 'Food & Cooking',
        'emoji': '🍳',
        'color': 'orange',
        'gradient': 'from-orange-500 to-amber-600',
        'bgLight': 'bg-orange-50/80',
        'borderLight': 'border-orange-200',
        'textAccent': 'text-orange-800',
        'desc': 'Retseptlar, taom tayyorlash usullari, pazandachilik va oshxona anjomlari.',
        'slug': 'food_cooking'
    },
    'General': {
        'nameUz': 'Umumiy Lug‘at Boyligi',
        'nameEn': 'General Vocabulary',
        'emoji': '📚',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-700',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Darajaning mustahkam poydevori uchun universal qo‘shimcha leksika.',
        'slug': 'general'
    },
    'General A2': {
        'nameUz': 'Umumiy Lug‘at Boyligi (A2)',
        'nameEn': 'General Vocabulary (A2)',
        'emoji': '📖',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-700',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'A2 darajasidagi qo‘shimcha zaruriy so‘zlar to‘plami.',
        'slug': 'general_a2'
    },

    # Additional B1/B2/C1/C2 topics
    'Science & Technology': {
        'nameUz': 'Fan va Texnologiya',
        'nameEn': 'Science & Technology',
        'emoji': '🔬',
        'color': 'cyan',
        'gradient': 'from-cyan-500 to-blue-600',
        'bgLight': 'bg-cyan-50/80',
        'borderLight': 'border-cyan-200',
        'textAccent': 'text-cyan-800',
        'desc': 'Ilmiy kashfiyotlar, texnologik yutuqlar, kompyuter va elektronika.',
        'slug': 'science_tech'
    },
    'Work & Occupations': {
        'nameUz': 'Kasblar va Faoliyat',
        'nameEn': 'Work & Occupations',
        'emoji': '👷',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Turli soha mutaxassislari, kasblar va ularning mehnat vazifalari.',
        'slug': 'occupations'
    },
    'Clothes & Fashion': {
        'nameUz': 'Kiyim va Moda',
        'nameEn': 'Clothes & Fashion',
        'emoji': '👔',
        'color': 'pink',
        'gradient': 'from-pink-500 to-rose-600',
        'bgLight': 'bg-pink-50/80',
        'borderLight': 'border-pink-200',
        'textAccent': 'text-pink-800',
        'desc': 'Zamonaviy moda, kiyinish madaniyati, uslublar va matolar.',
        'slug': 'clothes_fashion'
    },
    'Arts & Culture': {
        'nameUz': 'San’at va Madaniyat',
        'nameEn': 'Arts & Culture',
        'emoji': '🎨',
        'color': 'violet',
        'gradient': 'from-violet-500 to-purple-600',
        'bgLight': 'bg-violet-50/80',
        'borderLight': 'border-violet-200',
        'textAccent': 'text-violet-800',
        'desc': 'Musiqa, teatr, kino, rasm va tasviriy san’at durdonalari.',
        'slug': 'arts_culture'
    },
    'Society & Politics': {
        'nameUz': 'Jamiyat va Siyosat',
        'nameEn': 'Society & Politics',
        'emoji': '🏛️',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-800',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Davlat boshqaruvi, qonunlar, saylovlar va ijtimoiy jarayonlar.',
        'slug': 'society_politics'
    },
    'Everyday Actions': {
        'nameUz': 'Kundalik Harakatlar',
        'nameEn': 'Everyday Actions',
        'emoji': '🏃',
        'color': 'blue',
        'gradient': 'from-blue-500 to-cyan-600',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Insonning har kungi amallari, harakatlari va xatti-harakatlari.',
        'slug': 'actions'
    },
    'Personality & Character': {
        'nameUz': 'Xarakter va Shaxsiyat',
        'nameEn': 'Personality & Character',
        'emoji': '🧠',
        'color': 'purple',
        'gradient': 'from-purple-500 to-pink-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Inson fazilatlari, ijobiy va salbiy fe’l-atvor xususiyatlari.',
        'slug': 'personality'
    },
    'Money & Finance': {
        'nameUz': 'Pul va Moliya',
        'nameEn': 'Money & Finance',
        'emoji': '💰',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Bank tizimi, daromad, soliqlar, qarz va sarmoya tushunchalari.',
        'slug': 'finance'
    },
    'House & Chores': {
        'nameUz': 'Uy va Ro‘zg‘or Yumushlari',
        'nameEn': 'House & Chores',
        'emoji': '🧹',
        'color': 'amber',
        'gradient': 'from-amber-500 to-yellow-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'Uy tozalash, ta’mirlash, qulayliklar va kundalik ro‘zg‘or ishlari.',
        'slug': 'house_chores'
    },
    'Nature & Geography': {
        'nameUz': 'Tabiat va Geografiya',
        'nameEn': 'Nature & Geography',
        'emoji': '🌍',
        'color': 'green',
        'gradient': 'from-green-500 to-teal-600',
        'bgLight': 'bg-green-50/80',
        'borderLight': 'border-green-200',
        'textAccent': 'text-green-800',
        'desc': 'Qit’alar, okeanlar, tog‘lar, daryolar va geografik landshaftlar.',
        'slug': 'geography'
    },
    'Communication & Thoughts': {
        'nameUz': 'Muloqot va Fikrlash',
        'nameEn': 'Communication & Thoughts',
        'emoji': '💭',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'O‘z fikrini ifodalash, bahslashish, rozi bo‘lish va mulohaza yuritish.',
        'slug': 'communication_thoughts'
    },
    'Entertainment & Media': {
        'nameUz': 'Ko‘ngilochar va OAV',
        'nameEn': 'Entertainment & Media',
        'emoji': '🎬',
        'color': 'rose',
        'gradient': 'from-rose-500 to-purple-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Kino, televideniye, radio, teatr va tomoshabinlar dunyosi.',
        'slug': 'entertainment'
    },
    'Relationships & Emotions': {
        'nameUz': 'Munosabatlar va Hissiyotlar',
        'nameEn': 'Relationships & Emotions',
        'emoji': '🤝',
        'color': 'pink',
        'gradient': 'from-pink-500 to-rose-600',
        'bgLight': 'bg-pink-50/80',
        'borderLight': 'border-pink-200',
        'textAccent': 'text-pink-800',
        'desc': 'Do‘stlik, sevgi, oilaviy rishtalar va hissiy kechinmalar.',
        'slug': 'relationships'
    },
    'Crime & Law': {
        'nameUz': 'Jinoyat va Qonun',
        'nameEn': 'Crime & Law',
        'emoji': '⚖️',
        'color': 'slate',
        'gradient': 'from-slate-600 to-gray-800',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Sud tizimi, adolat, qonunbuzarlik va huquqiy atamalar.',
        'slug': 'crime_law'
    },
    'City Life & Housing': {
        'nameUz': 'Shahar Hayoti va Turar-joy',
        'nameEn': 'City Life & Housing',
        'emoji': '🏙️',
        'color': 'sky',
        'gradient': 'from-sky-500 to-indigo-600',
        'bgLight': 'bg-sky-50/80',
        'borderLight': 'border-sky-200',
        'textAccent': 'text-sky-800',
        'desc': 'Zamonaviy shahar infratuzilmasi, binolar va kvartiralar.',
        'slug': 'city_housing'
    },
    'Sports & Leisure': {
        'nameUz': 'Sport va Hordiq',
        'nameEn': 'Sports & Leisure',
        'emoji': '🏆',
        'color': 'amber',
        'gradient': 'from-amber-500 to-orange-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'Jismoniy tarbiya, chempionatlar, hakamlar va faol dam olish.',
        'slug': 'sports_leisure'
    },
    'Shopping & Clothes': {
        'nameUz': 'Xarid va Kiyimlar',
        'nameEn': 'Shopping & Clothes',
        'emoji': '🛍️',
        'color': 'teal',
        'gradient': 'from-teal-500 to-emerald-600',
        'bgLight': 'bg-teal-50/80',
        'borderLight': 'border-teal-200',
        'textAccent': 'text-teal-800',
        'desc': 'Kiyim xaridi, kassa, narxlar va savdo markazlari.',
        'slug': 'shopping_clothes'
    },
    'Education': {
        'nameUz': 'Ta’lim',
        'nameEn': 'Education',
        'emoji': '📚',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-purple-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Kollej, universitet, diplomlar va o‘quv jarayoni.',
        'slug': 'education_general'
    },
    'Work & Business': {
        'nameUz': 'Ish va Biznes',
        'nameEn': 'Work & Business',
        'emoji': '📈',
        'color': 'blue',
        'gradient': 'from-blue-600 to-indigo-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Kompaniyalar, xodimlar, mijozlar va boshqaruv.',
        'slug': 'work_business'
    },
    'Health': {
        'nameUz': 'Salomatlik',
        'nameEn': 'Health',
        'emoji': '🩺',
        'color': 'rose',
        'gradient': 'from-rose-500 to-red-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Tez yordam, dorilar, operatsiya va tibbiy muolajalar.',
        'slug': 'health_general'
    },
    'Travel': {
        'nameUz': 'Sayohat',
        'nameEn': 'Travel',
        'emoji': '🛫',
        'color': 'sky',
        'gradient': 'from-sky-500 to-blue-600',
        'bgLight': 'bg-sky-50/80',
        'borderLight': 'border-sky-200',
        'textAccent': 'text-sky-800',
        'desc': 'Xorijga chiqish, viza, bojxona va manzil sari safar.',
        'slug': 'travel_general'
    },
    'Environment': {
        'nameUz': 'Atrof-muhit',
        'nameEn': 'Environment',
        'emoji': '♻️',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Ifloslanish, chiqindilar, qayta ishlash va tabiiy ofatlar.',
        'slug': 'environment_general'
    },
    'Technology': {
        'nameUz': 'Texnologiya',
        'nameEn': 'Technology',
        'emoji': '💻',
        'color': 'cyan',
        'gradient': 'from-cyan-500 to-blue-600',
        'bgLight': 'bg-cyan-50/80',
        'borderLight': 'border-cyan-200',
        'textAccent': 'text-cyan-800',
        'desc': 'Dasturiy ta’minot, brauzer, ma’lumotlar bazasi va yangilanishlar.',
        'slug': 'tech_general'
    },
    'Education & Learning': {
        'nameUz': 'Ta’lim va O‘rganish',
        'nameEn': 'Education & Learning',
        'emoji': '📖',
        'color': 'violet',
        'gradient': 'from-violet-600 to-indigo-700',
        'bgLight': 'bg-violet-50/80',
        'borderLight': 'border-violet-200',
        'textAccent': 'text-violet-800',
        'desc': 'Akademik talablar, ilmiy darajalar, metodika va bilim olish.',
        'slug': 'education_learning'
    },
    'Arts & Literature': {
        'nameUz': 'San’at va Adabiyot',
        'nameEn': 'Arts & Literature',
        'emoji': '🎭',
        'color': 'purple',
        'gradient': 'from-purple-500 to-pink-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Adabiy janrlar, romanlar, she’riyat va tasviriy san’at.',
        'slug': 'arts_lit'
    },
    'Phrasal Verbs & Idioms': {
        'nameUz': 'Frazali Fe’llar va Idiomalar',
        'nameEn': 'Phrasal Verbs & Idioms',
        'emoji': '💬',
        'color': 'amber',
        'gradient': 'from-amber-500 to-orange-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'Ko‘chma ma’noli iboralar, maqollar va ravon nutq vositalari.',
        'slug': 'phrasal_idioms'
    },
    'Adjectives & Advanced Opinions': {
        'nameUz': 'Murakkab Sifatlar va Fikrlar',
        'nameEn': 'Adjectives & Advanced Opinions',
        'emoji': '✨',
        'color': 'indigo',
        'gradient': 'from-indigo-500 to-purple-600',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Chuqur fikrlash, aniq baholash va murakkab sifatlar.',
        'slug': 'adv_adjectives'
    },
    'Grammar & Connectors (Advanced)': {
        'nameUz': 'Murakkab Grammatika va Bog‘lovchilar',
        'nameEn': 'Grammar & Connectors (Advanced)',
        'emoji': '🔗',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-700',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Murakkab gap qurilmalari, insho va maqola yozish bog‘lovchilari.',
        'slug': 'adv_connectors'
    },
    'Emotions & Human Experience': {
        'nameUz': 'Insoniy Kechinmalar va Tuyg‘ular',
        'nameEn': 'Emotions & Human Experience',
        'emoji': '🧘',
        'color': 'rose',
        'gradient': 'from-rose-500 to-pink-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Ichki xotirjamlik, tashvish, umid va insoniy psixologik kechinmalar.',
        'slug': 'human_exp'
    },
    'Business & Economy': {
        'nameUz': 'Biznes va Iqtisodiyot',
        'nameEn': 'Business & Economy',
        'emoji': '📊',
        'color': 'blue',
        'gradient': 'from-blue-600 to-cyan-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Kompaniyalar birlashishi, fond bozori, strategiya va iqtisodiy o‘sish.',
        'slug': 'biz_econ'
    },
    'Politics & Government': {
        'nameUz': 'Siyosat va Davlat Boshqaruvi',
        'nameEn': 'Politics & Government',
        'emoji': '🏛️',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-800',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Konstitutsiya, diplomatiya, vazirliklar va davlat siyosati.',
        'slug': 'politics_gov'
    },
    'Environment & Science': {
        'nameUz': 'Atrof-muhit va Ilm-fan',
        'nameEn': 'Environment & Science',
        'emoji': '🔬',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Ilmiy tajribalar, laboratoriya, biologiya, kimyo va ekotizim.',
        'slug': 'env_science'
    },
    'Health & Medicine': {
        'nameUz': 'Salomatlik va Tibbiyot',
        'nameEn': 'Health & Medicine',
        'emoji': '🏥',
        'color': 'rose',
        'gradient': 'from-rose-500 to-red-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Klinik tashxislar, dori-darmonlar, emlash va jamoat salomatligi.',
        'slug': 'health_med'
    },
    'Media & Communication': {
        'nameUz': 'Media va Kommunikatsiya',
        'nameEn': 'Media & Communication',
        'emoji': '📡',
        'color': 'cyan',
        'gradient': 'from-cyan-500 to-blue-600',
        'bgLight': 'bg-cyan-50/80',
        'borderLight': 'border-cyan-200',
        'textAccent': 'text-cyan-800',
        'desc': 'OAV erkinligi, jurnalistika, yangiliklar va jamoatchilik fikri.',
        'slug': 'media_comm'
    },
    'Psychology & Behavior': {
        'nameUz': 'Psixologiya va Xulq-atvor',
        'nameEn': 'Psychology & Behavior',
        'emoji': '🧠',
        'color': 'purple',
        'gradient': 'from-purple-500 to-indigo-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Inson ruhiyati, idrok, xulq-atvor omillari va motivatsiya.',
        'slug': 'psych_behav'
    },
    'Law & Justice': {
        'nameUz': 'Qonun va Adolat',
        'nameEn': 'Law & Justice',
        'emoji': '⚖️',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-800',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Sud jarayoni, advokatlik, huquqiy javobgarlik va hukmlar.',
        'slug': 'law_justice'
    },
    'Global Issues': {
        'nameUz': 'Global Muammolar',
        'nameEn': 'Global Issues',
        'emoji': '🌐',
        'color': 'blue',
        'gradient': 'from-blue-600 to-teal-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Xalqaro inqirozlar, qashshoqlik, migratsiya va tinchlik masalalari.',
        'slug': 'global_issues'
    },

    # Additional B2/C1/C2 topics
    'Environment & Nature': {
        'nameUz': 'Atrof-muhit va Tabiat',
        'nameEn': 'Environment & Nature',
        'emoji': '🌱',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-green-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Bioxilma-xillik, atmosfera, iqlim o‘zgarishi va tabiatni muhofaza qilish.',
        'slug': 'env_nature'
    },
    'Business & Work': {
        'nameUz': 'Biznes va Mehnat',
        'nameEn': 'Business & Work',
        'emoji': '💼',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Korxona boshqaruvi, investitsiyalar, iqtisodiy tahlil va korporatsiya.',
        'slug': 'biz_work'
    },
    'Abstract Concepts & General Nouns': {
        'nameUz': 'Abstrakt Tushunchalar va Otlar',
        'nameEn': 'Abstract Concepts & General Nouns',
        'emoji': '💭',
        'color': 'purple',
        'gradient': 'from-purple-500 to-indigo-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Murakkab g‘oyalar, falsafiy tushunchalar va mavhum ma’noli otlar.',
        'slug': 'abstract_concepts'
    },
    'Action & Mental Verbs': {
        'nameUz': 'Aqliy va Harakat Fe’llari',
        'nameEn': 'Action & Mental Verbs',
        'emoji': '⚡',
        'color': 'amber',
        'gradient': 'from-amber-500 to-orange-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'Tafakkur qilish, baholash, xulosa chiqarish va intellektual harakat fe’llari.',
        'slug': 'mental_verbs'
    },
    'Academic & Research': {
        'nameUz': 'Akademik Tadqiqotlar',
        'nameEn': 'Academic & Research',
        'emoji': '🔬',
        'color': 'violet',
        'gradient': 'from-violet-600 to-purple-700',
        'bgLight': 'bg-violet-50/80',
        'borderLight': 'border-violet-200',
        'textAccent': 'text-violet-800',
        'desc': 'Ilmiy dissertatsiyalar, gipotezalar, ilmiy maqolalar va metodologiya.',
        'slug': 'academic_res'
    },
    'Literature & Rhetoric': {
        'nameUz': 'Adabiyot va Notiqlik',
        'nameEn': 'Literature & Rhetoric',
        'emoji': '📜',
        'color': 'amber',
        'gradient': 'from-amber-600 to-yellow-700',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-900',
        'desc': 'Badiiy vositalar, nutq san’ati, ritorika va adabiy uslublar.',
        'slug': 'lit_rhetoric'
    },
    'Idioms & Advanced Expressions': {
        'nameUz': 'Idiomalar va Murakkab Iboralar',
        'nameEn': 'Idioms & Advanced Expressions',
        'emoji': '🗣️',
        'color': 'rose',
        'gradient': 'from-rose-500 to-pink-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Ona tili darajasidagi boy iboralar, metaforalar va turg‘un birikmalar.',
        'slug': 'adv_idioms'
    },
    'Advanced Adjectives & Nuance': {
        'nameUz': 'Nozik Ma’noli Sifatlar',
        'nameEn': 'Advanced Adjectives & Nuance',
        'emoji': '💎',
        'color': 'teal',
        'gradient': 'from-teal-500 to-cyan-600',
        'bgLight': 'bg-teal-50/80',
        'borderLight': 'border-teal-200',
        'textAccent': 'text-teal-800',
        'desc': 'Nozik ma’nodosh sifatlar, kamyob va yuqori saviyadagi sifatlar.',
        'slug': 'nuance_adj'
    },
    'Advanced Grammar & Discourse Markers': {
        'nameUz': 'Diskurs Vositalari va Grammatika',
        'nameEn': 'Advanced Grammar & Discourse Markers',
        'emoji': '🧩',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-700',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Murakkab insho va akademik taqdimotlar uchun leksik ko‘priklar.',
        'slug': 'discourse_markers'
    },
    'Human Nature & Ethics': {
        'nameUz': 'Inson Tabiati va Axloq',
        'nameEn': 'Human Nature & Ethics',
        'emoji': '⚖️',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Axloqiy qadriyatlar, vijdon, burch va insoniy fazilatlar.',
        'slug': 'ethics'
    },
    'Economics & Finance': {
        'nameUz': 'Iqtisodiyot va Moliya',
        'nameEn': 'Economics & Finance',
        'emoji': '📈',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Makroiqtisodiyot, pul-kredit siyosati, bozor kon’yunkturasi va likvidlik.',
        'slug': 'adv_econ'
    },
    'Governance & Law': {
        'nameUz': 'Davlat Boshqaruvi va Huquq',
        'nameEn': 'Governance & Law',
        'emoji': '🏛️',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-800',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Qonun ustuvorligi, konstitutsiyaviy huquq, yurisprudensiya va suverenitet.',
        'slug': 'adv_law'
    },
    'Medicine & Public Health': {
        'nameUz': 'Tibbiyot va Jamoat Salomatligi',
        'nameEn': 'Medicine & Public Health',
        'emoji': '🏥',
        'color': 'rose',
        'gradient': 'from-rose-500 to-red-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Klinik tushunchalar, bioetika, epidemiologiya va kasalliklarning oldini olish.',
        'slug': 'adv_med'
    },
    'Media, Culture & Society': {
        'nameUz': 'Media, Madaniyat va Jamiyat',
        'nameEn': 'Media, Culture & Society',
        'emoji': '🌐',
        'color': 'blue',
        'gradient': 'from-blue-600 to-indigo-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Ommaviy madaniyat, ijtimoiy tabaqalanish, an’analar va zamonaviy o‘zgarishlar.',
        'slug': 'adv_society'
    },
    'Psychology & Cognition': {
        'nameUz': 'Kognitiv Psixologiya va Idrok',
        'nameEn': 'Psychology & Cognition',
        'emoji': '🧠',
        'color': 'purple',
        'gradient': 'from-purple-500 to-indigo-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Xotira, fikrlash xatoliklari, hissiy aql va insoniy qaror qabul qilish mexanizmi.',
        'slug': 'adv_psych'
    },
    'Environment & Sustainability': {
        'nameUz': 'Atrof-muhit va Barqarorlik',
        'nameEn': 'Environment & Sustainability',
        'emoji': '🌿',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-green-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Barqaror rivojlanish, uglerod neytralligi va global ekologik maqsadlar.',
        'slug': 'adv_env'
    },
    'Global & International Affairs': {
        'nameUz': 'Xalqaro Munosabatlar',
        'nameEn': 'Global & International Affairs',
        'emoji': '🌍',
        'color': 'sky',
        'gradient': 'from-sky-500 to-blue-600',
        'bgLight': 'bg-sky-50/80',
        'borderLight': 'border-sky-200',
        'textAccent': 'text-sky-800',
        'desc': 'Geosiyosat, ko‘p tomonlama shartnomalar, xalqaro xavfsizlik va diplomatiya.',
        'slug': 'adv_global'
    },
    'Advanced Academic': {
        'nameUz': 'Ilg‘or Akademik Leksika',
        'nameEn': 'Advanced Academic Lexis',
        'emoji': '📜',
        'color': 'violet',
        'gradient': 'from-violet-600 to-purple-700',
        'bgLight': 'bg-violet-50/80',
        'borderLight': 'border-violet-200',
        'textAccent': 'text-violet-800',
        'desc': 'IELTS 7.5–8.5, ilmiy jurnallar va akademik maqolalar uchun yuksak leksika.',
        'slug': 'adv_academic'
    },
    'Mastery & Rare': {
        'nameUz': 'Mukammal va Nodir Leksika',
        'nameEn': 'Mastery & Rare Lexis',
        'emoji': '💎',
        'color': 'amber',
        'gradient': 'from-amber-500 to-rose-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-900',
        'desc': 'C2 darajasidagi boy ona tili saviyasi, nozik ma’nodosh va nodir adabiy so‘zlar.',
        'slug': 'mastery_rare'
    },

    # Single-word generic topics present in lists
    'Business': {
        'nameUz': 'Biznes va Tijorat',
        'nameEn': 'Business',
        'emoji': '💼',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Tijorat, bozor va korporativ faoliyat.',
        'slug': 'biz_single'
    },
    'Society': {
        'nameUz': 'Jamiyat va Ijtimoiy Hayot',
        'nameEn': 'Society',
        'emoji': '👥',
        'color': 'blue',
        'gradient': 'from-blue-600 to-indigo-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Ijtimoiy tizim, jamoatchilik va fuqarolik munosabatlari.',
        'slug': 'society_single'
    },
    'Work': {
        'nameUz': 'Mehnat va Kasb',
        'nameEn': 'Work',
        'emoji': '💼',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Kasbiy vazifalar va mehnat jarayoni.',
        'slug': 'work_single'
    },
    'Science': {
        'nameUz': 'Ilm-fan',
        'nameEn': 'Science',
        'emoji': '🔬',
        'color': 'cyan',
        'gradient': 'from-cyan-500 to-blue-600',
        'bgLight': 'bg-cyan-50/80',
        'borderLight': 'border-cyan-200',
        'textAccent': 'text-cyan-800',
        'desc': 'Ilmiy tushunchalar va tabiiy qonuniyatlar.',
        'slug': 'science_single'
    },
    'Psychology': {
        'nameUz': 'Psixologiya',
        'nameEn': 'Psychology',
        'emoji': '🧠',
        'color': 'purple',
        'gradient': 'from-purple-500 to-indigo-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Ruhiyat, fe’l-atvor va idrok qilish.',
        'slug': 'psych_single'
    },
    'Communication': {
        'nameUz': 'Muloqot va Axborot',
        'nameEn': 'Communication',
        'emoji': '🗣️',
        'color': 'blue',
        'gradient': 'from-blue-600 to-indigo-700',
        'bgLight': 'bg-blue-50/80',
        'borderLight': 'border-blue-200',
        'textAccent': 'text-blue-800',
        'desc': 'Muloqot qilish, fikr yetkazish va suhbat.',
        'slug': 'comm_single'
    },
    'Law': {
        'nameUz': 'Qonun va Huquq',
        'nameEn': 'Law',
        'emoji': '⚖️',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-800',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Huquqiy normalar, sud va qonunchilik.',
        'slug': 'law_single'
    },
    'Everyday': {
        'nameUz': 'Kundalik Turmush',
        'nameEn': 'Everyday Life',
        'emoji': '☕',
        'color': 'amber',
        'gradient': 'from-amber-500 to-orange-600',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-800',
        'desc': 'Har kungi kundalik vaziyatlar va oddiy hayot.',
        'slug': 'everyday_single'
    },
    'Politics': {
        'nameUz': 'Siyosat',
        'nameEn': 'Politics',
        'emoji': '🏛️',
        'color': 'slate',
        'gradient': 'from-slate-600 to-stone-800',
        'bgLight': 'bg-slate-50/80',
        'borderLight': 'border-slate-200',
        'textAccent': 'text-slate-800',
        'desc': 'Siyosiy munosabatlar va davlat tuzilishi.',
        'slug': 'politics_single'
    },
    'Economy': {
        'nameUz': 'Iqtisodiyot',
        'nameEn': 'Economy',
        'emoji': '📊',
        'color': 'emerald',
        'gradient': 'from-emerald-500 to-teal-600',
        'bgLight': 'bg-emerald-50/80',
        'borderLight': 'border-emerald-200',
        'textAccent': 'text-emerald-800',
        'desc': 'Iqtisodiy jarayonlar, bozor va moliyaviy muvozanat.',
        'slug': 'economy_single'
    },
    'Language': {
        'nameUz': 'Til va Lingvistika',
        'nameEn': 'Language & Linguistics',
        'emoji': '🗣️',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-purple-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': 'Nutq, til vositalari, uslub va so‘z boyligi.',
        'slug': 'language_single'
    },
    'Behavior': {
        'nameUz': 'Xulq-atvor',
        'nameEn': 'Behavior',
        'emoji': '🚶',
        'color': 'purple',
        'gradient': 'from-purple-500 to-pink-600',
        'bgLight': 'bg-purple-50/80',
        'borderLight': 'border-purple-200',
        'textAccent': 'text-purple-800',
        'desc': 'Xulq, xatti-harakat va insoniy reaksiyalar.',
        'slug': 'behavior_single'
    },
    'Literature': {
        'nameUz': 'Adabiyot',
        'nameEn': 'Literature',
        'emoji': '📚',
        'color': 'rose',
        'gradient': 'from-rose-500 to-purple-600',
        'bgLight': 'bg-rose-50/80',
        'borderLight': 'border-rose-200',
        'textAccent': 'text-rose-800',
        'desc': 'Badiiy ijod, hikoyalar va adabiy meros.',
        'slug': 'literature_single'
    },
    'Philosophy': {
        'nameUz': 'Falsafa',
        'nameEn': 'Philosophy',
        'emoji': '💭',
        'color': 'amber',
        'gradient': 'from-amber-600 to-yellow-700',
        'bgLight': 'bg-amber-50/80',
        'borderLight': 'border-amber-200',
        'textAccent': 'text-amber-900',
        'desc': 'Borliq, haqiqat va inson hayoti ma’nosi.',
        'slug': 'philosophy_single'
    },
    'Media': {
        'nameUz': 'OAV va Jurnalistika',
        'nameEn': 'Media',
        'emoji': '📡',
        'color': 'cyan',
        'gradient': 'from-cyan-500 to-blue-600',
        'bgLight': 'bg-cyan-50/80',
        'borderLight': 'border-cyan-200',
        'textAccent': 'text-cyan-800',
        'desc': 'Matbuot, televideniye va axborot vositalari.',
        'slug': 'media_single'
    },
}

def clean_topic_name(raw_top):
    # Remove leading numbering like "1. Greetings & Basic Communication"
    t = re.sub(r'^\d+\.\s*', '', raw_top.strip())
    # Standardize slight naming variants
    if t == 'Travel & Transport': return 'Travel & Transport'
    if t == 'Places, Transport & Travel': return 'Places, Transport & Travel'
    return t

def get_topic_info(raw_top):
    clean = clean_topic_name(raw_top)
    if clean in TOPIC_META:
        return TOPIC_META[clean]
    # Fallback
    slug = re.sub(r'[^a-z0-9]+', '_', clean.lower()).strip('_')
    return {
        'nameUz': clean,
        'nameEn': clean,
        'emoji': '📚',
        'color': 'indigo',
        'gradient': 'from-indigo-600 to-blue-700',
        'bgLight': 'bg-indigo-50/80',
        'borderLight': 'border-indigo-200',
        'textAccent': 'text-indigo-800',
        'desc': f"{clean} mavzusiga oid saralangan so‘zlar to‘plami.",
        'slug': slug
    }

# Process each level's JSON file to update categories and topicIds based on tmp/user_*.csv
LEVEL_FILES = {
    'A1': ['tmp/user_a1_1.csv', 'tmp/user_a1_2.csv', 'tmp/user_a1_3.csv'],
    'A2': ['tmp/user_a2_1.csv', 'tmp/user_a2_2.csv'],
    'B1': ['tmp/user_b1_1.csv', 'tmp/user_b1_2.csv', 'tmp/user_b1_3.csv'],
    'B2': ['tmp/user_b2_1.csv', 'tmp/user_b2_2.csv', 'tmp/user_b2_3.csv'],
    'C1': ['tmp/user_c1.csv'],
    'C2': ['tmp/user_c2.csv'],
}

all_ts_categories = {}

for lvl, fps in LEVEL_FILES.items():
    json_path = f"public/data/cefr/{lvl.lower()}.json"
    with open(json_path, 'r', encoding='utf-8') as f:
        words = json.load(f)

    # Read all CSV rows for this level
    csv_rows = []
    for fp in fps:
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
            for r in csv.reader(f):
                if len(r) >= 2:
                    csv_rows.append(r)

    print(f"Level {lvl}: {len(words)} JSON words, {len(csv_rows)} CSV rows")

    for i, w in enumerate(words):
        if i < len(csv_rows):
            raw_top = csv_rows[i][1].strip()
        else:
            # Fallback for synthetic tail words
            raw_top = "General"

        meta = get_topic_info(raw_top)
        uz_cat = meta['nameUz']
        slug = meta['slug']

        w['category'] = uz_cat
        w['topicId'] = f"cefr_{lvl.lower()}_{slug}"

        # Register in TS categories dictionary
        all_ts_categories[uz_cat] = meta
        all_ts_categories[meta['nameEn']] = meta

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    print(f"Updated {json_path} successfully!")

# Update starter_preview.json with matching categories
starter_path = "public/data/cefr/starter_preview.json"
with open(starter_path, 'r', encoding='utf-8') as f:
    starters = json.load(f)

for w in starters:
    # Look up from the updated level file
    lvl = w['level']
    lvl_json = f"public/data/cefr/{lvl.lower()}.json"
    with open(lvl_json, 'r', encoding='utf-8') as f:
        lvl_words = json.load(f)
    match = next((x for x in lvl_words if x['id'] == w['id']), None)
    if match:
        w['category'] = match['category']
        w['topicId'] = match['topicId']

with open(starter_path, 'w', encoding='utf-8') as f:
    json.dump(starters, f, ensure_ascii=False, indent=2)
print("Updated starter_preview.json successfully!")

# Update public/data/cefr/metadata.json
meta_path = "public/data/cefr/metadata.json"
with open(meta_path, 'r', encoding='utf-8') as f:
    meta_json = json.load(f)

for lvl in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']:
    lvl_json = f"public/data/cefr/{lvl.lower()}.json"
    with open(lvl_json, 'r', encoding='utf-8') as f:
        lvl_words = json.load(f)
    counts = dict(Counter(w['category'] for w in lvl_words))
    meta_json['levels'][lvl]['categories'] = counts

with open(meta_path, 'w', encoding='utf-8') as f:
    json.dump(meta_json, f, ensure_ascii=False, indent=2)
print("Updated metadata.json with exact topic counts!")

# Save all_ts_categories to a json file for generating cefrService.ts
with open('tmp/topic_categories.json', 'w', encoding='utf-8') as f:
    json.dump(all_ts_categories, f, ensure_ascii=False, indent=2)
print("Generated tmp/topic_categories.json!")
