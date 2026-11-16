// ai.js - VEXA AI CHE EDITA DAVVERO
// Gratis, senza chiave, senza 18 anni - Pollinations AI
// Comandi: testo, filtro, velocità, formato, musica

// ============ 1. AI CHE EDITA IL VIDEO ============
function aiDoEdit(cmd) {
  cmd = cmd.toLowerCase();
  let fatto = [];

  // --- TESTO ---
  if (cmd.includes('testo') || cmd.includes('scritta') || cmd.includes('scrivi') || cmd.includes('metti scritto')) {
    let txt = "";
    // Se c'è : prendi dopo i :
    if (cmd.includes(':')) {
      txt = cmd.split(':')[1].trim();
    } else {
      // Altrimenti togli le parole comando e prendi il resto
      txt = cmd.replace(/metti|testo|scritta|scrivi|scritto|con|di|che|dica/gi, '').trim();
      // Togli anche i comandi filtro/velocità/formato dal testo
      txt = txt.replace(/filtro.*|velocit.*|formato.*|tiktok|youtube|instagram|bianco.*|vivid|vintage|originale|2x|0\.5x|1x|veloce|lento|slow/gi, '').trim();
    }
    if (!txt) txt = "GUARDA FINO ALLA FINE";

    let wrap = document.getElementById('videoWrap');
    let el = document.getElementById('overlayText');
    if (!el) {
      el = document.createElement('div');
      el.id = 'overlayText';
      el.style.cssText = 'position:absolute;top:20%;left:0;right:0;text-align:center;font-size:32px;font-weight:900;color:#fff;text-shadow:2px 2px 0 #000;z-index:10;padding:0 10px;word-break:break-word';
      if (wrap) wrap.appendChild(el);
    }
    el.innerText = txt.toUpperCase();
    // Se chiede scorrimento
    if (cmd.includes('scorr') || cmd.includes('scorre')) {
      el.style.whiteSpace = 'nowrap';
      el.style.animation = 'scrollText 4s linear infinite';
    } else {
      el.style.animation = 'none';
    }
    fatto.push('✅ Testo: ' + txt.toUpperCase());
  }

  // TOGLI TESTO
  if (cmd.includes('togli testo') || cmd.includes('rimuovi testo') || cmd.includes('cancella testo')) {
    let el = document.getElementById('overlayText');
    if (el) el.remove();
    fatto.push('✅ Testo tolto');
  }

  // --- FILTRI ---
  if (cmd.includes('bianco e nero') || cmd.includes('b/n') || cmd.includes('bianco nero') || cmd.includes('black')) {
    setFilter('grayscale(1)');
    fatto.push('✅ Filtro B/N');
  }
  if (cmd.includes('vivid') || cmd.includes('colorato') || cmd.includes('colori')) {
    setFilter('contrast(1.4) saturate(1.5)');
    fatto.push('✅ Filtro Vivid');
  }
  if (cmd.includes('vintage') || cmd.includes('vecchio') || cmd.includes('sepia')) {
    setFilter('sepia(0.6)');
    fatto.push('✅ Filtro Vintage');
  }
  if (cmd.includes('originale') || cmd.includes('togli filtro') || cmd.includes('rimuovi filtro') || cmd.includes('senza filtro')) {
    setFilter('none');
    fatto.push('✅ Filtro Originale');
  }

  // --- VELOCITA ---
  if (cmd.includes('2x') || cmd.includes('veloce') || cmd.includes('velocizza')) {
    setSpeed(2);
    fatto.push('✅ Velocità 2x');
  } else if (cmd.includes('0.5') || cmd.includes('lento') || cmd.includes('slow') || cmd.includes('rallenta')) {
    setSpeed(0.5);
    fatto.push('✅ Velocità 0.5x Slow');
  } else if (cmd.includes('normale') || cmd.includes('1x')) {
    setSpeed(1);
    fatto.push('✅ Velocità 1x Normale');
  }

  // --- FORMATO ---
  if (cmd.includes('tiktok') || cmd.includes('9:16') || cmd.includes('verticale')) {
    video.style.aspectRatio = '9/16';
    fatto.push('✅ Formato 9:16 TikTok');
  }
  if (cmd.includes('youtube') || cmd.includes('16:9') || cmd.includes('orizzontale')) {
    video.style.aspectRatio = '16/9';
    fatto.push('✅ Formato 16:9 YouTube');
  }
  if (cmd.includes('instagram') || cmd.includes('1:1') || cmd.includes('quadrato')) {
    video.style.aspectRatio = '1/1';
    fatto.push('✅ Formato 1:1 Instagram');
  }

  // --- MUSICA ---
  if (cmd.includes('musica') || cmd.includes('phonk') || cmd.includes('canzone') || cmd.includes('audio')) {
    // Se chiede di togliere audio
    if (cmd.includes('togli') || cmd.includes('rimuovi') || cmd.includes('muto') || cmd.includes('silenzia')) {
      if (typeof audio !== 'undefined' && audio) audio.pause();
      if (typeof video !== 'undefined' && video) video.muted = true;
      fatto.push('✅ Audio tolto / Muto');
    } else {
      // Apre la schermata musica
      if (cmd.includes('phonk')) {
        openSheet('musica');
        setTimeout(() => searchMusic('phonk'), 500);
      } else {
        openSheet('musica');
      }
      fatto.push('✅ Ho aperto la Musica, scegli la canzone');
    }
  }

  // --- TAGLIA / RESET ---
  if (cmd.includes('reset') || cmd.includes('ricomincia') || cmd.includes('tutto normale')) {
    setFilter('none');
    setSpeed(1);
    video.style.aspectRatio = '9/16';
    let el = document.getElementById('overlayText');
    if (el) el.remove();
    fatto.push('✅ Reset fatto - tutto normale');
  }

  return fatto.length ? fatto.join('\n') : null;
}

