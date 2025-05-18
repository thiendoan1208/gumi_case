import DesignPreview from "@/app/configure/preview/design-preview";
import { db } from "@/db";
import { notFound } from "next/navigation";

type PageProps = Promise<{ [key: string]: string | string[] | undefined }>;

async function PreviewPage({ searchParams }: { searchParams: PageProps }) {
  const { id } = await searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
}

export default PreviewPage;
