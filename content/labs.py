def select(id, label, options):
    return f'<label for="{id}">{label}</label><select id="{id}">'+''.join(f'<option value="{v}">{s}</option>' for v,s in options)+'</select>'

def slider(id, label, low, high, value, step=1, units=''):
    return f'<div class="range-heading"><label for="{id}">{label}</label><output id="{id}-out" for="{id}">{value}{units}</output></div><input type="range" id="{id}" min="{low}" max="{high}" step="{step}" value="{value}"><div class="range-ends"><span>{low}{units}</span><span>{high}{units}</span></div>'

def svg(id, label, box='0 0 600 310'):
    return f'<svg id="{id}" viewBox="{box}" role="img" aria-label="{label}"><title>{label}</title></svg>'

def lab(id, tag, title, controls, picture, limit):
    return f'''<div class="lab new-lab" id="lab-{id}"><div class="lab-top"><div><span class="lab-label">{tag}</span><h3>{title}</h3></div><button type="button" class="text-button" id="{id}-reset">初期</button></div><div class="experiment-layout"><div class="control-panel">{controls}</div><div class="plot-panel">{picture}<p class="observation" id="{id}-observation" role="status"></p></div></div><div class="lab-bottom"><span>{limit}</span></div></div>'''.replace('>初期<','>초기화<')

LABS = {}
LABS['atoms'] = lab('atom','CHARGE COUNTER','전자 수만 바꾸면 무엇이 달라질까요?',
    select('atom-species','원소', [('B','B · 보론 / 양성자 5개'),('Si','Si · 실리콘 / 양성자 14개')])+slider('atom-electrons','전자 수',0,7,5)+ '<button type="button" class="secondary" id="atom-neutral">중성으로 맞추기</button>',
    svg('atom-chart','원자핵과 전자 수를 비교하는 전하 약도')+'<div class="result-strip"><div><span>원소</span><strong id="atom-name"></strong></div><div><span>전자 수</span><strong id="atom-count"></strong></div><div><span>전체 전하</span><strong id="atom-charge"></strong></div></div>',
    '개별 원자의 전하 세기 · 실제 전자 궤도·크기·이온화 안정성을 계산하지 않습니다.')
LABS['silicon'] = lab('carrier','BOND TO BAND','전자와 빈자리를 한 단계씩 따라가 보세요',
    '<div class="button-stack"><button id="carrier-excite" type="button">전자 들뜨기</button><button id="carrier-move" type="button">옆 전자로 채우기</button><button id="carrier-recombine" type="button">재결합</button></div><p class="form-hint">전자가 들뜬 다음 빈 상태를 이동시켜 보세요. 한 쌍만 추적하는 개념도입니다.</p>',
    svg('carrier-chart','결합 전자의 이동과 반대 방향으로 움직이는 정공')+'<p id="carrier-state" class="metric-line"></p>',
    '전자 상태와 정공의 개념도 · 버튼 횟수는 시간·온도가 아니며 재결합 에너지 방출은 생략합니다.')
LABS['doping'] = lab('dopant','COMPENSATION EXPLORER','도너와 억셉터를 함께 넣어 보세요',
    slider('donors','도너 농도 / nᵢ',0,12,8)+slider('acceptors','억셉터 농도 / nᵢ',0,12,0),
    svg('dopant-chart','도너·억셉터와 전자·정공의 상대 농도 막대그래프')+'<div class="result-strip"><div><span>전자 n/nᵢ</span><strong id="dopant-n"></strong></div><div><span>정공 p/nᵢ</span><strong id="dopant-p"></strong></div><div><span>유형</span><strong id="dopant-type"></strong></div></div>',
    '균일·열평형·완전 이온화·비축퇴 가정 · 실제 도펀트 원자 비율·농도 예측이 아닙니다.')
LABS['transistor'] = lab('mos','GATE AND CHANNEL','도핑은 그대로, 게이트 전압만 바꿉니다',
    select('mos-type','트랜지스터',[('n','NMOS'),('p','PMOS')])+slider('mos-gate','게이트의 상대 전압',-2,2,0,.1)+'<p class="form-hint">소스·바디 기준의 부호를 비교합니다. 숫자는 임의 척도이며 V나 실제 문턱전압이 아닙니다.</p>',
    svg('mos-chart','게이트 전압에 따른 축적·공핍·반전의 단면 약도','0 0 620 320')+'<p id="mos-state" class="metric-line"></p>',
    '평면 MOS의 표면 상태 모형 · 전류, 문턱 이하 동작, 누설·산화막 손상을 계산하지 않습니다.')
LABS['energy-lab'] = lab('accel','ENERGY PER ION','같은 전압, 다른 전하수',
    slider('accel-voltage','가속 전위차 크기',0,50,20,1,' kV')+select('accel-charge','양이온 전하수',[('1','z=1'),('2','z=2'),('3','z=3')]),
    svg('accel-chart','전하수와 가속 전압에 비례하는 에너지 증가량','0 0 600 340')+'<p class="metric-line">에너지 증가 <strong id="accel-energy"></strong></p>',
    '초기 운동에너지·손실을 제외한 ΔE 계산 · 특정 이온의 실제 장비 동작 범위나 깊이를 뜻하지 않습니다.')
