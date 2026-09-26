import type Cropper from "cropperjs";

/** Center a crop box that fills as much of the visible image as possible for the given ratio. */
export function fitCropBoxToRatio(cropper: Cropper, aspectRatio: number | null) {
  const image = cropper.getImageData();
  if (!image.width || !image.height) return;

  let width = image.width;
  let height = image.height;

  if (aspectRatio && Number.isFinite(aspectRatio) && aspectRatio > 0) {
    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }
  }

  const left = image.left + (image.width - width) / 2;
  const top = image.top + (image.height - height) / 2;
  cropper.setCropBoxData({ left, top, width, height });
}

export function syncCropDimensions(cropper: Cropper) {
  const data = cropper.getData(true);
  return {
    width: Math.max(1, Math.round(data.width)),
    height: Math.max(1, Math.round(data.height)),
  };
}
