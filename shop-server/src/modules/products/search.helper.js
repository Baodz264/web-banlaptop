export const keywordMap = {
  // ================= LAPTOP =================
  laptop: ["macbook", "dell", "hp", "asus", "msi", "lenovo"],
  macbook: ["laptop", "apple"],
  dell: ["laptop", "inspiron", "g series"],
  hp: ["laptop", "pavilion"],
  asus: ["laptop", "rog", "vivobook"],
  msi: ["laptop", "gaming"],
  lenovo: ["laptop", "thinkpad"],

  // ================= GAMING =================
  gaming: ["rog", "msi", "acer nitro"],
  rog: ["asus", "gaming"],
  "acer nitro": ["gaming", "acer"],

  // ================= ACCESSORY =================
  chuot: ["logitech", "razer"],
  mouse: ["logitech", "razer"],
  logitech: ["chuot", "keyboard"],
  razer: ["chuot", "keyboard"],

  keyboard: ["logitech", "razer", "corsair"],
  "ban phim": ["keyboard", "logitech", "razer"],

  // ================= STORAGE =================
  ram: ["kingston", "corsair"],
  ssd: ["samsung", "kingston"],
  kingston: ["ram", "ssd"],
  corsair: ["ram"],

  samsung: ["ssd", "monitor"],

  // ================= MONITOR =================
  monitor: ["dell", "samsung"],
  "man hinh": ["monitor", "dell", "samsung"],

  // ================= GENERAL =================
  pc: ["computer", "laptop"],
  computer: ["laptop"],
  "may tinh": ["computer", "laptop"],

  phone: ["iphone", "samsung"],
  "dien thoai": ["phone", "iphone", "samsung"],

  apple: ["macbook", "iphone"]
};

/* ================= NORMALIZE ================= */
const normalize = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ");
};

/* ================= TYPO FIX ================= */
const typoMap = {
  laptopp: "laptop",
  macboook: "macbook",
  macbookk: "macbook",
  logitec: "logitech",
  logiteech: "logitech",
  razeer: "razer",
  razerw: "razer",
  samsng: "samsung",
  samssung: "samsung",
  banphim: "ban phim",
  chuotgamming: "chuot gaming",
  chuotgaming: "chuot gaming",
  compoter: "computer",
  computar: "computer"
};

const fixTypo = (word) => {
  return typoMap[word] || word;
};

/* ================= MAIN FUNCTION ================= */
export const expandKeyword = (keyword) => {
  if (!keyword) return [];

  // 1. normalize
  const normalized = normalize(keyword);

  // 2. split words
  const words = normalized.split(" ").filter(Boolean);

  // 3. fix typo
  const fixedWords = words.map(fixTypo);

  const fixedKeyword = fixedWords.join(" ");

  const resultSet = new Set();

  const keys = Object.keys(keywordMap);

  const add = (k) => {
    if (!k) return;

    resultSet.add(k);

    if (Array.isArray(keywordMap[k])) {
      keywordMap[k].forEach(v => resultSet.add(v));
    }
  };

  // ================= CASE 1: match cả cụm =================
  if (keywordMap[fixedKeyword]) {
    add(fixedKeyword);
  }

  // ================= CASE 2: từng từ =================
  for (const w of fixedWords) {
    add(w);

    // ================= CASE 3: dính chữ =================
    for (const k of keys) {
      const cleanKey = k.replace(/\s+/g, "");

      if (w.includes(cleanKey)) {
        add(k);
      }
    }
  }

  return [...resultSet];
};