LABS['shadow-lab'] = lab('shadow','MASK SHADOW','높은 마스크 옆의 가려진 영역',
    slider('shadow-height','마스크 높이 / 임의 길이',0,30,15)+slider('shadow-angle','법선으로부터 입사각',0,60,20,1,'°'),
    svg('shadow-chart','비스듬한 직선 빔과 마스크 뒤 그림자의 길이')+'<p class="metric-line">그림자 길이 <strong id="shadow-length"></strong> <small>임의 단위</small></p>',
    '수직 벽·평행 직선 빔·완전 차단 가정 · 주입 산란·막 통과·옆 방향 확산은 생략합니다.')
LABS['physics'] = lab('diffusion','PROFILE TO SHEET RESISTANCE','총량은 같아도 전기적 결과는 다를까요?',
    slider('diffusion-time','확산 정도 τ / 임의 단위',0,4,0,.1)+slider('diffusion-active','활성 비율 f / 가정값',.1,1,.5,.05)+slider('diffusion-mobility','이동도 / 기준 이동도',.5,1.5,1,.1),
    '<div class="chart-legend"><span><i class="line dashed"></i> 처음 화학 농도</span><span><i class="line blue"></i> 현재 화학 농도</span><span><i class="line orange"></i> 활성 농도</span></div>'+svg('diffusion-chart','확산으로 넓어지는 화학 농도와 활성 농도 분포','0 0 600 350')+'<div class="result-strip"><div><span>화학 농도 면적</span><strong id="diffusion-area"></strong><small>전체 반공간 / 정규화</small></div><div><span>구성 함수 폭 σ</span><strong id="diffusion-width"></strong><small>임의 길이</small></div><div><span>면저항 / 기준</span><strong id="diffusion-resistance"></strong><small>f=0.5, 이동도=1 기준</small></div></div>',
    '1차원·반사 표면·총량 보존, 균일 활성 비율·이동도, 단일 다수 캐리어 가정 · 실제 어닐링 예측 아님')
LABS['devices'] = '''<div class="lab device-lab" id="lab-device"><div class="lab-top"><div><span class="lab-label">PROCESS CROSS-SECTION STUDIO</span><h3>소자를 고르고, 주입 창을 따라가 보세요</h3></div><button type="button" class="text-button" id="device-reset">전체 초기화</button></div><div class="device-selectors">'''+select('device-voltage','예제 구조',[('lv','LV · 평면 MOS + 확장'),('hv','HV · 측면 드리프트 MOS')])+select('device-polarity','소자 극성',[('n','NMOS · 전자 채널'),('p','PMOS · 정공 채널')])+'''</div><p class="device-assumption" id="device-assumption"></p><div id="device-steps" class="process-steps" role="group" aria-label="공정 단계"></div><div class="device-toolbar"><button type="button" id="device-prev">← 이전 단계</button><p id="device-step-count" role="status"></p><button type="button" id="device-next">다음 단계 →</button></div><div class="device-viewport" tabindex="0" role="region" aria-label="소자 공정 단면. 작은 화면에서는 좌우로 이동할 수 있습니다.">'''+svg('device-chart','현재 공정 단계의 마스크와 도핑 영역','0 0 840 390')+'''</div><p class="diagram-caption">좌우로 이동해 전체 단면을 확인하세요. n/p 문자: 도핑 유형 · +: 높은 도핑 · 점선 테두리: 현재 주입 영역 · 빗금: 차단 마스크. 실제 축척·접합 경계가 아닙니다.</p><div class="device-explain" aria-live="polite" aria-atomic="true"><h3 id="device-heading"></h3><p id="device-copy"></p><dl class="device-facts"><div><dt>이번 단계</dt><dd id="device-species"></dd></div><div><dt>주입 창 / 차단</dt><dd id="device-mask"></dd></div><div><dt>분포의 목적</dt><dd id="device-goal"></dd></div></dl></div><div class="experiment-layout"><div class="control-panel"><h4>현재 주입 단계 비교</h4>'''+slider('device-amount','투입량 / 이 단계 기준',.5,1.5,1,.1)+slider('device-depth','침투 깊이 / 이 단계 기준',.6,1.4,1,.1)+'''<p class="form-hint" id="device-control-hint">주입 단계에서 조작할 수 있습니다. 변화는 이 단계의 상대 비교이며 실제 도즈·keV·nm로 변환하지 않습니다.</p>'''+select('device-probe','분포를 관찰할 영역',[('current','현재 단계')])+'''</div><div class="plot-panel"><p id="device-profile-label" class="metric-line"></p>'''+svg('device-profile','선택한 영역에 투입한 도펀트의 정성적 깊이 분포','0 0 600 320')+'''<p id="device-profile-note" class="observation" role="status"></p></div></div><div class="lab-bottom"><span>영역 역할을 연결하는 교육용 단면 · 실제 공정 순서·양산 레시피·활성 농도·항복 전압 예측이 아닙니다. 구조를 바꾸면 해당 예제의 첫 단계와 기본 비교값으로 돌아갑니다.</span></div></div>'''
