import { Module } from '@nestjs/common';
import { PostActivity } from '@postnode/orchestrator/activities/post.activity';
import { getTemporalModule } from '@postnode/nestjs-libraries/temporal/temporal.module';
import { DatabaseModule } from '@postnode/nestjs-libraries/database/prisma/database.module';
import { AutopostActivity } from '@postnode/orchestrator/activities/autopost.activity';
import { EmailActivity } from '@postnode/orchestrator/activities/email.activity';
import { IntegrationsActivity } from '@postnode/orchestrator/activities/integrations.activity';
import { VideoActivity } from '@postnode/orchestrator/activities/video.activity';
import { MediaActivity } from '@postnode/orchestrator/activities/media.activity';
import { ClippingActivity } from '@postnode/orchestrator/activities/clipping.activity';
import { VideoModule } from '@postnode/nestjs-libraries/videos/video.module';
import { HealthController } from '@postnode/orchestrator/health.controller';

const activities = [
  PostActivity,
  AutopostActivity,
  EmailActivity,
  IntegrationsActivity,
  VideoActivity,
  MediaActivity,
  ClippingActivity,
];
@Module({
  imports: [
    DatabaseModule,
    VideoModule,
    getTemporalModule(true, require.resolve('./workflows'), activities),
  ],
  controllers: [HealthController],
  providers: [...activities],
  get exports() {
    return [...this.providers, ...this.imports];
  },
})
export class AppModule {}
