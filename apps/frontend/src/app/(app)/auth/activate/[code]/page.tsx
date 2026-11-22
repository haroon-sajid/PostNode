export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AfterActivate } from '@postnode/frontend/components/auth/after.activate';
import { getAppName } from '@postnode/helpers/utils/app.name';
export const metadata: Metadata = {
  title: `${getAppName()} - Activate your account`,
  description: '',
};
export default async function Auth() {
  return <AfterActivate />;
}
