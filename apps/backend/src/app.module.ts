import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@postnode/nestjs-libraries/database/prisma/database.module';
import { ApiModule } from '@postnode/backend/api/api.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from '@postnode/backend/services/auth/permissions/permissions.guard';
import { PublicApiModule } from '@postnode/backend/public-api/public.api.module';
import { ThrottlerBehindProxyGuard } from '@postnode/nestjs-libraries/throttler/throttler.provider';
import { ThrottlerModule } from '@nestjs/throttler';
import { AgentModule } from '@postnode/nestjs-libraries/agent/agent.module';
import { ThirdPartyModule } from '@postnode/nestjs-libraries/3rdparties/thirdparty.module';
import { VideoModule } from '@postnode/nestjs-libraries/videos/video.module';
import { ChatModule } from '@postnode/nestjs-libraries/chat/chat.module';
import { getTemporalModule } from '@postnode/nestjs-libraries/temporal/temporal.module';
import { TemporalRegisterMissingSearchAttributesModule } from '@postnode/nestjs-libraries/temporal/temporal.register';
import { InfiniteWorkflowRegisterModule } from '@postnode/nestjs-libraries/temporal/infinite.workflow.register';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ioRedis } from '@postnode/nestjs-libraries/redis/redis.service';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ApiModule,
    PublicApiModule,
    AgentModule,
    ThirdPartyModule,
    VideoModule,
    ChatModule,
    getTemporalModule(false),
    TemporalRegisterMissingSearchAttributesModule,
    InfiniteWorkflowRegisterModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 3600000,
          limit: process.env.API_LIMIT ? Number(process.env.API_LIMIT) : 90,
        },
      ],
      storage: new ThrottlerStorageRedisService(ioRedis),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [
    DatabaseModule,
    ApiModule,
    PublicApiModule,
    AgentModule,
    ThrottlerModule,
    ChatModule,
  ],
})
export class AppModule {}
