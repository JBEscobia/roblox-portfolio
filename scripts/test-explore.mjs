import {chromium, expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const base=process.env.TEST_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch();
try {
  const page=await browser.newPage({reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const slug of ['gravity-dash','time-tag','ants','anipal-archipelago']){
    const project=JSON.parse(await readFile(`src/content/projects/${slug}.json`,'utf8'));
    await page.goto(base+'/',{waitUntil:'networkidle'});
    const response=page.waitForResponse(r=>r.request().isNavigationRequest()&&new URL(r.url()).pathname===`/projects/${slug}/`);
    await page.locator(`#${slug} .project-evidence-footer a`).click();
    assert.equal((await response).status(),200,`${slug}: Explore must load successfully`);
    await expect(page.locator('h1')).toHaveText(project.title);
    await expect(page.locator('.feature-overview h3')).toHaveText(project.features.map(f=>f.title));
    await expect(page.locator('.supporting-media [data-media-id]')).toHaveCount(project.supporting.length);
    for(const id of project.supporting)await expect(page.locator(`.supporting-media [data-media-id="${id}"]`)).toBeVisible();
  }
  assert.deepEqual(errors,[]);
  console.log(`PASS: all four Explore links load current feature and media records without errors at ${base}.`);
} finally {await browser.close();}
