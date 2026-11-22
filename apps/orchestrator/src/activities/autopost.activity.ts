import { Injectable } from '@nestjs/common';
import { Activity, ActivityMethod } from 'nestjs-temporal-core';
import { PostsService } from '@postnode/nestjs-libraries/database/prisma/posts/posts.service';
import {
  NotificationService,
  NotificationType,
} from '@postnode/nestjs-libraries/database/prisma/notifications/notification.service';
import { Integration, Post, State } from '@prisma/client';
import { stripHtmlValidation } from '@postnode/helpers/utils/strip.html.validation';
import { IntegrationManager } from '@postnode/nestjs-libraries/integrations/integration.manager';
import { AuthTokenDetails } from '@postnode/nestjs-libraries/integrations/social/social.integrations.interface';
import { RefreshIntegrationService } from '@postnode/nestjs-libraries/integrations/refresh.integration.service';
import { timer } from '@postnode/helpers/utils/timer';
import { IntegrationService } from '@postnode/nestjs-libraries/database/prisma/integrations/integration.service';
import { WebhooksService } from '@postnode/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { AutopostService } from '@postnode/nestjs-libraries/database/prisma/autopost/autopost.service';

@Injectable()
@Activity()
export class AutopostActivity {
  constructor(private _autoPostService: AutopostService) {}

  @ActivityMethod()
  async autoPost(id: string) {
    return this._autoPostService.startAutopost(id)
  }
}
