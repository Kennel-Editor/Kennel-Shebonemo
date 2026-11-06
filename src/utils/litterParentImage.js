// Legacy list and detail views intentionally retain their original precedence.
export function getLitterParentImage(parent = {}, dog, view = 'list') {
  if (parent.imageSelectionVersion === 1) {
    const standard = dog?.image || parent.image || null;
    return parent.overrideImageButton === true
      ? parent.overrideImage?.asset ? parent.overrideImage : standard
      : standard;
  }
  if (view === 'detail') {
    return parent.overrideImage || dog?.overrideImage || (dog ? dog.image : parent.image) || null;
  }
  return parent.overrideImage?.asset ? parent.overrideImage
    : dog?.image?.asset ? dog.image
    : parent.image?.asset ? parent.image : null;
}
