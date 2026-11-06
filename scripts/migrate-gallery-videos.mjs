import {createClient} from '@sanity/client';
import {config} from 'dotenv';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';

config({quiet: true});
const client = createClient({projectId: 'l6081rg7', dataset: 'production',
  apiVersion: '2025-03-02', useCdn: false, perspective: 'raw', token: process.env.SANITY_TOKEN});
const docs = await client.fetch('*[_type == "litter"]');
const plans = docs.map((doc) => {
  const set = {};
  for (const gallery of doc.galleries || []) {
    if (!gallery.video?.asset?._ref || Array.isArray(gallery.videos)) continue;
    assert(gallery._key, 'Gallery without stable key');
    set[`galleries[_key==${JSON.stringify(gallery._key)}].videos`] = [
      {...gallery.video, _key: `legacy-${gallery._key}`},
    ];
  }
  return {doc, set};
}).filter(({set}) => Object.keys(set).length);
const count = plans.reduce((sum, plan) => sum + Object.keys(plan.set).length, 0);
console.log(JSON.stringify({documents: plans.length, referencesToCopy: count, apply: process.argv.includes('--apply')}));
if (!process.argv.includes('--apply') || !count) process.exit(0);
assert.equal(count, 10, 'Expected exactly the ten reviewed video references; review changed content before migration');
const refs = plans.flatMap(({set}) => Object.values(set).map(([video]) => video.asset._ref));
const assets = await client.fetch('*[_id in $refs]{_id}', {refs});
assert.equal(new Set(assets.map(a => a._id)).size, new Set(refs).size, 'Missing video asset');
const directory = resolve('.netlify/sanity-backups');
await mkdir(directory, {recursive: true});
const backup = resolve(directory, `gallery-videos-before-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
await writeFile(backup, JSON.stringify({projectId: 'l6081rg7', dataset: 'production', docs}, null, 2), {flag: 'wx'});
assert.deepEqual(JSON.parse(await readFile(backup, 'utf8')).docs, docs);
console.log(`Backup verified: ${backup}`);
let transaction = client.transaction();
for (const {doc, set} of plans) {
  transaction = transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).set(set));
}
await transaction.commit();
const after = await client.fetch('*[_type == "litter"]');
for (const {doc} of plans) {
  const updated = after.find(item => item._id === doc._id);
  const expected = structuredClone(doc);
  for (const gallery of expected.galleries || []) {
    if (gallery.video?.asset?._ref && !Array.isArray(gallery.videos)) {
      gallery.videos = [{...gallery.video, _key: `legacy-${gallery._key}`}];
    }
  }
  for (const item of [expected, updated]) { delete item._rev; delete item._updatedAt; }
  assert.deepEqual(updated, expected, 'Unexpected document changes after migration');
}
console.log(`Verified ${count} copied references; legacy fields and all other content unchanged.`);
