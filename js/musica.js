let audio = new Audio();
audio.loop = true;
let currentTrack = null;
let musicStart = 0;
let musicLen = 30;
let musicDuration = 0;
let musicMode = 'full'; // 'full' = puoi scegliere dove, 'preview' = solo 30 sec fissi

// --- CERCA IN TUTTE E DUE LE LIBRERIE ---
async function searchMusic(query) {
  let box = document.getElementById('musicResults');
  if(!box) return;
  box.innerHTML = '<p style="color:#888">🔍 Sto cercando...</p>';

  let all = [];

  // 1. FAMOSE - iTunes - SOLO 30 SEC
  try {
    let r1 = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=8&country=IT`);
    let d1 = await r1.json();
    d1.results.forEach(t => all.push({
      name: t.trackName, artist: t.artistName, image: t.artworkUrl100,
      url: t.previewUrl, duration: 30, badge: 'SOLO 30 SEC', badgeColor: '#ff9f00', mode: 'preview'
    }));
  } catch(e) {}

  // 2. FREE FULL - Jamendo - TUTTA
  try {
    let r2 = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=56d30c5d&format=json&limit=8&search=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`);
    let d2 = await r2.json();
    d2.results.forEach(t => all.push({
      name: t.name, artist: t.artist_name, image: t.image,
      url: t.audio, duration: t.duration, badge: 'TUTTA', badgeColor: '#00e676', mode: 'full'
    }));
  } catch(e) {}

  window._vexaTracks = all;
  if(!all.length) { box.innerHTML = 'Nessun risultato. Prova "phonk" o "chill"'; return; }

  box.innerHTML = all.map((t,i) => `
    <div style="display:flex;align-items:center;gap:10px;background:#222;padding:10px;border-radius:12px;margin-bottom:8px">
      <img src="${t.image}" style="width:50px;height:50px;border-radius:10px;object-fit:cover;background:#333">
      <div style="flex:1;min-width:0">
        <b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.name}</b>
        <span style="font-size:12px;color:#888">${t.artist}</span><br>
        <span style="display:inline-block;font-size:10px;font-weight:900;padding:3px 7px;border-radius:20px;margin-top:4px;background:${t.badgeColor};color:#000">${t.badge}</span>
        <span style="font-size:11px;color:#888;margin-left:4px">${t.mode==='full' ? Math.floor(t.duration/60)+':'+String(Math.floor(t.duration%60)).padStart(2,'0')+' • puoi scegliere dove' : '30 sec fissi'}</span>
      </div>
      <button onclick="useTrack(${i})" style="width:42px;height:42px;background:#00e676;border:0;border-radius:50%;font-size:16px">➡️</button>
    </div>
  `).join('');
}

function useTrack(i) {
  let t = window._vexaTracks[i];
  openMusicTrim(t.name, t.artist, t.url, t.duration, t.image, t.mode);
}

// --- SCHERMATA TAGLIO - COME WHATSAPP ---
function openMusicTrim(name, artist, url, duration, image, mode) {
  currentTrack = { name, artist, url, duration, image };
  musicMode = mode || 'full';
  musicDuration = duration;
  musicStart = 0;
  musicLen = musicMode === 'full' ? Math.min(30, duration) : 30;

  let sheet = document.getElementById('sheet');
  document.getElementById('sheetTitle').innerText = '🎵 Taglia la musica';
  document.getElementById('sheetContent').innerHTML = `
    <div style="display:flex;gap:10px;align-items:center">
      <img src="${image || ''}" style="width:60px;height:60px;border-radius:12px;background:#333;object-fit:cover">
      <div><b>${name}</b><br><span style="font-size:13px;color:#888">${artist}</span><br>
      <span style="display:inline-block;font-size:11px;font-weight:900;padding:4px 8px;border-radius:20px;margin-top:4px;background:${musicMode==='full' ? '#00e676' : '#ff9f00'};color:#000">${musicMode==='full' ? 'TUTTA - scegli tu dove' : 'SOLO 30 SEC - fissi'}</span>
      </div>
    </div>

    ${musicMode==='full' ? `
      <p style="font-size:12px;color:#888;margin-top:14px">Trascina la sbarra verde per scegliere il pezzo:</p>
      <div id="musicWaveWrap" style="position:relative;height:64px;background:#1a1a24;border-radius:12px;overflow:hidden;margin:10px 0;border:1px solid #333">
        <canvas id="musicWave" style="width:100%;height:100%"></canvas>
        <div id="musicSelector" style="position:absolute;top:0;bottom:0;left:0%;width:20%;background:rgba(0,230,118,0.35);border:2px solid #00e676;border-radius:10px;cursor:grab;touch-action:none"></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-size:13px">Quanto dura?</span>
        <select id="musicLenSelect" onchange="setMusicLen(this.value)" style="flex:1">
          <option value="30" selected>30 secondi</option>
          <option value="15">15 secondi</option>
          <option value="60">60 secondi</option>
          <option value="999">Tutta la canzone</option>
        </select>
      </div>
      <p style="font-size:12px;color:#888;margin-top:8px">Inizio: <b id="musicStartLabel">0:00</b> • Fine: <b id="musicEndLabel">0:30</b></p>
    ` : `
      <div style="background:#2a1e00;border:1px solid #ff9f00;padding:12px;border-radius:12px;margin-top:14px">
        <b>⚠️ SOLO 30 SEC</b><br><span style="font-size:13px;color:#ccc">Questa è una canzone famosa. Apple ti fa sentire solo 30 secondi fissi, non puoi scegliere dove. Se vuoi scegliere tu dove, usa una canzone TUTTA o carica il tuo MP3.</span>
      </div>
      <div style="height:64px;background:#1a1a24;border-radius:12px;margin:10px 0;display:flex;align-items:center;justify-content:center;color:#888">▶️ Anteprima 30 sec</div>
    `}

    <div style="display:flex;gap:8px;align-items:center;margin:10px 0">
      <button onclick="toggleMusicPlay()" id="musicPlayBtn" style="width:50px;border-radius:50%;background:#fff;color:#000">⏸️</button>
      <span id="musicTimeLabel" style="font-size:14px">0:00 / 0:30</span>
    </div>
    <button onclick="confirmMusic()">✅ FINE - METTI SUL VIDEO</button>
    <button onclick="closeAll()" style="background:#333;color:#fff">Annulla</button>
  `;
  sheet.classList.add('show');
  document.getElementById('overlay').classList.add('show');

  audio.src = url;
  audio.currentTime = 0;
  audio.play();
  drawMusicWave();
  initMusicDrag();
  audio.ontimeupdate = () => {
    if(!musicDuration) return;
    let label = document.getElementById('musicTimeLabel');
    if(label) label.innerText = Math.floor(audio.currentTime/60)+':'+String(Math.floor(audio.currentTime%60)).padStart(2,'0') + ' / ' + Math.floor(musicDuration/60)+':'+String(Math.floor(musicDuration%60)).padStart(2,'0');
    if(musicMode==='full' && audio.currentTime > musicStart + musicLen) audio.currentTime = musicStart;
  };
}

