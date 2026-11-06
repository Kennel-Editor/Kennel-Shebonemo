import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';
import dotenv from 'dotenv';
import {getLitterParentImage} from '../src/utils/litterParentImage.js';

dotenv.config({quiet: true});
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET,
  apiVersion: '2025-01-01', useCdn: false,
});
const litters = await client.fetch(`*[_type == 'litter']{
  _id, mother{..., 'dog': dogReference->}, father{..., 'dog': dogReference->}
}`);
let checked = 0;
for (const litter of litters) {
  for (const role of ['mother', 'father']) {
    const parent = litter[role] || {};
    const dog = parent.dog || undefined;
    if (parent.imageSelectionVersion === 1) continue;
    const oldList = parent.overrideImage?.asset ? parent.overrideImage
      : dog?.image?.asset ? dog.image : parent.image?.asset ? parent.image : null;
    const oldMerged = {...parent, ...dog,
      overrideImage: parent.overrideImage || dog?.overrideImage};
    const oldDetail = oldMerged.overrideImage?.asset ? oldMerged.overrideImage : oldMerged.image || null;
    assert.deepEqual(getLitterParentImage(parent, dog), oldList, `${litter._id} ${role} list`);
    const selected = getLitterParentImage(parent, dog, 'detail');
    const displayedDetail = selected?.asset ? selected : oldMerged.image || null;
    assert.deepEqual(displayedDetail, oldDetail, `${litter._id} ${role} detail`);
    checked++;
  }
}
const standard = {asset: {_ref: 'standard'}, hotspot: {x: 0.2}};
const custom = {asset: {_ref: 'custom'}, crop: {left: 0.1}};
for (const view of ['list', 'detail']) {
  const parent = {imageSelectionVersion: 1, overrideImage: custom};
  assert.equal(getLitterParentImage({...parent, overrideImageButton: true}, {image: standard}, view), custom);
  assert.equal(getLitterParentImage({...parent, overrideImageButton: false}, {image: standard}, view), standard);
  assert.equal(getLitterParentImage({...parent, overrideImage: null, overrideImageButton: true}, {image: standard}, view), standard);
}
console.log(`PASS: ${checked} parents in ${litters.length} published litters retain identical list/detail images, including crop/hotspot. New toggle on/off and fallback pass.`);
