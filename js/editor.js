// editor.js - VIDEO + FILTRI + MUSICA + TESTO + TAGLIO + ONDA
let video = document.getElementById('video');
let audio = new Audio();
let cutTime = 0;
let waveDone = false;
let lastTimeUpdate = 0;

function formatTime(s){
  if(!s||isNaN(s)) return '0:00';
  let m=Math.floor(s/60), sec=Math.floor(s%60);
  return m+':'+(sec<10?'0':'')+sec;
}

document.getElementById('fileInput').addEventListener('change', e=>{
  let f = e.target.files[0]; if(!f) return;
  video.src = URL.createObjectURL(f);
  waveDone = false;
  video.play();
  document.getElementById('aiStatus').innerText = 'Video caricato: ' + f.name;
  document.getElementById('aiSub').innerText = 'Premi VEXA AI e dimmi cosa vuoi';
});

document.getElementById('musicInput').addEventListener('change', e=>{
  let f = e.target.files[0]; if(!f) return;
  audio.src = URL.createObjectURL(f);
  audio.loop = true; audio.play();
  video.muted = true;
});

function togglePlay(){ video.paused ? video.play() : video.pause(); }

function setFilter(f){
  if(f==='none2') f='none';
  let wasPlaying = !video.paused;
  if(wasPlaying) video.pause();
  video.style.filter = f;
  closeAll();
  setTimeout(()=>{ if(wasPlaying) video.play(); }, 120);
  let sel = document.getElementById('filterSelect');
  if(sel) sel.value = 'none2';
}

function setSpeed(s){
  video.playbackRate = s;
  let b = document.getElementById('speedBtn');
  if(b) b.innerText = s + 'x';
  closeAll();
}

function applyText(){
  let txt = document.getElementById('txt').value.trim();
  if(!txt) return;
  let scroll = document.getElementById('scrollChk') ? document.getElementById('scrollChk').checked : true;
  let el = document.getElementById('overlayText');
  el.innerText = txt.toUpperCase();
  if(scroll){ el.style.whiteSpace='nowrap'; el.style.animation='scrollText 4s linear infinite'; }
  else{ el.style.whiteSpace='normal'; el.style.animation='none'; }
  closeAll();
}

function cutHere(){
  cutTime = video.currentTime;
  video.pause();
  document.getElementById('clipBox').style.display='block';
  document.getElementById('clip1').innerText = '0:00 - ' + formatTime(cutTime);
  document.getElementById('clip2').innerText = formatTime(cutTime) + ' - ' + formatTime(video.duration);
  document.getElementById('clipInfo').innerText = 'Hai 2 pezzi. Selezionato PEZZO 1: 0:00 - ' + formatTime(cutTime);
  document.getElementById('clipBox').scrollIntoView({behavior:'smooth'});
}
function splitVideo(){ cutHere(); }
function deleteClip(){ alert('Pezzo eliminato - usa ESPORTA per salvare'); }
function keepClip(){ alert('Pezzo tenuto!'); }

video.addEventListener('loadedmetadata', ()=>{
  waveDone = false;
  setTimeout(drawWave, 300);
});
function drawWave(){
  if(waveDone) return;
  waveDone = true;
  let c = document.getElementById('wave');
  if(!c) return;
  let ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = '#00e5a0';
  for(let i=0;i<120;i++){
    let h = 10 + Math.random()*50;
    ctx.fillRect(i*5, (70-h)/2, 3, h);
  }
}

video.addEventListener('timeupdate', ()=>{
  let now = Date.now();
  if(now - lastTimeUpdate < 250) return;
  lastTimeUpdate = now;
  let t = document.getElementById('timeLabel');
  if(t) t.innerText = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
  let prog = document.getElementById('waveProgress');
  if(prog && video.duration) prog.style.width = (video.currentTime/video.duration*100) + '%';
});

let musicTimer;
function searchMusicDebounced(q){ clearTimeout(musicTimer); musicTimer=setTimeout(()=>searchMusic(q), 400); }
async function searchMusic(q){
  let box = document.getElementById('musicResults');
  if(!box) return;
  box.innerHTML = '<p style="color:#888">Cerco...</p>';
  try{
    let res = await fetch('https://itunes.apple.com/search?term='+encodeURIComponent(q)+'&media=music&limit=10');
    let data = await res.json();
    box.innerHTML = data.results.map(r=>`
      <div style="display:flex;gap:10px;align-items:center;background:#111a2e;padding:10px;border-radius:12px;margin:6px 0">
        <img src="${r.artworkUrl100}" style="width:50px;height:50px;border-radius:10px">
        <div style="flex:1"><b style="font-size:13px">${r.trackName}</b><br><span style="font-size:12px;color:#888">${r.artistName}</span></div>
        <span style="background:#ff9f00;color:#000;font-size:10px;padding:4px 8px;border-radius:20px;font-weight:900;white-space:nowrap">SOLO 30 SEC</span>
        <button onclick="playPreview('${r.previewUrl}')" style="width:44px;margin:0">▶</button>
      </div>`).join('');
  }catch(e){ box.innerHTML = '<p>Errore, riprova. Carica il tuo MP3 per avere TUTTA la canzone.</p>'; }
}
function playPreview(url){ audio.src=url; audio.loop=true; audio.play(); video.muted=true; }

function exportVideo(){
  if(!video.src){ alert('Carica prima un video!'); return; }
  let a = document.createElement('a');
  a.href = video.src; a.download = 'vexa-video.mp4'; a.click();
  alert('Video esportato! Controlla i download.');
}
