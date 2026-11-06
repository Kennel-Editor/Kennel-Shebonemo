// Read ISO BMFF/MOV headers with HTTP Range; never uploads or modifies media.
import {createClient} from '@sanity/client';
import {config} from 'dotenv';
import {mkdir, writeFile} from 'node:fs/promises';
config({quiet: true});
const client = createClient({projectId: 'l6081rg7', dataset: 'production', apiVersion: '2025-03-02',
  useCdn: false, perspective: 'raw', token: process.env.SANITY_TOKEN});
const docs = await client.fetch('*[_type == "litter"]{_id,galleries[]{_key,title,video{asset->{_id,url,size,mimeType}}}}');
async function range(url, start, length) {
  const response = await fetch(url, {headers: {Range: `bytes=${start}-${start + length - 1}`}});
  if (response.status !== 206) {
    await response.body?.cancel();
    throw new Error(`Server did not honor Range (${response.status})`);
  }
  return Buffer.from(await response.arrayBuffer());
}
function boxes(buffer, start = 0, end = buffer.length) {
  const result = [];
  while (start + 8 <= end) {
    let size = buffer.readUInt32BE(start), header = 8;
    const type = buffer.toString('ascii', start + 4, start + 8);
    if (size === 1) {size = Number(buffer.readBigUInt64BE(start + 8)); header = 16;}
    if (size === 0) size = end - start;
    if (size < header || start + size > end) break;
    result.push({type, start: start + header, end: start + size});
    start += size;
  }
  return result;
}
function find(buffer, path, start = 0, end = buffer.length) {
  const [type, ...rest] = path;
  return boxes(buffer, start, end).filter(box => box.type === type)
    .flatMap(box => rest.length ? find(buffer, rest, box.start, box.end) : [box]);
}
const report = [];
for (const doc of docs) for (const gallery of doc.galleries || []) {
  const asset = gallery.video?.asset;
  if (!asset) continue;
  let offset = 0, moov;
  while (offset + 16 <= asset.size) {
    const header = await range(asset.url, offset, 16);
    let size = header.readUInt32BE(0);
    const type = header.toString('ascii', 4, 8);
    if (size === 1) size = Number(header.readBigUInt64BE(8));
    if (size === 0) size = asset.size - offset;
    if (size < 8 || offset + size > asset.size) throw new Error('Invalid MOV box');
    if (type === 'moov') {
      if (size > 16 * 1024 * 1024) throw new Error('Unexpectedly large metadata');
      moov = await range(asset.url, offset, size);
      break;
    }
    offset += size;
  }
  if (!moov) throw new Error('No movie metadata found');
  const tracks = find(moov, ['moov', 'trak']).map(track => {
    const handler = find(moov, ['mdia', 'hdlr'], track.start, track.end)[0];
    const sample = find(moov, ['mdia', 'minf', 'stbl', 'stsd'], track.start, track.end)[0];
    if (!handler || !sample) return null;
    const kind = moov.toString('ascii', handler.start + 8, handler.start + 12);
    const codec = moov.toString('ascii', sample.start + 12, sample.start + 16);
    return {kind, codec};
  }).filter(Boolean);
  report.push({document: doc._id, galleryKey: gallery._key, title: gallery.title,
    assetId: asset._id, mimeType: asset.mimeType, tracks,
    recommendation: tracks.some(t => t.kind === 'vide' && !['avc1', 'avc3'].includes(t.codec))
      ? 'Transcode video to H.264; inspect audio, rotation and HDR before conversion'
      : asset.mimeType === 'video/quicktime' ? 'H.264 video; assess audio and remux to MP4 if compatible' : 'H.264 in MP4; verify audio and browser playback'});
}
await mkdir('.netlify/media-audit', {recursive: true});
await writeFile('.netlify/media-audit/video-codecs.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
