// Keep migrated data authoritative: an empty videos array means videos were removed.
export function galleryVideos(gallery) {
  const videos = Array.isArray(gallery.videos)
    ? gallery.videos
    : gallery.video ? [gallery.video] : [];
  const seen = new Set();
  return videos.filter((video) => {
    const id = video.asset?._ref || video.asset?._id || video.url || video.asset?.url;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
