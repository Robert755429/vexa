let video=document.getElementById('video');
let music=document.getElementById('music');
let clips=[],history=[],future=[],rot=0,mirrored=false,karaokeTimer=null;
function toggleMenu(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlayMenu').classList.toggle('show');
}
function showSection(n){
  ['video','audio','testo','effetti','ai'].forEach(x=>{
    let el=document.getElementById('sec-'+x);
    if(el) el.style.display=(x===n?'block':'none');
  });
  document.querySelectorAll('.sidebar button').forEach(b=>b.classList.remove('active'));
}
function togglePlay(){ if(video.paused) video.play(); else video.pause(); }
document.getElementById('videoInput').onchange=e=>{video.src=URL.createObjectURL(e.target.files[0]);video.play();clips=[{start:0,name:'Video intero'}];renderClips();};
document.getElementById('musicInput').onchange=e=>{music.src=URL.createObjectURL(e.target.files[0]);music.loop=false;alert('Musica caricata!');};
function save(){history.push(JSON.stringify(clips));future=[];}
function undo(){if(!history.length)return;future.push(JSON.stringify(clips));clips=JSON.parse(history.pop());renderClips();}
function redo(){if(!future.length)return;history.push(JSON.stringify(clips));clips=JSON.parse(future.pop());renderClips();}
function splitClip(){save();let t=video.currentTime;clips.push({start:t,name:'Clip '+(clips.length+1)+' - '+t.toFixed(1)+'s'});renderClips();alert('Tagliato a '+t.toFixed(1)+'s');}
function renderClips(){let c=document.getElementById('clips');c.innerHTML='';clips.forEach((cl,i)=>{let d=document.createElement('div');d.className='clip';d.innerHTML=cl.name+' <span onclick="event.stopPropagation();deleteClip('+i+')">❌</span>';d.onclick=()=>{video.currentTime=cl.start;video.play();};c.appendChild(d);});}
function deleteClip(i){save();clips.splice(i,1);renderClips();}
function duplicateClip(){save();if(clips.length)clips.push({...clips[clips.length-1],name:'Copia'});renderClips();}
function overwriteClip(){save();if(!clips.length)return alert('Prima dividi!');let t=video.currentTime;clips[clips.length-1]={start:t,name:'Sovrascritta - '+t.toFixed(1)+'s'};renderClips();}
function clearAll(){clips=[];renderClips();stopMusic();video.pause();video.src='';}
function setSpeed(){video.playbackRate=parseFloat(document.getElementById('speed').value);}
function setFilter(){video.style.filter=document.getElementById('filter').value;}
function rotateVideo(){rot+=90;video.style.transform=`rotate(${rot}deg) scaleX(${mirrored?-1:1})`;}
function mirrorVideo(){mirrored=!mirrored;video.style.transform=`rotate(${rot}deg) scaleX(${mirrored?-1:1})`;}
function playMusic(){if(!music.src)return alert('Carica prima una musica!');music.play();}
function stopMusic(){music.pause();music.currentTime=0;}
function toggleLoop(){music.loop=!music.loop;document.getElementById('loopTxt').innerText=music.loop?'ON':'OFF';}
function updateText(){let el=document.getElementById('overlayText');el.innerText=document.getElementById('textInput').value;el.style.fontFamily=document.getElementById('fontSel').value;el.style.color=document.getElementById('colorSel').value;el.style.top=document.getElementById('posSel').value;}
function clearText(){document.getElementById('overlayText').innerText='';document.getElementById('textInput').value='';clearInterval(karaokeTimer);}
function toggleKaraoke(){let txt=document.getElementById('textInput').value||'VEXA SPINGE';let words=txt.split(' ');let i=0;clearInterval(karaokeTimer);karaokeTimer=setInterval(()=>{document.getElementById('overlayText').innerText=words.slice(0,i+1).join(' ');i++;if(i>=words.length)i=0;},500);}
function addSticker(e){document.getElementById('stickerLayer').innerText=e;setTimeout(()=>document.getElementById('stickerLayer').innerText='',3000);}
function askAI(){let q=document.getElementById('aiInput').value.toLowerCase();let out=document.getElementById('aiOut');if(q.includes('virale'))out.innerText='🤖 VEXA AI: Dividi a metà e cancella la parte dove non succede niente';else out.innerText='🤖 VEXA AI: Dividi a metà e cancella la parte dove non succede niente. Hook 1s + testo grande!';}
function exportVideo(){if(!video.src)return alert('Carica prima un video!');alert('Esporto 5s...');try{let s=video.captureStream();let r=new MediaRecorder(s,{mimeType:'video/webm'});let ch=[];r.ondataavailable=e=>ch.push(e.data);r.onstop=()=>{let b=new Blob(ch,{type:'video/webm'});let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='vexa-video.webm';a.click();};video.currentTime=0;video.play();r.start();setTimeout(()=>{r.stop();video.pause();},5000);}catch(e){alert('Export non supportato, prova Chrome.');}}
function makeDraggable(track,fill,handle,onMove){let dragging=false;function move(e){let rect=track.getBoundingClientRect();let cx=e.touches?e.touches[0].clientX:e.clientX;let pct=(cx-rect.left)/rect.width;pct=Math.max(0,Math.min(1,pct));fill.style.width=(pct*100)+'%';handle.style.left=`calc(${pct*100}% - 7px)`;onMove(pct);}track.addEventListener('pointerdown',e=>{dragging=true;track.setPointerCapture(e.pointerId);move(e);});track.addEventListener('pointermove',e=>{if(dragging)move(e);});track.addEventListener('pointerup',()=>dragging=false);}
makeDraggable(document.getElementById('volBar'),document.getElementById('volFill'),document.getElementById('volHandle'),(pct)=>{music.volume=pct;video.volume=pct;document.getElementById('volText').innerText=Math.round(pct*100)+'% '+(pct===0?'🔇 MUTED':'🔊');document.getElementById('volFill').style.background=pct===0?'#ef4444':'#22c55e';});
makeDraggable(document.getElementById('videoBar'),document.getElementById('videoFill'),document.getElementById('videoHandle'),(pct)=>{if(video.duration){video.currentTime=pct*video.duration;}});
video.addEventListener('timeupdate',()=>{if(video.duration){let pct=video.currentTime/video.duration;document.getElementById('videoFill').style.width=(pct*100)+'%';document.getElementById('videoHandle').style.left=`calc(${pct*100}% - 7px)`;document.getElementById('videoText').innerText=video.currentTime.toFixed(1)+'s / '+video.duration.toFixed(1)+'s';}});
video.volume=0.5;music.volume=0.5;
