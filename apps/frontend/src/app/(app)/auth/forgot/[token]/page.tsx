export const dynamic = 'force-dynamic';
import { ForgotReturn } from '@postnode/frontend/components/auth/forgot-return';
import { Metadata } from 'next';
import { getAppName } from '@postnode/helpers/utils/app.name';
export const metadata: Metadata = {
  title: `${getAppName()} Forgot Password`,
  description: '',
};
export default async function Auth(params: {
  params: Promise<{
    token: string;
  }>;
}) {
  return <ForgotReturn token={(await params.params).token} />;
}
