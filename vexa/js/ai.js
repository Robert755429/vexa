function askAI(){let q=document.getElementById('aiInput').value.toLowerCase(); let out=document.getElementById('aiOut');
if(q.includes('virale')) out.innerText='💡 Virale: hook 1s, testo grande, musica alta, taglio ogni 1.5s, filtro Vivido + 1.5x!';
else if(q.includes('musica')) out.innerText='🎵 Carica MP3, PLAY per sentire, STOP per fermarla. Loop è OFF di default.';
else out.innerText='✨ VEXA: dividi il video, aggiungi testo TikTok Bold e filtro Vivido. Poi ESPORTA!';}
async function exportVideo(){
if(!video.src) return alert('Carica prima un video!');
alert('Esporto 5s... tieni aperta la pagina!');
try{let stream=video.captureStream(); let rec=new MediaRecorder(stream,{mimeType:'video/webm'}); let chunks=[];
rec.ondataavailable=e=>chunks.push(e.data); rec.onstop=()=>{let blob=new Blob(chunks,{type:'video/webm'}); let a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='vexa-video.webm'; a.click(); alert('Esportato! ✅');};
video.currentTime=0; video.play(); if(music.src) music.play(); rec.start(); setTimeout(()=>{rec.stop(); video.pause(); stopMusic();},5000);
}catch(e){alert('Export non supportato su questo telefono, prova Chrome.');}}
