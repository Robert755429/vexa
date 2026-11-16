// ai.js - CHAT SALVATA, X chiude ma non cancella
let AI_KEY='vexa_ai_chat_v2';
function getChat(){ try{ return JSON.parse(localStorage.getItem(AI_KEY))||[] }catch(e){ return [] } }
function saveChat(m){ localStorage.setItem(AI_KEY, JSON.stringify(m)) }
function openAIChat(){ document.getElementById('aiChat').classList.add('open'); document.getElementById('sidebar').classList.remove('open'); renderAIChat(); }
function closeAIChat(){ document.getElementById('aiChat').classList.remove('open'); }
function clearAIChat(){ localStorage.removeItem(AI_KEY); renderAIChat(); }
function renderAIChat(){
  let box=document.getElementById('aiMsgs');
  let msgs=getChat();
  if(!msgs.length){ box.innerHTML=`<div class="msg ai">Ciao! Sono VEXA AI 🤖<br><br>Scrivimi cosa vuoi e lo faccio sul video.<br><br>Es: <b>metti testo CIAO + filtro B/N + 2x</b></div>`; return; }
  box.innerHTML=msgs.map(m=>`<div class="msg ${m.who}">${m.text}<small>${m.who==='me'?'Tu':'VEXA AI'}</small></div>`).join('');
  box.scrollTop=box.scrollHeight;
}
function aiAdd(who,text){ let m=getChat(); m.push({who,text}); saveChat(m); renderAIChat(); }
async function aiSend(){
  let inp=document.getElementById('aiInputChat');
  let txt=inp.value.trim(); if(!txt) return;
  inp.value=''; aiAdd('me',txt); aiAdd('ai','🤖 Sto editando...');
  let fatto=aiDoEdit(txt);
  if(fatto){ let m=getChat(); m.pop(); m.push({who:'ai',text:fatto+'\n\nFatto! Dimmi altro 😎'}); saveChat(m); renderAIChat(); return; }
  try{
    let res=await fetch('https://text.pollinations.ai/'+encodeURIComponent("Sei VEXA AI, editor TikTok. Utente: "+txt+". Rispondi in italiano, corto, con consigli pratici, hook, musica, didascalia."));
    let t=await res.text();
    let m=getChat(); m.pop(); m.push({who:'ai',text:t}); saveChat(m); renderAIChat();
  }catch(e){ let m=getChat(); m.pop(); m.push({who:'ai',text:"Prova: metti testo CIAO, filtro B/N, velocità 2x, formato tiktok"}); saveChat(m); renderAIChat(); }
}
function aiQuick(cmd){ document.getElementById('aiInputChat').value=cmd; aiSend(); }
function aiDoEdit(cmd){
  cmd=cmd.toLowerCase(); let fatto=[];
  if(cmd.includes('testo')||cmd.includes('scritta')||cmd.includes('scrivi')){
    let txt=cmd.includes(':')?cmd.split(':')[1].trim():cmd.replace(/metti|testo|scritta|scrivi|scritto|con|di|che|dica|filtro.*|velocit.*|formato.*|tiktok|youtube|instagram|bianco.*|vivid|vintage|originale|2x|0\.5x|1x|veloce|lento|slow/gi,'').trim();
    if(!txt) txt="GUARDA FINO ALLA FINE";
    let el=document.getElementById('overlayText'); el.innerText=txt.toUpperCase(); fatto.push('✅ Testo: '+txt.toUpperCase());
  }
  if(cmd.includes('togli testo')){ document.getElementById('overlayText').innerText=''; fatto.push('✅ Testo tolto'); }
  if(cmd.includes('bianco e nero')||cmd.includes('b/n')){ setFilter('grayscale(1)'); fatto.push('✅ Filtro B/N'); }
  if(cmd.includes('vivid')){ setFilter('contrast(1.4) saturate(1.5)'); fatto.push('✅ Filtro Vivid'); }
  if(cmd.includes('vintage')){ setFilter('sepia(0.6)'); fatto.push('✅ Filtro Vintage'); }
  if(cmd.includes('originale')||cmd.includes('togli filtro')){ setFilter('none'); fatto.push('✅ Filtro Originale'); }
  if(cmd.includes('2x')||cmd.includes('veloce')){ setSpeed(2); fatto.push('✅ Velocità 2x'); }
  else if(cmd.includes('0.5')||cmd.includes('lento')||cmd.includes('slow')){ setSpeed(0.5); fatto.push('✅ Velocità 0.5x'); }
  else if(cmd.includes('1x')||cmd.includes('normale')){ setSpeed(1); fatto.push('✅ Velocità 1x'); }
  if(cmd.includes('tiktok')||cmd.includes('9:16')){ video.style.aspectRatio='9/16'; fatto.push('✅ Formato 9:16 TikTok'); }
  if(cmd.includes('youtube')||cmd.includes('16:9')){ video.style.aspectRatio='16/9'; fatto.push('✅ Formato 16:9'); }
  if(cmd.includes('instagram')||cmd.includes('1:1')){ video.style.aspectRatio='1/1'; fatto.push('✅ Formato 1:1'); }
  if(cmd.includes('musica')||cmd.includes('phonk')){ closeAIChat(); openSheet('musica'); fatto.push('✅ Ho aperto la Musica'); }
  if(cmd.includes('reset')){ setFilter('none'); setSpeed(1); video.style.aspectRatio='9/16'; document.getElementById('overlayText').innerText=''; fatto.push('✅ Reset fatto'); }
  return fatto.length?fatto.join('\n'):null;
}
