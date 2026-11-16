// main.js - sidebar, sheet, chiudi toccando fuori
function toggleSidebar(o){ document.getElementById('sidebar').classList.toggle('open',o); document.getElementById('overlay').classList.toggle('show',o); }
function closeAll(){ toggleSidebar(false); document.getElementById('sheet').classList.remove('show'); document.getElementById('overlay').classList.remove('show'); }
function openSheet(type){
  let t=document.getElementById('sheetTitle'), c=document.getElementById('sheetContent');
  toggleSidebar(false); document.getElementById('sheet').classList.add('show'); document.getElementById('overlay').classList.add('show');
  if(type==='testo'){ t.innerText='🔤 Testo che scorre'; c.innerHTML=`<input id="txt" placeholder="Scrivi..."><label><input type="checkbox" id="scrollChk" checked> Fai scorrere il testo</label><button onclick="applyText()">Applica Testo</button>`; }
  if(type==='musica'){ t.innerText='🎵 Musica'; c.innerHTML=`<button onclick="document.getElementById('musicInput').click()">Carica MP3</button><input type="range" min="0" max="1" step="0.1" value="0.5" oninput="audio.volume=this.value">`; }
  if(type==='velocita'){ t.innerText='⏩ Velocità'; c.innerHTML=`<button onclick="setSpeed(0.5);closeAll()">0.5x Slow</button><button onclick="setSpeed(1);closeAll()">1x Normale</button><button onclick="setSpeed(2);closeAll()">2x Veloce</button>`; }
  if(type==='filtri'){ t.innerText='🎨 Filtri'; c.innerHTML=`<button onclick="setFilter('none');closeAll()">Originale</button><button onclick="setFilter('grayscale(1)');closeAll()">B/N</button><button onclick="setFilter('contrast(1.4) saturate(1.5)');closeAll()">Vivid</button>`; }
  if(type==='formato'){ t.innerText='📐 Formato'; c.innerHTML=`<button onclick="video.style.aspectRatio='9/16';closeAll()">📱 9:16 TikTok</button><button onclick="video.style.aspectRatio='16/9';closeAll()">↔️ 16:9 YouTube</button>`; }
  if(type==='ai'){ t.innerText='🤖 VEXA AI'; c.innerHTML=`<p>La tua AI di editing.</p><button onclick="aiSuggest()">✨ Dammi un'idea</button><p style="margin-top:10px">${document.getElementById('aiText').innerText}</p>`; }
  if(type==='privacy'){ t.innerText='Privacy'; c.innerHTML=`<p>I tuoi video non lasciano mai il tuo telefono.</p>`; }
  if(type==='cookie'){ t.innerText='Cookie'; c.innerHTML=`<p>Solo cookie tecnici.</p>`; }
  if(type==='licenze'){ t.innerText='Licenze'; c.innerHTML=`<p>I contenuti che carichi sono tuoi.</p>`; }
  if(type==='faq'){ t.innerText='FAQ'; c.innerHTML=`<p><b>Cos'è VEXA?</b> Editor gratis stile CapCut.<br><b>Devo pagare?</b> No.<br><b>Dove vanno i video?</b> Restano sul tuo telefono.</p>`; }
}
