import { ToolPage } from "@/components/tools/ToolPage";
import { toolPages } from "@/content/pages";
import { createMetadata } from "@/lib/seo";

const page = toolPages["/webp-to-jpg"];

export const metadata = createMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function WebpToJpgPage() {
  return <ToolPage path="/webp-to-jpg" />;
}
