// testo.js - testo che scorre
function applyText(){
  let txt=document.getElementById('txt').value;
  let scroll=document.getElementById('scrollChk').checked;
  let o=document.getElementById('textOverlay');
  o.innerText=txt; o.classList.toggle('scroll',scroll);
  closeAll();
}
