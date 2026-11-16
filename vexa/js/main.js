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
