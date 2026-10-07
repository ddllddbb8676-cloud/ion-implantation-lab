/* IMP LAB — dependency-free, deterministic educational models. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const all = selector => [...document.querySelectorAll(selector)];
  const supers = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const sci = (n, places = 2) => {
    if (n === 0) return '0';
    const [mantissa, exponent] = n.toExponential(places).split('e');
    return `${Number(mantissa)} × 10${String(Number(exponent)).split('').map(c => supers[c]).join('')}`;
  };
  const svgText = (x, y, text, extra = '') => `<text x="${x}" y="${y}" ${extra}>${text}</text>`;
  const line = (x1, y1, x2, y2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
  const dot = (x, y, r, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
  const pathString = points => points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');

  // Navigation uses ordinary anchors: deep links, Back/Forward and no-JS reading work.
  const closeMenu = () => { $('sidebar').classList.remove('open'); $('menu-toggle').setAttribute('aria-expanded', 'false'); };
  $('menu-toggle').addEventListener('click', () => {
    const open = !$('sidebar').classList.contains('open');
    $('sidebar').classList.toggle('open', open);
    $('menu-toggle').setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('sidebar').classList.contains('open')) { closeMenu(); $('menu-toggle').focus(); }
  });
  document.addEventListener('click', e => { if (!$('sidebar').contains(e.target) && !$('menu-toggle').contains(e.target)) closeMenu(); });
  all('#chapter-nav a').forEach(a => a.addEventListener('click', () => {
    closeMenu();
    if (window.innerWidth <= 950) {
      const target = document.querySelector(a.hash);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }));
  window.addEventListener('resize', () => { if (window.innerWidth > 950) closeMenu(); });

  const stages = [
    ['먼저, 전하를 띠게 한다', '이온원에서 전자와 원자·분자의 충돌 등으로 이온을 만듭니다. 전기장으로 꺼낸 빔에는 여러 원소와 분자, 서로 다른 전하 상태가 섞일 수 있습니다.', '핵심: 전하가 있어야 전기장과 자기장으로 빔을 제어할 수 있습니다.', 175, 188],
    ['원하는 이온을 골라낸다', '분석 자석은 입자의 운동량/전하에 따라 궤적을 굽힙니다. 같은 추출 전압으로 얻은 빔에서는 질량/전하비(m/q)에 따라 경로가 달라지고, 슬릿이 목표 경로의 이온을 통과시킵니다.', '핵심: 원소의 질량만 보는 필터가 아닙니다. 전하 상태와 빔 조건도 중요합니다.', 280, 167],
    ['이온 한 개의 에너지를 맞춘다', '전위차를 지나며 이온이 얻는 에너지 변화의 크기는 ΔE = qΔV입니다. 단일 전하 이온은 1 kV의 가속 전위차에서 1 keV를 얻습니다. 장비는 가속·감속과 에너지 선택을 조합할 수 있습니다.', '핵심: 에너지는 주로 깊이 분포와 연결됩니다. 이온 수를 나타내는 도즈와 구분하세요.', 459, 116],
    ['좁은 빔을 넓은 면적에 나눈다', '빔을 전기장·자기장으로 움직이거나 웨이퍼를 기계적으로 이동합니다. 스캔과 빔 평행화를 통해 위치에 따른 도즈와 입사각 차이를 관리합니다.', '핵심: 한 점의 빔 전류만으로 웨이퍼 전체의 균일도를 알 수는 없습니다.', 651, 116],
    ['충돌하며 멈추고, 분포를 남긴다', '웨이퍼 안에서 이온은 핵과 전자에 에너지를 전달하며 멈춥니다. 일부는 깊게, 일부는 얕게 멈춰 농도 분포가 생깁니다. 이때 생기는 결정 손상은 후속 어닐링과 연결됩니다.', '핵심: 주입된 원자 수와 전기적으로 활성화된 도펀트 수는 같지 않을 수 있습니다.', 788, 116]
  ];
  const setStage = index => {
    const stage = stages[index];
    all('[data-stage]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.stage) === index)));
    all('[data-part]').forEach(g => g.classList.toggle('selected', Number(g.dataset.part) === index));
    $('stage-count').textContent = `${String(index + 1).padStart(2, '0')} / 05`;
    $('stage-title').textContent = stage[0]; $('stage-copy').textContent = stage[1]; $('stage-key').textContent = stage[2];
    $('beam-ion').setAttribute('cx', stage[3]); $('beam-ion').setAttribute('cy', stage[4]);
    $('beam-svg-desc').textContent = `현재 선택: ${stage[0]}. ${stage[1]}`;
    const visual = document.querySelector('.beam-visual');
    visual.scrollTo({ left: Math.max(0, stage[3] / 920 * $('beam-svg').clientWidth - visual.clientWidth / 2), behavior: 'instant' });
  };
  all('[data-stage]').forEach(b => b.addEventListener('click', () => setStage(Number(b.dataset.stage))));
  $('beam-reset').addEventListener('click', () => setStage(0));

  // Positive-half-line normalized Gaussian. All depth coefficients are invented.
  const erf = x => {
    const sign = x < 0 ? -1 : 1;
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    return sign * (1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-x * x));
  };
  const gaussian = (x, mu, sigma) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI) * (0.5 * (1 + erf(mu / (sigma * Math.SQRT2)))));
  const profileState = () => ({ species: $('species').value, dose: Number($('profile-dose').value), energy: Number($('energy').value) });
  const profileParams = state => { const mu = ({ B: 35, P: 23, As: 16 })[state.species] * (state.energy / 40) ** 0.8; return { mu, sigma: 6 + mu * 0.12 }; };
  let savedProfile = null;
  function drawProfile() {
    const state = profileState(), { mu, sigma } = profileParams(state);
    $('profile-dose-out').textContent = `${state.dose} × 10¹³`; $('energy-out').textContent = `${state.energy} keV`;
    $('profile-dose').setAttribute('aria-valuetext', `${state.dose} 곱하기 10의 13승 이온 매 제곱센티미터`);
    $('energy').setAttribute('aria-valuetext', `${state.energy} 킬로전자볼트`);
    $('profile-total').textContent = `${state.dose} × 10¹³`; $('profile-center').textContent = mu.toFixed(1);
    const left = 55, top = 39, width = 560, height = 258, bottom = top + height;
    const xp = x => left + x / 120 * width, yp = y => bottom - y / 32 * height;
    let content = `<title id="profile-chart-title">주입 깊이에 따른 모형 농도</title><desc id="profile-chart-desc">${state.species}, 도즈 ${state.dose} 곱하기 10의 13승, 에너지 ${state.energy} keV. 모형 중심 ${mu.toFixed(1)}. 실제 깊이와 농도가 아닙니다.</desc>`;
    for (let y = 0; y <= 32; y += 8) content += line(left, yp(y), left + width, yp(y), 'class="chart-grid"') + svgText(left - 12, yp(y) + 4, y, 'text-anchor="end" class="chart-label"');
    for (let x = 0; x <= 120; x += 30) content += line(xp(x), top, xp(x), bottom, 'class="chart-grid"') + svgText(xp(x), bottom + 23, x, 'text-anchor="middle" class="chart-label"');
    content += svgText(left, 20, '모형 농도 (상대값)', 'class="chart-label"') + svgText(left + width, 350, '모형 깊이 (임의 단위 · nm 아님)', 'text-anchor="end" class="chart-label"');
    const curve = state => { const p = profileParams(state); return Array.from({ length: 361 }, (_, i) => [xp(i / 3), yp(gaussian(i / 3, p.mu, p.sigma) * state.dose * 100)]); };
    const points = curve(state);
    content += `<path d="${pathString(points)} L${xp(120)} ${bottom} L${xp(0)} ${bottom} Z" fill="#244ed8" fill-opacity=".12"/>`;
    if (savedProfile) content += `<path d="${pathString(curve(savedProfile))}" fill="none" stroke="#8a54a6" stroke-width="2.5" stroke-dasharray="7 5"/>`;
    content += line(xp(mu), top + 30, xp(mu), bottom, 'stroke="#6885d9" stroke-dasharray="3 5"') + svgText(xp(mu) + 6, top + 20, '분포 중심', 'fill="#244ed8" font-size="12"');
    content += `<path d="${pathString(points)}" fill="none" stroke="#244ed8" stroke-width="3.5"/>`;
    $('profile-chart').innerHTML = content;
    $('saved-legend').hidden = !savedProfile; $('profile-clear').disabled = !savedProfile;
    if (savedProfile) {
      const saved = profileParams(savedProfile), ratio = state.dose / savedProfile.dose;
      $('profile-ratio').textContent = `${ratio.toFixed(2)}배`;
      $('profile-comparison').textContent = `${savedProfile.species} · ${savedProfile.energy} keV · ${savedProfile.dose} × 10¹³ 기준`;
      const shift = mu - saved.mu;
      $('profile-observation').textContent = `기준 대비 곡선의 전체 면적은 ${ratio.toFixed(2)}배입니다. 모형 중심은 ${Math.abs(shift) < 0.01 ? '같은 위치에 있습니다' : `${Math.abs(shift).toFixed(1)} 임의 단위 ${shift > 0 ? '깊은' : '얕은'} 쪽으로 이동했습니다`}. ${state.species === savedProfile.species && state.energy === savedProfile.energy ? '깊이 분포의 모양을 유지한 채 도즈만 비교하고 있습니다.' : '깊이 이동량은 실제 nm로 해석할 수 없습니다.'}`;
    } else {
      $('profile-ratio').textContent = '—'; $('profile-comparison').textContent = '비교 기준을 저장하세요';
      $('profile-observation').textContent = `${state.species} 모형에서 도즈는 곡선의 면적, 에너지는 주로 분포의 위치를 바꿉니다. 현재 조건을 저장하고 하나의 변수만 바꿔 차이를 확인하세요.`;
    }
  }
  ['species', 'profile-dose', 'energy'].forEach(id => $(id).addEventListener('input', drawProfile));
  $('profile-save').addEventListener('click', () => { savedProfile = profileState(); drawProfile(); });
  $('profile-clear').addEventListener('click', () => { savedProfile = null; drawProfile(); });
  $('profile-reset').addEventListener('click', () => { $('species').value = 'B'; $('profile-dose').value = 2; $('energy').value = 40; savedProfile = null; drawProfile(); });
  drawProfile();

  const elementaryCharge = 1.602176634e-19;
  function updateDose() {
    const limits = { current: [0, 10000], duration: [0, 10000], area: [0.01, 10000] };
    const names = { current: '전류', duration: '시간', area: '면적' };
    const values = {}, invalid = [];
    Object.entries(limits).forEach(([id, range]) => {
      const value = $(id).valueAsNumber;
      const valid = Number.isFinite(value) && value >= range[0] && value <= range[1];
      $(id).setAttribute('aria-invalid', String(!valid));
      if (!valid) { $(id).setAttribute('aria-describedby', 'dose-error'); invalid.push(names[id]); }
      else $(id).removeAttribute('aria-describedby');
      values[id] = value;
    });
    $('dose-error').hidden = !invalid.length;
    if (invalid.length) {
      $('dose-error').textContent = `${invalid.join('·')} 입력을 확인하세요. 표시된 범위 안의 숫자가 필요합니다. 면적은 0보다 커야 합니다.`;
      $('dose-result').textContent = '입력 확인'; $('dose-count').textContent = '유효한 입력을 넣으면 다시 계산합니다.';
      return;
    }
    $('dose-error').textContent = '';
    const count = values.current * 1e-6 * values.duration / (Number($('charge').value) * elementaryCharge);
    $('dose-result').textContent = sci(count / values.area);
    $('dose-count').textContent = `전체 이온 수 ${sci(count)}개`;
  }
  $('dose-form').addEventListener('submit', e => e.preventDefault());
  ['current', 'duration', 'area', 'charge'].forEach(id => $(id).addEventListener('input', updateDose));
  $('dose-reset').addEventListener('click', () => { $('current').value = 10; $('duration').value = 10; $('area').value = 100; $('charge').value = 1; updateDose(); });
  updateDose();

  function drawChannel() {
    const tilt = Number($('tilt').value), amorphous = $('crystal').value === 'amorphous';
    $('tilt-out').textContent = `${tilt}°`; $('tilt').setAttribute('aria-valuetext', `${tilt}도`);
    const aligned = tilt < 3 && !amorphous;
    let lattice = '<title>결정과 입사 방향의 개념도</title><desc>격자의 빈 방향에 정렬되면 경로가 길어지고 기울이거나 비정질화하면 산란이 늘어나는 설명용 그림입니다.</desc>';
    lattice += `<rect x="18" y="70" width="284" height="232" rx="8" fill="#f1f4f9"/>` + line(18, 70, 302, 70, 'stroke="#93a7c7" stroke-width="2"') + svgText(23, 24, amorphous ? '비정질 표면층 모형' : '한 결정축을 따라 본 모형', 'fill="#506078" font-size="13"');
    lattice += line(278, 44, 278, 276, 'stroke="#8f9cb0" stroke-dasharray="4 5"') + svgText(278, 37, '법선', 'text-anchor="middle" font-size="12"');
    for (let row = 0; row < 7; row++) for (let col = 0; col < 7; col++) {
      const disorder = amorphous && row < 4;
      const x = 37 + col * 35 + (disorder ? Math.sin(row * 8 + col * 11) * 10 : 0);
      const y = 90 + row * 30 + (disorder ? Math.cos(row * 13 + col * 3) * 8 : 0);
      lattice += dot(x, y, 6, 'fill="#a7b4c8"');
    }
    for (let i = 0; i < 5; i++) {
      const start = 54 + i * 35, endY = aligned ? 270 - i % 2 * 20 : 137 + i % 3 * 28;
      const drift = Math.tan(tilt * Math.PI / 180) * (endY - 48);
      const points = [[start, 44], [start + drift * 0.2, 78], [start + drift * 0.65, 110], [start + drift + (aligned ? 0 : (i % 2 ? -11 : 12)), endY]];
      lattice += `<path d="${pathString(points)}" fill="none" stroke="#244ed8" stroke-width="2.4" opacity="${.5 + i * .1}"/>`;
      const end = points[points.length - 1]; lattice += dot(end[0], end[1], 4, 'fill="#244ed8"');
    }
    lattice += svgText(27, 321, `Tilt ${tilt}° · 경로는 설명용`, 'fill="#506078" font-size="12"');
    $('lattice-chart').innerHTML = lattice;
    const tail = amorphous ? 0.035 : 0.42 * Math.exp(-0.5 * (tilt / 3.4) ** 2) + 0.035;
    const xp = x => 44 + x / 120 * 267, yp = y => 270 - y / 0.058 * 210;
    const density = (x, w) => (1 - w) * gaussian(x, 31, 8) + w * gaussian(x, 66, 24);
    const curve = w => Array.from({ length: 241 }, (_, i) => [xp(i / 2), yp(density(i / 2, w))]);
    let chart = '<title>채널링 꼬리의 정성적 비교</title><desc>점선은 0도 정렬 상태이며 실선은 현재 설정입니다. 큰 틸트와 비정질 상태에서 긴 꼬리가 감소하도록 설계된 모형입니다.</desc>';
    chart += svgText(44, 24, '모형 농도 (상대값)', 'font-size="12"') + `<rect x="${xp(65)}" y="48" width="${xp(120) - xp(65)}" height="222" fill="#fff3e2"/>`;
    for (let y = 0; y < 4; y++) chart += line(44, 270 - y * 66, 311, 270 - y * 66, 'class="chart-grid"');
    [0, 60, 120].forEach(x => chart += svgText(xp(x), 291, x, 'text-anchor="middle" font-size="12"'));
    chart += `<path d="${pathString(curve(0.455))}" fill="none" stroke="#8391aa" stroke-width="2" stroke-dasharray="5 5"/><path d="${pathString(curve(tail))}" fill="none" stroke="#244ed8" stroke-width="3"/>`;
    chart += svgText(242, 72, '깊은 꼬리', 'text-anchor="middle" fill="#a35c19" font-size="12"') + svgText(310, 321, '모형 깊이 (임의 단위)', 'text-anchor="end" font-size="12"');
    $('channel-chart').innerHTML = chart;
    $('channel-observation').textContent = amorphous ? '표면층의 규칙적인 원자 배열이 사라진 비교 상태입니다. 이 모형에서는 깊은 꼬리가 작아집니다. 실제 PAI 효과는 비정질층 두께와 주입 조건에도 달려 있습니다.' : aligned ? '한 결정축과 가까이 정렬된 상태입니다. 일부 이온의 경로가 길어지는 모습을 깊이 분포의 꼬리와 함께 보세요.' : `틸트 ${tilt}°에서 이 모형의 깊은 꼬리가 줄었습니다. 실제로는 다른 결정면·Twist·표면층도 고려해야 하며, 이 각도가 최적 조건이라는 뜻은 아닙니다.`;
  }
  ['tilt', 'crystal'].forEach(id => $(id).addEventListener('input', drawChannel));
  $('tilt-zero').addEventListener('click', () => { $('tilt').value = 0; drawChannel(); });
  $('tilt-seven').addEventListener('click', () => { $('tilt').value = 7; drawChannel(); });
  $('channel-reset').addEventListener('click', () => { $('tilt').value = 0; $('crystal').value = 'crystalline'; drawChannel(); });
  drawChannel();

  // Sample a circular grid. Each spatial distribution is normalized to mean 1.
  const waferCells = [];
  for (let y = -10; y <= 10; y++) for (let x = -10; x <= 10; x++) if (Math.hypot(x, y) <= 10.1) waferCells.push({ x, y, r: Math.hypot(x, y) / 10 });
  let scanTimer = null;
  const stopScan = () => { if (scanTimer !== null) clearInterval(scanTimer); scanTimer = null; $('scan-play').textContent = '스캔 재생'; $('scan-play').setAttribute('aria-pressed', 'false'); };
  function scanValues(mode) {
    const values = waferCells.map(({ x, y, r }) => mode === 'fixed' ? Math.exp(-r * r / .11) + .006 : mode === 'edge' ? .28 + 2.0 * r ** 4 : 1 + .028 * Math.sin(x * .7) * Math.cos(y * .6));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.map(v => v / mean);
  }
  function drawScan() {
    const mode = $('scan-mode').value, progress = Number($('scan-progress').value), values = scanValues(mode);
    $('scan-progress-out').textContent = `${progress}%`;
    const cv = Math.sqrt(values.reduce((sum, v) => sum + (v - 1) ** 2, 0) / values.length) * 100;
    let picture = '<title>모형 웨이퍼의 누적량 분포</title><desc>스캔 방식에 따라 같은 총량이 다르게 분배됩니다. 현재 진행률 ' + progress + '%.</desc><circle cx="220" cy="164" r="143" fill="#f1f5fe" stroke="#a7b9dc" stroke-width="2"/>';
    waferCells.forEach((cell, i) => {
      const strength = Math.min(1, Math.sqrt(values[i] * progress / 100) * .70);
      const from = [238, 243, 255], to = [36, 78, 216];
      const color = from.map((v, k) => Math.round(v + (to[k] - v) * strength));
      picture += `<rect x="${214 + cell.x * 12.7}" y="${158 + cell.y * 12.7}" width="11.1" height="11.1" rx="1.6" fill="rgb(${color.join(',')})"/>`;
    });
    picture += '<path d="M211 306L220 296L229 306" fill="#fff" stroke="#a7b9dc" stroke-width="2"/>' + svgText(220, 330, '원형 격자 · 교육용 누적 도즈 맵', 'text-anchor="middle" font-size="12"');
    $('wafer-chart').innerHTML = picture;
    $('scan-cv').textContent = progress === 0 ? '—' : `${cv.toFixed(1)}%`;
    $('scan-observation').textContent = progress === 0 ? '아직 주입량이 없습니다. 평균이 0이므로 변동계수는 정의하지 않습니다.' : mode === 'fixed' ? '중앙에 누적량이 집중됩니다. 총량을 맞추는 것만으로 균일한 주입이 되지는 않습니다.' : mode === 'edge' ? '가장자리에 더 많은 양이 쌓입니다. 위치별 체류 시간이 분포를 바꾸는 비교입니다.' : '이상적인 전체 스캔에 작은 공간 변동을 더한 예시입니다. 실제 장비 성능 수치가 아닙니다.';
  }
  $('scan-mode').addEventListener('input', drawScan);
  $('scan-progress').addEventListener('input', () => { stopScan(); drawScan(); });
  $('scan-play').addEventListener('click', () => {
    if (scanTimer !== null) { stopScan(); return; }
    if (Number($('scan-progress').value) >= 100) $('scan-progress').value = 0;
    $('scan-play').textContent = '일시 정지'; $('scan-play').setAttribute('aria-pressed', 'true');
    scanTimer = setInterval(() => { $('scan-progress').value = Math.min(100, Number($('scan-progress').value) + 5); drawScan(); if (Number($('scan-progress').value) >= 100) stopScan(); }, 250);
  });
  $('scan-reset').addEventListener('click', () => { stopScan(); $('scan-mode').value = 'raster'; $('scan-progress').value = 60; drawScan(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopScan(); });
  window.addEventListener('pagehide', stopScan);
  document.addEventListener('readerchange', stopScan);
  drawScan();

  const annealStates = [
    { label: 'AS-IMPLANTED', title: '총 원자 수만으로는 전도성을 모른다', copy: '충돌로 흐트러진 격자와 비활성 도펀트를 함께 보여줍니다. 일부 원자가 들어왔다는 사실만으로 목표 전기 특성이 완성되지는 않습니다.', damage: '남아 있음', active: '충분하지 않을 수 있음', spread: '주입 분포' },
    { label: 'RECOVERY & ACTIVATION', title: '격자를 회복하고, 전기적 역할을 만든다', copy: '적절한 열처리는 손상 회복과 도펀트 활성화를 돕습니다. 모든 결함이 없어지거나 모든 도펀트가 활성화된다고 가정해서는 안 됩니다.', damage: '감소하는 방향', active: '증가하는 방향', spread: '일부 재분포 가능' },
    { label: 'DIFFUSION TRADE-OFF', title: '분포가 퍼지면 소자 결과도 달라진다', copy: '열 이력에 따른 확산이 커진 상황의 예시입니다. 활성화가 충분해도 목표한 얕은 분포를 유지하지 못할 수 있습니다. 실제 영향은 이온종과 결함·온도·시간에 의존합니다.', damage: '잔류 결함 검토 필요', active: '계속 증가한다고 단정 불가', spread: '더 넓어진 예시' }
  ];
  function setAnneal(index) {
    const state = annealStates[index];
    all('[data-anneal]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.anneal) === index)));
    $('anneal-state').textContent = state.label; $('anneal-heading').textContent = state.title; $('anneal-copy').textContent = state.copy;
    $('anneal-damage').textContent = state.damage; $('anneal-active').textContent = state.active; $('anneal-spread').textContent = state.spread;
    let picture = '<title>' + state.title + '</title><desc>' + state.copy + '</desc><rect x="18" y="40" width="493" height="250" rx="12" fill="#f3f6fb"/>' + svgText(22, 24, '실리콘 단면 · 개념도', 'fill="#56647a" font-size="13"');
    const dopants = index === 2 ? [3, 16, 21, 26, 33, 39, 45, 50, 57, 64] : [16, 18, 21, 25, 27, 29, 32, 34, 37, 39];
    for (let row = 0; row < 6; row++) for (let col = 0; col < 11; col++) {
      const n = row * 11 + col, x = 43 + col * 44, y = 66 + row * 40, doped = dopants.includes(n);
      if (index === 0 && (n % 8 === 2 || doped)) {
        picture += dot(x, y, 7, 'fill="none" stroke="#af683f" stroke-width="1.5" stroke-dasharray="3 2"');
        picture += dot(x + 13, y + 11, doped ? 6 : 5, `fill="${doped ? '#bc581b' : '#91a0b8'}"`);
      } else {
        const inactive = doped && (n % 3 === 0);
        picture += dot(x, y, doped ? 7 : 5, `fill="${doped ? (inactive ? '#bc581b' : '#244ed8') : '#a9b5c8'}"`);
      }
    }
    if (index === 0) picture += '<path d="M106 81L135 95L162 139L194 160L216 178M162 139L123 170M194 160L235 140" fill="none" stroke="#bc581b" stroke-width="2" stroke-dasharray="4 4" opacity=".55"/>';
    $('anneal-chart').innerHTML = picture;
  }
  all('[data-anneal]').forEach(b => b.addEventListener('click', () => setAnneal(Number(b.dataset.anneal))));
  $('anneal-reset').addEventListener('click', () => setAnneal(0));
  setAnneal(0);

  const quizzes = [
    { question: '이온종과 에너지를 고정하고 도즈만 2배로 늘렸습니다. 단순 모형에서 무엇이 달라질까요?', options: ['곡선의 전체 면적이 2배가 된다', '분포 중심이 반드시 2배 깊어진다'], answer: 0, reason: '도즈는 면적당 이온 수입니다. 분포 모양이 같다면 농도와 적분 면적이 2배가 됩니다. 실제 고도즈에서는 손상 누적 등으로 모양도 달라질 수 있습니다.', link: '#profile', label: '도즈·에너지 실험' },
    { question: '같은 전류·시간·면적에서 전하수 z를 1에서 2로 바꾸면 이온 수는?', options: ['2배가 된다', '절반이 된다'], answer: 1, reason: '전류는 이온의 개수가 아닌 전하의 흐름입니다. 이온 한 개당 전하량이 2배이면 같은 총 전하를 운반하는 이온 수는 절반입니다.', link: '#dose', label: '도즈 계산 실험' },
    { question: '평균 깊이는 비슷하지만 깊은 쪽 꼬리가 길어졌습니다. 어떤 설명을 먼저 검토할까요?', options: ['도즈가 같으면 분포 모양도 항상 같다', '결정 방향과 채널링의 영향이 달라졌을 수 있다'], answer: 1, reason: '채널링은 일부 이온이 더 깊이 들어가는 현상입니다. 평균 하나로 분포 전체를 설명할 수 없습니다. 입사 방향·표면층·손상 상태를 함께 확인합니다.', link: '#channel', label: '채널링 실험' },
    { question: 'SIMS 원소 분포가 비슷한 두 시료의 면저항이 다릅니다. 가능한 이유는?', options: ['활성화와 이동도 등의 차이를 추가로 확인해야 한다', 'SIMS 측정이 반드시 잘못되었다'], answer: 0, reason: 'SIMS의 화학적 원소 농도와 전기적 활성 캐리어 농도는 같은 측정값이 아닙니다. 활성화·결함·이동도와 측정 조건까지 연결해 해석합니다.', link: '#anneal', label: '손상·활성화 비교' }
  ];
  let answers = Array(quizzes.length).fill(null);
  function renderQuiz() {
    $('quiz-list').innerHTML = quizzes.map((q, i) => `<article class="quiz-card" aria-labelledby="question-${i}"><h3 id="question-${i}"><span>Q${i + 1}.</span>${q.question}</h3><div class="quiz-options" role="group" aria-labelledby="question-${i}">${q.options.map((option, choice) => `<button type="button" data-question="${i}" data-choice="${choice}" aria-pressed="false">${option}</button>`).join('')}</div><div id="feedback-${i}" class="quiz-feedback" role="status" hidden></div></article>`).join('');
    all('[data-question]').forEach(button => button.addEventListener('click', () => {
      const i = Number(button.dataset.question), choice = Number(button.dataset.choice), q = quizzes[i];
      answers[i] = choice;
      all(`[data-question="${i}"]`).forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.choice) === choice)));
      const correct = choice === q.answer, feedback = $(`feedback-${i}`);
      feedback.hidden = false; feedback.classList.toggle('wrong', !correct);
      feedback.innerHTML = `<p><strong>${correct ? '맞습니다.' : '다시 생각해 보세요.'}</strong> ${q.reason}</p><a href="${q.link}">${q.label}으로 돌아가기</a>`;
      const tried = answers.filter(a => a !== null).length, score = answers.filter((a, j) => a === quizzes[j].answer).length;
      $('quiz-score').textContent = `${tried} / 4문제 확인 · 현재 ${score}문제 정답`;
    }));
  }
  $('quiz-reset').addEventListener('click', () => { answers = Array(quizzes.length).fill(null); renderQuiz(); $('quiz-score').textContent = '0 / 4문제 확인'; });
  renderQuiz();
})();
