import ClientPage from './ClientPage';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const isTesting = (await searchParams)['is-testing'] === 'true';
  return <ClientPage isTesting={isTesting} />;
}
