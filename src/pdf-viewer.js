export function createPdfViewer({url,onOpen,onClose,scene}){
 const dialog=document.createElement('dialog');dialog.id='pdf-viewer';dialog.setAttribute('aria-label','RuneScape PDF article');
 const reader=document.createElement('div');reader.id='article-pdf';reader.tabIndex=0;reader.setAttribute('aria-label','PDF pages');
 const footer=document.createElement('div');footer.className='pdf-viewer-footer';
 const count=document.createElement('span');count.className='pdf-page-count';count.setAttribute('aria-live','polite');
 const previous=document.createElement('button');previous.id='pdf-previous-page';previous.type='button';previous.textContent='Previous';previous.setAttribute('aria-label','Previous page');previous.hidden=true;
 const next=document.createElement('button');next.id='pdf-next-page';next.type='button';next.textContent='Next page';next.hidden=true;
 const zoom=document.createElement('button');zoom.id='pdf-zoom';zoom.type='button';zoom.disabled=true;zoom.setAttribute('aria-pressed','false');zoom.setAttribute('aria-label','Zoom in');zoom.title='Zoom in';
 zoom.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5M7 10h6"/><path class="pdf-zoom-plus" d="M10 7v6"/></svg>';
 const left=document.createElement('div'),info=document.createElement('div'),right=document.createElement('div');info.className='pdf-page-info';right.className='pdf-next-slot';
 left.append(previous);info.append(count,zoom);right.append(next);footer.append(left,info,right);dialog.append(reader,footer);document.body.append(dialog);
 let pdfPromise=null,pdf=null,renderTask=null,generation=0,pages=[],currentPage=1;
 function syncPage(){
  if(!pages.length)return;
  let closest=0;
  for(let index=1;index<pages.length;index++)if(Math.abs(pages[index].offsetTop-reader.scrollTop)<Math.abs(pages[closest].offsetTop-reader.scrollTop))closest=index;
  currentPage=closest+1;count.textContent=`${currentPage} / ${pdf.numPages}`;previous.hidden=currentPage<=1;next.hidden=currentPage>=pdf.numPages;
 }
 reader.addEventListener('scroll',syncPage,{passive:true});
 function turnPage(direction){
  const target=pages[currentPage-1+direction];if(!target)return;
  reader.scrollTo({top:target.offsetTop,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 }
 previous.onclick=()=>turnPage(-1);next.onclick=()=>turnPage(1);
 async function renderCanvas(page,width){
  const pixelRatio=Math.min(window.devicePixelRatio||1,2);
  const viewport=page.getViewport({scale:width/page.getViewport({scale:1}).width*pixelRatio});
  const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.setAttribute('aria-label',`PDF page ${page.pageNumber}`);
  renderTask=page.render({canvas,viewport});await renderTask.promise;renderTask=null;
  return canvas;
 }
 zoom.onclick=async()=>{
  if(!pages.length)return;
  const token=generation,index=currentPage-1,anchor=pages[index];
  const progress=(reader.scrollTop-anchor.offsetTop)/anchor.offsetHeight;
  const enlarged=dialog.classList.toggle('is-zoomed');
  zoom.setAttribute('aria-pressed',String(enlarged));zoom.setAttribute('aria-label',enlarged?'Zoom out':'Zoom in');zoom.title=enlarged?'Zoom out':'Zoom in';
  reader.scrollTop=anchor.offsetTop+progress*anchor.offsetHeight;syncPage();zoom.disabled=true;
  try{
   for(let number=1;number<=pages.length;number++){
    if(token!==generation||!dialog.open)return;
    const section=pages[number-1],width=reader.clientWidth;
    if(section.firstElementChild.width>=width*Math.min(window.devicePixelRatio||1,2))continue;
    const page=await pdf.getPage(number);
    if(token!==generation||!dialog.open)return;
    const canvas=await renderCanvas(page,width);
    if(token!==generation||!dialog.open)return;
    section.replaceChildren(canvas);
   }
  }catch(error){if(token===generation&&error.name!=='RenderingCancelledException')console.warn('PDF zoom rendering unavailable',error)}
  finally{if(token===generation)zoom.disabled=false}
 };
 async function renderDocument(token){
  if(!pdfPromise)pdfPromise=(async()=>{
   const [library,worker]=await Promise.all([import('pdfjs-dist'),import('pdfjs-dist/build/pdf.worker.min.mjs?url')]);
   library.GlobalWorkerOptions.workerSrc=worker.default;
   return library.getDocument({url:new URL(url,document.baseURI).href,useWasm:false,useSystemFonts:true}).promise;
  })().catch(error=>{pdfPromise=null;throw error});
  pdf=await pdfPromise;if(token!==generation||!dialog.open)return;
  const firstPage=await pdf.getPage(1),firstViewport=firstPage.getViewport({scale:1});
  dialog.style.setProperty('--pdf-page-ratio',String(firstViewport.width/firstViewport.height));
  count.textContent=`1 / ${pdf.numPages}`;next.hidden=pdf.numPages<=1;
  const width=reader.clientWidth;
  for(let number=1;number<=pdf.numPages;number++){
   if(token!==generation||!dialog.open)return;
   const page=number===1?firstPage:await pdf.getPage(number);
   if(token!==generation||!dialog.open)return;
   const canvas=await renderCanvas(page,width);
   if(token!==generation||!dialog.open)return;
   const section=document.createElement('div');section.className='pdf-page';section.dataset.page=String(number);section.append(canvas);
   if(number===1)reader.replaceChildren();reader.append(section);pages.push(section);
  }
  previous.disabled=false;next.disabled=false;zoom.disabled=false;syncPage();
 }
 let pressedOutside=false;
 const outside=event=>{const rect=dialog.getBoundingClientRect();return event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom};
 dialog.addEventListener('pointerdown',event=>{pressedOutside=event.button===0&&event.target===dialog&&outside(event)});
 dialog.addEventListener('click',event=>{if(pressedOutside&&event.target===dialog&&outside(event))dialog.close();pressedOutside=false});
 dialog.addEventListener('close',()=>{generation++;renderTask?.cancel();renderTask=null;pages=[];reader.replaceChildren();onClose()});
 scene.onDisposeObservable.add(()=>{generation++;renderTask?.cancel();pdfPromise?.then(document=>document.destroy()).catch(()=>{});dialog.remove()});
 return {dialog,async open(){
  if(dialog.open)return;onOpen();pages=[];currentPage=1;previous.hidden=true;previous.disabled=true;next.hidden=true;next.disabled=true;zoom.disabled=true;zoom.hidden=false;zoom.setAttribute('aria-pressed','false');zoom.setAttribute('aria-label','Zoom in');zoom.title='Zoom in';dialog.classList.remove('is-zoomed');count.textContent='Loading PDF…';reader.textContent='Loading PDF…';dialog.showModal();reader.scrollTop=0;
  const token=++generation;
  try{await renderDocument(token)}catch(error){if(token!==generation||error.name==='RenderingCancelledException')return;console.error('PDF could not be loaded',error);reader.textContent='Could not load the PDF. Close this window and try again.';count.textContent='';previous.hidden=true;next.hidden=true;zoom.hidden=true}
 }};
}
