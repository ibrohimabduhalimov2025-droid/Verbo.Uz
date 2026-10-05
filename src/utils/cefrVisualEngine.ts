import { Word, CEFRLevel } from '../types';

export interface WordVisualMeta {
  imageUrl: string;
  hasSpecificImage: boolean;
  sourceType: 'custom' | 'photo' | 'artwork' | 'none';
  accentGradient: string;
  themeColor: string;
  categoryLabel: string;
  categoryIcon: string;
  mnemonicHook: string;
  isConcreteObject: boolean;
  objectQuestion: string;
  objectPromptUz: string;
  letterHint: string;
}

/**
 * Normalizes a word string for dictionary lookup.
 * Strips out parenthetical qualifiers like '(animal)', '(organ)', '(handbag)', etc.
 */
export function normalizeWordKey(english: string): string {
  if (!english) return '';
  return english
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim();
}

/**
 * Dedicated visual vector graphics for tangible objects, animals, food, tools, clothing, vehicles, etc.
 * 100% offline, loads in 0ms, guaranteed never to break, 0 API tokens!
 */
export const OBJECT_VECTOR_EMBLEMS: Record<
  string,
  { emoji: string; color1: string; color2: string; uzHint: string }
> = {
  // === Hayvonlar & Jonivorlar (Animals & Wildlife) ===
  dog: { emoji: '🐕', color1: '#d97706', color2: '#78350f', uzHint: 'Kuchuk / It — vafodor uy hayvoni' },
  dogs: { emoji: '🐕', color1: '#d97706', color2: '#78350f', uzHint: 'Kuchuklar — uy hayvonlari' },
  puppy: { emoji: '🐶', color1: '#d97706', color2: '#92400e', uzHint: 'Kuchukcha — kichik itcha' },
  cat: { emoji: '🐈', color1: '#f97316', color2: '#c2410c', uzHint: 'Mushuk — muloyim uy jonivori' },
  cats: { emoji: '🐈', color1: '#f97316', color2: '#c2410c', uzHint: 'Mushuklar — xonaki jonivorlar' },
  kitten: { emoji: '🐱', color1: '#fb923c', color2: '#ea580c', uzHint: 'Mushukcha — kichik mushuk' },
  cow: { emoji: '🐄', color1: '#64748b', color2: '#334155', uzHint: 'Sigir — sut beruvchi xonaki hayvon' },
  cows: { emoji: '🐄', color1: '#64748b', color2: '#334155', uzHint: 'Sigirlar — qoramollar' },
  calf: { emoji: '🐮', color1: '#78716c', color2: '#44403c', uzHint: 'Buzoq — yosh qoramol' },
  bull: { emoji: '🐂', color1: '#92400e', color2: '#451a03', uzHint: 'Ho‘kiz / Buqa — kuchli qoramol' },
  ox: { emoji: '🐂', color1: '#92400e', color2: '#451a03', uzHint: 'Ho‘kiz — mehnatkash qoramol' },
  horse: { emoji: '🐎', color1: '#92400e', color2: '#451a03', uzHint: 'Ot — chopqir xonaki hayvon' },
  horses: { emoji: '🐎', color1: '#92400e', color2: '#451a03', uzHint: 'Otlar — chopqir hayvonlar' },
  sheep: { emoji: '🐑', color1: '#78716c', color2: '#44403c', uzHint: 'Qo‘y — jun va go‘sht beruvchi jonivor' },
  lamb: { emoji: '🐑', color1: '#a8a29e', color2: '#57534e', uzHint: 'Qo‘zichoq — kichik qo‘y' },
  goat: { emoji: '🐐', color1: '#a8a29e', color2: '#57534e', uzHint: 'Echki — chaqqon uy hayvoni' },
  goats: { emoji: '🐐', color1: '#a8a29e', color2: '#57534e', uzHint: 'Echkilar — uy hayvonlari' },
  pig: { emoji: '🐖', color1: '#f472b6', color2: '#db2777', uzHint: 'Cho‘chqa — xonaki hayvon' },
  donkey: { emoji: '🫏', color1: '#78716c', color2: '#44403c', uzHint: 'Eshak — yuk tashuvchi xonaki hayvon' },
  lion: { emoji: '🦁', color1: '#f59e0b', color2: '#b45309', uzHint: 'Sher — yirtqich hayvonlar shohi' },
  lions: { emoji: '🦁', color1: '#f59e0b', color2: '#b45309', uzHint: 'Sherlar — yirtqichlar' },
  tiger: { emoji: '🐅', color1: '#ea580c', color2: '#9a3412', uzHint: 'Yo‘lbars — yo‘l-yo‘l bahaybat yirtqich' },
  tigers: { emoji: '🐅', color1: '#ea580c', color2: '#9a3412', uzHint: 'Yo‘lbarslar — yirtqichlar' },
  leopard: { emoji: '🐆', color1: '#d97706', color2: '#78350f', uzHint: 'Qoplon — chaqqon yirtqich' },
  cheetah: { emoji: '🐆', color1: '#eab308', color2: '#854d0e', uzHint: 'Gepard — dunyodagi eng tezkor jonivor' },
  elephant: { emoji: '🐘', color1: '#64748b', color2: '#334155', uzHint: 'Fil — eng bahaybat quruqlik hayvoni' },
  elephants: { emoji: '🐘', color1: '#64748b', color2: '#334155', uzHint: 'Fillar — bahaybat hayvonlar' },
  monkey: { emoji: '🐒', color1: '#a16207', color2: '#713f12', uzHint: 'Maymun — chaqqon daraxt jonivori' },
  monkeys: { emoji: '🐒', color1: '#a16207', color2: '#713f12', uzHint: 'Maymunlar — daraxt jonivorlari' },
  gorilla: { emoji: '🦍', color1: '#334155', color2: '#0f172a', uzHint: 'Gorilla — ulkan odamsimon maymun' },
  bear: { emoji: '🐻', color1: '#78350f', color2: '#451a03', uzHint: 'Ayiq — o‘rmon pahlavoni' },
  bears: { emoji: '🐻', color1: '#78350f', color2: '#451a03', uzHint: 'Ayiqlar — o‘rmon jonivorlari' },
  wolf: { emoji: '🐺', color1: '#475569', color2: '#1e293b', uzHint: 'Bo‘ri — yovvoyi o‘rmon yirtqichi' },
  wolves: { emoji: '🐺', color1: '#475569', color2: '#1e293b', uzHint: 'Bo‘rilar — to‘dali yirtqichlar' },
  fox: { emoji: '🦊', color1: '#ea580c', color2: '#9a3412', uzHint: 'Tulki — ayyor yovvoyi jonivor' },
  foxes: { emoji: '🦊', color1: '#ea580c', color2: '#9a3412', uzHint: 'Tulkilar — ayyor jonivorlar' },
  rabbit: { emoji: '🐇', color1: '#cbd5e1', color2: '#64748b', uzHint: 'Quyon — uzun quloq jonivor' },
  rabbits: { emoji: '🐇', color1: '#cbd5e1', color2: '#64748b', uzHint: 'Quyonlar — tez yugurar jonivorlar' },
  hare: { emoji: '🐇', color1: '#cbd5e1', color2: '#64748b', uzHint: 'Yovvoyi quyon' },
  mouse: { emoji: '🐁', color1: '#94a3b8', color2: '#475569', uzHint: 'Sichqon — kichik kemiruvchi' },
  mice: { emoji: '🐁', color1: '#94a3b8', color2: '#475569', uzHint: 'Sichqonlar — kemiruvchilar' },
  rat: { emoji: '🐀', color1: '#64748b', color2: '#334155', uzHint: 'Kalamush — kemiruvchi jonivor' },
  deer: { emoji: '🦌', color1: '#b45309', color2: '#78350f', uzHint: 'Kiyik — shoxdor go‘zal jonivor' },
  camel: { emoji: '🐪', color1: '#d97706', color2: '#92400e', uzHint: 'Tuya — sahro kemasi' },
  camels: { emoji: '🐪', color1: '#d97706', color2: '#92400e', uzHint: 'Tuyalar — sahro hayvonlari' },
  zebra: { emoji: '🦓', color1: '#475569', color2: '#0f172a', uzHint: 'Zebra — oq-qora yo‘l-yo‘l hayvon' },
  zebras: { emoji: '🦓', color1: '#475569', color2: '#0f172a', uzHint: 'Zebralar — Afrika hayvonlari' },
  giraffe: { emoji: '🦒', color1: '#eab308', color2: '#a16207', uzHint: 'Jirafa — uzun bo‘yinli hayvon' },
  giraffes: { emoji: '🦒', color1: '#eab308', color2: '#a16207', uzHint: 'Jirafalar — eng baland hayvonlar' },
  kangaroo: { emoji: '🦘', color1: '#d97706', color2: '#78350f', uzHint: 'Kenguru — sakrovchi xaltali hayvon' },
  panda: { emoji: '🐼', color1: '#1e293b', color2: '#0f172a', uzHint: 'Panda — bambukxo‘r oq-qora ayiq' },
  koala: { emoji: '🐨', color1: '#64748b', color2: '#334155', uzHint: 'Koala — daraxtda yashovchi xaltali ayiq' },
  squirrel: { emoji: '🐿️', color1: '#b45309', color2: '#78350f', uzHint: 'Olmoxon — chaqqon o‘rmon jonivori' },
  hedgehog: { emoji: '🦔', color1: '#78716c', color2: '#44403c', uzHint: 'Tipratikan — tikanli jonivor' },
  bat: { emoji: '🦇', color1: '#334155', color2: '#0f172a', uzHint: 'Ko‘rshapalak — tungi uchar jonivor' },
  snake: { emoji: '🐍', color1: '#16a34a', color2: '#14532d', uzHint: 'Ilon — sudralib yuruvchi jonivor' },
  snakes: { emoji: '🐍', color1: '#16a34a', color2: '#14532d', uzHint: 'Ilonlar — sudralib yuruvchilar' },
  turtle: { emoji: '🐢', color1: '#059669', color2: '#065f46', uzHint: 'Toshbaqa — qattiq kosali jonivor' },
  tortoise: { emoji: '🐢', color1: '#059669', color2: '#065f46', uzHint: 'Quruqlik toshbaqasi' },
  lizard: { emoji: '🦎', color1: '#16a34a', color2: '#15803d', uzHint: 'Kaltakesak — chaqqon jonivor' },
  frog: { emoji: '🐸', color1: '#22c55e', color2: '#15803d', uzHint: 'Qurbaqa — suvda va quruqlikda yashovchi' },
  frogs: { emoji: '🐸', color1: '#22c55e', color2: '#15803d', uzHint: 'Qurbaqalar' },
  crocodile: { emoji: '🐊', color1: '#15803d', color2: '#14532d', uzHint: 'Timsoh — yirtqich suv jonivori' },
  alligator: { emoji: '🐊', color1: '#15803d', color2: '#14532d', uzHint: 'Alligator — yirtqich timsoh' },
  hippopotamus: { emoji: '🦛', color1: '#64748b', color2: '#334155', uzHint: 'Begemot — daryo hayvoni' },
  hippo: { emoji: '🦛', color1: '#64748b', color2: '#334155', uzHint: 'Begemot' },
  rhinoceros: { emoji: '🦏', color1: '#64748b', color2: '#334155', uzHint: 'Karkidon — bir shoxli hayvon' },
  rhino: { emoji: '🦏', color1: '#64748b', color2: '#334155', uzHint: 'Karkidon' },

  // Qushlar (Birds)
  bird: { emoji: '🐦', color1: '#0ea5e9', color2: '#0284c7', uzHint: 'Qush — qanotli jonivor' },
  birds: { emoji: '🐦', color1: '#0ea5e9', color2: '#0284c7', uzHint: 'Qushlar — qanotli jonivorlar' },
  eagle: { emoji: '🦅', color1: '#78350f', color2: '#451a03', uzHint: 'Burgut — osmon qahramoni' },
  eagles: { emoji: '🦅', color1: '#78350f', color2: '#451a03', uzHint: 'Burgutlar — yirtqich qushlar' },
  owl: { emoji: '🦉', color1: '#a16207', color2: '#713f12', uzHint: 'Boyo‘g‘li — tungi qush' },
  duck: { emoji: '🦆', color1: '#0d9488', color2: '#115e59', uzHint: 'O‘rdak — suzuvchi qush' },
  ducks: { emoji: '🦆', color1: '#0d9488', color2: '#115e59', uzHint: 'O‘rdaklar — suv qushlari' },
  chicken: { emoji: '🐔', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Tovuq — xonaki parranda' },
  chickens: { emoji: '🐔', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Tovuqlar — parrandalar' },
  rooster: { emoji: '🐓', color1: '#dc2626', color2: '#991b1b', uzHint: 'Xo‘roz — ertalab qichqiruvchi parranda' },
  parrot: { emoji: '🦜', color1: '#22c55e', color2: '#15803d', uzHint: 'To‘tiqush — rang-barang gapiruvchi qush' },
  swan: { emoji: '🦢', color1: '#f8fafc', color2: '#94a3b8', uzHint: 'Oqqush — go‘zal qush' },
  penguin: { emoji: '🐧', color1: '#0f172a', color2: '#0284c7', uzHint: 'Pingvin — muzlikda yashovchi qush' },
  penguins: { emoji: '🐧', color1: '#0f172a', color2: '#0284c7', uzHint: 'Pingvinlar' },
  dove: { emoji: '🕊️', color1: '#f8fafc', color2: '#94a3b8', uzHint: 'Kaptar — tinchlik ramzi' },
  pigeon: { emoji: '🐦', color1: '#64748b', color2: '#334155', uzHint: 'Kabutar — shahar qushi' },
  sparrow: { emoji: '🐦', color1: '#b45309', color2: '#78350f', uzHint: 'Chumchuq — kichik qush' },
  crow: { emoji: '🐦‍⬛', color1: '#1e293b', color2: '#0f172a', uzHint: 'Qarg‘a — qora qush' },
  raven: { emoji: '🐦‍⬛', color1: '#0f172a', color2: '#020617', uzHint: 'Qarg‘a — bahaybat qora qush' },
  peacock: { emoji: '🦚', color1: '#0284c7', color2: '#0f766e', uzHint: 'Tovus — rang-barang go‘zal qush' },
  flamingo: { emoji: '🦩', color1: '#f43f5e', color2: '#be123c', uzHint: 'Flamingo — pushtirang qush' },
  goose: { emoji: '🪿', color1: '#f8fafc', color2: '#94a3b8', uzHint: 'G‘oz — yirik suv parrandasi' },
  geese: { emoji: '🪿', color1: '#f8fafc', color2: '#94a3b8', uzHint: 'G‘ozlar — suv parrandalari' },
  turkey: { emoji: '🦃', color1: '#b45309', color2: '#78350f', uzHint: 'Kurka — yirik xonaki parranda' },
  ostrich: { emoji: '🦤', color1: '#334155', color2: '#0f172a', uzHint: 'Tuyaqush — eng katta yuguruvchi qush' },

  // Suv hayvonlari & Hasharotlar (Marine & Insects)
  fish: { emoji: '🐟', color1: '#0284c7', color2: '#0369a1', uzHint: 'Baliq — suv jonivori' },
  fishes: { emoji: '🐟', color1: '#0284c7', color2: '#0369a1', uzHint: 'Baliqlar' },
  shark: { emoji: '🦈', color1: '#0369a1', color2: '#0c4a6e', uzHint: 'Akula — dengiz yirtqichi' },
  sharks: { emoji: '🦈', color1: '#0369a1', color2: '#0c4a6e', uzHint: 'Akulalar' },
  whale: { emoji: '🐋', color1: '#1e3a8a', color2: '#172554', uzHint: 'Kit — eng ulkan suv jonzoti' },
  whales: { emoji: '🐋', color1: '#1e3a8a', color2: '#172554', uzHint: 'Kitlar' },
  dolphin: { emoji: '🐬', color1: '#0ea5e9', color2: '#0369a1', uzHint: 'Delfin — aqlli dengiz jonzoti' },
  dolphins: { emoji: '🐬', color1: '#0ea5e9', color2: '#0369a1', uzHint: 'Delfinlar' },
  crab: { emoji: '🦀', color1: '#dc2626', color2: '#991b1b', uzHint: 'Qisqichbaqa — dengiz jonivori' },
  lobster: { emoji: '🦞', color1: '#b91c1c', color2: '#7f1d1d', uzHint: 'Omar — katta qisqichbaqa' },
  shrimp: { emoji: '🦐', color1: '#f97316', color2: '#c2410c', uzHint: 'Krevetka — dengiz mahsuloti' },
  octopus: { emoji: '🐙', color1: '#ec4899', color2: '#be185d', uzHint: 'Sakkizoyoq — dengiz jonzoti' },
  squid: { emoji: '🦑', color1: '#d946ef', color2: '#a21caf', uzHint: 'Kalmar — ko‘p oyoqli dengiz jonzoti' },
  jellyfish: { emoji: '🪼', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Meduza — shaffof dengiz jonzoti' },
  starfish: { emoji: '⭐', color1: '#f59e0b', color2: '#b45309', uzHint: 'Dengiz yulduzi' },
  bee: { emoji: '🐝', color1: '#eab308', color2: '#a16207', uzHint: 'Asalari — asal yig‘uvchi hasharot' },
  bees: { emoji: '🐝', color1: '#eab308', color2: '#a16207', uzHint: 'Asalarilar' },
  butterfly: { emoji: '🦋', color1: '#8b5cf6', color2: '#6d28d9', uzHint: 'Kapalak — go‘zal qanotli hasharot' },
  butterflies: { emoji: '🦋', color1: '#8b5cf6', color2: '#6d28d9', uzHint: 'Kapalaklar' },
  ant: { emoji: '🐜', color1: '#78350f', color2: '#451a03', uzHint: 'Chumoli — mehnatkash hasharot' },
  ants: { emoji: '🐜', color1: '#78350f', color2: '#451a03', uzHint: 'Chumolilar' },
  spider: { emoji: '🕷️', color1: '#1e293b', color2: '#0f172a', uzHint: 'O‘rgimchak — to‘r to‘quvchi' },
  spiders: { emoji: '🕷️', color1: '#1e293b', color2: '#0f172a', uzHint: 'O‘rgimchaklar' },
  mosquito: { emoji: '🦟', color1: '#64748b', color2: '#334155', uzHint: 'Chivin — qon so‘ruvchi hasharot' },
  fly: { emoji: '🪰', color1: '#475569', color2: '#1e293b', uzHint: 'Pashsha — qanotli hasharot' },
  flies: { emoji: '🪰', color1: '#475569', color2: '#1e293b', uzHint: 'Pashshalar' },
  beetle: { emoji: '🪲', color1: '#15803d', color2: '#14532d', uzHint: 'Qo‘ng‘iz — qattiq qanotli hasharot' },
  caterpillar: { emoji: '🐛', color1: '#22c55e', color2: '#16a34a', uzHint: 'Qurt — kapalak lichinkasi' },
  snail: { emoji: '🐌', color1: '#b45309', color2: '#78350f', uzHint: 'Shilliqurt — kosali sekin jonzot' },
  worm: { emoji: '🪱', color1: '#f472b6', color2: '#be185d', uzHint: 'Chuvalchang — yer jonzoti' },

  // === Mevalar & Rezavorlar (Fruits & Berries) ===
  apple: { emoji: '🍎', color1: '#ef4444', color2: '#991b1b', uzHint: 'Olma — shirin qizil meva' },
  apples: { emoji: '🍎', color1: '#ef4444', color2: '#991b1b', uzHint: 'Olmalar — mevalar' },
  banana: { emoji: '🍌', color1: '#eab308', color2: '#ca8a04', uzHint: 'Banan — sariq tropik meva' },
  bananas: { emoji: '🍌', color1: '#eab308', color2: '#ca8a04', uzHint: 'Bananlar' },
  orange: { emoji: '🍊', color1: '#f97316', color2: '#c2410c', uzHint: 'Apelsin — nordon-shirin sitrus' },
  oranges: { emoji: '🍊', color1: '#f97316', color2: '#c2410c', uzHint: 'Apelsinlar' },
  lemon: { emoji: '🍋', color1: '#facc15', color2: '#a16207', uzHint: 'Limon — nordon sariq sitrus' },
  lemons: { emoji: '🍋', color1: '#facc15', color2: '#a16207', uzHint: 'Limonlar' },
  lime: { emoji: '🍋‍🟩', color1: '#84cc16', color2: '#4d7c0f', uzHint: 'Laym — yashil nordon meva' },
  grape: { emoji: '🍇', color1: '#8b5cf6', color2: '#5b21b6', uzHint: 'Uzum — shingil meva' },
  grapes: { emoji: '🍇', color1: '#8b5cf6', color2: '#5b21b6', uzHint: 'Uzum — shingil meva' },
  strawberry: { emoji: '🍓', color1: '#f43f5e', color2: '#be123c', uzHint: 'Qulupnay — qizil shirin rezavor' },
  strawberries: { emoji: '🍓', color1: '#f43f5e', color2: '#be123c', uzHint: 'Qulupnaylar' },
  watermelon: { emoji: '🍉', color1: '#10b981', color2: '#047857', uzHint: 'Tarvuz — sersuv poliz ekini' },
  watermelons: { emoji: '🍉', color1: '#10b981', color2: '#047857', uzHint: 'Tarvuzlar' },
  melon: { emoji: '🍈', color1: '#84cc16', color2: '#4d7c0f', uzHint: 'Qovun — shirin poliz mevasi' },
  melons: { emoji: '🍈', color1: '#84cc16', color2: '#4d7c0f', uzHint: 'Qovunlar' },
  cherry: { emoji: '🍒', color1: '#dc2626', color2: '#7f1d1d', uzHint: 'Gilos / Olcha' },
  cherries: { emoji: '🍒', color1: '#dc2626', color2: '#7f1d1d', uzHint: 'Giloslar / Olchalar' },
  peach: { emoji: '🍑', color1: '#fb923c', color2: '#ea580c', uzHint: 'Shaftoli — mayin xushbo‘y meva' },
  peaches: { emoji: '🍑', color1: '#fb923c', color2: '#ea580c', uzHint: 'Shaftolilar' },
  pear: { emoji: '🍐', color1: '#84cc16', color2: '#4d7c0f', uzHint: 'Nok — shirin meva' },
  pears: { emoji: '🍐', color1: '#84cc16', color2: '#4d7c0f', uzHint: 'Noklar' },
  pineapple: { emoji: '🍍', color1: '#eab308', color2: '#854d0e', uzHint: 'Ananas — tropik meva' },
  pineapples: { emoji: '🍍', color1: '#eab308', color2: '#854d0e', uzHint: 'Ananaslar' },
  pomegranate: { emoji: '🍎', color1: '#b91c1c', color2: '#7f1d1d', uzHint: 'Anor — donador qizil meva' },
  apricot: { emoji: '🍑', color1: '#f97316', color2: '#c2410c', uzHint: 'O‘rik — shirin sarg‘ish meva' },
  apricots: { emoji: '🍑', color1: '#f97316', color2: '#c2410c', uzHint: 'O‘riklar' },
  plum: { emoji: '🫐', color1: '#7c3aed', color2: '#4c1d95', uzHint: 'Olxo‘ri — to‘q binafsha meva' },
  plums: { emoji: '🫐', color1: '#7c3aed', color2: '#4c1d95', uzHint: 'Olxo‘rilar' },
  fig: { emoji: '🫐', color1: '#6b21a8', color2: '#3b0764', uzHint: 'Anjir — shirin meva' },
  figs: { emoji: '🫐', color1: '#6b21a8', color2: '#3b0764', uzHint: 'Anjirlar' },
  mango: { emoji: '🥭', color1: '#f59e0b', color2: '#b45309', uzHint: 'Mango — shirin tropik meva' },
  kiwi: { emoji: '🥝', color1: '#65a30d', color2: '#3f6212', uzHint: 'Kivi — nordon-shirin yashil meva' },
  avocado: { emoji: '🥑', color1: '#4d7c0f', color2: '#14532d', uzHint: 'Avokado — foydali meva' },
  coconut: { emoji: '🥥', color1: '#78350f', color2: '#451a03', uzHint: 'Kokos — qattiq qobiqli yong‘oq' },
  blueberry: { emoji: '🫐', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Chernika — ko‘k rezavor' },
  blueberries: { emoji: '🫐', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Chernikalar' },
  raspberry: { emoji: '🍓', color1: '#e11d48', color2: '#9f1239', uzHint: 'Malina — xushbo‘y rezavor' },
  raspberries: { emoji: '🍓', color1: '#e11d48', color2: '#9f1239', uzHint: 'Malinalar' },

  // === Sabzavotlar (Vegetables) ===
  tomato: { emoji: '🍅', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Pomidor — qizil sabzavot' },
  tomatoes: { emoji: '🍅', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Pomidorlar' },
  potato: { emoji: '🥔', color1: '#d97706', color2: '#78350f', uzHint: 'Kartoshka — to‘yimli ildizmeva' },
  potatoes: { emoji: '🥔', color1: '#d97706', color2: '#78350f', uzHint: 'Kartoshkalar' },
  carrot: { emoji: '🥕', color1: '#ea580c', color2: '#9a3412', uzHint: 'Sabzi — to‘q sariq sabzavot' },
  carrots: { emoji: '🥕', color1: '#ea580c', color2: '#9a3412', uzHint: 'Sabzilar' },
  onion: { emoji: '🧅', color1: '#f59e0b', color2: '#b45309', uzHint: 'Piyoz — o‘tkir ta’mli sabzavot' },
  onions: { emoji: '🧅', color1: '#f59e0b', color2: '#b45309', uzHint: 'Piyozlar' },
  garlic: { emoji: '🧄', color1: '#78716c', color2: '#44403c', uzHint: 'Sarimsoq — shifobaxsh o‘tkir sabzavot' },
  cucumber: { emoji: '🥒', color1: '#22c55e', color2: '#15803d', uzHint: 'Bodring — yangi sersuv sabzavot' },
  cucumbers: { emoji: '🥒', color1: '#22c55e', color2: '#15803d', uzHint: 'Bodringlar' },
  corn: { emoji: '🌽', color1: '#eab308', color2: '#a16207', uzHint: 'Makkajo‘xori — sariq don' },
  pepper: { emoji: '🫑', color1: '#16a34a', color2: '#14532d', uzHint: 'Qalampir / Bolgar qalampiri' },
  peppers: { emoji: '🫑', color1: '#16a34a', color2: '#14532d', uzHint: 'Qalampirlar' },
  chili: { emoji: '🌶️', color1: '#dc2626', color2: '#991b1b', uzHint: 'Achchiq qalampir' },
  mushroom: { emoji: '🍄', color1: '#ef4444', color2: '#991b1b', uzHint: 'Qo‘ziqorin' },
  mushrooms: { emoji: '🍄', color1: '#ef4444', color2: '#991b1b', uzHint: 'Qo‘ziqorinlar' },
  cabbage: { emoji: '🥬', color1: '#16a34a', color2: '#14532d', uzHint: 'Karam — bargli sabzavot' },
  pumpkin: { emoji: '🎃', color1: '#ea580c', color2: '#9a3412', uzHint: 'Oshqovoq — poliz ekini' },
  pumpkins: { emoji: '🎃', color1: '#ea580c', color2: '#9a3412', uzHint: 'Oshqovoqlar' },
  eggplant: { emoji: '🍆', color1: '#7c3aed', color2: '#4c1d95', uzHint: 'Baqlajon — binafsha sabzavot' },
  lettuce: { emoji: '🥬', color1: '#22c55e', color2: '#15803d', uzHint: 'Salat bargi — ko‘kat' },
  broccoli: { emoji: '🥦', color1: '#15803d', color2: '#14532d', uzHint: 'Brokkoli — foydali karam' },
  pea: { emoji: '🫛', color1: '#4ade80', color2: '#16a34a', uzHint: 'No‘xat — dukkakli ozuqa' },
  peas: { emoji: '🫛', color1: '#4ade80', color2: '#16a34a', uzHint: 'No‘xat — dukkakli don' },
  bean: { emoji: '🫘', color1: '#b45309', color2: '#78350f', uzHint: 'Loviya — dukkakli don' },
  beans: { emoji: '🫘', color1: '#b45309', color2: '#78350f', uzHint: 'Loviyalar — dukkakli donlar' },
  radish: { emoji: '🥗', color1: '#f43f5e', color2: '#be123c', uzHint: 'Turp / Rediska' },
  spinach: { emoji: '🥬', color1: '#15803d', color2: '#14532d', uzHint: 'Ismaloq — temirga boy ko‘kat' },
  olive: { emoji: '🫒', color1: '#4d7c0f', color2: '#14532d', uzHint: 'Zaytun — foydali meva' },
  olives: { emoji: '🫒', color1: '#4d7c0f', color2: '#14532d', uzHint: 'Zaytunlar' },

  // === Taomlar & Ichimliklar (Food & Drinks) ===
  bread: { emoji: '🍞', color1: '#d97706', color2: '#78350f', uzHint: 'Non — issiq tandir noni' },
  cheese: { emoji: '🧀', color1: '#f59e0b', color2: '#b45309', uzHint: 'Pishloq — sut mahsuloti' },
  egg: { emoji: '🥚', color1: '#f8fafc', color2: '#94a3b8', uzHint: 'Tuxum — to‘yimli oqsil manbai' },
  eggs: { emoji: '🥚', color1: '#f8fafc', color2: '#94a3b8', uzHint: 'Tuxumlar' },
  meat: { emoji: '🥩', color1: '#dc2626', color2: '#881337', uzHint: 'Go‘sht — to‘yimli taom asosi' },
  beef: { emoji: '🥩', color1: '#b91c1c', color2: '#7f1d1d', uzHint: 'Mol go‘shti' },
  mutton: { emoji: '🥩', color1: '#991b1b', color2: '#4c0519', uzHint: 'Qo‘y go‘shti' },
  chicken_meat: { emoji: '🍗', color1: '#ea580c', color2: '#9a3412', uzHint: 'Tovuq go‘shti' },
  sausage: { emoji: '🌭', color1: '#dc2626', color2: '#991b1b', uzHint: 'Sosiska / Kolbasa' },
  sausages: { emoji: '🌭', color1: '#dc2626', color2: '#991b1b', uzHint: 'Sosiskalar / Kolbasalar' },
  bacon: { emoji: '🥓', color1: '#b91c1c', color2: '#7f1d1d', uzHint: 'Bekon — dudlangan go‘sht' },
  steak: { emoji: '🥩', color1: '#991b1b', color2: '#4c0519', uzHint: 'Bifshteks / Steyk' },
  butter: { emoji: '🧈', color1: '#fef08a', color2: '#ca8a04', uzHint: 'Sariyog‘ — sut mahsuloti' },
  milk: { emoji: '🥛', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Sut — toza oq ichimlik' },
  yogurt: { emoji: '🫙', color1: '#e0f2fe', color2: '#0284c7', uzHint: 'Qatiq / Yodurt' },
  coffee: { emoji: '☕', color1: '#78350f', color2: '#451a03', uzHint: 'Qahva — issiq tetiklantiruvchi ichimlik' },
  tea: { emoji: '🍵', color1: '#16a34a', color2: '#166534', uzHint: 'Choy — xushbo‘y issiq damlama' },
  water: { emoji: '💧', color1: '#0ea5e9', color2: '#0369a1', uzHint: 'Suv — hayot manbai' },
  juice: { emoji: '🧃', color1: '#f97316', color2: '#c2410c', uzHint: 'Sharbat — yangi mevali ichimlik' },
  soup: { emoji: '🍲', color1: '#d97706', color2: '#92400e', uzHint: 'Sho‘rva — issiq suyuq taom' },
  salad: { emoji: '🥗', color1: '#22c55e', color2: '#15803d', uzHint: 'Salat — yangi sabzavotlar' },
  pizza: { emoji: '🍕', color1: '#ea580c', color2: '#9a3412', uzHint: 'Pitsa — italyancha taom' },
  burger: { emoji: '🍔', color1: '#d97706', color2: '#78350f', uzHint: 'Burger — to‘yimli go‘shtli taom' },
  sandwich: { emoji: '🥪', color1: '#f59e0b', color2: '#b45309', uzHint: 'Sendvich — buterbrod' },
  rice: { emoji: '🍚', color1: '#f8fafc', color2: '#cbd5e1', uzHint: 'Guruch — oq donli ozuqa' },
  pasta: { emoji: '🍝', color1: '#f59e0b', color2: '#b45309', uzHint: 'Makaron / Pasta' },
  noodle: { emoji: '🍜', color1: '#f59e0b', color2: '#b45309', uzHint: 'Lag‘mon / Lapsha' },
  noodles: { emoji: '🍜', color1: '#f59e0b', color2: '#b45309', uzHint: 'Lag‘mon / Lapshalar' },
  cake: { emoji: '🎂', color1: '#ec4899', color2: '#be185d', uzHint: 'Tort / Pirojniy — shirinlik' },
  pie: { emoji: '🥧', color1: '#d97706', color2: '#78350f', uzHint: 'Pirog — pishiriq' },
  cookie: { emoji: '🍪', color1: '#b45309', color2: '#78350f', uzHint: 'Pechenye — shirin qarsildoq pechenye' },
  cookies: { emoji: '🍪', color1: '#b45309', color2: '#78350f', uzHint: 'Pechenyalar' },
  biscuit: { emoji: '🍪', color1: '#b45309', color2: '#78350f', uzHint: 'Biskvit / Pechenye' },
  chocolate: { emoji: '🍫', color1: '#78350f', color2: '#451a03', uzHint: 'Shokolad — kakao shirinligi' },
  candy: { emoji: '🍬', color1: '#f43f5e', color2: '#9f1239', uzHint: 'Konfet — shirinlik' },
  candies: { emoji: '🍬', color1: '#f43f5e', color2: '#9f1239', uzHint: 'Konfetlar' },
  sweets: { emoji: '🍬', color1: '#ec4899', color2: '#be185d', uzHint: 'Shirinliklar' },
  honey: { emoji: '🍯', color1: '#f59e0b', color2: '#b45309', uzHint: 'Asal — asalari shirinligi' },
  ice_cream: { emoji: '🍨', color1: '#ec4899', color2: '#38bdf8', uzHint: 'Muzqaymoq — muzdek shirinlik' },
  pancake: { emoji: '🥞', color1: '#f59e0b', color2: '#ca8a04', uzHint: 'Quymoq / Blinchik' },
  pancakes: { emoji: '🥞', color1: '#f59e0b', color2: '#ca8a04', uzHint: 'Quymoqlar' },
  waffle: { emoji: '🧇', color1: '#d97706', color2: '#a16207', uzHint: 'Vafli — katak pishiriq' },
  sugar: { emoji: '🧂', color1: '#f8fafc', color2: '#94a3b8', uzHint: 'Shakar — oq shirinlik' },
  salt: { emoji: '🧂', color1: '#f8fafc', color2: '#cbd5e1', uzHint: 'Tuz — oziq-ovqat ta’mi' },
  oil: { emoji: '🫒', color1: '#eab308', color2: '#854d0e', uzHint: 'Moy / Yog‘' },
  bun: { emoji: '🥯', color1: '#d97706', color2: '#78350f', uzHint: 'Bulochka — mayin pishiriq' },

  // === Idish-tovoq & Oshxona (Kitchenware & Utensils) ===
  cup: { emoji: '☕', color1: '#6366f1', color2: '#4338ca', uzHint: 'Chashka / Finka' },
  cups: { emoji: '☕', color1: '#6366f1', color2: '#4338ca', uzHint: 'Chashkalar' },
  mug: { emoji: '🍺', color1: '#0284c7', color2: '#075985', uzHint: 'Krujka / Katta finjon' },
  glass: { emoji: '🥛', color1: '#06b6d4', color2: '#0e7490', uzHint: 'Stakan — shisha idish' },
  glasses: { emoji: '👓', color1: '#78716c', color2: '#292524', uzHint: 'Ko‘zoynak' },
  bottle: { emoji: '🍾', color1: '#0284c7', color2: '#075985', uzHint: 'Shisha idish / Butilka' },
  bottles: { emoji: '🍾', color1: '#0284c7', color2: '#075985', uzHint: 'Butilkalar' },
  plate: { emoji: '🍽️', color1: '#64748b', color2: '#334155', uzHint: 'Tarelka / Likopcha' },
  plates: { emoji: '🍽️', color1: '#64748b', color2: '#334155', uzHint: 'Tarelkalar' },
  dish: { emoji: '🍽️', color1: '#64748b', color2: '#334155', uzHint: 'Idish / Taom' },
  dishes: { emoji: '🍽️', color1: '#64748b', color2: '#334155', uzHint: 'Idish-tovoqlar' },
  bowl: { emoji: '🥣', color1: '#0284c7', color2: '#0369a1', uzHint: 'Kosa / Piyola' },
  bowls: { emoji: '🥣', color1: '#0284c7', color2: '#0369a1', uzHint: 'Kosalar' },
  fork: { emoji: '🍴', color1: '#94a3b8', color2: '#475569', uzHint: 'Vilka — sanchqi' },
  forks: { emoji: '🍴', color1: '#94a3b8', color2: '#475569', uzHint: 'Vilka — sanchqilar' },
  spoon: { emoji: '🥄', color1: '#94a3b8', color2: '#475569', uzHint: 'Qoshiq — ovqatlanish asbobi' },
  spoons: { emoji: '🥄', color1: '#94a3b8', color2: '#475569', uzHint: 'Qoshiqlar' },
  knife: { emoji: '🔪', color1: '#64748b', color2: '#334155', uzHint: 'Pichoq — kesish asbobi' },
  knives: { emoji: '🔪', color1: '#64748b', color2: '#334155', uzHint: 'Pichoqlar' },
  pot: { emoji: '🍲', color1: '#475569', color2: '#1e293b', uzHint: 'Qozon — ovqat pishirish idishi' },
  pan: { emoji: '🍳', color1: '#334155', color2: '#0f172a', uzHint: 'Tova — qovurish idishi' },
  kettle: { emoji: '🫖', color1: '#0284c7', color2: '#075985', uzHint: 'Choynak — suv qaynatish idishi' },
  teapot: { emoji: '🫖', color1: '#16a34a', color2: '#14532d', uzHint: 'Choynak — choy damlash idishi' },

  // === Uy, Mebel & Xonalar (Home & Furniture) ===
  house: { emoji: '🏠', color1: '#f97316', color2: '#9a3412', uzHint: 'Uy — yashash maskani' },
  houses: { emoji: '🏠', color1: '#f97316', color2: '#9a3412', uzHint: 'Uylar' },
  home: { emoji: '🏡', color1: '#10b981', color2: '#047857', uzHint: 'Xonadon — qadrdon uy' },
  apartment: { emoji: '🏢', color1: '#0284c7', color2: '#075985', uzHint: 'Kvartira — ko‘p qavatli uydagi xonadon' },
  door: { emoji: '🚪', color1: '#92400e', color2: '#451a03', uzHint: 'Eshik — kirish vositasi' },
  doors: { emoji: '🚪', color1: '#92400e', color2: '#451a03', uzHint: 'Eshiklar' },
  window: { emoji: '🪟', color1: '#38bdf8', color2: '#0369a1', uzHint: 'Deraza — yorug‘lik manbai' },
  windows: { emoji: '🪟', color1: '#38bdf8', color2: '#0369a1', uzHint: 'Derazalar' },
  bed: { emoji: '🛏️', color1: '#6366f1', color2: '#4338ca', uzHint: 'Karavot — yotoq mebeli' },
  beds: { emoji: '🛏️', color1: '#6366f1', color2: '#4338ca', uzHint: 'Karavotlar' },
  table: { emoji: '🪵', color1: '#92400e', color2: '#78350f', uzHint: 'Stol — mebel' },
  tables: { emoji: '🪵', color1: '#92400e', color2: '#78350f', uzHint: 'Stollar' },
  chair: { emoji: '🪑', color1: '#a16207', color2: '#713f12', uzHint: 'Stul — o‘tirish jihozi' },
  chairs: { emoji: '🪑', color1: '#a16207', color2: '#713f12', uzHint: 'Stullar' },
  sofa: { emoji: '🛋️', color1: '#059669', color2: '#065f46', uzHint: 'Divan — yumshoq mebel' },
  couch: { emoji: '🛋️', color1: '#059669', color2: '#065f46', uzHint: 'Divan — o‘tirish mebeli' },
  desk: { emoji: '🖥️', color1: '#64748b', color2: '#334155', uzHint: 'Yozuv stoli — parta' },
  mirror: { emoji: '🪞', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Ko‘zgu / Oyna' },
  clock: { emoji: '⏰', color1: '#ef4444', color2: '#991b1b', uzHint: 'Soat — vaqt o‘lchagich' },
  alarm_clock: { emoji: '⏰', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Budilnik — uyg‘otuvchi soat' },
  lamp: { emoji: '💡', color1: '#eab308', color2: '#a16207', uzHint: 'Chiroq — xona yoritqichi' },
  key: { emoji: '🔑', color1: '#f59e0b', color2: '#b45309', uzHint: 'Kalit — qulf ochish vositasi' },
  keys: { emoji: '🔑', color1: '#f59e0b', color2: '#b45309', uzHint: 'Kalitlar' },
  lock: { emoji: '🔒', color1: '#f59e0b', color2: '#b45309', uzHint: 'Qulf — himoya vositasi' },
  box: { emoji: '📦', color1: '#b45309', color2: '#78350f', uzHint: 'Quti — narsalar saqlash qutisi' },
  boxes: { emoji: '📦', color1: '#b45309', color2: '#78350f', uzHint: 'Qutilar' },
  bookshelf: { emoji: '📚', color1: '#b45309', color2: '#78350f', uzHint: 'Kitob javoni' },
  wardrobe: { emoji: '🚪', color1: '#78350f', color2: '#451a03', uzHint: 'Kiyim shkafi' },
  closet: { emoji: '🚪', color1: '#78350f', color2: '#451a03', uzHint: 'Kiyim xonasi / Shkaf' },
  drawer: { emoji: '🗄️', color1: '#92400e', color2: '#78350f', uzHint: 'Tortma — stol tortmasi' },
  carpet: { emoji: '🧶', color1: '#dc2626', color2: '#991b1b', uzHint: 'Gilam — poldagi to‘shama' },
  rug: { emoji: '🧶', color1: '#dc2626', color2: '#991b1b', uzHint: 'Kichik gilamcha' },
  curtain: { emoji: '🪟', color1: '#8b5cf6', color2: '#6d28d9', uzHint: 'Parda — deraza to‘sig‘i' },
  curtains: { emoji: '🪟', color1: '#8b5cf6', color2: '#6d28d9', uzHint: 'Pardalar' },
  pillow: { emoji: '🛏️', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Yostiq — bosh qo‘yish moslamasi' },
  pillows: { emoji: '🛏️', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Yostiqlar' },
  blanket: { emoji: '🛏️', color1: '#6366f1', color2: '#4338ca', uzHint: 'Adyol / Ko‘rpa' },
  quilt: { emoji: '🛏️', color1: '#ec4899', color2: '#be185d', uzHint: 'Ko‘rpa' },
  towel: { emoji: '🧖', color1: '#06b6d4', color2: '#0891b2', uzHint: 'Sochiq — artinish vositasi' },
  towels: { emoji: '🧖', color1: '#06b6d4', color2: '#0891b2', uzHint: 'Sochiqlar' },
  soap: { emoji: '🧼', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Sovun — yuvinish vositasi' },
  broom: { emoji: '🧹', color1: '#a16207', color2: '#713f12', uzHint: 'Supurgi — tozalash asbobi' },
  bucket: { emoji: '🪣', color1: '#0284c7', color2: '#075985', uzHint: 'Chelak — suv idishi' },
  candle: { emoji: '🕯️', color1: '#f59e0b', color2: '#b45309', uzHint: 'Sham — yorug‘lik manbai' },
  candles: { emoji: '🕯️', color1: '#f59e0b', color2: '#b45309', uzHint: 'Shamlar' },
  fence: { emoji: '🪵', color1: '#92400e', color2: '#78350f', uzHint: 'Panjara / Devor to‘sig‘i' },
  roof: { emoji: '🏠', color1: '#dc2626', color2: '#991b1b', uzHint: 'Tom — uy tomi' },
  wall: { emoji: '🧱', color1: '#b45309', color2: '#78350f', uzHint: 'Devor — xona devori' },
  walls: { emoji: '🧱', color1: '#b45309', color2: '#78350f', uzHint: 'Devorlar' },
  floor: { emoji: '🪵', color1: '#78350f', color2: '#451a03', uzHint: 'Pol — xona pasti' },
  stairs: { emoji: '🪜', color1: '#64748b', color2: '#334155', uzHint: 'Zina — qavatlar oralig‘i' },
  balcony: { emoji: '🏙️', color1: '#0284c7', color2: '#075985', uzHint: 'Balkon' },
  garage: { emoji: '🚗', color1: '#475569', color2: '#1e293b', uzHint: 'Garaj — mashina turar joyi' },
  garden: { emoji: '🏡', color1: '#16a34a', color2: '#14532d', uzHint: 'Bog‘ — hovli bog‘i' },

  // === O‘quv qurollari, Kitoblar & Asboblar (Study, Office & Tools) ===
  book: { emoji: '📖', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Kitob — bilim manbai' },
  books: { emoji: '📚', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Kitoblar — kutubxona boyligi' },
  pen: { emoji: '🖊️', color1: '#6366f1', color2: '#4338ca', uzHint: 'Ruchka — yozish asbobi' },
  pens: { emoji: '🖊️', color1: '#6366f1', color2: '#4338ca', uzHint: 'Ruchkalar' },
  pencil: { emoji: '✏️', color1: '#eab308', color2: '#a16207', uzHint: 'Qalam — yozish va chizish asbobi' },
  pencils: { emoji: '✏️', color1: '#eab308', color2: '#a16207', uzHint: 'Qalamlar' },
  eraser: { emoji: '🧼', color1: '#ec4899', color2: '#be185d', uzHint: 'O‘chirg‘ich' },
  ruler: { emoji: '📏', color1: '#f59e0b', color2: '#b45309', uzHint: 'Chizg‘ich — o‘lchash asbobi' },
  notebook: { emoji: '📓', color1: '#10b981', color2: '#047857', uzHint: 'Daftar — yozuv daftari' },
  notebooks: { emoji: '📓', color1: '#10b981', color2: '#047857', uzHint: 'Daftarlar' },
  bag: { emoji: '👜', color1: '#be185d', color2: '#831843', uzHint: 'Sumka — buyum tashuvchi' },
  backpack: { emoji: '🎒', color1: '#dc2626', color2: '#991b1b', uzHint: 'Ryukzak — o‘quvchilar xaltasi' },
  camera: { emoji: '📷', color1: '#475569', color2: '#0f172a', uzHint: 'Fotoapparat — suratga olish apparati' },
  cameras: { emoji: '📷', color1: '#475569', color2: '#0f172a', uzHint: 'Fotoapparatlar' },
  computer: { emoji: '💻', color1: '#4f46e5', color2: '#312e81', uzHint: 'Kompyuter — elektron hisoblash mashinasi' },
  computers: { emoji: '💻', color1: '#4f46e5', color2: '#312e81', uzHint: 'Kompyuterlar' },
  laptop: { emoji: '💻', color1: '#6366f1', color2: '#3730a3', uzHint: 'Noutbuk — ixcham kompyuter' },
  phone: { emoji: '📱', color1: '#0ea5e9', color2: '#0369a1', uzHint: 'Telefon — aloqa vositasi' },
  phones: { emoji: '📱', color1: '#0ea5e9', color2: '#0369a1', uzHint: 'Telefonlar' },
  smartphone: { emoji: '📱', color1: '#0284c7', color2: '#075985', uzHint: 'Smartfon' },
  television: { emoji: '📺', color1: '#334155', color2: '#0f172a', uzHint: 'Televizor — ko‘rsatuv qurilmasi' },
  tv: { emoji: '📺', color1: '#334155', color2: '#0f172a', uzHint: 'Televizor' },
  watch: { emoji: '⌚', color1: '#64748b', color2: '#1e293b', uzHint: 'Qo‘l soati' },
  watches: { emoji: '⌚', color1: '#64748b', color2: '#1e293b', uzHint: 'Qo‘l soatlari' },
  money: { emoji: '💵', color1: '#10b981', color2: '#065f46', uzHint: 'Pul — to‘lov vositasi' },
  coin: { emoji: '🪙', color1: '#f59e0b', color2: '#b45309', uzHint: 'Tanga pul' },
  coins: { emoji: '🪙', color1: '#f59e0b', color2: '#b45309', uzHint: 'Tangalar' },
  wallet: { emoji: '👛', color1: '#78350f', color2: '#451a03', uzHint: 'Hamyon — pul soladigan buyum' },
  guitar: { emoji: '🎸', color1: '#ea580c', color2: '#9a3412', uzHint: 'Gitara — torli musiqa asbobi' },
  guitars: { emoji: '🎸', color1: '#ea580c', color2: '#9a3412', uzHint: 'Gitaralar' },
  piano: { emoji: '🎹', color1: '#0f172a', color2: '#334155', uzHint: 'Pianino — musiqa asbobi' },
  violin: { emoji: '🎻', color1: '#b45309', color2: '#78350f', uzHint: 'Skripka — nozik torli asbob' },
  drum: { emoji: '🥁', color1: '#dc2626', color2: '#991b1b', uzHint: 'Baraban — zarbli musiqa asbobi' },
  flute: { emoji: '🪈', color1: '#f59e0b', color2: '#b45309', uzHint: 'Fleyta / Nay — puflama asbob' },
  scissors: { emoji: '✂️', color1: '#ef4444', color2: '#991b1b', uzHint: 'Qaychi — qirqish asbobi' },
  hammer: { emoji: '🔨', color1: '#92400e', color2: '#451a03', uzHint: 'Bolg‘a — mehnat quroli' },
  envelope: { emoji: '✉️', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Konvert — xat jildi' },
  letter: { emoji: '✉️', color1: '#6366f1', color2: '#4338ca', uzHint: 'Xat — maktub' },
  map: { emoji: '🗺️', color1: '#059669', color2: '#065f46', uzHint: 'Xarita — geografik yo‘l ko‘rsatkich' },
  newspaper: { emoji: '📰', color1: '#475569', color2: '#1e293b', uzHint: 'Gazeta — matbuot nashri' },
  painting: { emoji: '🖼️', color1: '#8b5cf6', color2: '#6d28d9', uzHint: 'Rasm / Kartina' },
  picture: { emoji: '🖼️', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Surat / Tasvir' },

  // === Kiyim-kechak & Aksessuarlar (Clothing & Accessories) ===
  shirt: { emoji: '👕', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Ko‘ylak — kiyim' },
  shirts: { emoji: '👕', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Ko‘ylaklar' },
  jacket: { emoji: '🧥', color1: '#64748b', color2: '#334155', uzHint: 'Kurtka / Pidjak' },
  jackets: { emoji: '🧥', color1: '#64748b', color2: '#334155', uzHint: 'Kurtkalar' },
  coat: { emoji: '🧥', color1: '#475569', color2: '#1e293b', uzHint: 'Palto — ustki qalin kiyim' },
  coats: { emoji: '🧥', color1: '#475569', color2: '#1e293b', uzHint: 'Paltolar' },
  dress: { emoji: '👗', color1: '#ec4899', color2: '#be185d', uzHint: 'Ko‘ylak — ayollar libosi' },
  dresses: { emoji: '👗', color1: '#ec4899', color2: '#be185d', uzHint: 'Ko‘ylaklar — ayollar liboslari' },
  skirt: { emoji: '👗', color1: '#f43f5e', color2: '#9f1239', uzHint: 'Yubka — ayollar kiyimi' },
  pants: { emoji: '👖', color1: '#0284c7', color2: '#075985', uzHint: 'Shim — kiyim' },
  trousers: { emoji: '👖', color1: '#0284c7', color2: '#075985', uzHint: 'Shim — erkaklar kiyimi' },
  jeans: { emoji: '👖', color1: '#1d4ed8', color2: '#1e3a8a', uzHint: 'Jinsi shim' },
  suit: { emoji: '🤵', color1: '#1e293b', color2: '#0f172a', uzHint: 'Kostyum — rasmiy libos' },
  sweater: { emoji: '🧶', color1: '#ea580c', color2: '#9a3412', uzHint: 'Sviter — to‘qilgan issiq kiyim' },
  shoes: { emoji: '👟', color1: '#ef4444', color2: '#991b1b', uzHint: 'Poyabzal — oyoq kiyimi' },
  shoe: { emoji: '👟', color1: '#ef4444', color2: '#991b1b', uzHint: 'Poyabzal — poyabzal poyi' },
  boots: { emoji: '🥾', color1: '#78350f', color2: '#451a03', uzHint: 'Etik — qishki poyabzal' },
  boot: { emoji: '🥾', color1: '#78350f', color2: '#451a03', uzHint: 'Etik' },
  sneakers: { emoji: '👟', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Krossovka — sport poyabzali' },
  sandals: { emoji: '🩴', color1: '#f59e0b', color2: '#b45309', uzHint: 'Sandal / Yozgi poyabzal' },
  socks: { emoji: '🧦', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Paypoq — oyoq kiyimi' },
  sock: { emoji: '🧦', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Paypoq' },
  hat: { emoji: '🧢', color1: '#0284c7', color2: '#075985', uzHint: 'Bosh kiyim — shapka / kepka' },
  hats: { emoji: '🧢', color1: '#0284c7', color2: '#075985', uzHint: 'Bosh kiyimlar' },
  cap: { emoji: '🧢', color1: '#0284c7', color2: '#075985', uzHint: 'Kepka — soyabonli bosh kiyim' },
  tie: { emoji: '👔', color1: '#dc2626', color2: '#991b1b', uzHint: 'Galstuk — bo‘yinbog‘' },
  belt: { emoji: '🪢', color1: '#78350f', color2: '#451a03', uzHint: 'Kamar — belbog‘' },
  scarf: { emoji: '🧣', color1: '#ea580c', color2: '#9a3412', uzHint: 'Sharf — issiq bo‘yinbog‘' },
  gloves: { emoji: '🧤', color1: '#0284c7', color2: '#075985', uzHint: 'Qo‘lqop — qo‘lni asrovchi' },
  umbrella: { emoji: '☂️', color1: '#8b5cf6', color2: '#5b21b6', uzHint: 'Soyabon — yomg‘irdan himoya' },
  umbrellas: { emoji: '☂️', color1: '#8b5cf6', color2: '#5b21b6', uzHint: 'Soyabonlar' },
  ring: { emoji: '💍', color1: '#f59e0b', color2: '#b45309', uzHint: 'Uzuk — qimmatbaho taqinchoq' },
  rings: { emoji: '💍', color1: '#f59e0b', color2: '#b45309', uzHint: 'Uzuklar' },
  necklace: { emoji: '📿', color1: '#eab308', color2: '#a16207', uzHint: 'Marjon / Bo‘yinturuq' },
  button: { emoji: '🔘', color1: '#64748b', color2: '#334155', uzHint: 'Tugma — kiyim tugmasi' },
  pocket: { emoji: '👖', color1: '#0284c7', color2: '#075985', uzHint: 'Cho‘ntak — kiyim cho‘ntagi' },

  // === Transport vositalari (Vehicles) ===
  car: { emoji: '🚗', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Mashina — yengil avtomobil' },
  cars: { emoji: '🚗', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Mashinalar — avtomobillar' },
  automobile: { emoji: '🚗', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Avtomobil' },
  bus: { emoji: '🚌', color1: '#eab308', color2: '#a16207', uzHint: 'Avtobus — jamoat transporti' },
  buses: { emoji: '🚌', color1: '#eab308', color2: '#a16207', uzHint: 'Avtobuslar' },
  train: { emoji: '🚆', color1: '#0284c7', color2: '#075985', uzHint: 'Poyezd — temiryo‘l transporti' },
  trains: { emoji: '🚆', color1: '#0284c7', color2: '#075985', uzHint: 'Poyezdlar' },
  airplane: { emoji: '✈️', color1: '#6366f1', color2: '#3730a3', uzHint: 'Samolyot — havo transporti' },
  airplanes: { emoji: '✈️', color1: '#6366f1', color2: '#3730a3', uzHint: 'Samolyotlar' },
  plane: { emoji: '✈️', color1: '#6366f1', color2: '#3730a3', uzHint: 'Samolyot' },
  planes: { emoji: '✈️', color1: '#6366f1', color2: '#3730a3', uzHint: 'Samolyotlar' },
  helicopter: { emoji: '🚁', color1: '#0284c7', color2: '#075985', uzHint: 'Vertolyot — aylanma qanotli havo vositasi' },
  bicycle: { emoji: '🚲', color1: '#10b981', color2: '#047857', uzHint: 'Velosiped — ikki g‘ildirakli transport' },
  bicycles: { emoji: '🚲', color1: '#10b981', color2: '#047857', uzHint: 'Velosipedlar' },
  bike: { emoji: '🚲', color1: '#10b981', color2: '#047857', uzHint: 'Velosiped' },
  motorcycle: { emoji: '🏍️', color1: '#dc2626', color2: '#991b1b', uzHint: 'Mototsikl — tezyurar transport' },
  boat: { emoji: '⛵', color1: '#0ea5e9', color2: '#0369a1', uzHint: 'Qayiq — suv transporti' },
  boats: { emoji: '⛵', color1: '#0ea5e9', color2: '#0369a1', uzHint: 'Qayiqlar' },
  ship: { emoji: '🚢', color1: '#1e3a8a', color2: '#0f172a', uzHint: 'Kema — ulkan dengiz kemasi' },
  ships: { emoji: '🚢', color1: '#1e3a8a', color2: '#0f172a', uzHint: 'Kemalar — dengiz floti' },
  truck: { emoji: '🚛', color1: '#ea580c', color2: '#9a3412', uzHint: 'Yuk mashinasi — yuk tashuvchi avtomobil' },
  trucks: { emoji: '🚛', color1: '#ea580c', color2: '#9a3412', uzHint: 'Yuk mashinalari' },
  taxi: { emoji: '🚕', color1: '#eab308', color2: '#a16207', uzHint: 'Taksi — yo‘lovchi tashuvchi mashina' },
  van: { emoji: '🚐', color1: '#64748b', color2: '#334155', uzHint: 'Furgon / Mikroavtobus' },
  ambulance: { emoji: '🚑', color1: '#dc2626', color2: '#991b1b', uzHint: 'Tez yordam mashinasi' },
  tractor: { emoji: '🚜', color1: '#22c55e', color2: '#15803d', uzHint: 'Traktor — qishloq xo‘jaligi texnikasi' },
  rocket: { emoji: '🚀', color1: '#dc2626', color2: '#475569', uzHint: 'Raketa — kosmik kema' },

  // === Tana a’zolari (Body Parts & Anatomy) ===
  leg: { emoji: '🦵', color1: '#0284c7', color2: '#0369a1', uzHint: 'Oyoq — inson harakatlanish a‘zosi' },
  legs: { emoji: '🦵', color1: '#0284c7', color2: '#0369a1', uzHint: 'Oyoqlar' },
  arm: { emoji: '💪', color1: '#6366f1', color2: '#4338ca', uzHint: 'Qo‘l — harakat va mehnat a‘zosi' },
  arms: { emoji: '💪', color1: '#6366f1', color2: '#4338ca', uzHint: 'Qo‘llar' },
  hand: { emoji: '✋', color1: '#f59e0b', color2: '#d97706', uzHint: 'Qo‘l panjasi — ushlash va yozish vositasi' },
  hands: { emoji: '✋', color1: '#f59e0b', color2: '#d97706', uzHint: 'Qo‘l panjalari' },
  foot: { emoji: '🦶', color1: '#0ea5e9', color2: '#0284c7', uzHint: 'Oyoq kafti' },
  feet: { emoji: '🦶', color1: '#0ea5e9', color2: '#0284c7', uzHint: 'Oyoq kaftlari' },
  head: { emoji: '🗣️', color1: '#8b5cf6', color2: '#6d28d9', uzHint: 'Bosh — inson boshi' },
  eye: { emoji: '👁️', color1: '#06b6d4', color2: '#0891b2', uzHint: 'Ko‘z — ko‘rish a‘zosi' },
  eyes: { emoji: '👀', color1: '#06b6d4', color2: '#0891b2', uzHint: 'Ko‘zlar — ko‘rish a‘zolari' },
  ear: { emoji: '👂', color1: '#f97316', color2: '#ea580c', uzHint: 'Quloq — eshitish a‘zosi' },
  ears: { emoji: '👂', color1: '#f97316', color2: '#ea580c', uzHint: 'Quloqlar' },
  nose: { emoji: '👃', color1: '#fb923c', color2: '#c2410c', uzHint: 'Burun — hid bilish va nafas a‘zosi' },
  mouth: { emoji: '👄', color1: '#ef4444', color2: '#b91c1c', uzHint: 'Og‘iz — nutq va ovqatlanish a‘zosi' },
  tooth: { emoji: '🦷', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Tish — chaynash a‘zosi' },
  teeth: { emoji: '🦷', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Tishlar' },
  heart: { emoji: '❤️', color1: '#ef4444', color2: '#991b1b', uzHint: 'Yurak — qon haydovchi asosiy markaz' },
  brain: { emoji: '🧠', color1: '#ec4899', color2: '#be185d', uzHint: 'Miya — aql va fikrlash organi' },
  face: { emoji: '🙂', color1: '#f59e0b', color2: '#b45309', uzHint: 'Yuz — inson chehrasi' },
  hair: { emoji: '💇', color1: '#78350f', color2: '#451a03', uzHint: 'Soch — bosh qoplami' },
  finger: { emoji: '👆', color1: '#f59e0b', color2: '#d97706', uzHint: 'Barmoq — qo‘l barmog‘i' },
  fingers: { emoji: '👆', color1: '#f59e0b', color2: '#d97706', uzHint: 'Barmoqlar' },
  thumb: { emoji: '👍', color1: '#f59e0b', color2: '#d97706', uzHint: 'Bosh barmoq' },
  bone: { emoji: '🦴', color1: '#94a3b8', color2: '#475569', uzHint: 'Suyak — skelet bo‘lagi' },
  bones: { emoji: '🦴', color1: '#94a3b8', color2: '#475569', uzHint: 'Suyaklar' },
  stomach: { emoji: '🫄', color1: '#ea580c', color2: '#9a3412', uzHint: 'Oshqozon / Qorin' },
  chest: { emoji: '🫁', color1: '#e11d48', color2: '#9f1239', uzHint: 'Ko‘krak qafasi' },
  neck: { emoji: '🦒', color1: '#f59e0b', color2: '#b45309', uzHint: 'Bo‘yin' },
  knee: { emoji: '🦵', color1: '#0284c7', color2: '#0369a1', uzHint: 'Tizza' },
  knees: { emoji: '🦵', color1: '#0284c7', color2: '#0369a1', uzHint: 'Tizzalar' },
  blood: { emoji: '🩸', color1: '#dc2626', color2: '#991b1b', uzHint: 'Qon — hayotiy suyuqlik' },

  // === Tabiat & Geografiya (Nature & Geography) ===
  tree: { emoji: '🌳', color1: '#16a34a', color2: '#14532d', uzHint: 'Daraxt — ko‘m-ko‘k o‘simlik' },
  trees: { emoji: '🌳', color1: '#16a34a', color2: '#14532d', uzHint: 'Daraxtlar' },
  flower: { emoji: '🌸', color1: '#ec4899', color2: '#be185d', uzHint: 'Gul — go‘zal xushbo‘y o‘simlik' },
  flowers: { emoji: '🌸', color1: '#ec4899', color2: '#be185d', uzHint: 'Gullar' },
  rose: { emoji: '🌹', color1: '#dc2626', color2: '#991b1b', uzHint: 'Atirgul — nafis gul' },
  roses: { emoji: '🌹', color1: '#dc2626', color2: '#991b1b', uzHint: 'Atirgullar' },
  leaf: { emoji: '🍃', color1: '#22c55e', color2: '#15803d', uzHint: 'Barg — daraxt bargi' },
  leaves: { emoji: '🍃', color1: '#22c55e', color2: '#15803d', uzHint: 'Barglar' },
  grass: { emoji: '🌱', color1: '#16a34a', color2: '#14532d', uzHint: 'O‘t / Maysa — yashil tabiat' },
  plant: { emoji: '🪴', color1: '#16a34a', color2: '#14532d', uzHint: 'O‘simlik' },
  plants: { emoji: '🪴', color1: '#16a34a', color2: '#14532d', uzHint: 'O‘simliklar' },
  sun: { emoji: '☀️', color1: '#f59e0b', color2: '#b45309', uzHint: 'Quyosh — osmon yoritqichi' },
  moon: { emoji: '🌙', color1: '#6366f1', color2: '#312e81', uzHint: 'Oy — tungi osmon yoritqichi' },
  star: { emoji: '⭐', color1: '#eab308', color2: '#a16207', uzHint: 'Yulduz — osmon jismi' },
  stars: { emoji: '⭐', color1: '#eab308', color2: '#a16207', uzHint: 'Yulduzlar' },
  mountain: { emoji: '🏔️', color1: '#64748b', color2: '#1e293b', uzHint: 'Tog‘ — baland qoyalar' },
  mountains: { emoji: '🏔️', color1: '#64748b', color2: '#1e293b', uzHint: 'Tog‘lar' },
  river: { emoji: '🏞️', color1: '#0284c7', color2: '#0369a1', uzHint: 'Daryo — oqar suv havzasi' },
  rivers: { emoji: '🏞️', color1: '#0284c7', color2: '#0369a1', uzHint: 'Daryolar' },
  sea: { emoji: '🌊', color1: '#0369a1', color2: '#0c4a6e', uzHint: 'Dengiz — katta sho‘r suv havzasi' },
  ocean: { emoji: '🌊', color1: '#1e3a8a', color2: '#172554', uzHint: 'Okean — eng katta suv havzasi' },
  lake: { emoji: '🏞️', color1: '#0284c7', color2: '#0369a1', uzHint: 'Ko‘l — tinch suv havzasi' },
  island: { emoji: '🏝️', color1: '#059669', color2: '#065f46', uzHint: 'Orol — suv o‘rtasidagi quruqlik' },
  forest: { emoji: '🌲', color1: '#166534', color2: '#14532d', uzHint: 'O‘rmon — daraxtzor maskan' },
  rain: { emoji: '🌧️', color1: '#0284c7', color2: '#0369a1', uzHint: 'Yomg‘ir — yog‘ingarchilik' },
  snow: { emoji: '❄️', color1: '#38bdf8', color2: '#0284c7', uzHint: 'Qor — oq qish yog‘ini' },
  cloud: { emoji: '☁️', color1: '#94a3b8', color2: '#475569', uzHint: 'Bulut — osmon buluti' },
  clouds: { emoji: '☁️', color1: '#94a3b8', color2: '#475569', uzHint: 'Bulutlar' },
  rainbow: { emoji: '🌈', color1: '#ec4899', color2: '#8b5cf6', uzHint: 'Kamalak — yetti rangli jilo' },
  desert: { emoji: '🏜️', color1: '#d97706', color2: '#92400e', uzHint: 'Cho‘l — qumlik hudud' },
  volcano: { emoji: '🌋', color1: '#dc2626', color2: '#7f1d1d', uzHint: 'Vulqon — olovli tog‘' },

  // === Binolar & Shahar Ob’ektlari (Buildings & Places) ===
  school: { emoji: '🏫', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Maktab — ta’lim dargohi' },
  hospital: { emoji: '🏥', color1: '#dc2626', color2: '#991b1b', uzHint: 'Shifoxona — tibbiyot markazi' },
  hotel: { emoji: '🏨', color1: '#f59e0b', color2: '#b45309', uzHint: 'Mehmonxona — yotoq maskani' },
  bank: { emoji: '🏦', color1: '#059669', color2: '#065f46', uzHint: 'Bank — moliya muassasasi' },
  restaurant: { emoji: '🍽️', color1: '#ea580c', color2: '#9a3412', uzHint: 'Restoran — ovqatlanish maskani' },
  cafe: { emoji: '☕', color1: '#78350f', color2: '#451a03', uzHint: 'Kafe — choyxona / qahvaxona' },
  airport: { emoji: '🛫', color1: '#6366f1', color2: '#3730a3', uzHint: 'Aeroport — havo porti' },
  station: { emoji: '🚉', color1: '#0284c7', color2: '#075985', uzHint: 'Vokzal / Bekat' },
  bridge: { emoji: '🌉', color1: '#64748b', color2: '#334155', uzHint: 'Ko‘prik — daryo usti yo‘li' },
  castle: { emoji: '🏰', color1: '#78716c', color2: '#44403c', uzHint: 'Qal’a — qadimiy saroy' },
  library: { emoji: '🏛️', color1: '#3b82f6', color2: '#1d4ed8', uzHint: 'Kutubxona — kitoblar maskani' },
  museum: { emoji: '🏛️', color1: '#a16207', color2: '#713f12', uzHint: 'Muzey — tarix va san’at maskani' },
  cinema: { emoji: '🎬', color1: '#dc2626', color2: '#991b1b', uzHint: 'Kinoteatr — film tomoshasi' },
  theater: { emoji: '🎭', color1: '#8b5cf6', color2: '#6d28d9', uzHint: 'Teatr — sahna san’ati' },
  park: { emoji: '🌳', color1: '#16a34a', color2: '#14532d', uzHint: 'Bog‘ / Park — dam olish maskani' },
  shop: { emoji: '🏬', color1: '#0ea5e9', color2: '#0284c7', uzHint: 'Do‘kon — savdo maskani' },
  store: { emoji: '🏬', color1: '#0ea5e9', color2: '#0284c7', uzHint: 'Do‘kon' },
  market: { emoji: '🏪', color1: '#f59e0b', color2: '#b45309', uzHint: 'Bozor — savdo maydoni' },
  stadium: { emoji: '🏟️', color1: '#059669', color2: '#065f46', uzHint: 'Stadion — sport maydoni' },

  // === Sport & O‘yinlar (Sports & Games) ===
  ball: { emoji: '⚽', color1: '#1e293b', color2: '#0f172a', uzHint: 'To‘p — sport anjomi' },
  balls: { emoji: '⚽', color1: '#1e293b', color2: '#0f172a', uzHint: 'To‘plar' },
  trophy: { emoji: '🏆', color1: '#f59e0b', color2: '#b45309', uzHint: 'Kubok — g‘oliblik sovrini' },
  medal: { emoji: '🥇', color1: '#eab308', color2: '#a16207', uzHint: 'Medal — chempionlik nishoni' },
  racket: { emoji: '🎾', color1: '#84cc16', color2: '#4d7c0f', uzHint: 'Raketka — tennis asbobi' },
  whistle: { emoji: '🪈', color1: '#64748b', color2: '#334155', uzHint: 'Hushtak — hakam asbobi' },
};

export const CONCRETE_OBJECTS_SET = new Set<string>(Object.keys(OBJECT_VECTOR_EMBLEMS));

export const CATEGORY_THEMES: Record<
  string,
  {
    gradient: string;
    border: string;
    accent: string;
    icon: string;
    badgeBg: string;
  }
> = {
  'Tabiat va Atrof-muhit': {
    gradient: 'from-emerald-600 via-teal-700 to-green-900',
    border: 'border-emerald-300',
    accent: 'text-emerald-700',
    icon: '🌿',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  'Tabiat, Hayvonlar va Ob-havo': {
    gradient: 'from-emerald-600 via-teal-700 to-green-900',
    border: 'border-emerald-300',
    accent: 'text-emerald-700',
    icon: '🐾',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  'Oziq-ovqat va Pazandachilik': {
    gradient: 'from-amber-600 via-orange-600 to-amber-900',
    border: 'border-amber-300',
    accent: 'text-amber-700',
    icon: '🥗',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  'Oziq-ovqat va Ichimliklar': {
    gradient: 'from-amber-600 via-orange-600 to-amber-900',
    border: 'border-amber-300',
    accent: 'text-amber-700',
    icon: '🍎',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  'Uy va Mebel Jihozlari': {
    gradient: 'from-amber-700 via-stone-700 to-stone-900',
    border: 'border-amber-300',
    accent: 'text-amber-700',
    icon: '🏠',
    badgeBg: 'bg-stone-50 text-stone-800 border-stone-200',
  },
  'Texnologiya va Fan': {
    gradient: 'from-indigo-600 via-cyan-700 to-blue-950',
    border: 'border-cyan-300',
    accent: 'text-cyan-700',
    icon: '💻',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  'Texnologiya va OAV': {
    gradient: 'from-indigo-600 via-cyan-700 to-blue-950',
    border: 'border-cyan-300',
    accent: 'text-cyan-700',
    icon: '📱',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  'Sayohat va Transport': {
    gradient: 'from-sky-600 via-blue-700 to-indigo-900',
    border: 'border-sky-300',
    accent: 'text-sky-700',
    icon: '✈️',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  'Joylar, Transport va Sayohat': {
    gradient: 'from-sky-600 via-blue-700 to-indigo-900',
    border: 'border-sky-300',
    accent: 'text-sky-700',
    icon: '🚗',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  'Tana a’zolari va Salomatlik': {
    gradient: 'from-rose-500 via-red-600 to-rose-900',
    border: 'border-rose-300',
    accent: 'text-rose-700',
    icon: '🩺',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  'Kiyim-kechak va Aksessuarlar': {
    gradient: 'from-violet-600 via-purple-700 to-indigo-900',
    border: 'border-violet-300',
    accent: 'text-violet-700',
    icon: '👕',
    badgeBg: 'bg-violet-50 text-violet-800 border-violet-200',
  },
  'Kiyim-kechak va Tashqi ko‘rinish': {
    gradient: 'from-violet-600 via-purple-700 to-indigo-900',
    border: 'border-violet-300',
    accent: 'text-violet-700',
    icon: '👗',
    badgeBg: 'bg-violet-50 text-violet-800 border-violet-200',
  },
  'Sport va Qiziqishlar': {
    gradient: 'from-emerald-600 via-teal-600 to-cyan-900',
    border: 'border-emerald-300',
    accent: 'text-emerald-700',
    icon: '⚽',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  'Maktab va Ta’lim': {
    gradient: 'from-blue-600 via-indigo-600 to-slate-900',
    border: 'border-blue-300',
    accent: 'text-blue-700',
    icon: '📚',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
  },
};

const DEFAULT_THEME = {
  gradient: 'from-indigo-600 via-purple-600 to-slate-900',
  border: 'border-indigo-300',
  accent: 'text-indigo-700',
  icon: '✨',
  badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
};

/**
 * Verified, high-definition realistic photography for concrete entities across the vocabulary.
 * Curated from Unsplash CDN (global Fastly edge cache, 100% reliable, zero API cost).
 */
export const REALISTIC_OBJECT_PHOTOS: Record<string, string> = {
  // === Animals & Wildlife ===
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  dogs: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  puppy: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  cats: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  kitten: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
  lion: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
  lions: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
  tiger: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=800&q=80',
  tigers: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=800&q=80',
  elephant: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
  elephants: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
  giraffe: 'https://images.unsplash.com/photo-1538127426967-75a6c73f6d20?auto=format&fit=crop&w=800&q=80',
  giraffes: 'https://images.unsplash.com/photo-1538127426967-75a6c73f6d20?auto=format&fit=crop&w=800&q=80',
  zebra: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?auto=format&fit=crop&w=800&q=80',
  zebras: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?auto=format&fit=crop&w=800&q=80',
  bear: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
  bears: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
  wolf: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=800&q=80',
  wolves: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=800&q=80',
  fox: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80',
  foxes: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=800&q=80',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
  rabbits: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
  deer: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=800&q=80',
  monkey: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80',
  monkeys: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80',
  camel: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  camels: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  horse: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80',
  horses: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80',
  cow: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
  cows: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
  sheep: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80',
  goat: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
  goats: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
  pig: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
  pigs: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
  donkey: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80',
  chicken: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
  turkey: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?auto=format&fit=crop&w=800&q=80',
  duck: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  ducks: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  goose: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  swan: 'https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?auto=format&fit=crop&w=800&q=80',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
  birds: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
  eagle: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80',
  owl: 'https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=800&q=80',
  parrot: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
  penguin: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
  dolphin: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80',
  whale: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
  shark: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80',
  fish: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
  turtle: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80',
  crocodile: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
  snake: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=800&q=80',
  frog: 'https://images.unsplash.com/photo-1496070242169-b672c576566b?auto=format&fit=crop&w=800&q=80',
  butterfly: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
  bee: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
  spider: 'https://images.unsplash.com/photo-1542435503-956c42d76156?auto=format&fit=crop&w=800&q=80',
  ant: 'https://images.unsplash.com/photo-1589134763175-4d0456418a08?auto=format&fit=crop&w=800&q=80',
  mouse: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',

  // === Food & Drink ===
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
  orange: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
  lemon: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80',
  strawberry: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
  grapes: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
  grape: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
  watermelon: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  cherry: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
  pineapple: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
  avocado: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80',
  onion: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
  cucumber: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  hamburger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  toast: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  meat: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
  steak: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80',
  cheese: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
  egg: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
  eggs: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  chocolate: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
  icecream: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  tea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  juice: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',

  // === Vehicles ===
  car: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
  bus: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
  bicycle: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  bike: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  motorcycle: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
  airplane: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  plane: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  train: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
  boat: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  ship: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=800&q=80',
  helicopter: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',

  // === Clothes ===
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  boots: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  dress: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  pants: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  jeans: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
  hat: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
  watch: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
  glasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  bag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  umbrella: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',

  // === Furniture & Home ===
  chair: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
  table: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  clock: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
  mirror: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',

  // === Technology & Instruments ===
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  computer: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80',
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  television: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
  guitar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  piano: 'https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&w=800&q=80',
  book: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  pen: 'https://images.unsplash.com/photo-1585336261026-418071839958?auto=format&fit=crop&w=800&q=80',

  // === Nature ===
  tree: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
  flower: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
  rose: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  sunflower: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  river: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=80',
  lake: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  ocean: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  island: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=800&q=80',
  bridge: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
  castle: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80',
  airport: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
};

/**
 * Words specifically confirmed to be abstract concepts that should strictly NEVER receive pictures.
 */
const BOGUS_ABSTRACT_WORDS = new Set([
  'accident', 'arrival', 'border', 'check-in', 'fiancé', 'housewife',
  'adult', 'couple', 'father-in-law', 'godfather', 'north', 'south',
  'east', 'west', 'autumn', 'breeze', 'climate', 'crop', 'drought',
  'dust', 'earthquake', 'flood', 'fog', 'frost', 'fur', 'horizon',
  'horn', 'humidity', 'landscape', 'lightning', 'mud', 'nature',
  'paw', 'puddle', 'pollution', 'recycle', 'root', 'sand', 'season',
  'seed', 'shadow', 'soil', 'spring', 'stone', 'storm', 'summer',
  'sunrise', 'sunset', 'tail', 'thunder', 'universe', 'valley',
  'wildlife', 'wing', 'winter', 'worm', 'zookeeper', 'environment'
]);

/**
 * Checks whether a word is a concrete physical entity (predmet, hayvon, narsa, buyum, kiyim, taom, etc.)
 * Strictly returns false for Adjectives, Verbs, Numbers, Adverbs, Prepositions, etc.
 */
export function isWordConcreteObject(word: Word): boolean {
  const clean = normalizeWordKey(word.english);
  const cleanWithoutS = clean.endsWith('s') && clean.length > 3 ? clean.slice(0, -1) : clean;

  // 1. Explicitly check if part of speech is NOT a noun
  const pos = (word.partOfSpeech || '').toLowerCase();
  if (
    pos.includes('fe’l') || pos.includes('fe\'l') || pos.includes('verb') ||
    pos.includes('sifat') || pos.includes('adjective') ||
    pos.includes('son') || pos.includes('number') ||
    pos.includes('ravish') || pos.includes('adverb') ||
    pos.includes('predlog') || pos.includes('preposition') ||
    pos.includes('bog‘lovchi') || pos.includes('conjunction') ||
    pos.includes('olmosh') || pos.includes('pronoun') ||
    pos.includes('undov') || pos.includes('interjection') ||
    pos.includes('ibora') || pos.includes('idiom') || pos.includes('phrase')
  ) {
    return false;
  }

  // 2. Strictly filter out bogus abstract words
  if (BOGUS_ABSTRACT_WORDS.has(clean) || BOGUS_ABSTRACT_WORDS.has(cleanWithoutS)) {
    return false;
  }

  // 3. Direct dictionary match in realistic photos or vector emblems
  if (
    REALISTIC_OBJECT_PHOTOS[clean] ||
    REALISTIC_OBJECT_PHOTOS[cleanWithoutS] ||
    OBJECT_VECTOR_EMBLEMS[clean] ||
    OBJECT_VECTOR_EMBLEMS[cleanWithoutS] ||
    CONCRETE_OBJECTS_SET.has(clean) ||
    CONCRETE_OBJECTS_SET.has(cleanWithoutS)
  ) {
    return true;
  }

  // 4. User uploaded custom card image
  if (word.image && word.image.trim().length > 0) {
    return true;
  }

  // 4. Must be a noun (Ot)
  const isNoun = pos.includes('ot') || pos.includes('noun');
  if (!isNoun) {
    return false;
  }

  // 5. Exclude abstract concept suffixes
  const abstractSuffixes = [
    'tion', 'sion', 'ment', 'ence', 'ance', 'ity', 'ness',
    'ism', 'ship', 'hood', 'logy', 'sis', 'phy', 'tude', 'cy',
    'dom', 'ry', 'ty'
  ];
  if (abstractSuffixes.some((s) => clean.endsWith(s))) {
    return false;
  }

  // 6. Exclude abstract categories
  const cat = (word.category || '').toLowerCase();
  if (
    cat.includes('abstrakt') ||
    cat.includes('akademik') ||
    cat.includes('aqliy') ||
    cat.includes('grammatik')
  ) {
    return false;
  }

  // 7. Uzbek tangible clues (hayvonlar, narsalar, taomlar, kiyimlar, buyumlar)
  const uz = (word.uzbek || '').toLowerCase();
  const concreteUzMarkers = [
    'hayvon', 'jonivor', 'it', 'mushuk', 'qush', 'baliq', 'ot', 'sigir', 'qo‘y', 'echki',
    'meva', 'sabzavot', 'olma', 'banan', 'non', 'taom', 'ichimlik', 'suv', 'choy', 'go‘sht',
    'buyum', 'jihoz', 'mebel', 'stol', 'stul', 'karavot', 'uy', 'eshik', 'deraza', 'quti',
    'kiyim', 'ko‘ylak', 'shim', 'poyabzal', 'tufli', 'bosh kiyim', 'etik', 'palto', 'sumka',
    'transport', 'mashina', 'avtomobil', 'avtobus', 'poyezd', 'samolyot', 'kema', 'velosiped',
    'tana a’zosi', 'tana a\'zosi', 'bosh', 'ko‘z', 'quloq', 'burun', 'og‘iz', 'tish', 'qo‘l', 'oyoq', 'yurak', 'miya',
    'asbob', 'idish', 'qoshiq', 'pichoq', 'vilka', 'chashka', 'qalam', 'ruchka', 'kitob', 'daftar',
    'daraxt', 'gul', 'o‘simlik', 'quyosh', 'oy', 'yulduz', 'tog‘', 'daryo', 'ko‘l', 'dengiz',
    'telefon', 'kompyuter', 'kamera', 'soat', 'bino', 'maktab', 'shifoxona', 'ko‘prik', 'qal’a'
  ];

  if (concreteUzMarkers.some((m) => uz.includes(m))) {
    return true;
  }

  // 8. Concrete categories check
  const concreteCategories = [
    'tabiat, hayvonlar',
    'oziq-ovqat',
    'uy va mebel',
    'kiyim-kechak',
    'tana a’zolari',
    'transport'
  ];
  if (concreteCategories.some((cc) => cat.includes(cc))) {
    return true;
  }

  return false;
}

/**
 * Generates an SVG Data-URI visual banner for a concrete object.
 * 100% offline, guaranteed never to break, 0 API tokens!
 */
export function generateWordArtworkSvg(word: Word): string {
  const clean = normalizeWordKey(word.english);
  const cleanWithoutS = clean.endsWith('s') && clean.length > 3 ? clean.slice(0, -1) : clean;
  const cat = word.category || 'Kundalik hayot va Muloqot';
  const theme = CATEGORY_THEMES[cat] || DEFAULT_THEME;

  const emblem = OBJECT_VECTOR_EMBLEMS[clean] || OBJECT_VECTOR_EMBLEMS[cleanWithoutS];
  if (emblem) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${emblem.color1}"/>
          <stop offset="100%" stop-color="${emblem.color2}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      
      <!-- Base Gradient -->
      <rect width="600" height="400" fill="url(#grad)"/>
      <circle cx="300" cy="180" r="160" fill="url(#glow)"/>
      
      <!-- Subtle Framing -->
      <rect x="20" y="20" width="560" height="360" rx="28" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
      
      <!-- Center Circle Container Ring -->
      <circle cx="300" cy="170" r="95" fill="#ffffff" fill-opacity="0.95"/>
      <circle cx="300" cy="170" r="88" fill="#ffffff" stroke="${emblem.color1}" stroke-opacity="0.3" stroke-width="2.5"/>
      
      <!-- Prominent Object Emoji Graphic -->
      <text x="300" y="215" font-size="110" text-anchor="middle" font-family="'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, sans-serif">
        ${emblem.emoji}
      </text>

      <!-- Predmet Tag Pill -->
      <rect x="180" y="40" width="240" height="34" rx="17" fill="#000000" fill-opacity="0.35" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1"/>
      <text x="300" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">
        🔍 PREDMET · BU NIMA?
      </text>
      
      <!-- Word Hint Strip at bottom -->
      <rect x="40" y="300" width="520" height="56" rx="20" fill="#ffffff" fill-opacity="0.2" stroke="#ffffff" stroke-opacity="0.4"/>
      <text x="300" y="335" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="800" fill="#ffffff" text-anchor="middle">
        ${emblem.uzHint}
      </text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Fallback for concrete object: Category styled vector emblem
  const firstLetter = word.english.trim().charAt(0).toUpperCase() || 'P';
  const categoryIcon = theme.icon || '🔍';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="400" fill="url(#bg)"/>
    <circle cx="300" cy="180" r="150" fill="url(#glow2)"/>

    <rect x="20" y="20" width="560" height="360" rx="28" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>

    <circle cx="300" cy="170" r="95" fill="#ffffff" fill-opacity="0.95"/>
    <circle cx="300" cy="170" r="88" fill="#ffffff" stroke="#0284c7" stroke-opacity="0.3" stroke-width="2.5"/>
    
    <text x="300" y="210" font-size="96" text-anchor="middle" font-family="'Apple Color Emoji', 'Segoe UI Emoji', NotoColorEmoji, sans-serif">
      ${categoryIcon}
    </text>

    <rect x="180" y="40" width="240" height="34" rx="17" fill="#000000" fill-opacity="0.35" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1"/>
    <text x="300" y="62" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">
      🔍 PREDMET · BU NIMA?
    </text>

    <rect x="40" y="300" width="520" height="56" rx="20" fill="#ffffff" fill-opacity="0.2" stroke="#ffffff" stroke-opacity="0.4"/>
    <text x="300" y="335" font-family="system-ui, sans-serif" font-size="17" font-weight="800" fill="#ffffff" text-anchor="middle">
      ${word.uzbek || 'Predmet — moddiy narsa'}
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns complete visual metadata for any word from the 10,000 CEFR database.
 * Non-concrete words (Adjectives, Verbs, Numbers, etc.) strictly get NO image (imageUrl = '').
 */
export function getWordVisualMeta(word: Word): WordVisualMeta {
  const cat = word.category || 'Kundalik hayot va Muloqot';
  const theme = CATEGORY_THEMES[cat] || DEFAULT_THEME;
  const isConcrete = isWordConcreteObject(word);

  // If NOT a concrete object (Sifat, Fe'l, Son, Ravish, Abstrakt tushuncha):
  // Strictly NO image is displayed! The card displays dedicated lexical typography.
  if (!isConcrete) {
    return {
      imageUrl: '',
      hasSpecificImage: false,
      sourceType: 'none',
      accentGradient: theme.gradient,
      themeColor: theme.border,
      categoryLabel: cat,
      categoryIcon: theme.icon,
      mnemonicHook: getWordMnemonic(word),
      isConcreteObject: false,
      objectQuestion: '',
      objectPromptUz: '',
      letterHint: '',
    };
  }

  // Generate interactive masking clue / letter hint for "Bu nima?" mode
  const cleanEn = normalizeWordKey(word.english);
  const firstChar = cleanEn.charAt(0).toUpperCase();
  const lastChar = cleanEn.length > 2 ? cleanEn.charAt(cleanEn.length - 1).toLowerCase() : '';
  const maskedLength = cleanEn.length;
  const letterHint =
    maskedLength > 2
      ? `${firstChar} ${'_ '.repeat(maskedLength - 2)}${lastChar} (${maskedLength} ta harf)`
      : `${firstChar} _ (${maskedLength} ta harf)`;

  const objectQuestion = 'Bu nima? / What is this?';
  const objectPromptUz = 'Ushbu predmet ingliz va o‘zbek tilida nima deb ataladi?';

  // 1. Direct explicit image on the word object (user created card or dataset photo)
  if (word.image && word.image.trim().length > 0) {
    return {
      imageUrl: word.image,
      hasSpecificImage: true,
      sourceType: 'photo',
      accentGradient: theme.gradient,
      themeColor: theme.border,
      categoryLabel: cat,
      categoryIcon: theme.icon,
      mnemonicHook: getWordMnemonic(word),
      isConcreteObject: true,
      objectQuestion,
      objectPromptUz,
      letterHint,
    };
  }

  // 2. Realistic photographic catalog match (verified Unsplash HD photography)
  const cleanWithoutS = cleanEn.endsWith('s') && cleanEn.length > 3 ? cleanEn.slice(0, -1) : cleanEn;
  const photo = REALISTIC_OBJECT_PHOTOS[cleanEn] || (cleanWithoutS ? REALISTIC_OBJECT_PHOTOS[cleanWithoutS] : '');
  if (photo) {
    return {
      imageUrl: photo,
      hasSpecificImage: true,
      sourceType: 'photo',
      accentGradient: theme.gradient,
      themeColor: theme.border,
      categoryLabel: cat,
      categoryIcon: theme.icon,
      mnemonicHook: getWordMnemonic(word),
      isConcreteObject: true,
      objectQuestion,
      objectPromptUz,
      letterHint,
    };
  }

  // 3. Concrete vector art representation (100% offline, 0 bytes external CDN)
  return {
    imageUrl: generateWordArtworkSvg(word),
    hasSpecificImage: true,
    sourceType: 'artwork',
    accentGradient: theme.gradient,
    themeColor: theme.border,
    categoryLabel: cat,
    categoryIcon: theme.icon,
    mnemonicHook: getWordMnemonic(word),
    isConcreteObject: true,
    objectQuestion,
    objectPromptUz,
    letterHint,
  };
}

/**
 * Dynamic associative mnemonic hook in Uzbek for memory enhancement.
 */
export function getWordMnemonic(word: Word): string {
  const w = normalizeWordKey(word.english);
  const uz = word.uzbek;
  const pos = word.partOfSpeech || 'So‘z';

  const mnemonics: Record<string, string> = {
    leg: '💡 Oyoq (leg) — qadam bosish va harakatlanish vositasi.',
    arm: '💡 Qo‘l (arm) — kuch-quvvat va buyumlarni ko‘tarish a‘zosi.',
    hand: '💡 Qo‘l panjasi (hand) — yozish va salomlashish vositasi.',
    eye: '💡 Ko‘z (eye) — yorug‘ olamni ko‘rish a‘zosi.',
    head: '💡 Bosh (head) — aql va fikrlash markazi.',
    apple: '💡 Esda saqlash: Qizil shirin olma mevasi. Harflari: A-P-P-L-E.',
    banana: '💡 Banan — quvvat beruvchi sariq banana.',
    orange: '💡 Apelsin — sitrus meva, rangi ham orange (to‘q sariq).',
    bread: '💡 Non — nonvoyxonadagi issiq bread hidi.',
    coffee: '💡 Qahva — tonggi tetiklantiruvchi issiq qora kofe.',
    book: '💡 Kitob — varaqlab o‘qiladigan bilim manbai.',
    sun: '💡 Quyosh — osmonda porlayotgan yorug Sun.',
    car: '💡 Avtomobil — yo‘lda harakatlanayotgan mashina.',
    dog: '💡 Kuchuk/It — sodiq uy hayvoni do‘sti.',
    cat: '💡 Mushuk — muloyim miyovlovchi jonivor.',
    doctor: '💡 Shifokor — insonlar salomatligini asrovchi tabib.',
    water: '💡 Suv — hayot manbai bo‘lgan toza ichimlik.',
    flower: '💡 Gul — bahor faslida ochiladigan xushbo‘y gul.',
    money: '💡 Pul — xaridlar uchun to‘lov vositasi.',
    friend: '💡 Do‘st — qiyin va xursand kunlarda hamroh bo‘luvchi inson.',
    train: '💡 Poyezd (train) — relslar ustida tez yurguvchi temiryo‘l transporti.',
    ship: '💡 Kema (ship) — okean va dengizlarni zabt etuvchi ulkan kema.',
    plane: '💡 Samolyot (plane) — osmon bo‘ylab uchuvchi tezyurar havo vositasi.',
    door: '💡 Eshik (door) — xona va uyga kirish yo‘li.',
    window: '💡 Deraza (window) — quyosh nuri tushuvchi deraza oynasi.',
    table: '💡 Stol (table) — o‘qish va ovqatlanish stoli.',
    chair: '💡 Stul (chair) — dam olish va ishlash jihozi.',
  };

  if (mnemonics[w]) {
    return mnemonics[w];
  }

  if (pos.includes('Fe’l') || pos.includes('verb')) {
    return `⚡ Harakat fe’li: «${word.english}» — ${uz} ma’nosida harakat yoki holatni ifodalaydi.`;
  }

  if (pos.includes('Sifat') || pos.includes('adjective')) {
    return `✨ Sifat (Belgi-xususiyat): «${word.english}» — predmetning ${uz} belgisini ifodalaydi.`;
  }

  if (pos.includes('Son') || pos.includes('number')) {
    return `🔢 Son (Miqdor / Tartib): «${word.english}» — ${uz} miqdorini bildiradi.`;
  }

  if (pos.includes('Ravish') || pos.includes('adverb')) {
    return `💫 Ravish: «${word.english}» — harakatning qanday bajarilishini (${uz}) bildiradi.`;
  }

  return `💡 «${word.english}» (${uz}) — ${pos}. Namunaviy kontekstdagi misolini takrorlang!`;
}

/**
 * Returns a cloze-sentence with the target word masked.
 */
export function getClozeSentence(exampleSentence: string, targetWord: string): string {
  if (!exampleSentence || !targetWord) return '';
  const regex = new RegExp(`\\b${targetWord.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\b`, 'gi');
  return exampleSentence.replace(regex, '[ ... ]');
}

/**
 * Generates 4 distinct choices for Quiz mode.
 */
export function generateQuizOptions(currentWord: Word, allWords: Word[]): string[] {
  const options = new Set<string>();
  options.add(currentWord.uzbek);

  const sameCategory = allWords.filter(
    (w) => w.id !== currentWord.id && w.category === currentWord.category && w.uzbek !== currentWord.uzbek
  );
  const shuffledSame = [...sameCategory].sort(() => 0.5 - Math.random());
  for (const w of shuffledSame) {
    if (options.size >= 4) break;
    options.add(w.uzbek);
  }

  const shuffledAll = [...allWords].sort(() => 0.5 - Math.random());
  for (const w of shuffledAll) {
    if (options.size >= 4) break;
    if (w.uzbek !== currentWord.uzbek) {
      options.add(w.uzbek);
    }
  }

  return Array.from(options).sort(() => 0.5 - Math.random());
}
