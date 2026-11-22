export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { DashboardComponent } from '@postnode/frontend/components/dashboard/dashboard.component';
import { getAppName } from '@postnode/helpers/utils/app.name';
export const metadata: Metadata = {
  title: `${getAppName()} Dashboard`,
  description: '',
};
export default async function Index() {
  return <DashboardComponent />;
}
