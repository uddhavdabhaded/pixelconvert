import { ToolPage } from "@/components/tools/ToolPage";
import { toolPages } from "@/content/pages";
import { createMetadata } from "@/lib/seo";

const page = toolPages["/png-to-jpg"];

export const metadata = createMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function PngToJpgPage() {
  return <ToolPage path="/png-to-jpg" />;
}
