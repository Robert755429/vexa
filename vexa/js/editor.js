let clips = [];
let history = [];
let future = [];

function save(){
  history.push(JSON.stringify(clips));
  future = [];
}
function undo(){
  if(!history.length) return;
  future.push(JSON.stringify(clips));
  clips = JSON.parse(history.pop());
  renderClips();
}
function redo(){
  if(!future.length) return;
  history.push(JSON.stringify(clips));
  clips = JSON.parse(future.pop());
  renderClips();
}
function splitClip(){
  let video = document.getElementById('video');
  save();
  let t = video.currentTime;
  clips.push({start: t, name: 'Clip ' + (clips.length+1) + ' - ' + t.toFixed(1) + 's'});
  renderClips();
}
function renderClips(){
  let c = document.getElementById('clips');
  if(!c) return;
  c.innerHTML = '';
  clips.forEach((cl,i)=>{
    let d = document.createElement('div');
    d.className = 'clip';
    d.innerHTML = cl.name + ' <span onclick="event.stopPropagation();deleteClip('+i+')">❌</span>';
    d.onclick = ()=>{
      let video = document.getElementById('video');
      video.currentTime = cl.start;
      video.play();
    };
    c.appendChild(d);
  });
}
function deleteClip(i){
  save();
  clips.splice(i,1);
  renderClips();
}
function duplicateClip(){
  save();
  if(clips.length) clips.push({...clips[clips.length-1], name: 'Copia'});
  renderClips();
}
function clearAll(){
  clips = [];
  renderClips();
  let video = document.getElementById('video');
  video.pause();
  video.src = '';
}
