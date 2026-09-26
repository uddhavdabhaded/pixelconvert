import { ToolPage } from "@/components/tools/ToolPage";
import { toolPages } from "@/content/pages";
import { createMetadata } from "@/lib/seo";

const page = toolPages["/jpg-to-webp"];

export const metadata = createMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function JpgToWebpPage() {
  return <ToolPage path="/jpg-to-webp" />;
}
