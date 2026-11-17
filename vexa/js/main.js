let music=document.getElementById('music');
let karaokeOn=false, karaokeTimer=null;
document.getElementById('musicInput').onchange=e=>{music.src=URL.createObjectURL(e.target.files[0]); music.loop=false; alert('Musica caricata! Loop OFF. Premi PLAY');};
function playMusic(){if(!music.src) return alert('Carica prima una musica!'); music.play();}
function stopMusic(){music.pause(); music.currentTime=0; alert('Musica FERMATA ✅');}
function toggleLoop(){music.loop=!music.loop; document.getElementById('loopTxt').innerText=music.loop?'ON':'OFF';}
function setMusicVol(){music.volume=document.getElementById('musicVol').value/100;}
function setVideoVol(){video.volume=document.getElementById('videoVol').value/100;}
function playSfx(t){let a=new Audio(); a.src=t==='boom'?'https://actions.google.com/sounds/v1/impacts/metal_thud_and_fall.ogg':'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'; a.play();}
function updateText(){let el=document.getElementById('overlayText'); el.innerText=document.getElementById('textInput').value; el.style.fontFamily=document.getElementById('fontSel').value; el.style.color=document.getElementById('colorSel').value; el.style.top=document.getElementById('posSel').value;}
function clearText(){document.getElementById('overlayText').innerText=''; document.getElementById('textInput').value=''; karaokeOn=false; clearInterval(karaokeTimer);}
function toggleKaraoke(){karaokeOn=!karaokeOn; if(karaokeOn){let txt=document.getElementById('textInput').value||'VEXA SPINGE'; let words=txt.split(' '); let i=0; karaokeTimer=setInterval(()=>{document.getElementById('overlayText').innerText=words.slice(0,i+1).join(' '); i++; if(i>=words.length) i=0;},500);} else {karaokeOn=false; clearInterval(karaokeTimer);}}
function addSubtitle(){let t=prompt('Scrivi sottotitolo:'); if(t){document.getElementById('textInput').value=t; updateText();}}
function addSticker(e){document.getElementById('stickerLayer').innerText=e; setTimeout(()=>document.getElementById('stickerLayer').innerText='',3000);}
// --- BARRE TRASCINABILI VEXA ---
let volBar = document.getElementById('volBar');
let videoBar = document.getElementById('videoBar');

function makeDraggable(track, fill, handle, onMove){
  let dragging = false;
  function move(e){
    let rect = track.getBoundingClientRect();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    fill.style.width = (pct*100)+'%';
    handle.style.left = `calc(${pct*100}% - 7px)`;
    onMove(pct);
  }
  track.addEventListener('pointerdown', e=>{dragging=true; track.setPointerCapture(e.pointerId); move(e);});
  track.addEventListener('pointermove', e=>{if(dragging) move(e);});
  track.addEventListener('pointerup', ()=> dragging=false);
}

if(volBar){
  let vFill = document.getElementById('volFill');
  let vHandle = document.getElementById('volHandle');
  let vText = document.getElementById('volText');
  makeDraggable(volBar, vFill, vHandle, (pct)=>{
    music.volume = pct;
    video.volume = pct;
    vText.innerText = Math.round(pct*100)+'% ' + (pct===0 ? '🔇 MUTED' : pct<0.5 ? '🔉 BASSO' : '🔊 ALTO');
    if(pct===0) vFill.style.background='#ef4444';
    else vFill.style.background='#22c55e';
  });
}

if(videoBar){
  let vidFill = document.getElementById('videoFill');
  let vidHandle = document.getElementById('videoHandle');
  let vidText = document.getElementById('videoText');
  makeDraggable(videoBar, vidFill, vidHandle, (pct)=>{
    if(video.duration){ video.currentTime = pct * video.duration; vidText.innerText = video.currentTime.toFixed(1)+'s / '+video.duration.toFixed(1)+'s'; }
  });
  // Quando il video va avanti, la barra si muove da sola
  video.addEventListener('timeupdate', ()=>{
    if(video.duration && !videoBar.matches(':active')){
      let pct = video.currentTime / video.duration;
      vidFill.style.width = (pct*100)+'%';
      vidHandle.style.left = `calc(${pct*100}% - 7px)`;
      if(vidText) vidText.innerText = video.currentTime.toFixed(1)+'s / '+video.duration.toFixed(1)+'s';
    }
  });
}
