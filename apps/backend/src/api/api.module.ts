import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from '@postnode/backend/api/routes/auth.controller';
import { AuthService } from '@postnode/backend/services/auth/auth.service';
import { UsersController } from '@postnode/backend/api/routes/users.controller';
import { AuthMiddleware } from '@postnode/backend/services/auth/auth.middleware';
import { StripeService } from '@postnode/nestjs-libraries/services/stripe.service';
import { PaymentController } from '@postnode/backend/api/routes/payment.controller';
import { PaymentService } from '@postnode/nestjs-libraries/services/payment/payment.service';
import { PaymentProviderManager } from '@postnode/nestjs-libraries/services/payment/payment.provider.manager';
import { RevenueCatProvider } from '@postnode/nestjs-libraries/services/payment/providers/revenuecat.provider';
import { AnalyticsController } from '@postnode/backend/api/routes/analytics.controller';
import { PoliciesGuard } from '@postnode/backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@postnode/backend/services/auth/permissions/permissions.service';
import { IntegrationsController } from '@postnode/backend/api/routes/integrations.controller';
import { IntegrationManager } from '@postnode/nestjs-libraries/integrations/integration.manager';
import { SettingsController } from '@postnode/backend/api/routes/settings.controller';
import { PostsController } from '@postnode/backend/api/routes/posts.controller';
import { MediaController } from '@postnode/backend/api/routes/media.controller';
import { ClippingController } from '@postnode/backend/api/routes/clipping.controller';
import { MediaWidgetController } from '@postnode/backend/api/routes/media.widget.controller';
import { UploadWidgetAuthMiddleware } from '@postnode/backend/services/auth/upload.widget.auth.middleware';
import { ClippingWidgetController } from '@postnode/backend/api/routes/clipping.widget.controller';
import { ClippingWidgetAuthMiddleware } from '@postnode/backend/services/auth/clipping.widget.auth.middleware';
import { UploadModule } from '@postnode/nestjs-libraries/upload/upload.module';
import { BillingController } from '@postnode/backend/api/routes/billing.controller';
import { NotificationsController } from '@postnode/backend/api/routes/notifications.controller';
import { OpenaiService } from '@postnode/nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@postnode/nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@postnode/nestjs-libraries/services/codes.service';
import { CopilotController } from '@postnode/backend/api/routes/copilot.controller';
import { PublicController } from '@postnode/backend/api/routes/public.controller';
import { RootController } from '@postnode/backend/api/routes/root.controller';
import { ShortLinkService } from '@postnode/nestjs-libraries/short-linking/short.link.service';
import { WebhookController } from '@postnode/backend/api/routes/webhooks.controller';
import { SignatureController } from '@postnode/backend/api/routes/signature.controller';
import { AutopostController } from '@postnode/backend/api/routes/autopost.controller';
import { SetsController } from '@postnode/backend/api/routes/sets.controller';
import { ThirdPartyController } from '@postnode/backend/api/routes/third-party.controller';
import { MonitorController } from '@postnode/backend/api/routes/monitor.controller';
import { NoAuthIntegrationsController } from '@postnode/backend/api/routes/no.auth.integrations.controller';
import { EnterpriseController } from '@postnode/backend/api/routes/enterprise.controller';
import { OAuthAppController } from '@postnode/backend/api/routes/oauth-app.controller';
import { ApprovedAppsController } from '@postnode/backend/api/routes/approved-apps.controller';
import {
  OAuthController,
  OAuthAuthorizedController,
} from '@postnode/backend/api/routes/oauth.controller';
import { AnnouncementsController } from '@postnode/backend/api/routes/announcements.controller';
import { AdminController } from '@postnode/backend/api/routes/admin.controller';
import { AuthProviderManager } from '@postnode/backend/services/auth/providers/providers.manager';
import { GithubProvider } from '@postnode/backend/services/auth/providers/github.provider';
import { GoogleProvider } from '@postnode/backend/services/auth/providers/google.provider';
import { AppleProvider } from '@postnode/backend/services/auth/providers/apple.provider';
import { FarcasterProvider } from '@postnode/backend/services/auth/providers/farcaster.provider';
import { WalletProvider } from '@postnode/backend/services/auth/providers/wallet.provider';
import { OauthProvider } from '@postnode/backend/services/auth/providers/oauth.provider';
import { StripeController } from '@postnode/backend/api/routes/stripe.controller';

const authenticatedController = [
  UsersController,
  AnalyticsController,
  IntegrationsController,
  SettingsController,
  PostsController,
  MediaController,
  ClippingController,
  BillingController,
  NotificationsController,
  CopilotController,
  WebhookController,
  SignatureController,
  AutopostController,
  SetsController,
  ThirdPartyController,
  OAuthAppController,
  ApprovedAppsController,
  OAuthAuthorizedController,
  AnnouncementsController,
  AdminController,
];
@Module({
  imports: [UploadModule],
  controllers: process.env.MCP_ONLY
    ? [
        RootController,
        OAuthController,
        MediaWidgetController,
        ClippingWidgetController,
      ]
    : [
        RootController,
        PaymentController,
        StripeController,
        AuthController,
        PublicController,
        MonitorController,
        EnterpriseController,
        NoAuthIntegrationsController,
        OAuthController,
        MediaWidgetController,
        ClippingWidgetController,
        ...authenticatedController,
      ],
  providers: [
    AuthService,
    StripeService,
    PaymentService,
    PaymentProviderManager,
    RevenueCatProvider,
    OpenaiService,
    ExtractContentService,
    AuthMiddleware,
    UploadWidgetAuthMiddleware,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
    ShortLinkService,
    AuthProviderManager,
    GithubProvider,
    GoogleProvider,
    AppleProvider,
    FarcasterProvider,
    WalletProvider,
    OauthProvider,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...authenticatedController);
    consumer.apply(UploadWidgetAuthMiddleware).forRoutes(MediaWidgetController);
    consumer
      .apply(ClippingWidgetAuthMiddleware)
      .forRoutes(ClippingWidgetController);
  }
}
