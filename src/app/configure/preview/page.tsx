interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

function PreviewPage({ searchParams }: PageProps) {
  const { id } = searchParams;
  return <div>{id}</div>;
}

export default PreviewPage;
