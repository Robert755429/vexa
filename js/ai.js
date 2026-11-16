// ai.js - VEXA AI - VERSIONE SENZA CHIAVE
// Usa Pollinations - gratis, senza account, senza 18 anni
// Se un giorno hai la chiave Google, la rimettiamo

async function aiSuggest() {
  let box = document.getElementById('aiText');
  box.innerText = '🤖 VEXA AI sta pensando...';

  let prompt = "Sei VEXA, un editor video per TikTok. Dammi 3 idee virali per un video, con hook dei primi 2 secondi, musica consigliata e didascalia. Rispondi in italiano, in modo corto e divertente.";

  try {
    // Pollinations - niente chiave, niente login
    let res = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt));
    let text = await res.text();
    if(!text || text.length < 10) throw new Error('vuoto');
    box.innerText = text;
  } catch(e) {
    // Se internet va male, torna l'AI finta di prima
    let idee = [
      "🔥 HOOK: 'Non guardare fino alla fine...' + zoom veloce + musica phonk + testo che scorre",
      "🎬 IDEA: Transizione con la mano davanti alla camera, cambio outfit, beat drop a 0:08",
      "💡 DIDASCALIA: 'Chi altro fa così? 😂' + hashtag #vexa #fyp #viral",
      "⚡ IDEA: Video 0.5x all'inizio, poi 2x sul ritornello, filtro Vivid",
      "🎵 IDEA: Usa una canzone con bollino TUTTA, taglia il ritornello da 1:20 a 1:50"
    ];
    box.innerText = idee[Math.floor(Math.random()*idee.length)];
  }
}
