import DesignConfigurator from "@/app/configure/design/design-configurator";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

async function DesignPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { id } = resolvedSearchParams;

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

  return (<DesignConfigurator
      imageURL={imageUrl}
      configID={configuration.id}
      imageDimensions={{ width, height }}
    />
    
  );
}

export default DesignPage;
