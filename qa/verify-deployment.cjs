// Read-only release verification for the explicitly authorized, existing Pages target.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const requireQA=name=>{try{return require(name)}catch{return require(path.resolve(__dirname,'../../qa-tools/node_modules',name))}};
const {chromium}=requireQA('playwright');
const repo='ddllddbb8676-cloud/ion-implantation-lab';
const expectedUrl='https://ddllddbb8676-cloud.github.io/ion-implantation-lab/';
const [sha,runId]=process.argv.slice(2);
if(!/^[a-f0-9]{40}$/.test(sha||'')||!/^\d+$/.test(runId||''))throw new Error('Expected a full commit SHA and numeric Actions run ID.');
const root=path.resolve(__dirname,'..'),output=path.join(__dirname,'results/v03-release');
fs.mkdirSync(output,{recursive:true});
const api=endpoint=>JSON.parse(execFileSync('gh',['api',endpoint],{encoding:'utf8',windowsHide:true}));
(async()=>{
  const remote=api(`repos/${repo}/commits/main`),run=api(`repos/${repo}/actions/runs/${runId}`),pages=api(`repos/${repo}/pages`),repository=api(`repos/${repo}`);
  assert.equal(remote.sha,sha);assert.equal(run.head_sha,sha);assert.equal(run.status,'completed');assert.equal(run.conclusion,'success');
  assert.equal(repository.full_name,repo);assert.equal(repository.private,false);assert.equal(pages.html_url,expectedUrl);assert.equal(pages.build_type,'workflow');assert.equal(pages.cname,null);assert.equal(pages.https_enforced,true);
  const deployment=api(`repos/${repo}/deployments?sha=${sha}&environment=github-pages`).find(d=>d.sha===sha);
  assert.ok(deployment,'No matching Pages deployment.');const state=api(`repos/${repo}/deployments/${deployment.id}/statuses`)[0];assert.equal(state.state,'success');
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'site-manifest.json'),'utf8'));
  const browser=await chromium.launch({executablePath:process.env.IMP_BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const publicAssets=[];
  try{
    const context=await browser.newContext();
    for(const item of manifest.files.filter(f=>!f.path.endsWith('.nojekyll'))){
      const filename=item.path.slice(5);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,item.path))).digest('hex'),item.sha256,'Local manifest mismatch');
      for(const cacheProbe of [false,true]){
        const url=new URL(filename,expectedUrl);if(cacheProbe)url.searchParams.set('verified_commit',sha);
        const response=await context.request.get(url.href,{timeout:30000});assert.equal(response.status(),200,filename);
        const bytes=await response.body(),digest=crypto.createHash('sha256').update(bytes).digest('hex');assert.equal(digest,item.sha256,`Public asset differs: ${url.href}`);
        publicAssets.push({url:url.href,status:response.status(),bytes:bytes.length,sha256:digest,matchesLocal:true});
      }
    }
    const page=await context.newPage();const response=await page.goto(expectedUrl,{waitUntil:'networkidle',timeout:45000});assert.equal(response.status(),200);assert.equal(await page.locator('.chapter').count(),12);assert.equal(await page.locator('.lab').count(),14);
    await page.goto(expectedUrl+'#devices');await page.locator('#devices').waitFor({state:'visible'});await page.selectOption('#device-voltage','hv');await page.selectOption('#device-polarity','p');await page.click('[data-device-step="5"]');assert.match(await page.locator('#device-chart').textContent(),/HV 측면 드리프트.*PMOS/);
    await page.screenshot({path:path.join(output,'verified-public-hv-pmos.png')});
  }finally{await browser.close();}
  const report={verifiedAt:new Date().toISOString(),repository:{name:repo,url:repository.html_url,public:true},remoteCommit:sha,commitUrl:remote.html_url,workflow:{runId:Number(runId),headSha:run.head_sha,status:run.status,conclusion:run.conclusion,url:run.html_url},deployment:{id:deployment.id,sha:deployment.sha,state:state.state,environmentUrl:state.environment_url},pages:{url:pages.html_url,httpsEnforced:pages.https_enforced,cname:pages.cname,buildType:pages.build_type},publicAssets,authorization:'Explicit user request to finish and redeploy to the existing repository and Pages site. No DNS or authentication scope changes.'};
  fs.writeFileSync(path.join(output,'deployment-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({remoteCommit:sha,workflow:report.workflow,deployment:report.deployment,pages:report.pages,verifiedAssetResponses:publicAssets.length},null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
