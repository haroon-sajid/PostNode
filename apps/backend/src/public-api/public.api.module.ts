import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from '@postnode/backend/services/auth/auth.service';
import { StripeService } from '@postnode/nestjs-libraries/services/stripe.service';
import { PoliciesGuard } from '@postnode/backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@postnode/backend/services/auth/permissions/permissions.service';
import { IntegrationManager } from '@postnode/nestjs-libraries/integrations/integration.manager';
import { UploadModule } from '@postnode/nestjs-libraries/upload/upload.module';
import { OpenaiService } from '@postnode/nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@postnode/nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@postnode/nestjs-libraries/services/codes.service';
import { PublicIntegrationsController } from '@postnode/backend/public-api/routes/v1/public.integrations.controller';
import { PublicAuthMiddleware } from '@postnode/backend/services/auth/public.auth.middleware';
import { SuperAdminGuard } from '@postnode/backend/services/auth/super.admin.guard';

const authenticatedController = [PublicIntegrationsController];
@Module({
  imports: [UploadModule],
  controllers: process.env.MCP_ONLY ? [] : [...authenticatedController],
  providers: [
    AuthService,
    StripeService,
    OpenaiService,
    ExtractContentService,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
    SuperAdminGuard,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class PublicApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicAuthMiddleware).forRoutes(...authenticatedController);
  }
}

