import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir, readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {galleryVideos} from '../src/utils/media.js';

test('legacy videos are readable, migrated arrays are authoritative, duplicates are removed', () => {
  const video = {asset: {_ref: 'file-one-mov'}};
  assert.deepEqual(galleryVideos({video}), [video]);
  assert.deepEqual(galleryVideos({video, videos: []}), []);
  assert.deepEqual(galleryVideos({video, videos: [video, video]}), [video]);
  assert.deepEqual(galleryVideos({video, videos: [{asset: {_ref: 'file-two-mp4'}}]}),
    [{asset: {_ref: 'file-two-mp4'}}]);
});

test('responsive image URLs cap dimensions and preserve editorial crop', async () => {
  await mkdir('.netlify/media-tests', {recursive: true});
  const outfile = resolve('.netlify/media-tests/image-helper.mjs');
  await build({entryPoints: ['src/utils/sanityImage.js'], outfile, bundle: true, platform: 'node', format: 'esm',
    plugins: [{name: 'public-client', setup(builder) {
      builder.onResolve({filter: /sanityClient$/}, () => ({path: 'client', namespace: 'test'}));
      builder.onLoad({filter: /.*/, namespace: 'test'}, () => ({contents:
        'export default {config: () => ({projectId: "l6081rg7", dataset: "production"})}'}));
    }}]});
  const {imageProps} = await import(pathToFileURL(outfile));
  const image = {asset: {_ref: `image-${'a'.repeat(40)}-2400x1600-jpg`},
    crop: {left: 0.1, right: 0.1, top: 0, bottom: 0}};
  const props = imageProps(image, {width: 640, sizes: '150px'});
  const url = new URL(props.src);
  assert.equal(url.searchParams.get('w'), '640');
  assert.equal(url.searchParams.get('fit'), 'max');
  assert.equal(url.searchParams.get('auto'), 'format');
  assert.equal(url.searchParams.get('q'), '80');
  assert.ok(url.searchParams.get('rect'), 'editorial crop is preserved');
  assert.equal(props.loading, 'lazy');
  assert.equal(props.sizes, '150px');
  assert.equal(props.srcSet.split(', ').length, 2);
  assert.equal(imageProps(image, {lazy: false}).loading, 'eager');
  assert.equal(imageProps(null).src, null);
});

test('Studio publishes only within the agreed gallery limits and preserves the hidden legacy field', async () => {
  const capture = () => {
    let max, severity = 'error';
    const rule = {max(value) {max = value; return rule;}, error() {return rule;},
      warning() {severity = 'warning'; return rule;}};
    return {rule, result: () => ({max, severity})};
  };
  const gallery = (await import('../sanity-studio/schemaTypes/gallery.js')).default;
  const dog = (await import('../sanity-studio/schemaTypes/dogs.js')).default;
  const litter = (await import('../sanity-studio/schemaTypes/litter.js')).default;
  const galleries = litter.fields.find(field => field.name === 'galleries');
  const fields = galleries.of[0].fields;
  for (const [field, expected] of [[gallery.fields.find(f => f.name === 'images'), 40],
    [dog.fields.find(f => f.name === 'gallery'), 15], [galleries, 15],
    [fields.find(f => f.name === 'images'), 20], [fields.find(f => f.name === 'videos'), 3]]) {
    const check = capture(); field.validation(check.rule);
    assert.deepEqual(check.result(), {max: expected, severity: 'error'});
  }
  const legacy = fields.find(f => f.name === 'video');
  assert.equal(legacy.hidden, true);
  assert.equal(legacy.readOnly, true);
});

test('video dialog changes source on navigation and does not force MOV to MP4', async () => {
  const source = await readFile('src/utils/GalleryImageModal.jsx', 'utf8');
  assert.match(source, /key=\{videoUrl\}/);
  assert.match(source, /preload="metadata"/);
  assert.doesNotMatch(source, /type="video\/mp4"/);
});
