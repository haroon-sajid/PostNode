import { Metadata } from 'next';
import { Agent } from '@postnode/frontend/components/agents/agent';
import { AgentChat } from '@postnode/frontend/components/agents/agent.chat';
import { getAppName } from '@postnode/helpers/utils/app.name';
export const metadata: Metadata = {
  title: `${getAppName()} - Agent`,
  description: '',
};
export default async function Page() {
  return (
    <AgentChat />
  );
}
