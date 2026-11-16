// ai.js - VEXA AI vera con Gemini, se hai la chiave. Altrimenti finta gratis.
async function aiSuggest(){
  if(!clips.length) return alert('Carica prima un video');
  let box=document.getElementById('aiText');
  box.innerText='🤖 VEXA AI sta pensando...';

  // Se hai messo la chiave vera -> chiama Gemini
  if(typeof USE_REAL_AI !== 'undefined' && USE_REAL_AI){
    try{
      let prompt = `Sei VEXA AI, assistente editing stile CapCut. Video di ${Math.round(duration)} secondi, ${clips.length} pezzi. Dimmi in italiano, corto e diretto: 1 dove tagliare, 2 che testo che scorre mettere, 3 che musica usare.`;
      let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] })
      });
      let data = await res.json();
      let answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Errore AI';
      box.innerText = '🤖 VEXA AI: ' + answer;
      openSheet('ai');
      return;
    }catch(e){ box.innerText='Errore API, uso AI finta. Controlla la chiave in config.js'; }
  }

  // Altrimenti AI finta gratis - senza API
  let ideas=[
    'Taglia i primi 2 secondi, sono lenti. Inizia con la parte più forte!',
    'Metti un testo che scorre: "GUARDA FINO ALLA FINE"',
    'Metti musica a 0.5 di volume, così si sente la tua voce',
    'Dividi a metà e cancella la parte dove non succede niente'
  ];
  box.innerText='🤖 VEXA AI: '+ideas[Math.floor(Math.random()*ideas.length)];
  openSheet('ai');
}
