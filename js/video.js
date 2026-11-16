// video.js - importa, play, onda
let video = document.getElementById('preview');
let clips = [], sel = 0, duration = 0, startTrim = 0, endTrim = 0;

document.getElementById('fileInput').addEventListener('change', (e) => {
  let f = e.target.files[0]; if (!f) return;
  video.src = URL.createObjectURL(f);
  video.onloadedmetadata = () => {
    duration = video.duration; startTrim = 0; endTrim = duration;
    clips = [{ start: 0, end: duration, deleted: false }]; sel = 0;
    renderClips(); drawWave();
    document.getElementById('aiText').innerText = 'Video caricato: ' + f.name + ' - ' + Math.round(duration) + 's. Premi VEXA AI!';
    document.getElementById('clipLabel').innerText = 'Video: ' + f.name + ' - ' + Math.round(duration) + 's';
  };
});

function playPause(){ video.paused ? video.play() : video.pause(); }
function fmt(s){ return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'); }
function drawWave(){
  let c = document.getElementById('wave'), ctx = c.getContext('2d');
  c.width = c.offsetWidth*2; c.height = c.offsetHeight*2;
  ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle='#00e676';
  for(let x=0;x<c.width;x+=8){ let h=Math.random()*c.height*0.8+10; ctx.fillRect(x,c.height/2-h/2,4,h); }
}
video.ontimeupdate = () => {
  if(!duration) return;
  document.getElementById('playhead').style.left = (video.currentTime/duration*100)+'%';
  if(video.currentTime >= endTrim) video.pause();
  let cur = clips.find(c=>video.currentTime>=c.start && video.currentTime<c.end);
  if(cur && cur.deleted){
    let next = clips.find(c=>c.start>=cur.end && !c.deleted);
    if(next) video.currentTime = next.start; else video.pause();
  }
};
function exportVideo(){
  if(!clips.length) return alert('Carica prima un video');
  let kept = clips.filter(c=>!c.deleted);
  alert('VEXA - Tieni '+kept.length+' pezzi. Export MP4 vero nella V5!');
  if(kept.length){ video.currentTime=kept[0].start; video.play(); }
}
