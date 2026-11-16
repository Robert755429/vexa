let video=document.getElementById('video');
let clips=[], history=[], future=[], rot=0, mirrored=false;
document.getElementById('videoInput').onchange=e=>{video.src=URL.createObjectURL(e.target.files[0]); video.play(); clips=[{start:0,end:0,name:'Video intero'}]; renderClips();};
function save(){history.push(JSON.stringify(clips)); future=[];}
function undo(){if(!history.length)return; future.push(JSON.stringify(clips)); clips=JSON.parse(history.pop()); renderClips();}
function redo(){if(!future.length)return; history.push(JSON.stringify(clips)); clips=JSON.parse(future.pop()); renderClips();}
function splitClip(){save(); let t=video.currentTime; clips.push({start:t,end:t+3,name:'Clip '+(clips.length+1)+' - '+t.toFixed(1)+'s'}); renderClips(); alert('Tagliato a '+t.toFixed(1)+'s! Premi la clip per vederla');}
function renderClips(){let c=document.getElementById('clips'); c.innerHTML=''; clips.forEach((cl,i)=>{let d=document.createElement('div'); d.className='clip'; d.innerHTML=cl.name+' <span onclick="event.stopPropagation();deleteClip('+i+')">❌</span>'; d.onclick=()=>{video.currentTime=cl.start; video.play(); document.querySelectorAll('.clip').forEach(x=>x.classList.remove('active')); d.classList.add('active'); setTimeout(()=>video.pause(),3000)}; c.appendChild(d);});}
function deleteClip(i){save(); clips.splice(i,1); renderClips();}
function duplicateClip(){save(); if(clips.length) clips.push({...clips[clips.length-1],name:'Copia'}); renderClips();}
function overwriteClip(){save(); if(!clips.length) return alert('Prima dividi!'); let t=video.currentTime; clips[clips.length-1]={start:t,end:t+3,name:'Clip sovrascritta - '+t.toFixed(1)+'s'}; renderClips(); alert('Sovrascritta! ✅');}
function clearAll(){save(); clips=[]; renderClips(); stopMusic(); video.pause(); video.src='';}
function setSpeed(){video.playbackRate=parseFloat(document.getElementById('speed').value);}
function setFilter(){video.style.filter=document.getElementById('filter').value;}
function rotateVideo(){rot+=90; video.style.transform=`rotate(${rot}deg) scaleX(${mirrored?-1:1})`;}
function mirrorVideo(){mirrored=!mirrored; video.style.transform=`rotate(${rot}deg) scaleX(${mirrored?-1:1})`;}
