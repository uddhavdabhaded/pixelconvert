export type ToolIcon = "convert" | "crop" | "resize" | "compress" | "file";

export type ToolInfo = {
  href: string;
  title: string;
  description: string;
  icon: ToolIcon;
};

export const tools: ToolInfo[] = [
  {
    href: "/image-converter",
    title: "Image Converter",
    description:
      "Convert JPG, PNG, and WEBP images individually or in a batch, then download them or a ZIP file.",
    icon: "convert",
  },
  {
    href: "/image-cropper",
    title: "Image Cropper",
    description:
      "Drag and resize a crop box, lock an aspect ratio, zoom, rotate, and flip before you download.",
    icon: "crop",
  },
  {
    href: "/image-resizer",
    title: "Image Resizer",
    description:
      "Set exact pixel dimensions or a percentage, with the aspect ratio locked when you want it.",
    icon: "resize",
  },
  {
    href: "/image-compressor",
    title: "Image Compressor",
    description:
      "Lower the file size with a quality slider and compare the before and after result locally.",
    icon: "compress",
  },
  {
    href: "/jpg-to-png",
    title: "JPG to PNG",
    description: "Convert JPEG photos to PNG in your browser and download the new file immediately.",
    icon: "file",
  },
  {
    href: "/png-to-jpg",
    title: "PNG to JPG",
    description: "Turn PNG images into smaller JPG files and choose how much quality to keep.",
    icon: "file",
  },
  {
    href: "/jpg-to-webp",
    title: "JPG to WEBP",
    description: "Convert JPG images to WEBP for a smaller file that still looks sharp.",
    icon: "file",
  },
  {
    href: "/png-to-webp",
    title: "PNG to WEBP",
    description: "Convert PNG images to WEBP while keeping transparency when you need it.",
    icon: "file",
  },
  {
    href: "/webp-to-jpg",
    title: "WEBP to JPG",
    description: "Convert WEBP images to JPG for tools and sites that expect a JPEG file.",
    icon: "file",
  },
  {
    href: "/webp-to-png",
    title: "WEBP to PNG",
    description: "Convert WEBP images to PNG for editing workflows that prefer a lossless file.",
    icon: "file",
  },
];

export const popularTools = [
  "/jpg-to-png",
  "/png-to-jpg",
  "/image-cropper",
  "/image-compressor",
  "/image-resizer",
  "/jpg-to-webp",
];

export function getTool(href: string) {
  return tools.find((tool) => tool.href === href);
}

export const pipeline = [
  { href: "/image-cropper", label: "Crop" },
  { href: "/image-resizer", label: "Resize" },
  { href: "/image-compressor", label: "Compress" },
  { href: "/image-converter", label: "Convert" },
] as const;
