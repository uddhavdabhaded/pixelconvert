import { ToolLayout } from "@/components/ToolLayout";
import { CompressorTool } from "@/components/tools/CompressorTool";
import { ConverterTool } from "@/components/tools/ConverterTool";
import { CropperTool } from "@/components/tools/CropperTool";
import { ResizerTool } from "@/components/tools/ResizerTool";
import { toolPages } from "@/content/pages";

export function ToolPage({ path }: { path: string }) {
  const page = toolPages[path];
  return (
    <ToolLayout
      crumbs={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }, { name: page.h1 }]}
      heading={page.h1}
      description={page.description}
      path={page.path}
      lead={page.lead}
      howTo={page.howTo}
      faqs={page.faqs}
      related={page.related}
    >
      {page.kind === "crop" ? <CropperTool /> : null}
      {page.kind === "resize" ? <ResizerTool /> : null}
      {page.kind === "compress" ? <CompressorTool /> : null}
      {page.kind === "convert" ? (
        <ConverterTool lockedInput={page.lockedInput} defaultOutput={page.defaultOutput ?? "image/png"} />
      ) : null}
    </ToolLayout>
  );
}
