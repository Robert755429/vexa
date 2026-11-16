// main.js - VEXA - Accende tutto
// SIDEBAR + SHEET + CHIUDI TOCCANDO FUORI

function toggleSidebar(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('overlay').classList.toggle('show', open);
}

function closeAll() {
  toggleSidebar(false);
  document.getElementById('sheet').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}

function openSheet(type) {
  let t = document.getElementById('sheetTitle');
  let c = document.getElementById('sheetContent');

  // Chiude la sidebar e apre la finestra in basso
  toggleSidebar(false);
  document.getElementById('sheet').classList.add('show');
  document.getElementById('overlay').classList.add('show');

  // --- TESTO ---
  if (type === 'testo') {
    t.innerText = '🔤 Testo che scorre';
    c.innerHTML = `
      <input id="txt" placeholder="Scrivi... es: GUARDA FINO ALLA FINE">
      <label style="display:flex;gap:8px;align-items:center;font-size:14px;margin:8px 0">
        <input type="checkbox" id="scrollChk" checked style="width:20px"> Fai scorrere il testo (tipo TikTok)
      </label>
      <button onclick="applyText()">Applica Testo</button>
    `;
  }

  // --- MUSICA - TUTTI E 3 INSIEME ---
  if (type === 'musica') {
    t.innerText = '🎵 Musica';
    c.innerHTML = `
      <!-- 1. IN ALTO - UPLOAD MP3 -->
      <div style="background:#1a2a1f;border:1px solid #00e676;padding:14px;border-radius:14px">
        <b>⬆️ 1. CARICA IL TUO MP3</b><br>
        <span style="font-size:12px;color:#888">Hai tutta la canzone, scegli tu i 30 sec • <b style="color:#00e676">TUTTA</b></span>
        <button onclick="document.getElementById('musicInput').click()">📂 Scegli MP3 dal telefono</button>
      </div>

      <!-- 2. SCORRI GIU - CERCA -->
      <p style="margin:16px 0 8px"><b>🔍 2. CERCA MUSICA</b><br>
      <span style="font-size:12px;color:#888">Scorri giù, scegli. A destra vedi se è SOLO 30 SEC o TUTTA</span></p>

      <input id="musicSearch" placeholder="Cerca... es: phonk, chill, Fred De Palma" oninput="if(this.value.length>2) searchMusic(this.value)">

      <div style="display:flex;gap:6px;margin:8px 0">
        <button onclick="searchMusic('phonk')" style="flex:1">Phonk</button>
        <button onclick="searchMusic('chill')" style="flex:1">Chill</button>
        <button onclick="searchMusic('tiktok')" style="flex:1">TikTok</button>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;font-size:11px;margin-bottom:8px">
        <span style="background:#ff9f00;color:#000;padding:4px 8px;border-radius:20px;font-weight:900">SOLO 30 SEC = famose, fissi</span>
        <span style="background:#00e676;color:#000;padding:4px 8px;border-radius:20px;font-weight:900">TUTTA = scegli tu dove</span>
      </div>

      <div id="musicResults">
        <p style="color:#888">Cerca sopra 👆<br>Vedrai la lista con il bollino a destra.</p>
      </div>

      <div style="margin-top:10px">
        <input type="range" min="0" max="1" step="0.1" value="0.5" oninput="audio.volume=this.value">
        <p style="font-size:12px;color:#888">Volume musica</p>
      </div>
    `;
    // Carica subito qualcosa così non è vuoto
    setTimeout(() => searchMusic('phonk'), 300);
  }

  // --- VELOCITÀ ---
  if (type === 'velocita') {
    t.innerText = '⏩ Velocità';
    c.innerHTML = `
      <button onclick="setSpeed(0.5);closeAll()">0.5x Slow</button>
      <button onclick="setSpeed(1);closeAll()">1x Normale</button>
      <button onclick="setSpeed(2);closeAll()">2x Veloce</button>
    `;
  }

  // --- FILTRI ---
  if (type === 'filtri') {
    t.innerText = '🎨 Filtri';
    c.innerHTML = `
      <button onclick="setFilter('none');closeAll()">Originale</button>
      <button onclick="setFilter('grayscale(1)');closeAll()">B/N</button>
      <button onclick="setFilter('contrast(1.4) saturate(1.5)');closeAll()">Vivid</button>
      <button onclick="setFilter('sepia(0.6)');closeAll()">Vintage</button>
    `;
  }

  // --- FORMATO ---
  if (type === 'formato') {
    t.innerText = '📐 Formato';
    c.innerHTML = `
      <button onclick="video.style.aspectRatio='9/16';closeAll()">📱 9:16 TikTok</button>
      <button onclick="video.style.aspectRatio='16/9';closeAll()">↔️ 16:9 YouTube</button>
      <button onclick="video.style.aspectRatio='1/1';closeAll()">⬛ 1:1 Instagram</button>
    `;
  }

  // --- AI CHE EDITA DAVVERO ---
  if (type === 'ai') {
    t.innerText = '🤖 VEXA AI CHE EDITA';
    c.innerHTML = `
      <p>Scrivimi cosa vuoi e lo faccio sul video.</p>
      <input id="aiInput" placeholder="Es: metti testo CIAO + filtro B/N + 2x">
      <button onclick="aiChat()">✨ Fai tu!</button>
      <div style="display:flex;gap:6px">
        <button onclick="aiSuggest()" style="flex:1">💡 Idea</button>
        <button onclick="aiCaption()" style="flex:1">✍️ Didascalia</button>
        <button onclick="aiHashtags()" style="flex:1">#️⃣ Hashtag</button>
      </div>
      <p id="aiText" style="margin-top:10px;background:#111;padding:12px;border-radius:12px;white-space:pre-wrap">Prova: metti testo CIAO + filtro B/N + 2x</p>
      <p style="font-size:12px;color:#888">Comandi: testo, filtro B/N / vivid / vintage, velocità 2x / 0.5x, formato tiktok / youtube / instagram, musica phonk, reset, togli testo</p>
    `;
  }

  // --- PRIVACY / COOKIE / LICENZE / FAQ ---
  if (type === 'privacy') {
    t.innerText = 'Privacy';
    c.innerHTML = `<p>I tuoi video non lasciano mai il tuo telefono. VEXA non salva i tuoi file sui nostri server. Tutto avviene nel tuo browser.</p>`;
  }
  if (type === 'cookie') {
    t.innerText = 'Cookie';
    c.innerHTML = `<p>Solo cookie tecnici per far funzionare il sito. Nessun tracciamento pubblicitario, nessun cookie di terze parti.</p>`;
  }
  if (type === 'licenze') {
    t.innerText = 'Licenze';
    c.innerHTML = `<p>I contenuti che carichi sono tuoi. Per la musica: le canzoni con bollino <b>TUTTA</b> sono free e puoi usarle. Quelle con bollino <b>SOLO 30 SEC</b> sono anteprime di canzoni famose, usale solo per provare.</p>`;
  }
  if (type === 'faq') {
    t.innerText = 'FAQ';
    c.innerHTML = `
      <p><b>Cos'è VEXA?</b><br>Editor gratis stile CapCut, dal browser.</p>
      <p><b>Devo pagare?</b><br>No, è 100% free.</p>
      <p><b>Dove vanno i miei video?</b><br>Restano sul tuo telefono.</p>
      <p><b>Cos'è un API?</b><br>È la chiave che collega VEXA all'AI vera di Google. Se non la metti, VEXA usa l'AI gratis di Pollinations, senza chiave e senza 18 anni.</p>
      <p><b>Perché alcune canzoni sono SOLO 30 SEC?</b><br>Perché sono famose e Apple dà solo l'anteprima. Quelle TUTTA sono free e le puoi tagliare dove vuoi.</p>
      <p><b>L'AI può editare da sola?</b><br>Sì! Scrivile: "metti testo CIAO + filtro B/N + 2x" e lei lo fa.</p>
    `;
  }
}
