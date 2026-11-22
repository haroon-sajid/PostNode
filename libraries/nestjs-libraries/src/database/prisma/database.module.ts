import { Global, Module } from '@nestjs/common';
import { PrismaRepository, PrismaService, PrismaTransaction } from './prisma.service';
import { OrganizationRepository } from '@postnode/nestjs-libraries/database/prisma/organizations/organization.repository';
import { OrganizationService } from '@postnode/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@postnode/nestjs-libraries/database/prisma/users/users.service';
import { UsersRepository } from '@postnode/nestjs-libraries/database/prisma/users/users.repository';
import { SubscriptionService } from '@postnode/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { SubscriptionRepository } from '@postnode/nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { NotificationService } from '@postnode/nestjs-libraries/database/prisma/notifications/notification.service';
import { IntegrationService } from '@postnode/nestjs-libraries/database/prisma/integrations/integration.service';
import { IntegrationRepository } from '@postnode/nestjs-libraries/database/prisma/integrations/integration.repository';
import { PostsService } from '@postnode/nestjs-libraries/database/prisma/posts/posts.service';
import { PostsRepository } from '@postnode/nestjs-libraries/database/prisma/posts/posts.repository';
import { IntegrationManager } from '@postnode/nestjs-libraries/integrations/integration.manager';
import { MediaService } from '@postnode/nestjs-libraries/database/prisma/media/media.service';
import { MediaRepository } from '@postnode/nestjs-libraries/database/prisma/media/media.repository';
import { NotificationsRepository } from '@postnode/nestjs-libraries/database/prisma/notifications/notifications.repository';
import { EmailService } from '@postnode/nestjs-libraries/services/email.service';
import { EncryptionService } from '@postnode/nestjs-libraries/services/encryption.service';
import { StripeService } from '@postnode/nestjs-libraries/services/stripe.service';
import { PaymentService } from '@postnode/nestjs-libraries/services/payment/payment.service';
import { PaymentProviderManager } from '@postnode/nestjs-libraries/services/payment/payment.provider.manager';
import { RevenueCatProvider } from '@postnode/nestjs-libraries/services/payment/providers/revenuecat.provider';
import { ExtractContentService } from '@postnode/nestjs-libraries/openai/extract.content.service';
import { OpenaiService } from '@postnode/nestjs-libraries/openai/openai.service';
import { DeepgramService } from '@postnode/nestjs-libraries/deepgram/deepgram.service';
import { ClippingService } from '@postnode/nestjs-libraries/database/prisma/clipping/clipping.service';
import { ClippingRepository } from '@postnode/nestjs-libraries/database/prisma/clipping/clipping.repository';
import { AgenciesService } from '@postnode/nestjs-libraries/database/prisma/agencies/agencies.service';
import { AgenciesRepository } from '@postnode/nestjs-libraries/database/prisma/agencies/agencies.repository';
import { ShortLinkService } from '@postnode/nestjs-libraries/short-linking/short.link.service';
import { WebhooksRepository } from '@postnode/nestjs-libraries/database/prisma/webhooks/webhooks.repository';
import { WebhooksService } from '@postnode/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { SignatureRepository } from '@postnode/nestjs-libraries/database/prisma/signatures/signature.repository';
import { SignatureService } from '@postnode/nestjs-libraries/database/prisma/signatures/signature.service';
import { AutopostRepository } from '@postnode/nestjs-libraries/database/prisma/autopost/autopost.repository';
import { AutopostService } from '@postnode/nestjs-libraries/database/prisma/autopost/autopost.service';
import { SetsService } from '@postnode/nestjs-libraries/database/prisma/sets/sets.service';
import { SetsRepository } from '@postnode/nestjs-libraries/database/prisma/sets/sets.repository';
import { ThirdPartyRepository } from '@postnode/nestjs-libraries/database/prisma/third-party/third-party.repository';
import { ThirdPartyService } from '@postnode/nestjs-libraries/database/prisma/third-party/third-party.service';
import { VideoManager } from '@postnode/nestjs-libraries/videos/video.manager';
import { FalService } from '@postnode/nestjs-libraries/openai/fal.service';
import { RefreshIntegrationService } from '@postnode/nestjs-libraries/integrations/refresh.integration.service';
import { OAuthRepository } from '@postnode/nestjs-libraries/database/prisma/oauth/oauth.repository';
import { OAuthService } from '@postnode/nestjs-libraries/database/prisma/oauth/oauth.service';
import { AnnouncementsRepository } from '@postnode/nestjs-libraries/database/prisma/announcements/announcements.repository';
import { AnnouncementsService } from '@postnode/nestjs-libraries/database/prisma/announcements/announcements.service';
import { ErrorsRepository } from '@postnode/nestjs-libraries/database/prisma/errors/errors.repository';
import { ErrorsService } from '@postnode/nestjs-libraries/database/prisma/errors/errors.service';
import { AdminStatsRepository } from '@postnode/nestjs-libraries/database/prisma/admin-stats/admin-stats.repository';
import { AdminStatsService } from '@postnode/nestjs-libraries/database/prisma/admin-stats/admin-stats.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    PrismaRepository,
    PrismaTransaction,
    UsersService,
    UsersRepository,
    OrganizationService,
    OrganizationRepository,
    SubscriptionService,
    SubscriptionRepository,
    NotificationService,
    NotificationsRepository,
    WebhooksRepository,
    WebhooksService,
    IntegrationService,
    IntegrationRepository,
    PostsService,
    PostsRepository,
    StripeService,
    PaymentService,
    PaymentProviderManager,
    RevenueCatProvider,
    SignatureRepository,
    AutopostRepository,
    AutopostService,
    SignatureService,
    MediaService,
    MediaRepository,
    AgenciesService,
    AgenciesRepository,
    IntegrationManager,
    RefreshIntegrationService,
    ExtractContentService,
    OpenaiService,
    DeepgramService,
    ClippingService,
    ClippingRepository,
    FalService,
    EmailService,
    EncryptionService,
    ShortLinkService,
    SetsService,
    SetsRepository,
    ThirdPartyRepository,
    ThirdPartyService,
    OAuthRepository,
    OAuthService,
    VideoManager,
    AnnouncementsRepository,
    AnnouncementsService,
    ErrorsRepository,
    ErrorsService,
    AdminStatsRepository,
    AdminStatsService,
  ],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
