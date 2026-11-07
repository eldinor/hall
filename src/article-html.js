export function createArticleHtml(article){
 const number=String(article.index+1).padStart(2,'0');
 const content=document.createElement('div');content.id=`article-${number}-vitrine-content`;content.className='vitrine-article';
 content.style.cssText='width:1280px;height:839px;display:flex;background:#18141f;color:#f2eee6;font:30px/1.6 Segoe UI,Arial,sans-serif;overflow:hidden';
 const image=document.createElement('img');image.src=import.meta.env.BASE_URL+article.cover;image.alt=article.title;
 image.style.cssText='width:34%;height:100%;object-fit:contain;object-position:left top;flex-shrink:0';
 const copy=document.createElement('div');copy.id=`article-${number}-vitrine-scroll`;copy.className='vitrine-reader';copy.tabIndex=0;copy.setAttribute('aria-label',`Article ${number} reader`);copy.style.cssText='flex:1;min-width:0;min-height:0;height:100%;max-height:100%;overflow-y:auto;overflow-x:hidden;padding:36px 42px;overscroll-behavior:contain;scrollbar-color:#a797bf #25202f';
 const category=document.createElement('p');category.textContent=article.category;category.style.cssText='font-size:22px;letter-spacing:1px;color:#e5cfa8;margin:24px 0 12px';
 const title=document.createElement('h2');title.textContent=article.title;title.style.cssText='font:600 48px/1.15 Segoe UI,Arial,sans-serif;margin:0 0 24px;overflow-wrap:break-word';
 copy.append(category,title);
 for(const key of ['subtitle','byline'])if(article[key]){const p=document.createElement('p');p.textContent=article[key];p.style.cssText=`font-size:26px;line-height:1.5;margin:0 0 20px;color:#dfd4e7;${key==='byline'?'font-weight:600':'font-style:italic'}`;copy.append(p)}
 const text=document.createElement('div'),more=document.createElement('button');more.type='button';more.textContent='Read more';more.setAttribute('aria-expanded','false');more.style.cssText='font:26px Segoe UI,Arial,sans-serif;padding:12px 24px;border:1px solid #d9c39c70;border-radius:5px;background:#282131;color:#e5cfa8;cursor:pointer';
 text.id=`article-${number}-vitrine-body`;more.id=`article-${number}-vitrine-read-more`;
 function render(expanded){
  const paragraphs=article.paragraphs||[article.description];
  text.replaceChildren(...paragraphs.slice(0,expanded?paragraphs.length:1).map((value,index)=>{
   const p=document.createElement('p');p.style.cssText='font-size:30px;line-height:1.6;margin:0 0 24px;color:#dfd4e7';
   const runs=article.formattedParagraphs?.[index]?.runs;
   if(!runs)p.textContent=value;
   else for(const run of runs){let node=document.createTextNode(run.text);if(run.italic){const em=document.createElement('em');em.append(node);node=em}if(run.bold){const strong=document.createElement('strong');strong.append(node);node=strong}p.append(node)}
   return p;
  }));
  more.hidden=expanded||paragraphs.length<=1;more.setAttribute('aria-expanded',String(expanded));
 }
 more.onclick=()=>{render(true);copy.focus({preventScroll:true})};render(false);copy.append(text,more);content.append(image,copy);
 return content;
}
