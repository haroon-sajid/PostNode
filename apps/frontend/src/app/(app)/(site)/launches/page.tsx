export const dynamic = 'force-dynamic';
import { LaunchesComponent } from '@postnode/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { getAppName } from '@postnode/helpers/utils/app.name';
export const metadata: Metadata = {
  title: `${getAppName()} Calendar`,
  description: '',
};
export default async function Index() {
  return <LaunchesComponent />;
}
