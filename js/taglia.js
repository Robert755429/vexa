// taglia.js - DIVIDI / ELIMINA / TIENI / MANIGLIE
function renderClips(){
  let el = document.getElementById('thumbs');
  el.innerHTML = clips.map((c,i)=>`<div class="thumb ${i===sel?'sel':''} ${c.deleted?'del':''}" onclick="selectClip(${i})">PEZZO ${i+1}<br>${fmt(c.start)}-${fmt(c.end)}</div>`).join('');
  if(clips.length) document.getElementById('clipLabel').innerText = `Hai ${clips.length} pezzi. Selezionato PEZZO ${sel+1}: ${fmt(clips[sel].start)} - ${fmt(clips[sel].end)}`;
}
function selectClip(i){ sel=i; video.currentTime=clips[i].start; renderClips(); }
function splitAtPlayhead(){
  if(!clips.length) return alert('Carica prima un video');
  let t=video.currentTime;
  let idx=clips.findIndex(c=>t>c.start+0.3 && t<c.end-0.3);
  if(idx===-1) return alert('Spostati al centro del pezzo');
  let c=clips[idx];
  clips.splice(idx,1,{start:c.start,end:t,deleted:c.deleted},{start:t,end:c.end,deleted:false});
  sel=idx+1; renderClips(); video.pause();
}
function deleteSelected(){ if(!clips.length) return; clips[sel].deleted=true; renderClips(); }
function keepSelected(){ if(!clips.length) return; clips[sel].deleted=false; renderClips(); }

// Maniglie verdi - trascina per tagliare
let dragging=null;
document.getElementById('hLeft').addEventListener('pointerdown',e=>{dragging='left'; e.target.setPointerCapture(e.pointerId)});
document.getElementById('hRight').addEventListener('pointerdown',e=>{dragging='right'; e.target.setPointerCapture(e.pointerId)});
window.addEventListener('pointermove',e=>{
  if(!dragging||!duration) return;
  let wrap=document.getElementById('waveWrap').getBoundingClientRect();
  let p=Math.max(0,Math.min(1,(e.clientX-wrap.left)/wrap.width));
  let t=p*duration;
  if(dragging==='left'){ startTrim=Math.min(t,endTrim-0.5); video.currentTime=startTrim; document.getElementById('hLeft').style.left=(startTrim/duration*100)+'%'; }
  else { endTrim=Math.max(t,startTrim+0.5); document.getElementById('hRight').style.right=((1-endTrim/duration)*100)+'%'; }
});
window.addEventListener('pointerup',()=>{dragging=null});
