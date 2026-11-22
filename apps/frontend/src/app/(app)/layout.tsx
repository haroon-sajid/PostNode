export const dynamic = 'force-dynamic';
import '../global.scss';
import 'react-tooltip/dist/react-tooltip.css';
import '@copilotkit/react-ui/styles.css';
import LayoutContext from '@postnode/frontend/components/layout/layout.context';
import { ReactNode } from 'react';
import { jakartaSans } from '@postnode/frontend/fonts/plus-jakarta-sans/plus.jakarta.sans.font';
import clsx from 'clsx';
import { VariableContextComponent } from '@postnode/react/helpers/variable.context';
import { cookies } from 'next/headers';
import {
  cookieName,
  fallbackLng,
} from '@postnode/react/translation/i18n.config';
import { HtmlComponent } from '@postnode/frontend/components/layout/html.component';
import { ChangeDirClient } from '@postnode/frontend/components/new-layout/change.dir.client';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const language = cookieStore.get(cookieName)?.value || fallbackLng;
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <ChangeDirClient />
      <body
        className={clsx(jakartaSans.className, 'dark text-primary !bg-primary')}
        // Browser extensions (e.g. ColorZilla) add attributes to <body>
        suppressHydrationWarning
      >
        <VariableContextComponent
          storageProvider={
            process.env.STORAGE_PROVIDER! as 'local' | 'cloudflare'
          }
          environment={process.env.NODE_ENV!}
          backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
          plontoKey={process.env.NEXT_PUBLIC_POLOTNO!}
          stripeClient={process.env.STRIPE_PUBLISHABLE_KEY!}
          billingEnabled={!!process.env.STRIPE_PUBLISHABLE_KEY}
          discordUrl={process.env.NEXT_PUBLIC_DISCORD_SUPPORT!}
          frontEndUrl={process.env.FRONTEND_URL!}
          isGeneral={!!process.env.IS_GENERAL}
          genericOauth={!!process.env.GENERIC_OAUTH}
          oauthLogoUrl={process.env.NEXT_PUBLIC_GENERIC_OAUTH_LOGO_URL!}
          oauthDisplayName={process.env.NEXT_PUBLIC_GENERIC_OAUTH_DISPLAY_NAME!}
          uploadDirectory={process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY!}
          cloudflareUrl={process.env.CLOUDFLARE_BUCKET_URL || ''}
          mainUrl={process.env.MAIN_URL || ''}
          mcpUrl={process.env.MCP_URL}
          telegramBotName={process.env.TELEGRAM_BOT_NAME!}
          neynarClientId={process.env.NEYNAR_CLIENT_ID!}
          appleClientId={process.env.APPLE_CLIENT_ID!}
          isSecured={!process.env.NOT_SECURED}
          disableImageCompression={!!process.env.DISABLE_IMAGE_COMPRESSION}
          disableXAnalytics={!!process.env.DISABLE_X_ANALYTICS}
          language={language}
          recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY || ''}
          mediaProcessing={
            process.env.STORAGE_PROVIDER === 'cloudflare' &&
            !!process.env.RUNPOD_API_KEY &&
            !!process.env.RUNPOD_ENDPOINT_ID
          }
          transloadit={
            process.env.TRANSLOADIT_AUTH && process.env.TRANSLOADIT_TEMPLATE
              ? [
                  process.env.TRANSLOADIT_AUTH!,
                  process.env.TRANSLOADIT_TEMPLATE!,
                ]
              : []
          }
        >
          <HtmlComponent />
          <LayoutContext>{children}</LayoutContext>
        </VariableContextComponent>
      </body>
    </html>
  );
}