function drawMusicWave() {
  let c = document.getElementById('musicWave'); if(!c) return;
  let ctx = c.getContext('2d'); c.width = c.offsetWidth*2; c.height = c.offsetHeight*2;
  ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle = '#00e676';
  for(let x=0;x<c.width;x+=6){ let h = Math.random()*c.height*0.7+12; ctx.fillRect(x, c.height/2-h/2, 3, h); }
  updateMusicSelector();
}
function updateMusicSelector() {
  let sel = document.getElementById('musicSelector'); if(!sel || !musicDuration) return;
  sel.style.left = (musicStart/musicDuration*100)+'%';
  sel.style.width = (musicLen/musicDuration*100)+'%';
  let s = document.getElementById('musicStartLabel'); if(s) s.innerText = Math.floor(musicStart/60)+':'+String(Math.floor(musicStart%60)).padStart(2,'0');
  let e = document.getElementById('musicEndLabel'); if(e) e.innerText = Math.floor((musicStart+musicLen)/60)+':'+String(Math.floor((musicStart+musicLen)%60)).padStart(2,'0');
}
function setMusicLen(v) { musicLen = v == 999 ? musicDuration : parseInt(v); musicLen = Math.min(musicLen, musicDuration - musicStart); updateMusicSelector(); }
function initMusicDrag() {
  let sel = document.getElementById('musicSelector'); if(!sel) return;
  let wrap = document.getElementById('musicWaveWrap'); let dragging = false;
  sel.addEventListener('pointerdown', e => { dragging = true; sel.setPointerCapture(e.pointerId); });
  sel.addEventListener('pointermove', e => {
    if(!dragging) return;
    let r = wrap.getBoundingClientRect();
    let p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    musicStart = p * musicDuration;
    if(musicStart + musicLen > musicDuration) musicStart = musicDuration - musicLen;
    audio.currentTime = musicStart; updateMusicSelector();
  });
  sel.addEventListener('pointerup', () => dragging = false);
}
function toggleMusicPlay() {
  if(audio.paused){ audio.play(); document.getElementById('musicPlayBtn').innerText='⏸️'; }
  else { audio.pause(); document.getElementById('musicPlayBtn').innerText='▶️'; }
}
function confirmMusic() {
  audio.currentTime = musicStart; audio.play();
  alert('🎵 Fatto! ' + currentTrack.name + ' - ' + (musicMode==='full' ? 'da ' + Math.floor(musicStart/60)+':'+String(Math.floor(musicStart%60)).padStart(2,'0') + ' per ' + musicLen + ' sec' : 'anteprima 30 sec'));
  closeAll();
}

// MP3 TUO - SEMPRE TUTTA
document.getElementById('musicInput').addEventListener('change', (e) => {
  let f = e.target.files[0]; if(!f) return;
  let url = URL.createObjectURL(f);
  let tmp = new Audio(url);
  tmp.onloadedmetadata = () => openMusicTrim(f.name, 'Il tuo MP3', url, tmp.duration, '', 'full');
});
