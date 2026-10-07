// Browser validation: node qa/browser-check.cjs (requires Playwright and axe-core).
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const requireQA = name => { try { return require(name); } catch { return require(path.resolve(__dirname,'../../qa-tools/node_modules',name)); } };
const { chromium } = requireQA('playwright');
const { default: AxeBuilder } = requireQA('@axe-core/playwright');
const siteRoot = path.resolve(__dirname, '../site');
const output = path.resolve(__dirname, 'results');
fs.mkdirSync(output, { recursive: true });
const checks = [], errors = [], failures = [], accessibility = [];
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/ion-implantation-lab(?=\/)/, ''); } catch { res.writeHead(400); res.end(); return; }
  const file = path.resolve(siteRoot, '.' + (urlPath.endsWith('/') ? urlPath + 'index.html' : urlPath));
  if (!file.startsWith(siteRoot + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, body) => { res.writeHead(err ? 404 : 200, { 'Content-Type': mime[path.extname(file)] || 'text/plain' }); res.end(err ? 'Not found' : body); });
});
const fillRange = async (page, id, value) => page.locator('#' + id).evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, String(value));
async function check(name, fn) { try { await fn(); checks.push({ name, passed: true }); } catch (e) { checks.push({ name, passed: false, error: e.message }); failures.push(name); } }
const text = (page, id) => page.locator('#' + id).innerText();
const noOverflow = page => page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, bad: [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.width && (r.right > innerWidth + 2 || r.left < -2) && !el.closest('.beam-visual,.sidebar,.skip-link') && getComputedStyle(el).position !== 'absolute'; }).slice(0,12).map(el => ({ tag: el.tagName, id: el.id, class: el.className.baseVal || el.className })) }));
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/ion-implantation-lab/`;
  const executablePath = process.env.IMP_BROWSER_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined);
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push({ type: 'pageerror', message: e.message }));
  page.on('console', m => { if (m.type() === 'error') errors.push({ type: 'console', message: m.text() }); });
  page.on('requestfailed', r => errors.push({ type: 'requestfailed', message: r.url() + ' ' + r.failure()?.errorText }));
  await page.goto(base, { waitUntil: 'networkidle' });
  await check('Project-path assets and Korean document load', async () => { assert.equal(await page.title(), 'IMP LAB · 직접 만지는 이온주입'); assert.equal(await page.locator('html').getAttribute('lang'), 'ko'); assert.equal(await page.locator('.chapter').count(), 7); assert.equal(await page.locator('svg').count(), 6); });
  await page.screenshot({ path: path.join(output, 'desktop-top.png') });
  await check('Five beamline stages and repeated reset', async () => {
    for (let pass = 0; pass < 2; pass++) { for (let i = 0; i < 5; i++) { await page.locator(`[data-stage="${i}"]`).click(); assert.equal(await page.locator(`[data-stage="${i}"]`).getAttribute('aria-pressed'), 'true'); assert.match(await text(page, 'stage-count'), new RegExp('0' + (i + 1))); } await page.locator('#beam-reset').click(); assert.equal(await text(page, 'stage-count'), '01 / 05'); }
  });
  await check('Profile: dose area ratio, invariant center, energy shift, species and reset', async () => {
    const center = await text(page, 'profile-center');
    await page.locator('#profile-save').click(); await fillRange(page, 'profile-dose', 4);
    assert.equal(await text(page, 'profile-ratio'), '2.00배'); assert.equal(await text(page, 'profile-center'), center);
    await fillRange(page, 'energy', 80); assert.ok(Number(await text(page, 'profile-center')) > Number(center));
    await page.locator('#species').selectOption('As'); assert.ok(Number(await text(page, 'profile-center')) < 35);
    for (const species of ['B','P','As']) { await page.locator('#species').selectOption(species); for (const energy of [20,100]) { await fillRange(page, 'energy', energy); for (const dose of [1,5]) { await fillRange(page, 'profile-dose', dose); assert.doesNotMatch(await page.locator('#profile-chart').innerHTML(), /NaN|Infinity/); } } }
    await page.locator('#profile-reset').click(); assert.equal(await text(page, 'profile-center'), '35.0'); assert.equal(await page.locator('#profile-clear').isDisabled(), true);
    await page.locator('#profile-save').click(); await fillRange(page, 'profile-dose', 4);
    await page.locator('#profile .lab').screenshot({ path: path.join(output,'desktop-profile.png') });
    await page.locator('#profile-clear').click(); assert.equal(await page.locator('#saved-legend').isHidden(), true); await page.locator('#profile-reset').click();
  });
  await check('Dose calculator: formula, charge, zero, negatives, empty, nonfinite, boundaries, recovery', async () => {
    assert.equal(await text(page,'dose-result'), '6.24 × 10¹²');
    await page.locator('#charge').selectOption('2'); assert.equal(await text(page,'dose-result'), '3.12 × 10¹²');
    await page.locator('#current').fill('0'); assert.equal(await text(page,'dose-result'), '0');
    for (const [id,value] of [['area','0'],['current','-1'],['duration',''],['area','10001']]) { await page.locator('#dose-reset').click(); await page.locator('#'+id).fill(value); assert.equal(await page.locator('#dose-error').isVisible(), true); assert.equal(await text(page,'dose-result'), '입력 확인'); }
    await page.locator('#dose-reset').click(); await page.locator('#area').fill('0.01'); await page.locator('#current').fill('10000'); await page.locator('#duration').fill('10000'); assert.doesNotMatch(await text(page,'dose-result'), /NaN|Infinity|입력/);
    await page.locator('#duration').fill('1e309'); assert.equal(await text(page,'dose-result'), '입력 확인');
    await page.locator('#dose-reset').click(); assert.equal(await text(page,'dose-result'), '6.24 × 10¹²'); assert.equal(await page.locator('#dose-error').isHidden(), true);
  });
  await check('Channeling: tilt presets, disorder, extremes and reset', async () => {
    const initial = await page.locator('#channel-chart').innerHTML(); await page.locator('#tilt-seven').click(); assert.equal(await text(page, 'tilt-out'), '7°'); assert.notEqual(await page.locator('#channel-chart').innerHTML(), initial);
    await page.locator('#crystal').selectOption('amorphous'); assert.match(await text(page,'channel-observation'), /비정질층/);
    await fillRange(page,'tilt',15); assert.doesNotMatch(await page.locator('#channel-chart').innerHTML(), /NaN|Infinity/);
    await page.locator('#channel-reset').click(); assert.equal(await text(page,'tilt-out'), '0°'); assert.equal(await page.locator('#crystal').inputValue(), 'crystalline');
  });
  await check('Wafer map: spatial variation, zero, play/pause, complete, replay, reset timer', async () => {
    const uniform = parseFloat(await text(page,'scan-cv'));
    await page.locator('#scan-mode').selectOption('fixed'); assert.ok(parseFloat(await text(page,'scan-cv')) > uniform);
    await page.locator('#scan-mode').selectOption('edge'); assert.ok(parseFloat(await text(page,'scan-cv')) > uniform);
    await fillRange(page,'scan-progress',0); assert.equal(await text(page,'scan-cv'), '—');
    await page.locator('#scan-play').click(); await page.waitForTimeout(650); await page.locator('#scan-play').click(); const stopped = await page.locator('#scan-progress').inputValue(); await page.waitForTimeout(400); assert.equal(await page.locator('#scan-progress').inputValue(), stopped);
    await fillRange(page,'scan-progress',95); await page.locator('#scan-play').click(); await page.waitForTimeout(400); assert.equal(await text(page,'scan-progress-out'), '100%'); assert.equal(await page.locator('#scan-play').getAttribute('aria-pressed'),'false');
    await page.locator('#scan-play').click(); await page.waitForTimeout(350); assert.ok(Number(await page.locator('#scan-progress').inputValue()) < 100);
    await page.locator('#scan-reset').click(); await page.waitForTimeout(400); assert.equal(await text(page,'scan-progress-out'),'60%'); assert.equal(await page.locator('#scan-mode').inputValue(),'raster');
  });
  await check('Anneal states and repeated reset', async () => { for (let pass=0;pass<2;pass++) { for (let i=0;i<3;i++) { await page.locator(`[data-anneal="${i}"]`).click(); assert.equal(await page.locator(`[data-anneal="${i}"]`).getAttribute('aria-pressed'),'true'); } await page.locator('#anneal-reset').click(); assert.equal(await text(page,'anneal-state'),'AS-IMPLANTED'); } });
  await check('Quiz: wrong answer, correction, score, reset and repeat', async () => {
    await page.locator('[data-question="0"][data-choice="1"]').click(); assert.match(await text(page,'feedback-0'),/다시 생각/);
    for (const [i,answer] of [0,1,1,0].entries()) await page.locator(`[data-question="${i}"][data-choice="${answer}"]`).click();
    assert.equal(await text(page,'quiz-score'),'4 / 4문제 확인 · 현재 4문제 정답'); await page.locator('#quiz-reset').click(); assert.equal(await text(page,'quiz-score'),'0 / 4문제 확인'); assert.equal(await page.locator('.quiz-feedback:not([hidden])').count(),0);
    await page.locator('[data-question="1"][data-choice="1"]').click(); assert.equal(await text(page,'quiz-score'),'1 / 4문제 확인 · 현재 1문제 정답'); await page.locator('#quiz-reset').click();
  });
  await check('All local navigation and reference anchors resolve; unique IDs', async () => { const result = await page.evaluate(() => { const ids=[...document.querySelectorAll('[id]')].map(x=>x.id); return { duplicates:ids.filter((x,i)=>ids.indexOf(x)!==i), broken:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash) }; }); assert.deepEqual(result,{duplicates:[],broken:[]}); });
  await check('Keyboard: skip link, range arrow, menu Escape', async () => {
    await page.goto(base); await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link'); await page.keyboard.press('Enter'); assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
    await page.locator('#energy').focus(); await page.keyboard.press('ArrowRight'); assert.equal(await page.locator('#energy').inputValue(),'45'); await page.locator('#profile-reset').click();
  });
  for (const [name, size] of [['desktop',{width:1440,height:1050}],['tablet',{width:768,height:1024}],['mobile',{width:390,height:844}],['small-mobile',{width:320,height:700}]]) {
    await page.setViewportSize(size); await page.goto(base); const overflow = await noOverflow(page);
    await check(`${name}: no page overflow`, async () => { assert.ok(overflow.scroll <= overflow.width,JSON.stringify(overflow)); });
    if (name==='desktop'||name==='mobile') { const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze(); accessibility.push({viewport:name, violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))}); }
    if (name==='mobile') {
      await page.screenshot({path:path.join(output,'mobile-top.png')});
      await check('Mobile menu: open, Escape, navigate, return, collapsed focus', async () => { await page.locator('#menu-toggle').click(); assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true'); await page.keyboard.press('Escape'); assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false'); await page.locator('#menu-toggle').click(); await page.locator('#chapter-nav a[href="#profile"]').click(); assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false'); assert.equal(await page.evaluate(()=>document.activeElement.id),'profile'); assert.ok(page.url().endsWith('#profile')); });
      await check('Mobile beam diagram follows selected stage and resets its scroll',async()=>{await page.locator('[data-stage="4"]').click();assert.ok(await page.locator('.beam-visual').evaluate(el=>el.scrollLeft)>200);await page.locator('#beam-reset').click();assert.ok(await page.locator('.beam-visual').evaluate(el=>el.scrollLeft)<5);});
      await page.locator('#profile .lab').screenshot({path:path.join(output,'mobile-profile.png'),style:'.topbar,.skip-link{visibility:hidden}'});
      await page.locator('#channel .lab').screenshot({path:path.join(output,'mobile-channel.png'),style:'.topbar,.skip-link{visibility:hidden}'});
    }
  }
  await page.setViewportSize({width:640,height:480}); await page.goto(base);
  await check('200% zoom equivalent: 1280px display with 640 CSS pixels reflows', async () => { const overflow=await noOverflow(page); assert.ok(overflow.scroll <= overflow.width,JSON.stringify(overflow)); });
  await page.setViewportSize({width:1440,height:1050}); await page.goto(base);
  await check('200% HTML text enlargement: no page overflow', async () => { await page.evaluate(()=>{const elements=[...document.querySelectorAll('body *')].filter(el=>el instanceof HTMLElement);const sizes=elements.map(el=>parseFloat(getComputedStyle(el).fontSize));elements.forEach((el,i)=>el.style.fontSize=sizes[i]*2+'px');}); const overflow=await noOverflow(page); assert.ok(overflow.scroll <= overflow.width,JSON.stringify(overflow)); await page.screenshot({path:path.join(output,'desktop-text-200.png')}); });
  const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}); const staticPage=await noJS.newPage(); await staticPage.goto(base);
  await check('No JavaScript: concepts, sources, notice remain readable', async () => { assert.equal(await staticPage.locator('noscript').isVisible(),true); assert.equal(await staticPage.locator('.references li').count(),11); assert.match(await staticPage.locator('body').innerText(),/원자를 심어/); }); await noJS.close();
  await page.setViewportSize({width:1440,height:1050}); await page.goto('file:///' + path.join(siteRoot,'index.html').replace(/\\/g,'/'));
  await check('Offline file opening: interactive calculator works without server',async()=>{assert.equal(await text(page,'dose-result'),'6.24 × 10¹²');await page.locator('#current').fill('20');assert.equal(await text(page,'dose-result'),'1.25 × 10¹³');});
  await browser.close(); server.close();
  const report={checkedAt:new Date().toISOString(),browser:'Installed Chrome via Playwright',checks,accessibility,errors,limitations:['Automated checks do not replace screen reader or real mobile device validation.','Physical models are illustrative, not calibrated process simulation.','No public deployment attempted without an authorized repository target.']};
  fs.writeFileSync(path.join(output,'browser-report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({checks:checks.length,passed:checks.filter(c=>c.passed).length,failures,accessibility,errors},null,2));
  if(failures.length||accessibility.some(a=>a.violations.length)||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1);});
