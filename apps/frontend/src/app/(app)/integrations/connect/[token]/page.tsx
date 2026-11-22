import { ConnectLink } from '@postnode/frontend/components/launches/connect.link';

export const dynamic = 'force-dynamic';

// The person who opens a connect link may have no account in the app
export default async function Page(props: {
  params: Promise<{
    token: string;
  }>;
}) {
  const { token } = await props.params;
  return <ConnectLink token={token} />;
}
