import type { FaqItem } from "@/content/faq";
import type { ImageMime } from "@/lib/image/types";

export type ToolPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  howTo: string[];
  faqs: FaqItem[];
  related: string[];
  kind: "convert" | "crop" | "resize" | "compress";
  lockedInput?: ImageMime[];
  defaultOutput?: ImageMime;
};

export const toolPages: Record<string, ToolPage> = {
  "/image-converter": {
    path: "/image-converter",
    title: "Image Converter — JPG, PNG, and WEBP in Your Browser",
    description:
      "Convert JPG, PNG, and WEBP images locally. Convert several files, choose quality, and download them one by one or as a ZIP.",
    h1: "Image Converter",
    lead: "Convert JPG, JPEG, PNG, and WEBP images without sending them anywhere. Drop in one file or a batch, pick the output format and quality, preview each result, and download a single image or a ZIP built in your browser.",
    howTo: [
      "Drop images onto the converter, or browse for JPG, PNG, and WEBP files.",
      "Choose the output format. Quality applies to JPG and WEBP. PNG stays lossless.",
      "Select Convert. Each file is processed on this device.",
      "Download one image, or choose Download all to save a ZIP.",
    ],
    faqs: [
      {
        question: "Can I mix JPG, PNG, and WEBP in one batch?",
        answer:
          "Yes. The converter accepts those formats together and exports every file in the format you select.",
      },
      {
        question: "Where is the ZIP created?",
        answer:
          "In your browser. PixelConvert packs the converted files into a ZIP on your device. The archive is not uploaded.",
      },
      {
        question: "What happens to transparent pixels in a JPG?",
        answer:
          "JPG has no transparency. Transparent areas from a PNG or WEBP are filled with white in the JPG export.",
      },
    ],
    related: ["/jpg-to-png", "/png-to-webp", "/image-compressor", "/image-cropper"],
    kind: "convert",
    defaultOutput: "image/png",
  },
  "/image-cropper": {
    path: "/image-cropper",
    title: "Image Cropper — Aspect Ratios, Zoom, Rotate, and Flip",
    description:
      "Crop images in the browser with a draggable crop box, aspect ratios, social presets, zoom, rotate, and flip. Your image never leaves your device.",
    h1: "Image Cropper",
    lead: "Crop with a real editor: drag the crop box, pull its handles, zoom, rotate, and flip. Lock a standard ratio, a social preset, or your own width and height. The crop stays in this tab, so you can resize or compress it next without a second upload.",
    howTo: [
      "Upload a JPG, PNG, or WEBP image.",
      "Drag the crop box to move it and drag the handles to resize it. Scroll, pinch, or use the slider to zoom.",
      "Choose a ratio, a social preset, or enter a custom width and height. The box keeps that ratio while you resize it.",
      "Rotate by 90 degrees or use the angle slider, then flip horizontally or vertically if you need to.",
      "Apply the crop or download it as JPG, PNG, or WEBP. Continue in the resizer or compressor with the same image.",
    ],
    faqs: [
      {
        question: "Does 1:1 force a square?",
        answer:
          "Yes. Fixed ratios lock the crop box. 1:1 stays square, 16:9 stays widescreen, and 9:16 stays portrait while you drag a handle.",
      },
      {
        question: "Are social presets exact pixel templates?",
        answer:
          "No. Each preset sets an aspect ratio used by that placement, such as 1:1 for an Instagram square or 9:16 for a story. It does not stretch your photo to a fake pixel size.",
      },
      {
        question: "Can I zoom and rotate before downloading?",
        answer:
          "Yes. Zoom with the slider, buttons, scroll wheel, or trackpad. Rotate left or right by 90 degrees, or set a custom angle. Flip horizontal and flip vertical are beside the rotation controls.",
      },
    ],
    related: ["/image-resizer", "/image-compressor", "/jpg-to-png", "/image-converter"],
    kind: "crop",
  },
  "/image-resizer": {
    path: "/image-resizer",
    title: "Image Resizer — Change Dimensions Without Uploading",
    description:
      "Resize JPG, PNG, and WEBP images by pixels or percentage. Lock the aspect ratio, preview the result, and download it from your browser.",
    h1: "Image Resizer",
    lead: "Change the pixel size of a JPG, PNG, or WEBP image on your device. Lock the aspect ratio so width and height stay in proportion, resize by percentage, or fit the image inside a common frame. Rotate and flip are here too.",
    howTo: [
      "Upload an image, or continue with the image you already cropped.",
      "Enter a width or height. With the lock on, the other side is calculated for you.",
      "Use a percentage or a preset such as 1920 wide or fit inside 1920 × 1080.",
      "Preview the result, then download JPG, PNG, or WEBP. Apply the resize if you want to compress it next.",
    ],
    faqs: [
      {
        question: "How does the aspect lock work?",
        answer:
          "While the lock is on, editing the width recalculates the height from the current image ratio, and editing the height recalculates the width. Turn the lock off to set both sides yourself.",
      },
      {
        question: "Will a fit preset distort the photo?",
        answer:
          "No. Fit presets scale the image so it sits inside the named frame, such as 1080 × 1080. The output keeps the current aspect ratio.",
      },
      {
        question: "Can I rotate while resizing?",
        answer:
          "Yes. Rotate left or right by 90 degrees, or flip the image, before you export. The new dimensions update immediately.",
      },
    ],
    related: ["/image-cropper", "/image-compressor", "/image-converter", "/jpg-to-webp"],
    kind: "resize",
  },
  "/image-compressor": {
    path: "/image-compressor",
    title: "Image Compressor — Shrink JPG, PNG, and WEBP Locally",
    description:
      "Compress images in your browser with a quality slider. Compare original and compressed size, then download. No upload and no account.",
    h1: "Image Compressor",
    lead: "Reduce the file size of a JPG, PNG, or WEBP image without uploading it. Move the quality slider, switch the target format, and compare the original size, compressed size, and percentage saved before you download.",
    howTo: [
      "Upload an image or continue with the one you cropped or resized.",
      "Choose JPG, PNG, or WEBP. The quality slider controls JPG and WEBP.",
      "Compare the before and after preview and check the percentage saved.",
      "Download the smaller file, or send it to the converter if you still need another format.",
    ],
    faqs: [
      {
        question: "Does the quality slider affect PNG?",
        answer:
          "No. Browser PNG export is lossless, so the slider is for JPG and WEBP. Choose one of those formats when you want a smaller file.",
      },
      {
        question: "Will I see the savings before downloading?",
        answer:
          "Yes. PixelConvert shows the original size, the compressed size, and whether the file got smaller or larger.",
      },
      {
        question: "Is the image sent away to be compressed?",
        answer:
          "No. Compression runs locally in this tab. Only the page itself is loaded from the server.",
      },
    ],
    related: ["/image-converter", "/jpg-to-webp", "/png-to-jpg", "/image-resizer"],
    kind: "compress",
  },
  "/jpg-to-png": {
    path: "/jpg-to-png",
    title: "JPG to PNG Converter — Free, Private, In Your Browser",
    description:
      "Convert JPG and JPEG images to PNG in your browser. No upload, no account, and a download that stays on your device.",
    h1: "JPG to PNG",
    lead: "Convert a JPG or JPEG photo to PNG without uploading it. PNG is a useful export when you want a widely supported file for editing, screenshots, or graphics. The conversion happens in your browser, and you can crop or resize the same image first.",
    howTo: [
      "Drop a JPG or JPEG image into the converter. Other formats are declined on this page.",
      "Leave the output on PNG, or switch it if you change your mind.",
      "Convert the image. Add more JPG files if you want a batch.",
      "Download the PNG, or download every converted file as a ZIP.",
    ],
    faqs: [
      {
        question: "Will converting JPG to PNG improve quality?",
        answer:
          "No. A JPG has already discarded some detail. Converting it to PNG preserves the current pixels and does not recover the original camera data.",
      },
      {
        question: "Why is the PNG larger than the JPG?",
        answer:
          "PNG uses lossless compression. Photographs often take more space as PNG than as JPG. Use the compressor or a WEBP export if a smaller file matters more.",
      },
      {
        question: "Can I convert several JPGs?",
        answer: "Yes. Add up to 20 JPG files, convert them together, and download a ZIP.",
      },
    ],
    related: ["/png-to-jpg", "/jpg-to-webp", "/image-cropper", "/image-compressor"],
    kind: "convert",
    lockedInput: ["image/jpeg"],
    defaultOutput: "image/png",
  },
  "/png-to-jpg": {
    path: "/png-to-jpg",
    title: "PNG to JPG Converter — Reduce File Size Locally",
    description:
      "Turn PNG images into smaller JPG files without uploading them. Set the quality, preview the result, and download in your browser.",
    h1: "PNG to JPG",
    lead: "Convert a PNG to JPG when you want a smaller photo file. Set the quality, preview the result, and download it from this page. Transparent areas are filled with white because JPG cannot store transparency.",
    howTo: [
      "Upload a PNG image.",
      "Keep JPG selected and set the quality. Lower values make smaller files.",
      "Check the preview. Transparent regions will look white.",
      "Download the JPG, or convert a batch and save a ZIP.",
    ],
    faqs: [
      {
        question: "What happens to a transparent background?",
        answer:
          "JPG does not support transparency. PixelConvert fills those pixels with white before saving the JPG.",
      },
      {
        question: "Which quality should I use?",
        answer:
          "Start around 80. Raise it if edges and text look soft, or lower it if you need a smaller file. The converted size is shown after processing.",
      },
      {
        question: "Can I crop the PNG before converting?",
        answer:
          "Yes. Crop it in the image cropper, then open PNG to JPG. The edited image stays in this tab.",
      },
    ],
    related: ["/jpg-to-png", "/png-to-webp", "/image-compressor", "/image-cropper"],
    kind: "convert",
    lockedInput: ["image/png"],
    defaultOutput: "image/jpeg",
  },
  "/jpg-to-webp": {
    path: "/jpg-to-webp",
    title: "JPG to WEBP Converter — Smaller Images, No Upload",
    description:
      "Convert JPG images to WEBP in your browser. Adjust quality, compare file size, and download the result without sending files to a server.",
    h1: "JPG to WEBP",
    lead: "Convert JPG images to WEBP for a smaller file that modern browsers and many publishing tools accept. Choose the quality, convert one image or a batch, and download the WEBP files without an upload.",
    howTo: [
      "Add one or more JPG or JPEG images.",
      "Set WEBP as the output and choose a quality level.",
      "Convert the images locally and review the new file size.",
      "Download a single WEBP or a ZIP of the batch.",
    ],
    faqs: [
      {
        question: "Does WEBP keep the photo looking the same?",
        answer:
          "At high quality, the difference is usually hard to see. Lower the quality only as far as the preview still looks acceptable.",
      },
      {
        question: "Can every device open WEBP?",
        answer:
          "Current browsers can. If you need a file for an older tool, convert the result to JPG or PNG from the image converter.",
      },
      {
        question: "Is the JPG uploaded to create the WEBP?",
        answer: "No. The decoder and the WEBP encoder both run in your browser.",
      },
    ],
    related: ["/webp-to-jpg", "/png-to-webp", "/image-compressor", "/image-resizer"],
    kind: "convert",
    lockedInput: ["image/jpeg"],
    defaultOutput: "image/webp",
  },
  "/png-to-webp": {
    path: "/png-to-webp",
    title: "PNG to WEBP Converter — Keep Quality, Cut File Size",
    description:
      "Convert PNG images to WEBP locally. Preserve transparency, choose a quality level, and download without uploading your image.",
    h1: "PNG to WEBP",
    lead: "Convert PNG graphics and screenshots to WEBP without leaving the browser. WEBP can keep transparency, and the quality slider lets you trade a little fidelity for a smaller file. Check the preview before you download.",
    howTo: [
      "Upload a PNG. This page does not accept other formats.",
      "Select WEBP and set the quality.",
      "Convert the file and compare its size with the original PNG.",
      "Download the WEBP. Transparent areas stay transparent in the WEBP export.",
    ],
    faqs: [
      {
        question: "Does PNG to WEBP keep transparency?",
        answer:
          "Yes. The WEBP export keeps an alpha channel. Switch to JPG only if you are comfortable replacing transparency with white.",
      },
      {
        question: "When should I stay with PNG?",
        answer:
          "Keep PNG for graphics that must stay lossless, such as sharp UI artwork or files you will edit again. Use WEBP when you mainly need a smaller image for the web.",
      },
      {
        question: "Can I resize before converting?",
        answer:
          "Yes. Resize the image first, then return here. You do not need to upload it again during this visit.",
      },
    ],
    related: ["/jpg-to-webp", "/webp-to-png", "/image-compressor", "/image-resizer"],
    kind: "convert",
    lockedInput: ["image/png"],
    defaultOutput: "image/webp",
  },
  "/webp-to-jpg": {
    path: "/webp-to-jpg",
    title: "WEBP to JPG Converter — Compatible Images in the Browser",
    description:
      "Convert WEBP images to widely supported JPG files on your device. Preview quality, then download. Nothing is uploaded.",
    h1: "WEBP to JPG",
    lead: "Convert a WEBP image to JPG when a form, editor, or older workflow asks for JPEG. Set the quality, preview the photo, and download it locally. Transparent areas are filled with white.",
    howTo: [
      "Drop a WEBP image onto the page.",
      "Leave the output as JPG and choose a quality setting.",
      "Convert the image and inspect the preview.",
      "Download the JPG file.",
    ],
    faqs: [
      {
        question: "Why convert WEBP to JPG?",
        answer:
          "Some printers, office tools, and upload forms still ask for JPG. This page creates that file without a server-side conversion.",
      },
      {
        question: "Will a transparent WEBP stay transparent?",
        answer: "Not as a JPG. Transparent pixels are flattened onto white.",
      },
      {
        question: "Can I convert a folder of WEBP images?",
        answer: "You can add up to 20 WEBP files, convert them, and download a ZIP.",
      },
    ],
    related: ["/jpg-to-webp", "/webp-to-png", "/image-converter", "/image-compressor"],
    kind: "convert",
    lockedInput: ["image/webp"],
    defaultOutput: "image/jpeg",
  },
  "/webp-to-png": {
    path: "/webp-to-png",
    title: "WEBP to PNG Converter — Lossless Export in the Browser",
    description:
      "Convert WEBP images to PNG without uploading them. Keep transparency and download a PNG that is ready to edit or share.",
    h1: "WEBP to PNG",
    lead: "Convert WEBP images to PNG in the browser when you want a lossless file for editing or a format a tool already accepts. Transparency is preserved. You can convert a single image or a small batch and download a ZIP.",
    howTo: [
      "Upload a WEBP image.",
      "Keep PNG selected. Quality is not applied to PNG because the export is lossless.",
      "Convert the image locally.",
      "Download the PNG or a ZIP if you converted several files.",
    ],
    faqs: [
      {
        question: "Is the PNG an exact copy of the WEBP?",
        answer:
          "It is a lossless PNG of the pixels decoded from the WEBP. If the WEBP itself was lossy, details removed during that earlier save cannot be restored.",
      },
      {
        question: "Does this keep transparency?",
        answer: "Yes. Transparent pixels in the WEBP remain transparent in the PNG.",
      },
      {
        question: "The PNG is larger. Is that a problem?",
        answer:
          "Often, yes, that is expected. PNG files of photos are frequently bigger than WEBP. Use PNG when compatibility or further editing matters more than file size.",
      },
    ],
    related: ["/png-to-webp", "/webp-to-jpg", "/image-cropper", "/image-converter"],
    kind: "convert",
    lockedInput: ["image/webp"],
    defaultOutput: "image/png",
  },
};
