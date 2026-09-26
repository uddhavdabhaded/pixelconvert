import { ToolPage } from "@/components/tools/ToolPage";
import { toolPages } from "@/content/pages";
import { createMetadata } from "@/lib/seo";

const page = toolPages["/image-cropper"];

export const metadata = createMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function ImageCropperPage() {
  return <ToolPage path="/image-cropper" />;
}
