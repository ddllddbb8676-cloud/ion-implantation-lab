/* Original teaching models. All numeric models and their limits are stated in the book. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), all=s=>[...document.querySelectorAll(s)];
  const num=id=>Number($(id).value), set=(id,s)=>$(id).textContent=s;
  const text=(x,y,s,more='')=>`<text x="${x}" y="${y}" ${more}>${s}</text>`;
  const rect=(x,y,w,h,fill,more='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fill}" ${more}/>`;
  const circle=(x,y,r,fill,more='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${more}/>`;
  const line=(x,y,x2,y2,more='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#a1aec4" ${more}/>`;
  const path=points=>points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const plot=(xmax,ymax,curves,xlabel='깊이 / 임의 단위',ylabel='농도 / 상대 단위')=>{
    const X=x=>55+x/xmax*515, Y=y=>270-y/ymax*215;
    let s=text(55,24,ylabel)+text(570,315,xlabel,'text-anchor="end"');
    for(let i=0;i<=4;i++){const y=ymax*i/4,x=xmax*i/4;s+=line(55,Y(y),570,Y(y),'opacity=".35"')+text(44,Y(y)+5,Number(y.toFixed(2)),'text-anchor="end"')+text(X(x),293,Number(x.toFixed(1)),'text-anchor="middle"');}
    curves.forEach(c=>s+=`<path d="${path(Array.from({length:281},(_,i)=>[X(i*xmax/280),Y(c.fn(i*xmax/280))]))}" fill="none" stroke="${c.color}" stroke-width="3" ${c.dash?'stroke-dasharray="7 5"':''}/>`);
    return s;
  };
  function readout(id,suffix=''){const v=num(id);set(id+'-out',v+suffix);$(id).setAttribute('aria-valuetext',v+suffix);return v;}
  function listen(ids,fn){ids.forEach(id=>$(id).addEventListener('input',fn));fn();}
  function reset(id,values,fn){$(id+'-reset').addEventListener('click',()=>{Object.entries(values).forEach(([k,v])=>$(k).value=v);fn();});}

  function atom(){const z=$('atom-species').value==='B'?5:14, symbol=$('atom-species').value; $('atom-electrons').max=z+2;$('atom-electrons').nextElementSibling.lastElementChild.textContent=String(z+2);const n=readout('atom-electrons'), q=z-n;
    let s='<title>원소는 '+symbol+', 양성자 '+z+'개, 전자 '+n+'개</title>'+circle(190,145,105,'#f1f5ff')+circle(190,145,45,'#11243c')+text(190,141,symbol,'fill="#fff" text-anchor="middle" font-size="27"')+text(190,164,'양성자 '+z,'fill="#fff" text-anchor="middle"');
    for(let i=0;i<n;i++){const a=i*2*Math.PI/Math.max(1,n);s+=circle(190+84*Math.cos(a),145+84*Math.sin(a),11,'#244ed8')+text(190+84*Math.cos(a),150+84*Math.sin(a),'−','fill="#fff" text-anchor="middle"');}
    s+=text(360,86,'양성자 '+z+' × (+e)')+text(360,122,'전자 '+n+' × (−e)')+line(355,141,560,141)+text(360,179,'합계 '+(q>0?'+':'')+q+'e','font-size="24" font-weight="700"')+text(190,287,'배치는 개수 표식 · 궤도 아님','text-anchor="middle"');
    $('atom-chart').innerHTML=s;set('atom-name',symbol);set('atom-count',n+'개');set('atom-charge',(q>0?'+':'')+q+'e');set('atom-observation',q===0?'양성자와 전자 수가 같아 전체 전하는 0입니다.':`전자 ${n}개, 양성자 ${z}개로 ${q>0?'양':'음'}전하가 남습니다. 원소는 ${symbol} 그대로입니다. 실제 이온의 안정성은 이 개수 모형으로 알 수 없습니다.`);
  }
  $('atom-species').addEventListener('input',()=>{const z=$('atom-species').value==='B'?5:14;$('atom-electrons').max=z+2;$('atom-electrons').value=z;atom();});
  $('atom-electrons').addEventListener('input',atom);$('atom-neutral').addEventListener('click',()=>{$('atom-electrons').value=$('atom-species').value==='B'?5:14;atom();});reset('atom',{'atom-species':'B','atom-electrons':5},atom);atom();

  let excited=false,hole=5,moves=0;
  function carrier(){let s='<title>전자 상태와 정공의 이동</title>'+rect(32,46,535,64,'#edf2ff')+rect(32,163,535,82,'#f6f0e9')+text(46,34,'에너지 높음 ↑')+text(46,75,'전도대')+text(46,188,'가전자대')+text(360,138,'밴드갭 · 공간 높이 아님','text-anchor="middle"');
    if(excited)s+=circle(400,78,12,'#244ed8')+text(400,83,'−','fill="#fff" text-anchor="middle"');
    for(let i=0;i<6;i++){const x=225+i*58;const empty=excited&&i===hole;s+=circle(x,212,15,empty?'#fff':'#244ed8',empty?'stroke="#a84310" stroke-width="3" stroke-dasharray="4 2"':'')+text(x,217,empty?'+':'−',`text-anchor="middle" fill="${empty?'#a84310':'#fff'}"`);}
    s+=text(300,279,excited?'전도 전자 1개 · 정공 1개':'표시한 상태의 전자는 가전자대에 있습니다','text-anchor="middle"');$('carrier-chart').innerHTML=s;
    $('carrier-excite').disabled=excited;$('carrier-move').disabled=!excited||hole===0;$('carrier-recombine').disabled=!excited;
    set('carrier-state',excited?`정공 위치 ${hole+1} / 6 · 이웃 전자 이동 ${moves}회`:'캐리어 쌍을 만들어 관찰하세요.');
    set('carrier-observation',excited?(moves?'왼쪽 전자가 오른쪽 빈 상태를 채웠습니다. 정공 표식은 왼쪽으로 이동했습니다. 두 캐리어의 개수는 유지됩니다.':'전자 하나가 높은 에너지 상태로 올라가고 가전자대에 정공 하나가 남았습니다.'):'열이나 빛에 의한 여기와 재결합을 한 쌍의 상태로 단순화했습니다.');
  }
  $('carrier-excite').addEventListener('click',()=>{excited=true;hole=5;moves=0;carrier();});$('carrier-move').addEventListener('click',()=>{if(excited&&hole>0){hole--;moves++;carrier();}});$('carrier-recombine').addEventListener('click',()=>{excited=false;carrier();set('carrier-observation','전자가 빈 상태를 채워 표시한 전자·정공 쌍이 재결합했습니다. 방출 에너지의 전달 과정은 생략했습니다.');});$('carrier-reset').addEventListener('click',()=>{excited=false;hole=5;moves=0;carrier();});carrier();

  function dopant(){const d=readout('donors'),a=readout('acceptors'),delta=d-a;const n=(delta+Math.hypot(delta,2))/2,p=1/n;
    let s='<title>고정 도펀트와 이동 캐리어의 상대 농도</title>'+text(44,25,'농도 / nᵢ · 모든 막대에 같은 척도');
    [['도너',d,'#244ed8'],['억셉터',a,'#a84310'],['전자',n,'#244ed8'],['정공',p,'#a84310']].forEach(([name,v,color],i)=>{const y=67+i*57;s+=text(42,y+12,name)+rect(117,y-9,v/14*360,29,color)+text(130+v/14*360,y+12,v.toFixed(2));});
    s+=text(300,298,'고정된 도펀트 전하와 움직이는 캐리어를 구분하세요','text-anchor="middle"');$('dopant-chart').innerHTML=s;set('dopant-n',n.toFixed(2));set('dopant-p',p.toFixed(2));set('dopant-type',delta===0?'보상 / n=p':delta>0?'n형':'p형');set('dopant-observation',`도너−억셉터는 ${delta}nᵢ, 전자−정공도 ${delta}nᵢ입니다. np/nᵢ²=1을 유지합니다. 도펀트 총농도는 ${(d+a)}nᵢ이며 순 도핑과 다릅니다.`);
  }listen(['donors','acceptors'],dopant);reset('dopant',{donors:8,acceptors:0},dopant);

  function mos(){const n=$('mos-type').value==='n',v=readout('mos-gate'),signed=v*(n?1:-1),body=n?'p':'n',sd=n?'n':'p',color=n?'#244ed8':'#a84310';const state=Math.abs(signed)<.05?'평탄대 예시':signed<0?'축적':signed<1?'공핍 · 반전으로 이동':'강한 반전 예시';
    let s='<title>'+state+' 상태의 '+(n?'NMOS':'PMOS')+'</title>'+rect(35,161,550,140,n?'#fff0e6':'#e8efff')+text(310,278,body+'형 바디 · 도핑 고정','text-anchor="middle"')+rect(100,161,140,62,color)+rect(380,161,140,62,color)+text(170,197,sd+'⁺ 소스','text-anchor="middle" fill="#fff"')+text(450,197,sd+'⁺ 드레인','text-anchor="middle" fill="#fff"')+rect(239,145,142,12,'#9dc9b2')+rect(239,91,142,52,'#11243c')+text(310,124,'게이트','text-anchor="middle" fill="#fff"')+text(404,144,'절연막')+text(310,51,'게이트 상대 전압 '+v.toFixed(1),'text-anchor="middle"');
    if(signed>0)s+=rect(240,164,140,Math.min(65,30+signed*25),'#fff','stroke="#7d8da7" stroke-dasharray="4 3"');
    if(signed>=1||signed<0){const sign=signed>=1?(n?'−':'+'):(n?'+':'−');s+=rect(240,163,140,10,signed>=1?color:(n?'#a84310':'#244ed8'));for(let i=0;i<7;i++)s+=text(250+i*18,187,sign,`fill="${signed>=1?color:(n?'#a84310':'#244ed8')}"`);}
    $('mos-chart').innerHTML=s;set('mos-state',state);set('mos-observation',signed>=1?`${n?'양':'음'}의 게이트 전압에서 ${n?'전자':'정공'} 반전층을 표시했습니다. 도핑된 원자 위치는 변하지 않습니다. 숫자 1은 임의 경계이며 실제 문턱전압이 아닙니다.`:signed<0?`바디의 다수 캐리어인 ${n?'정공':'전자'}가 표면에 더 모이는 축적 상태입니다.`:'표면 캐리어가 줄어드는 공핍으로 연결됩니다. 0은 평탄대의 임의 기준이며 실제 0 V를 의미하지 않습니다.');
  }listen(['mos-type','mos-gate'],mos);reset('mos',{'mos-type':'n','mos-gate':0},mos);

  function accel(){const v=readout('accel-voltage',' kV'),z=num('accel-charge'),e=v*z;let s=plot(50,150,[{fn:x=>x*z,color:'#244ed8'}],'전위차 크기 / kV','에너지 증가 / keV');s+=circle(55+v/50*515,270-e/150*215,6,'#a84310');$('accel-chart').innerHTML=s;set('accel-energy',e+' keV');set('accel-observation',`${z}e의 전하를 가진 이온이 가속 전위차 ${v} kV에서 ${e} keV를 얻습니다. 에너지 증가량이므로 초기 에너지가 있다면 별도로 더해야 합니다.`);}
  listen(['accel-voltage','accel-charge'],accel);reset('accel',{'accel-voltage':20,'accel-charge':1},accel);

  function shadow(){const h=readout('shadow-height'),a=readout('shadow-angle','°'),s=h*Math.tan(a*Math.PI/180),top=215-h*3;let p='<title>마스크 높이 '+h+', 입사각 '+a+'도에서 그림자 길이 '+s.toFixed(2)+'</title>'+rect(45,215,510,40,'#e5ecfa')+rect(95,top,135,h*3,'#11243c')+rect(230,215,s*3,12,'#e7b790')+line(230,top-55,230,215,'stroke-dasharray="3 4"')+line(230-55*Math.tan(a*Math.PI/180),top-55,230+s*3,215,'style="stroke:#244ed8" stroke-width="3"')+text(103,top-10,'마스크 높이 '+h)+text(325,111,'θ = '+a+'°')+text(240,275,'그림자 s = '+s.toFixed(2))+text(47,300,'입사 방향 ↘ · 실제 산란을 제외한 기하학');$('shadow-chart').innerHTML=p;set('shadow-length',s.toFixed(2));set('shadow-observation',`같은 임의 길이 척도로 h=${h}, s=${s.toFixed(2)}입니다. ${a===0||h===0?'이 기하학에서는 그림자 길이가 0입니다.':'각도 또는 마스크 높이를 키우면 가려진 폭이 커집니다.'}`);}
  listen(['shadow-height','shadow-angle'],shadow);reset('shadow',{'shadow-height':15,'shadow-angle':20},shadow);

  const gaussian=(x,m,s)=>Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
  function diffusion(){const t=readout('diffusion-time'),f=readout('diffusion-active'),m=readout('diffusion-mobility'),sigma=Math.sqrt(.64+2*t),fn=x=>gaussian(x,4,sigma)+gaussian(x,-4,sigma);$('diffusion-chart').innerHTML='<title>총량 보존과 활성 농도 비교</title>'+plot(14,.55,[{fn:x=>gaussian(x,4,.8)+gaussian(x,-4,.8),color:'#8a54a6',dash:true},{fn,color:'#244ed8'},{fn:x=>f*fn(x),color:'#a84310'}]);set('diffusion-area','1.00');set('diffusion-width',sigma.toFixed(2));set('diffusion-resistance',(.5/(f*m)).toFixed(2)+'배');set('diffusion-observation',`화학 농도 면적은 1, 활성 농도 면적은 ${f.toFixed(2)}입니다. 이 모형에서 상대 면저항은 0.5/(${f}×${m})입니다. 확산만 바꾸면 총 활성량이 같아 면저항이 유지됩니다. 실제 물성의 농도 의존성은 제외했습니다.`);}
  listen(['diffusion-time','diffusion-active','diffusion-mobility'],diffusion);reset('diffusion',{'diffusion-time':0,'diffusion-active':.5,'diffusion-mobility':1},diffusion);

  all('.chapter-question').forEach(q=>q.querySelectorAll('[data-answer-choice]').forEach(b=>b.addEventListener('click',()=>{q.querySelectorAll('[data-answer-choice]').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));const right=b.dataset.answerChoice===q.dataset.answer;const status=q.querySelector('.answer-status');status.textContent=(right?'맞습니다. ':'다시 생각해 보세요. ')+q.querySelector('.answer-explanation p').textContent;status.classList.toggle('wrong',!right);})));
  all('[data-reset-check]').forEach(b=>b.addEventListener('click',()=>{const area=$(b.dataset.resetCheck+'-check');area.querySelectorAll('[data-answer-choice]').forEach(o=>o.setAttribute('aria-pressed','false'));area.querySelectorAll('.answer-status').forEach(o=>{o.textContent='';o.classList.remove('wrong');});area.querySelectorAll('details').forEach(d=>d.open=false);}));
  $('glossary-search').addEventListener('input',()=>{const search=$('glossary-search').value.trim().toLocaleLowerCase();let count=0;all('[data-term]').forEach(t=>{t.hidden=!(t.dataset.term.includes(search)||t.textContent.toLocaleLowerCase().includes(search));if(!t.hidden)count++;});set('glossary-count',`${count} / 40개 용어`);});

  // Progressive enhancement: static chapters are fully readable without JavaScript.
  const panels=all('[data-reader]'),chapters=all('.chapter');let whole=false;
  function route(focus=false){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{id='intro';}if(id==='main')return;
    const target=$(id)||$('intro'),panel=target.closest('[data-reader]')||$('intro');
    panels.forEach(p=>p.hidden=!whole&&p!==panel);
    let parent=target.parentElement;while(parent&&parent!==panel){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
    const index=chapters.indexOf(panel);all('#chapter-nav a').forEach(a=>a.hash==='#'+panel.id?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    set('progress-label',index>=0?`${String(index+1).padStart(2,'0')} / 12`:panel.id==='intro'?'학습 지도':panel.id==='review'?'용어·복습':'출처·모형');$('progress-fill').style.width=(index>=0?(index+1)/12*100:0)+'%';
    set('reader-location',index>=0?`${index+1}장 / 12 · ${panel.querySelector('h2').textContent.replace(/^\d+장\. /,'')}`:panel.id==='intro'?'원자 → 공정 → 소자 → 해석':panel.querySelector('h2').textContent);
    document.title=(index>=0?panel.querySelector('h2').textContent+' · ':'')+'IMP LAB · 직접 만지는 이온주입';
    document.dispatchEvent(new Event('readerchange'));
    if(location.hash)requestAnimationFrame(()=>{target.scrollIntoView({block:'start',behavior:'instant'});if(focus){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}});
  }
  window.addEventListener('hashchange',()=>route(true));document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.hash===location.hash&&a.hash!=='#main'){e.preventDefault();route(true);}});
  $('reader-all').addEventListener('click',()=>{whole=!whole;$('reader-all').setAttribute('aria-pressed',String(whole));set('reader-all',whole?'한 장씩 읽기':'전체 이어 읽기');route(false);});route(false);
})();
