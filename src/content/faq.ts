export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaqs: FaqItem[] = [
  {
    question: "Are my images uploaded?",
    answer:
      "No. PixelConvert processes images in your browser with the Canvas API. The file stays on your device, and refreshing the tab clears it from memory.",
  },
  {
    question: "Which formats can I use?",
    answer:
      "You can open, edit, and download JPG, PNG, and WEBP images. JPEG files use the same converter as JPG.",
  },
  {
    question: "Can I crop, resize, and compress the same image?",
    answer:
      "Yes. After you upload an image, the edited result stays available in this browser tab. Open Crop, Resize, Compress, or Convert without uploading it again.",
  },
  {
    question: "Do I need an account?",
    answer: "No. Every tool is free to use and does not ask you to sign in.",
  },
];

export const faqPage: FaqItem[] = [
  ...homeFaqs,
  {
    question: "Can I lock a custom aspect ratio?",
    answer:
      "Yes. The image cropper includes Free, Original, 1:1, 4:3, 3:4, 3:2, 2:3, 16:9, 9:16, and 21:9, plus social presets. You can also enter a custom width and height such as 1200 and 800.",
  },
  {
    question: "Will transparency survive a conversion?",
    answer:
      "PNG and WEBP can keep transparent pixels. JPG cannot. When you export a transparent image as JPG, the empty areas are filled with white.",
  },
  {
    question: "Why is a compressed file sometimes larger?",
    answer:
      "PNG export from a browser is lossless, so it may not shrink the file. A high quality setting can also make a WEBP or JPG larger than a file that was already optimized. The compressor shows the real sizes before you download.",
  },
  {
    question: "Is there a size limit?",
    answer:
      "Images up to 25 MB and 12,000 pixels on a side can be opened. Output dimensions are limited to 8,192 pixels so the browser can finish the export reliably.",
  },
  {
    question: "Can I use PixelConvert on a phone?",
    answer:
      "Yes. The crop editor supports touch, including dragging the crop box, pinching or using the slider to zoom, and the same ratio, rotate, and flip controls.",
  },
  {
    question: "Do you store images after I close the page?",
    answer:
      "No. Images are kept only in memory for the current tab so you can move between tools. They are not written to a PixelConvert server, account, or database.",
  },
  {
    question: "Can I convert more than one image?",
    answer:
      "Yes. The image converter accepts up to 20 JPG, PNG, or WEBP files at once. You can download each result or all of them in a ZIP created in your browser.",
  },
  {
    question: "What happens if my image is corrupted?",
    answer:
      "PixelConvert stops and explains the problem. Unsupported files, empty files, unreadable images, and dimensions that are too large each get a specific message.",
  },
];