// ============ 2. IDEA VIDEO ============
async function aiSuggest() {
  let box = document.getElementById('aiText');
  if (!box) return;
  box.innerText = '🤖 VEXA AI sta pensando...';
  try {
    let res = await fetch('https://text.pollinations.ai/' + encodeURIComponent("Sei VEXA AI, editor video TikTok. Dammi 1 idea virale corta in italiano con: HOOK dei primi 2 secondi, cosa fare nel video, musica consigliata, didascalia. Stile divertente e corto."));
    let t = await res.text();
    if (!t || t.length < 10) throw new Error('vuoto');
    box.innerText = t;
  } catch (e) {
    box.innerText = "🔥 IDEA:\nHOOK: 'Non guardare fino alla fine...'\nVIDEO: zoom veloce + testo che scorre\nMUSICA: phonk\nDIDASCALIA: 'Chi altro fa così? 😂 #vexa #fyp'";
  }
}

// ============ 3. DIDASCALIA ============
async function aiCaption() {
  let box = document.getElementById('aiText');
  if (!box) return;
  box.innerText = '✍️ Sto scrivendo la didascalia...';
  try {
    let res = await fetch('https://text.pollinations.ai/' + encodeURIComponent("Sei VEXA AI. Scrivi 3 didascalie virali in italiano per TikTok, corte, divertenti, con emoji. Una divertente, una misteriosa, una che fa commentare."));
    let t = await res.text();
    box.innerText = t;
  } catch (e) {
    box.innerText = "✍️ DIDASCALIE:\n1. Chi altro fa così? 😂\n2. Aspetta la fine... 👀\n3. Non ci credo ancora 🤯";
  }
}

// ============ 4. HASHTAG ============
async function aiHashtags() {
  let box = document.getElementById('aiText');
  if (!box) return;
  box.innerText = '#️⃣ Sto cercando gli hashtag...';
  try {
    let res = await fetch('https://text.pollinations.ai/' + encodeURIComponent("Sei VEXA AI. Dammi 15 hashtag virali per TikTok in italiano e inglese, divisi per: virali, di nicchia, musica. Solo hashtag."));
    let t = await res.text();
    box.innerText = t;
  } catch (e) {
    box.innerText = "#️⃣ HASHTAG:\n#vexa #fyp #viral #perte #tiktokitalia #phonk #edit #trend #viralvideo #foryou";
  }
}

// ============ 5. CHAT PRINCIPALE - CAPISCE TUTTO ============
async function aiChat() {
  let input = document.getElementById('aiInput');
  let box = document.getElementById('aiText');
  if (!input || !box) return;
  let cmd = input.value.trim();
  if (!cmd) {
    box.innerText = "Scrivimi qualcosa! Es: 'metti testo CIAO + filtro B/N + 2x'";
    return;
  }

  box.innerText = '🤖 Sto editando...';

  // 1. Prima prova a editare davvero sul video
  let fatto = aiDoEdit(cmd);
  if (fatto) {
    box.innerText = fatto + '\n\nFatto! Dimmi altro 😎';
    input.value = '';
    // Chiude un attimo per farti vedere il video editato
    if (typeof closeAll === 'function') closeAll();
    setTimeout(() => {
      let sheet = document.getElementById('sheet');
      let overlay = document.getElementById('overlay');
      if (sheet) sheet.classList.add('show');
      if (overlay) overlay.classList.add('show');
    }, 1000);
    return;
  }

  // 2. Se non è un comando di editing, chiede consiglio all'AI vera
  try {
    let res = await fetch('https://text.pollinations.ai/' + encodeURIComponent("Sei VEXA AI, editor video TikTok esperto. Utente: " + cmd + ". Rispondi in italiano, corto, con consigli pratici per editare, hook, musica e didascalia. Max 100 parole."));
    let t = await res.text();
    box.innerText = t || "Prova: 'metti testo CIAO', 'filtro bianco e nero', 'velocità 2x', 'formato tiktok'";
  } catch (e) {
    box.innerText = "Prova a scrivermi:\n- metti testo CIAO\n- filtro bianco e nero\n- velocità 2x\n- formato tiktok\n- metti musica phonk\n- reset";
  }
  input.value = '';
    }
