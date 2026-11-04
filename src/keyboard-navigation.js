import * as B from 'babylonjs';

const movementKeys=new Map([
 ['KeyW',87],['KeyA',65],['KeyS',83],['KeyD',68],
 ['ArrowUp',38],['ArrowLeft',37],['ArrowDown',40],['ArrowRight',39]
]);

// Deliver physical navigation keys independently of canvas focus and Babylon's
// device-source keyboard routing. Keep Babylon's camera movement and inertia.
export function createKeyboardNavigation({scene,camera,canvas,onNavigate}){
 const held=new Map();
 const walkingSpeed=camera.speed;
 const setRunning=running=>{camera.speed=walkingSpeed*(running?2:1)};
 const codeOf=event=>event.code||({w:'KeyW',a:'KeyA',s:'KeyS',d:'KeyD'})[event.key?.toLowerCase()]||event.key;
 const notify=(type,code,key)=>{
  const event=new KeyboardEvent(type,{code,key,keyCode:movementKeys.get(code)});
  scene.onKeyboardObservable.notifyObservers(new B.KeyboardInfo(type==='keydown'?B.KeyboardEventTypes.KEYDOWN:B.KeyboardEventTypes.KEYUP,event));
 };
 const release=code=>{if(held.has(code)){notify('keyup',code,held.get(code));held.delete(code)}};
 const clear=()=>{for(const code of [...held.keys()])release(code);setRunning(false)};
 const blocked=event=>document.querySelector('dialog[open]')||event.target instanceof Element&&event.target.closest('#light-debug,input,textarea,select,[contenteditable]:not([contenteditable="false"])');
 const keydown=event=>{
  if(event.key==='Shift'){
   if(!event.ctrlKey&&!event.altKey&&!event.metaKey&&!blocked(event))setRunning(true);
   return;
  }
  const code=codeOf(event);
  if(!movementKeys.has(code))return;
  if(event.ctrlKey||event.altKey||event.metaKey||event.isComposing||blocked(event)){release(code);if(event.target===canvas)event.stopPropagation();return}
  event.preventDefault();event.stopPropagation();
  onNavigate();
  canvas.focus({preventScroll:true});
  setRunning(event.shiftKey);
  held.set(code,event.key);
  notify('keydown',code,event.key);
 };
 const keyup=event=>{
  if(event.key==='Shift'){setRunning(event.shiftKey&&!blocked(event));return}
  const code=codeOf(event);
  if(!held.has(code))return;
  event.preventDefault();event.stopPropagation();release(code);
 };
 const visibility=()=>{if(document.hidden)clear()};
 document.addEventListener('keydown',keydown,true);
 document.addEventListener('keyup',keyup,true);
 // Use a named listener so scene disposal releases every document subscription.
 const focusin=event=>{if(blocked(event))clear()};
 document.addEventListener('focusin',focusin);
 window.addEventListener('blur',clear);
 document.addEventListener('visibilitychange',visibility);
 scene.onDisposeObservable.add(()=>{
  clear();document.removeEventListener('keydown',keydown,true);document.removeEventListener('keyup',keyup,true);
  document.removeEventListener('focusin',focusin);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',visibility);
 });
 return {clear};
}
