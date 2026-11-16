// main.js - SOLO MENU + FOGLI
function toggleSidebar(open){
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('overlay').classList.toggle('show', open);
}
function closeAll(){
  toggleSidebar(false);
  document.getElementById('sheet').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}
function openSheet(type){
  if(type==='ai'){ openAIChat(); return; }
  let t=document.getElementById('sheetTitle');
  let c=document.getElementById('sheetContent');
  toggleSidebar(false);
  document.getElementById('sheet').classList.add('show');
  document.getElementById('overlay').classList.add('show');
  if(type==='testo'){
    t.innerText='🔤 Testo che scorre';
    c.innerHTML=`<input id="txt" placeholder="Scrivi... es: GUARDA FINO ALLA FINE"><label style="display:flex;gap:8px;align-items:center;font-size:14px"><input type="checkbox" id="scrollChk" checked style="width:20px"> Fai scorrere il testo</label><button onclick="applyText()">Applica Testo</button>`;
  }
  if(type==='musica'){
    t.innerText='🎵 Musica';
    c.innerHTML=`<div style="background:#1a2a1f;border:1px solid #00e676;padding:14px;border-radius:14px"><b>⬆️ 1. CARICA IL TUO MP3</b><br><span style="font-size:12px;color:#888">Hai TUTTA la canzone • <b style="color:#00e676">TUTTA</b></span><button onclick="document.getElementById('musicInput').click()">📂 Scegli MP3</button></div><p style="margin:16px 0 8px"><b>🔍 2. CERCA MUSICA</b></p><input id="musicSearch" placeholder="Cerca... phonk, chill" oninput="if(this.value.length>2) searchMusicDebounced(this.value)"><div style="display:flex;gap:6px"><button onclick="searchMusic('phonk')" style="flex:1">Phonk</button><button onclick="searchMusic('chill')" style="flex:1">Chill</button><button onclick="searchMusic('tiktok')" style="flex:1">TikTok</button></div><div style="display:flex;gap:6px;flex-wrap:wrap;font-size:11px;margin:8px 0"><span style="background:#ff9f00;color:#000;padding:4px 8px;border-radius:20px;font-weight:900">SOLO 30 SEC = famose</span><span style="background:#00e676;color:#000;padding:4px 8px;border-radius:20px;font-weight:900">TUTTA = MP3 tuo</span></div><div id="musicResults"><p style="color:#888">Cerca sopra 👆</p></div><input type="range" min="0" max="1" step="0.1" value="0.5" oninput="audio.volume=this.value">`;
    setTimeout(()=>searchMusic('phonk'), 300);
  }
  if(type==='velocita'){
    t.innerText='⏩ Velocità';
    c.innerHTML=`<button onclick="setSpeed(0.5)">0.5x Slow</button><button onclick="setSpeed(1)">1x Normale</button><button onclick="setSpeed(2)">2x Veloce</button>`;
  }
  if(type==='filtri'){
    t.innerText='🎨 Filtri';
    c.innerHTML=`<button onclick="setFilter('none')">Originale</button><button onclick="setFilter('grayscale(1)')">B/N</button><button onclick="setFilter('contrast(1.4) saturate(1.5)')">Vivid</button><button onclick="setFilter('sepia(0.6)')">Vintage</button>`;
  }
  if(type==='formato'){
    t.innerText='📐 Formato';
    c.innerHTML=`<button onclick="video.style.aspectRatio='9/16';closeAll()">📱 9:16 TikTok</button><button onclick="video.style.aspectRatio='16/9';closeAll()">↔️ 16:9 YouTube</button><button onclick="video.style.aspectRatio='1/1';closeAll()">⬛ 1:1 Instagram</button>`;
  }
  if(type==='privacy'){ t.innerText='Privacy'; c.innerHTML=`<p>I tuoi video non lasciano mai il tuo telefono. Tutto avviene nel tuo browser.</p>`; }
  if(type==='cookie'){ t.innerText='Cookie'; c.innerHTML=`<p>Solo cookie tecnici. Nessun tracciamento pubblicitario.</p>`; }
  if(type==='licenze'){ t.innerText='Licenze'; c.innerHTML=`<p>Le canzoni con bollino <b>TUTTA</b> sono free. Quelle <b>SOLO 30 SEC</b> sono anteprime famose, solo per provare.</p>`; }
  if(type==='faq'){ t.innerText='FAQ'; c.innerHTML=`<p><b>Cos'è VEXA?</b><br>Editor gratis stile CapCut, dal browser.</p><p><b>Devo pagare?</b><br>No, 100% free.</p><p><b>Dove vanno i video?</b><br>Restano sul tuo telefono.</p><p><b>L'AI edita da sola?</b><br>Sì! Scrivile: metti testo CIAO + filtro B/N + 2x</p>`; }
}
