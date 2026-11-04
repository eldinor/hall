// The Sandbox loading-screen rhythm, driven by the Hall's startup milestones.
let progress=0;
export function nextFrame(){
 return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
}
export async function loadingPhase(text,to){
 progress=Math.max(progress,Math.min(1,to));
 document.querySelector('#boot-phase').textContent=text;
 document.querySelector('#boot-bar').style.width=(progress*100).toFixed(1)+'%';
 document.querySelector('#loading [role="progressbar"]').setAttribute('aria-valuenow',String(Math.round(progress*100)));
 await nextFrame();
}
export async function finishLoading(){
 await loadingPhase('ready',1);
 await new Promise(resolve=>setTimeout(resolve,360));
}
