import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./design-configurator";

type PageProps = Promise<{ [key: string]: string | string[] | undefined }>;

const Page = async ({ searchParams }: { searchParams: PageProps }) => {
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

  const { imageUrl, width, height } = configuration;

  return (
    <DesignConfigurator
      configID={configuration.id}
      imageDimensions={{ width, height }}
      imageURL={imageUrl}
    />
  );
};

export default Page;
