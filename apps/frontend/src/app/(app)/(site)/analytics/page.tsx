export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { PlatformAnalytics } from '@postnode/frontend/components/platform-analytics/platform.analytics';
import { getAppName } from '@postnode/helpers/utils/app.name';
export const metadata: Metadata = {
  title: `${getAppName()} Analytics`,
  description: '',
};
export default async function Index() {
  return <PlatformAnalytics />;
}
