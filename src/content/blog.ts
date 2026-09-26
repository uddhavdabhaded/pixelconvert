export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
};

export const posts: BlogPost[] = [
  {
    slug: "jpg-vs-png-vs-webp",
    title: "JPG vs PNG vs WEBP: which format should you export?",
    description:
      "A practical comparison of JPG, PNG, and WEBP for photos, graphics, transparency, and file size.",
    date: "March 4, 2026",
    body: `Choosing a format is mostly a choice about what the image contains and where it will be used. PixelConvert can export all three in the browser, so you can compare a real file size before you commit.

## JPG

JPG is built for photographs. It throws away detail that is hard to see in exchange for a much smaller file. It has no transparency. If you convert a logo or screenshot with flat color and sharp text, a low quality setting can leave halos around edges.

Use JPG for camera photos, hero images, and anywhere a form still requires a JPEG. In the [PNG to JPG converter](/png-to-jpg), start near a quality of 80 and lower it only while the preview still looks clean.

## PNG

PNG is lossless. It keeps every pixel and it can store transparency, which makes it the right export for screenshots, interface artwork, and images you expect to edit again. Photographs saved as PNG are often several times larger than the same photo as JPG.

Converting a JPG to PNG with the [JPG to PNG converter](/jpg-to-png) does not invent detail that the JPG already discarded. It only changes the container.

## WEBP

WEBP covers both jobs. Lossy WEBP is often smaller than JPG at a similar visual quality, and WEBP can keep an alpha channel when you convert from PNG. Support in current browsers is solid. Older desktop tools are the usual reason to keep a JPG or PNG copy as well.

The [image compressor](/image-compressor) shows the original size next to the exported size, which is more useful than guessing from the quality number alone.

## A simple rule

Use JPG for photos that need broad compatibility. Use PNG for transparency and lossless graphics. Use WEBP when the destination can open it and file size matters. Crop or resize first so you are not compressing pixels you plan to throw away.`,
  },
  {
    slug: "crop-images-for-social-media",
    title: "How to crop images for social media without guessing pixels",
    description:
      "Use aspect ratios instead of misleading pixel templates when you crop for Instagram, YouTube, Facebook, LinkedIn, and X.",
    date: "May 18, 2026",
    body: `Social placements care about shape first. A square crop and a 9:16 story crop behave differently even when both files are sharp. PixelConvert’s [image cropper](/image-cropper) locks the crop box to a ratio so the shape stays correct while you reframe.

## Ratios that match common placements

- Instagram square uses 1:1.
- Instagram portrait uses 4:5.
- Instagram landscape uses about 1.91:1.
- Stories and Reels use 9:16.
- YouTube thumbnails use 16:9.
- LinkedIn cover images use a very wide 4:1.
- Profile photos, including WhatsApp, are usually square.

These are aspect-ratio presets, not a promise that a network will display a specific pixel dimension. Networks resize uploads. A 1:1 crop stays square whether the file is 800 pixels wide or 2000.

## How to frame the crop

Upload the image, choose the placement, and drag the crop box. Zoom in when you need to check a face or a product edge. The live dimensions under the preview tell you the pixel size of the crop you are about to export.

If a placement is not listed, enter a custom ratio. A width of 1200 and a height of 800 locks the box to 3:2. You can then [resize](/image-resizer) the cropped image if a site also asks for a maximum width.

## Export

Download PNG if you will edit again, or JPG and WEBP if the crop is a finished photo. The cropped file remains available in the tab, so compression does not require another upload.`,
  },
  {
    slug: "compress-images-without-ruining-them",
    title: "Compress images without ruining them",
    description:
      "How quality, dimensions, and format interact when you want a smaller image that still looks acceptable.",
    date: "July 9, 2026",
    body: `File size falls for three reasons: fewer pixels, a more efficient format, or a lower quality setting. Using all three at once is how images start to look soft. Change one thing, look at the result, then decide.

## Start with dimensions

A 4000 pixel photo displayed at 800 pixels still carries the large file. Crop to the frame you actually need in the [image cropper](/image-cropper), then [resize](/image-resizer) to the display size. That reduction is often bigger than any quality tweak, and it does not add blockiness by itself.

## Then choose a format

JPG and WEBP respond to the quality slider. PNG does not, because the browser export is lossless. If a PNG is too large, convert it to WEBP or JPG in the [image compressor](/image-compressor) and read the percentage saved. If the new file is larger, keep the original. That can happen when the source was already optimized.

## How to judge quality

Look at edges: hair, text, product outlines, and flat skies. Those areas show artifacts first. A quality around 80 is a reasonable starting point for photos. Graphics with text usually need a higher setting or a lossless format.

## Keep the original

Compression does not have an undo after you close the tab. Download the compressed copy and keep your source file. PixelConvert does not store either one.`,
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
