// Optional integration check: npm install --prefix .netlify/media-test-tools playwright
// Uses installed Edge and mocked content; no live Sanity/PostHog traffic.
import http from 'node:http';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from '../.netlify/media-test-tools/node_modules/playwright/index.mjs';

const fixture = [{galleries: [{title: 'Uke 1',
  images: [{asset: {_ref: `image-${'a'.repeat(40)}-2400x1600-jpg`}}],
  videos: [1, 2, 3].map(n => ({_key: String(n), asset: {_id: `file-${n}`,
    url: `http://127.0.0.1:4199/video-${n}.mov`, mimeType: 'video/quicktime'}})),
}]}];
await fs.mkdir('.netlify/media-browser', {recursive: true});
await build({stdin: {contents: `
  import React from 'react'; import {createRoot} from 'react-dom/client';
  import {ThemeProvider} from 'styled-components'; import {getTheme} from './src/styles/theme.js';
  import Gallery from './src/components/GalleryModal.jsx';
  createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={getTheme()}><Gallery litterId="test"/></ThemeProvider>);`,
  resolveDir: process.cwd(), loader: 'jsx'}, outfile: '.netlify/media-browser/app.js', bundle: true, format: 'esm',
  plugins: [{name: 'fixture', setup(builder) {
    builder.onResolve({filter: /sanityClient$/}, () => ({path: 'fixture', namespace: 'test'}));
    builder.onLoad({filter: /.*/, namespace: 'test'}, () => ({contents:
      `export default {config:()=>({projectId:'l6081rg7',dataset:'production'}),fetch:async()=>(${JSON.stringify(fixture)})}`}));
  }}]});
const server = http.createServer(async (req, res) => {
  if (req.url === '/app.js') {
    res.setHeader('Content-Type', 'text/javascript');
    res.end(await fs.readFile('.netlify/media-browser/app.js'));
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><html><div id="root"></div><script type="module" src="/app.js"></script></html>');
  }
});
await new Promise(resolve => server.listen(4199, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({channel: 'msedge', headless: true});
  const page = await browser.newPage();
  const requests = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/video-*.mov', async route => {requests.push(route.request().url()); await route.abort();});
  await page.route('https://cdn.sanity.io/**', route => route.abort());
  await page.goto('http://127.0.0.1:4199');
  await page.getByRole('button', {name: 'Spill av video 2', exact: true}).waitFor();
  assert.equal(await page.locator('video').count(), 0);
  assert.equal(requests.length, 0);
  assert.equal(await page.locator('img').first().getAttribute('loading'), 'lazy');
  assert.match(await page.locator('img').first().getAttribute('src'), /w=320/);
  await Promise.all([
    page.waitForRequest('**/video-1.mov'),
    page.getByRole('button', {name: 'Spill av video 2', exact: true}).click(),
  ]);
  assert.equal(await page.locator('video').getAttribute('src'), 'http://127.0.0.1:4199/video-1.mov');
  assert.equal(await page.locator('video').getAttribute('preload'), 'metadata');
  await page.getByRole('button').last().click();
  await page.waitForFunction(() => document.querySelector('video')?.src.endsWith('video-2.mov'));
  await page.locator('video').locator('..').getByRole('button').first().click();
  assert.equal(await page.locator('video').count(), 0);
  await page.setViewportSize({width: 390, height: 844});
  await page.getByRole('button', {name: 'Spill av video 4', exact: true}).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('video')?.src.endsWith('video-3.mov'));
  assert.equal(await page.locator('video').getAttribute('playsinline'), '');
  assert.ok(requests.every(url => /video-[123]\.mov$/.test(url)));
  assert.deepEqual(errors, []);
  console.log('PASS: no video download before click; source changes on navigation; player removed on close; mobile keyboard opening; lazy image; no React errors.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
