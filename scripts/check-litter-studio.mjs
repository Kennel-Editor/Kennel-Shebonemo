import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {transform} from 'esbuild';

const source = (await readFile('sanity-studio/schemaTypes/litter.js', 'utf8'))
  .replace("import ParentImageInput from '../components/ParentImageInput'", 'const ParentImageInput = null');
const {default: schema} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
assert.equal(schema.preview.prepare({motherReferenceNickname: 'Zizu', fatherNickname: 'Carlos'}).subtitle, 'Zizu |  Carlos');
assert.equal(schema.preview.prepare({motherName: 'Mother', fatherName: 'Father'}).subtitle, 'Mother |  Father');
assert.equal(schema.preview.prepare({motherReferenceName: 'Mother', fatherReferenceName: 'Father'}).subtitle, 'Mother |  Father');
assert.equal(schema.preview.prepare({motherNickname: 'Mother', fatherReferenceNickname: 'Father'}).subtitle, 'Mother |  Father');
for (const side of ['mother', 'father']) {
  const fields = schema.fields.find((field) => field.name === side).fields;
  const info = fields.find((field) => field.name === 'info');
  assert.equal(info.type, 'text');
  assert.equal(info.readOnly, true);
  assert.equal(info.hidden({value: 'Eye exam 12.08.2020'}), false);
  assert.equal(info.hidden({value: undefined}), true);
  const visible = (parent) => fields.filter((field) =>
    ['image', 'overrideImage'].includes(field.name) && !field.hidden({parent}),
  ).map((field) => field.name);
  assert.deepEqual(visible({dogReference: {_ref: 'dog'}}), []);
  assert.deepEqual(visible({dogReference: {_ref: 'dog'}, overrideImageButton: true}), ['overrideImage']);
  assert.deepEqual(visible({isOwned: false}), ['image']);
  assert.deepEqual(visible({dogReference: {_ref: 'dog'}, image: {asset: {_ref: 'old'}}}), ['image']);
  // An archived image stays accessible, but never creates a second editable image input.
  for (const parent of [
    {isOwned: false},
    {dogReference: {_ref: 'dog'}, overrideImageButton: true},
    {dogReference: {_ref: 'dog'}, overrideImageButton: true, image: {asset: {_ref: 'old'}}},
    {isOwned: false, image: {asset: {_ref: 'old'}}, overrideImage: {asset: {_ref: 'custom'}}},
    {imageSelectionVersion: 1, overrideImageButton: false, overrideImage: {asset: {_ref: 'saved'}}},
  ]) {
    const editableImages = fields.filter((field) =>
      ['image', 'overrideImage'].includes(field.name) && !field.hidden({parent}) &&
      !(typeof field.readOnly === 'function' ? field.readOnly({parent}) : field.readOnly),
    );
    assert.ok(editableImages.length <= 1);
  }
}

// Use the actual Sanity patch primitives: ordinary edits must not opt old litters in.
const patchSource = (await readFile('sanity-studio/components/ParentImageInput.jsx', 'utf8'))
  .replace("from 'sanity'", `from '${new URL('../sanity-studio/node_modules/sanity/lib/index.js', import.meta.url).href}'`);
const {default: ParentImageInput} = await import('data:text/javascript;base64,' + Buffer.from(patchSource).toString('base64'));
const {PatchEvent, set} = await import('../sanity-studio/node_modules/sanity/lib/index.js');
let patches;
const input = ParentImageInput({onChange: (event) => { patches = event.patches; }, renderDefault: (props) => props});
input.onChange(PatchEvent.from(set(false, ['overrideImageButton'])));
assert.deepEqual(patches.map((patch) => ({path: patch.path, value: patch.value})), [
  {path: ['overrideImageButton'], value: false},
  {path: ['imageSelectionVersion'], value: 1},
]);
input.onChange(PatchEvent.from(set('Preserved text', ['additionalInfo'])));
assert.equal(patches.length, 1);
assert.deepEqual(patches[0].path, ['additionalInfo']);

const require = createRequire(import.meta.url);
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const compiled = await transform(await readFile('src/components/LitterAdditionalInfo.jsx', 'utf8'), {
  loader: 'jsx', format: 'cjs',
});
const module = {exports: {}};
new Function('require', 'module', 'exports', compiled.code)(require, module, module.exports);
const {default: AdditionalInfo, getLegacyParentInfo} = module.exports;
const legacy = 'HD - A\nEye exam 12.08.2020\nHeight 60 cm';
assert.deepEqual(getLegacyParentInfo({info: legacy}, {info: legacy}), [legacy]);
assert.deepEqual(getLegacyParentInfo({info: legacy}, {info: 'Other preserved text'}), [legacy, 'Other preserved text']);
assert.deepEqual(getLegacyParentInfo({info: false}), []);
const html = renderToStaticMarkup(React.createElement(AdditionalInfo, {parent: {
  additionalInfo: 'Height 60 cm',
  extraInfoList: [{_key: 'owner', title: 'Owner', description: 'Preserved owner'}],
  legacyInfoTexts: getLegacyParentInfo({info: legacy}),
}}));
assert.ok(html.includes('12.08.2020'));
assert.ok(html.includes('Preserved owner'));
assert.ok(html.includes('Height 60 cm'));
assert.ok(html.includes('<details>'));
assert.equal(renderToStaticMarkup(React.createElement(AdditionalInfo, {parent: {}})), '');
console.log('PASS: Studio preview, image fields, read-only legacy info, and rendered legacy dates/additional information.');
