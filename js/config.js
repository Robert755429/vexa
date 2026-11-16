// VEXA CONFIG - API KEY
// Incolla qui la chiave che stai facendo su aistudio.google.com
// NON condividerla con nessuno, è tua!

const GEMINI_KEY = "INCOLLA_QUI_LA_TUA_CHIAVE";

// Se la chiave è vuota, VEXA usa l'AI finta gratis (senza API)
const USE_REAL_AI = GEMINI_KEY !== "INCOLLA_QUI_LA_TUA_CHIAVE" && GEMINI_KEY.length > 10;
