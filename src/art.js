import gtaVi from './content/gta-vi.json';
import wowForever from './content/wow-forever.json';
import fakerWorlds from './content/faker-worlds-2026.json';
import runescape from './content/runescape-gold-rush.json';
import halloween from './content/halloween-gamers-dilemma.json';
import minecraftCoach from './content/minecraft-coach-tomlin.json';
import militaryGaming from './content/military-gaming.json';
import gamersGolf from './content/gamers-n-golf.json';

const exhibitContent = [
  [gtaVi.title,'GAMES · 01',gtaVi.paragraphs[0],'#d6a36f','#494070'],
  [fakerWorlds.title,'ESPORTS · 02',fakerWorlds.paragraphs[0],'#b9d7b0','#164743'],
  [halloween.title,'LIFE · 03',halloween.paragraphs[0],'#d3a9ed','#31275a'],
  [militaryGaming.title,'GAMES · 04',militaryGaming.paragraphs[0],'#c3d6ed','#344c73'],
  [wowForever.title,'GAMES · 05',wowForever.paragraphs[0],'#b6b5fb','#42418a'],
  [runescape.title,'GAMES · 06',runescape.preview,'#f3be8c','#8a4152'],
  [minecraftCoach.title,'GAMES · 07',minecraftCoach.paragraphs[0],'#9ddcdb','#234855'],
  [gamersGolf.title,'GAMES · 08',gamersGolf.paragraphs[0],'#dcb3ed','#5b3675']
].map(([title,category,description,light,dark],i)=>{
 const content=i===0?gtaVi:i===1?fakerWorlds:i===2?halloween:i===3?militaryGaming:i===4?wowForever:i===5?runescape:i===6?minecraftCoach:i===7?gamersGolf:null;
 return {title,category,description,light,dark,index:i,
  cover:i===0?'covers/Official_Cover_Art_portrait.webp':i===1?'covers/Faker_portrait_in_Worlds_26_artwork.webp':i===4?'covers/Dramatic_god_rays_across_the_Warcraft_poster.webp':i===5?'covers/venez_Page_1.png':i===2?'covers/halloween_comic_whatever_fixed.webp':i===6?'covers/Minecraft_Coach_Tomlin.webp':i===3?'covers/Military_branches_and_iconic_gaming_logos.webp':i===7?'covers/Golfers_and_operators_above_the_city.webp':null,
  coverAspect:i===0?1080/1920:i===1?1024/1536:i===2?706/1024:i===3?1024/1536:i===4?706/1412:i===5?832/1206:i===6?1024/1536:i===7?1024/1536:null,
  paragraphs:content?.paragraphs??null,formattedParagraphs:content?.formattedParagraphs??null,
  subtitle:content?.subtitle??'',byline:content?.byline??'',preview:content?.preview??''};
});

// Read across each pair from the entrance, while keeping every story in place.
export const articles=[0,4,1,5,2,6,3,7].map((slot,index)=>({
 ...exhibitContent[slot],index,artSeed:slot,
 category:exhibitContent[slot].category.replace(/\d{2}$/,String(index+1).padStart(2,'0'))
}));

// Original, seeded canvas studies: no external image requests or missing assets.
export function paintWorld(item) {
 const c=document.createElement('canvas');c.width=720;c.height=1100;const g=c.getContext('2d');
 const artSeed=item.artSeed??item.index;
 let seed=artSeed*999+731;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
 const sky=g.createLinearGradient(0,0,0,1100);sky.addColorStop(0,item.dark);sky.addColorStop(.5,item.light);sky.addColorStop(1,'#151326');g.fillStyle=sky;g.fillRect(0,0,720,1100);
 for(let i=0;i<170;i++){g.fillStyle=`rgba(255,241,218,${rand()*.7})`;g.beginPath();g.arc(rand()*720,rand()*650,rand()*1.4+.3,0,Math.PI*2);g.fill()}
 const halo=g.createRadialGradient(430,290,10,430,290,330);halo.addColorStop(0,item.light+'cc');halo.addColorStop(1,item.light+'00');g.fillStyle=halo;g.fillRect(0,0,720,800);
 g.fillStyle='#fff0d4';g.beginPath();g.arc(430,270,artSeed===2?70:38,0,Math.PI*2);g.fill();
 for(let layer=0;layer<7;layer++){const base=450+layer*85;g.beginPath();g.moveTo(0,1100);for(let x=0;x<=750;x+=22){const y=base-Math.sin(x*.009+layer*2)*90-rand()*(100-layer*8);g.lineTo(x,y)}g.lineTo(720,1100);g.closePath();g.fillStyle=['#8d829a','#73768c','#595c79','#43465f','#313648','#252938','#171c29'][layer];g.globalAlpha=.65+layer*.05;g.fill()}g.globalAlpha=1;
 const cx=350+(artSeed%3-1)*85,cy=540;
 if(artSeed===1){for(let i=0;i<15;i++){let x=rand()*720,y=440+rand()*350;tree(x,y,90+rand()*180)}}else{
 for(let i=0;i<17;i++){let x=cx+(rand()-.5)*220,y=cy+rand()*100,w=12+rand()*27,h=40+rand()*140;g.fillStyle=i%2?'#302b46':'#42364f';g.fillRect(x,y-h,w,h+90);g.beginPath();g.moveTo(x-4,y-h);g.lineTo(x+w/2,y-h-30-rand()*30);g.lineTo(x+w+4,y-h);g.fill();for(let j=0;j<5;j++){g.fillStyle='#f4cb92';g.globalAlpha=.5+rand()*.5;g.fillRect(x+w/2-1,y-h+14+j*19,2,5);g.globalAlpha=1}}
 }
 // Light spilling through the valley.
 g.beginPath();g.moveTo(cx,650);g.bezierCurveTo(cx-80,800,cx+130,900,490,1100);g.lineTo(330,1100);g.bezierCurveTo(cx+50,900,cx-105,800,cx,650);g.fillStyle=item.light+'55';g.fill();
 function tree(x,y,h){g.fillStyle='#152d32';g.fillRect(x-3,y-h,6,h);for(let j=0;j<8;j++){let ty=y-h+j*h/9;g.beginPath();g.moveTo(x,ty-25);g.lineTo(x-15-j*7,ty+45);g.lineTo(x+15+j*7,ty+45);g.fill()}}
 for(let i=0;i<21;i++)tree(rand()*800-40,900+rand()*250,70+rand()*230);
 for(let i=0;i<9000;i++){g.fillStyle=rand()>.5?'#ffffff08':'#00000008';g.fillRect(rand()*720,rand()*1100,1+rand()*3,1+rand()*3)}
 const vignette=g.createRadialGradient(360,520,200,360,520,680);vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,'#080814b0');g.fillStyle=vignette;g.fillRect(0,0,720,1100);
 g.strokeStyle='#e4c89870';g.lineWidth=1;g.strokeRect(22,22,676,1056);g.fillStyle='#f2d9ac';g.textAlign='center';g.font='20px "Segoe UI", Arial, sans-serif';g.fillText('E X A L T E D   /   V O L U M E   I',360,61);g.font='600 34px "Segoe UI", Arial, sans-serif';g.fillText(item.title,360,1018,640);g.font='18px "Segoe UI", Arial, sans-serif';g.fillText(item.category.split(' · ')[0]+'   —   '+String(item.index+1).padStart(2,'0'),360,1050);
 item.image=c.toDataURL('image/webp',.9);return c;
}
