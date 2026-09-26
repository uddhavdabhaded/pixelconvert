import { ToolPage } from "@/components/tools/ToolPage";
import { toolPages } from "@/content/pages";
import { createMetadata } from "@/lib/seo";

const page = toolPages["/image-converter"];

export const metadata = createMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function ImageConverterPage() {
  return <ToolPage path="/image-converter" />;
}
