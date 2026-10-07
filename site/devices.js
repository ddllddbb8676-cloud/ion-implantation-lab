/* Region-role model, not a process/device solver. Every number below is a drawing parameter. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), set=(id,s)=>$(id).textContent=s;
  const T=(x,y,s,more='')=>`<text x="${x}" y="${y}" ${more}>${s}</text>`;
  const R=(x,y,w,h,color,more='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${color}" ${more}/>`;
  const L=(x,y,x2,y2,more='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" ${more}/>`;
  let step=0,settings={},steps=[];
  const mode=()=>$('device-voltage').value, nmos=()=>$('device-polarity').value==='n';
  const baseType=()=>nmos()?'p':'n', flowType=()=>nmos()?'n':'p';
  const species=t=>t==='n'?'P 또는 As · 도너 예시':'B · 억셉터 예시';
  const color=t=>t==='n'?'#244ed8':'#a84310';
  function definitions(){const b=baseType(),f=flowType();
    const make=(id,name,type,windows,mu,sigma,q,goal,copy)=>({id,name,type,windows,mu,sigma,q,goal,copy,implant:true});
    const start={id:'base',name:'기판 준비',copy:mode()==='lv'?'선택한 소자 하나의 활성 영역을 봅니다. 웰과 소자 격리는 기술마다 다르며, 여기서는 주입 영역의 역할만 따라갑니다.':'측면 드리프트 MOS의 격리된 소자 영역을 가정합니다. 격리층·매몰층·접합 격리 공정의 자세한 구조는 생략했습니다.'};
    const gate={id:'gate',name:'게이트 형성',copy:'이번 단계에는 도펀트를 주입하지 않습니다. 게이트 절연막과 전극을 표시합니다. 채널은 이 전극 아래의 바디 표면에 형성됩니다.'};
    const contact=make('contact','바디 접촉',b,[[130,188]],.7,.32,3,'바디와 같은 유형의 높은 도핑 · 바디 전위 연결',`${b}형 바디의 접촉을 위해 ${b}⁺ 영역을 만듭니다. ${f}⁺ 소스·드레인과 반대 유형이므로 별도 주입 창으로 보호합니다. 실제 금속 접촉 형성은 생략했습니다.`);
    const anneal={id:'anneal',name:'어닐링·확인',copy:'도핑 영역의 목적이 연결되었습니다. 열처리로 회복·활성화를 진행하지만 그림의 경계는 실제 활성 농도나 확산 결과가 아닙니다. 관찰 영역을 골라 앞선 주입 분포를 복습하세요. 캐리어 채널은 게이트 바이어스를 걸 때 형성되며 이 정적 그림에는 켜진 채널을 그리지 않습니다.'};
    if(mode()==='lv')return [start,
      make('well','웰',b,[[115,725]],2.9,.85,1.2,'비교적 깊은 바탕 영역 · 채널 바디 형성',`${nmos()?'p웰에 NMOS':'n웰에 PMOS'}를 만드는 예제입니다. 반대 종류의 소자 영역은 포토 마스크로 보호된 것으로 가정합니다. 실제 웰은 여러 에너지 주입과 열 공정을 조합할 수 있습니다.`),
      make('channel','채널 조절',b,[[315,515]],.42,.18,.45,'표면 가까운 조절 · 문턱전압 등 목표에 관여',`게이트 아래가 될 바디 표면을 ${b}형 도핑으로 다듬는 단순 예입니다. 이것은 동작 중의 ${nmos()?'전자':'정공'} 반전 채널을 지금 만들어 넣는 단계가 아닙니다. 실제 문턱 조절 도펀트는 게이트 재료·목표에 따라 달라집니다.`),gate,
      make('extension','얕은 확장',f,[[220,620]],.32,.15,.65,'얕고 상대적으로 낮은 도핑 · 게이트 근처 연결','게이트가 중앙을 막고 양옆에 얕은 확장을 만듭니다. 소자 선택 포토 마스크와 게이트 자기 정렬을 함께 사용한 예제입니다. 단순 사각형은 옆 방향 산란이나 확산을 계산하지 않습니다.'),
      {id:'spacer',name:'스페이서',copy:'주입 없이 게이트 옆벽에 절연막을 형성합니다. 다음 고농도 주입이 게이트 가까이까지 들어가지 않도록 가리는 기준이 됩니다. 앞선 얕은 확장은 남습니다.'},
      make('sd','고농도 S/D',f,[[220,620]],.78,.32,3,'높은 도핑 · 소스·드레인과 접촉 경로의 저항 저감','게이트와 스페이서가 중앙을 가리고 바깥쪽을 주입합니다. 게이트 바로 옆에는 앞선 얕은 확장이, 그 바깥에는 높은 도핑의 S/D가 남는 구조를 비교하세요.'),contact,anneal];
    return [start,
      make('drift','드리프트',f,[[370,725]],1.6,.6,.8,'넓고 상대적으로 낮은 도핑 · 전압 분산 경로',`${f}형 드리프트 영역을 먼저 표시하는 교육 순서입니다. 실제로는 웰·에피·주입·확산으로 구현하는 방식과 순서가 다릅니다. 농도를 많이 넣는 것이 곧 높은 차단 전압을 의미하지 않습니다.`),
      make('well','바디·웰',b,[[120,412]],2.25,.75,1.4,'채널의 바탕 · 드리프트와 pn 접합 형성',`${b}형 바디를 소스 쪽에 둡니다. 바디와 ${f}형 드리프트의 접합은 전압 차단에 관여합니다. 이 예제의 단계 경계는 실제 이중 확산의 시간 순서나 접합 계산이 아닙니다.`),
      make('channel','채널 조절',b,[[280,415]],.42,.18,.45,'게이트 아래 바디 표면 · 문턱 조건 조절','소스에서 드리프트로 이어질 게이트 아래 바디 부분을 표시합니다. 도펀트 주입과 게이트 전압에 의한 반전은 구분합니다.'),gate,
      make('sd','고농도 S/D',f,[[210,290],[660,722]],.78,.32,3,'소스와 드레인 접촉은 높게 · 드리프트는 보호','소스 쪽과 먼 드레인 쪽만 높은 도핑으로 주입합니다. 사이의 드리프트 영역은 마스크로 가려 낮은 도핑 역할을 유지합니다. 전기장을 다루는 필드 플레이트·RESURF 상세 설계는 생략했습니다.'),contact,anneal];
  }
  function drawRegion(s,current){const m=settings[s.id]||{dose:1,depth:1};let boxes=[];const hv=mode()==='hv';
    if(s.id==='well')boxes=hv?[[120,160,292,140]]:[[115,160,610,140]];
    if(s.id==='drift')boxes=[[370,160,355,88]];
    if(s.id==='channel')boxes=hv?[[285,160,127,20]]:[[315,160,200,20]];
    if(s.id==='extension')boxes=[[220,160,130,21],[480,160,140,21]];
    if(s.id==='sd')boxes=hv?[[210,160,80,53],[660,160,62,53]]:[[220,160,112,53],[498,160,122,53]];
    if(s.id==='contact')boxes=[[130,160,58,52]];
    const c=color(s.type),opacity=Math.min(.88,(s.id==='sd'||s.id==='contact'?.7:.27)*m.dose);
    return boxes.map(([x,y,w,h])=>R(x,y,w,Math.min(165,h*m.depth),c,`fill-opacity="${opacity}" stroke="${c}" stroke-width="${current?3:1}" ${current?'stroke-dasharray="6 4"':''} data-region="${s.id}" data-doping="${s.type}"`)).join('');
  }
  function draw(){const hv=mode()==='hv',n=nmos(),s=steps[step],built=steps.slice(0,step+1),b=baseType(),f=flowType(),ids=built.map(v=>v.id);const gatePresent=ids.includes('gate'),spacer=ids.includes('spacer'),gx=hv?290:350,gw=hv?150:130;
    set('device-assumption',hv?'예제: 격리된 측면 드리프트 MOS. HV PMOS는 극성을 뒤집은 대응 약도이며 실제 공정·물성은 비대칭입니다. 실제 전압 등급을 지정하지 않습니다.':'예제: 웰·얕은 확장·스페이서가 있는 평면 벌크 MOS. 선택 소자 하나만 표시하며 이웃 소자는 마스크로 보호된 것으로 가정합니다.');
    const stepButtons=[...$('device-steps').children];stepButtons.forEach((btn,i)=>btn.setAttribute('aria-pressed',String(i===step)));$('device-prev').disabled=step===0;$('device-next').disabled=step===steps.length-1;set('device-step-count',`${step+1} / ${steps.length}`);
    set('device-heading',`${step+1}. ${s.name}`);set('device-copy',s.copy);set('device-species',s.implant?`${species(s.type)} → ${s.type}형 역할`:'이번 단계는 이온주입 없음');
    set('device-mask',s.implant?(s.id==='sd'&&hv?'소스·드레인만 개방 · 드리프트와 바디 보호':s.id==='extension'?'포토 창 + 게이트로 중앙 차단':s.id==='sd'?'포토 창 + 게이트·스페이서 차단':'점선 영역 위의 창만 개방 · 주변 보호'):'마스크 제거 / 구조·열처리 단계의 약도');set('device-goal',s.goal||'새 도펀트 투입 없이 앞선 영역의 역할을 이어갑니다.');
    let pic=`<title>${hv?'HV':'LV'} ${n?'NMOS':'PMOS'} ${s.name}</title><desc>${s.copy}</desc><defs><pattern id="device-mask-hatch" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#d7deeb"/><path d="M-2 9L9-2M6 12L12 6" stroke="#5d6c83" stroke-width="2"/></pattern></defs>`;
    pic+=T(60,30,`${hv?'HV 측면 드리프트':'LV 평면'} · ${n?'NMOS':'PMOS'}`,'font-size="20" font-weight="700"')+T(780,30,'영역 역할 · 실제 축척 아님','text-anchor="end" fill="#56647a"');
    pic+=R(60,160,720,180,b==='p'?'#fff6ef':'#f0f4ff','stroke="#a5b1c6"')+T(420,365,(hv?'격리된 소자 영역 / ':'기판 / ')+b+'형 바탕','text-anchor="middle"');
    // Existing region fills are cumulative. New stage is outlined, not an activation prediction.
    built.filter(v=>v.implant).forEach(v=>pic+=drawRegion(v,v.id===s.id));
    if(ids.includes('well'))pic+=T(hv?245:420,292,b+(hv?'형 바디':'형 웰'),'text-anchor="middle" font-size="18"');
    if(ids.includes('drift'))pic+=T(545,232,f+'⁻ 드리프트','text-anchor="middle" font-size="18"');
    if(ids.includes('channel')&&!ids.includes('sd'))pic+=T(hv?330:410,199,b+' 채널 조절','text-anchor="middle"');
    if(ids.includes('extension')&&!ids.includes('sd'))pic+=T(279,209,f+' 확장','text-anchor="middle"')+T(551,209,f+' 확장','text-anchor="middle"');
    if(ids.includes('sd')){const sx=hv?250:275,dx=hv?692:561;pic+=R(sx-26,174,52,26,'#fff')+T(sx,193,f+'⁺ S','text-anchor="middle" fill="#142440" font-weight="700"')+R(dx-26,174,52,26,'#fff')+T(dx,193,f+'⁺ D','text-anchor="middle" fill="#142440" font-weight="700"');if(!hv)pic+=T(410,248,'얕은 확장은 스페이서 아래에 남음','text-anchor="middle"');pic+=T(hv?325:410,hv?265:224,'채널 위치: 게이트 아래 바디 표면','text-anchor="middle" font-size="13"');}
    if(ids.includes('contact'))pic+=R(133,174,52,26,'#fff')+T(159,192,b+'⁺ B','text-anchor="middle" fill="#142440" font-weight="700"');
    if(gatePresent){pic+=R(gx,150,gw,10,'#7ba990')+R(gx,112,gw,36,'#11243c')+T(gx+gw/2,137,'게이트','text-anchor="middle" fill="#fff"');if(hv)pic+=R(440,143,213,17,'#a4c4b1')+T(550,130,'필드 절연막 약도','text-anchor="middle"');}
    if(spacer)pic+=R(332,134,18,26,'#849db3')+R(480,134,18,26,'#849db3');
    if(s.implant){
      let last=60;s.windows.forEach(([a,z])=>{if(a>last)pic+=R(last,78,a-last,29,'url(#device-mask-hatch)');last=z;});if(last<780)pic+=R(last,78,780-last,29,'url(#device-mask-hatch)');
      const blockers=gatePresent?[[spacer?332:gx,spacer?498:gx+gw]]:[];
      s.windows.forEach(([a,z])=>{for(let x=a+12;x<z-3;x+=28){const blocked=blockers.some(([l,r])=>x>=l&&x<=r);const end=blocked?108:153;pic+=L(x,53,x,end,`stroke="${color(s.type)}" stroke-width="2"`)+`<path d="M${x-4} ${end-7}L${x} ${end}L${x+4} ${end-7}" fill="none" stroke="${color(s.type)}" stroke-width="2"/>`;}});
      pic+=T(60,65,'보호 마스크','font-size="13"');
    }else pic+=T(60,79,'이번 단계에는 주입 빔을 표시하지 않습니다.','fill="#56647a"');
    $('device-chart').innerHTML=pic;
    const state=settings[s.id]||{dose:1,depth:1};for(const [id,key] of [['device-amount','dose'],['device-depth','depth']]){$(id).disabled=!s.implant;$(id).value=state[key];set(id+'-out',state[key].toFixed(1)+'×');$(id).setAttribute('aria-valuetext',state[key]+'배, 임의 비교값');}
    set('device-control-hint',s.implant?'현재 주입 단계의 상대값입니다. 이전·다음으로 이동해도 이 예제 안의 비교값을 유지합니다. 실제 도즈·에너지·깊이로 환산하지 않습니다.':'이 단계에는 주입이 없어 손잡이를 잠갔습니다. 아래 목록에서 앞선 영역의 분포를 관찰할 수 있습니다.');
    const old=$('device-probe').value;const implants=built.filter(v=>v.implant);$('device-probe').innerHTML='<option value="current">현재 또는 직전 주입 영역</option>'+implants.map(v=>`<option value="${v.id}">${v.name} · ${v.type}형</option>`).join('');$('device-probe').value=implants.some(v=>v.id===old)?old:'current';drawProfile();
  }
  const erf=x=>{const sign=x<0?-1:1,a=Math.abs(x),t=1/(1+.3275911*a);return sign*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-a*a));};
  function drawProfile(){const implants=steps.slice(0,step+1).filter(v=>v.implant),requested=$('device-probe').value;const s=requested==='current'?implants.at(-1):implants.find(v=>v.id===requested);
    if(!s){set('device-profile-label','아직 주입한 영역이 없습니다.');$('device-profile').innerHTML='<title>아직 주입 전</title>'+T(300,150,'다음 단계로 이동해 주입 영역을 만드세요.','text-anchor="middle"');set('device-profile-note','기판의 배경 도핑은 이 추가 주입 프로파일에 표시하지 않습니다.');return;}
    const v=settings[s.id]||{dose:1,depth:1},mu=s.mu*v.depth,sigma=s.sigma*(.7+.3*v.depth),amount=s.q*v.dose,norm=.5*(1+erf(mu/(sigma*Math.SQRT2)));
    let pic=`<title>${s.name} 영역에 추가하는 도펀트 분포</title>`+T(52,23,'추가 도펀트 농도 / 임의 척도')+T(570,307,'깊이 / 임의 척도','text-anchor="end"');const X=x=>52+x/6*518,Y=y=>255-y/6.5*207;
    for(let i=0;i<=3;i++){pic+=L(52,Y(i*2),570,Y(i*2),'stroke="#dce2ed"')+T(41,Y(i*2)+4,i*2,'text-anchor="end"')+T(X(i*2),278,i*2,'text-anchor="middle"');}
    const points=Array.from({length:241},(_,i)=>{const x=i/40,y=amount*Math.exp(-.5*((x-mu)/sigma)**2)/(sigma*Math.sqrt(2*Math.PI)*norm);return[X(x),Y(y)];});const d=points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');pic+=`<path d="${d}" fill="none" stroke="${color(s.type)}" stroke-width="3"/>`+L(X(mu),50,X(mu),255,'stroke="#74829a" stroke-dasharray="4 4"');$('device-profile').innerHTML=pic;
    set('device-profile-label',`${s.name} · ${s.type}형 역할 / ${species(s.type)}`);
    set('device-profile-note',`${steps[step].id===s.id?'현재':'앞선'} 주입 영역을 관찰합니다. 이 단계 기준 투입량 ${v.dose.toFixed(1)}배, 침투 중심 ${v.depth.toFixed(1)}배. 그래프는 해당 도펀트의 추가 분포이며 배경·보상·활성화가 반영된 순 농도나 접합 깊이가 아닙니다.`);
  }
  function changeStep(i){step=Math.max(0,Math.min(steps.length-1,i));$('device-probe').value='current';draw();}
  function initialize(){step=0;settings={};steps=definitions();steps.filter(s=>s.implant).forEach(s=>settings[s.id]={dose:1,depth:1});$('device-steps').innerHTML=steps.map((s,i)=>`<button type="button" data-device-step="${i}" aria-pressed="${i===0}"><span>${String(i+1).padStart(2,'0')}</span> ${s.name}</button>`).join('');$('device-steps').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>changeStep(Number(b.dataset.deviceStep))));draw();}
  ['device-voltage','device-polarity'].forEach(id=>$(id).addEventListener('input',initialize));$('device-prev').addEventListener('click',()=>changeStep(step-1));$('device-next').addEventListener('click',()=>changeStep(step+1));$('device-reset').addEventListener('click',()=>{$('device-voltage').value='lv';$('device-polarity').value='n';initialize();});
  ['device-amount','device-depth'].forEach(id=>$(id).addEventListener('input',()=>{const s=steps[step];if(!s.implant)return;settings[s.id]={dose:Number($('device-amount').value),depth:Number($('device-depth').value)};draw();}));$('device-probe').addEventListener('input',drawProfile);initialize();
})();
