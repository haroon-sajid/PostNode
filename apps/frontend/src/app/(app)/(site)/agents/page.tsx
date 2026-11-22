import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAppName } from '@gitroom/helpers/utils/app.name';

export const metadata: Metadata = {
  title: `${getAppName()} - Agent`,
  description: '',
};

export default async function Page() {
  return redirect('/agents/new');
}
