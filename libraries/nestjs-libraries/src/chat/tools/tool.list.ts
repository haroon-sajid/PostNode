import { IntegrationValidationTool } from '@postnode/nestjs-libraries/chat/tools/integration.validation.tool';
import { IntegrationTriggerTool } from '@postnode/nestjs-libraries/chat/tools/integration.trigger.tool';
import { IntegrationSchedulePostTool } from './integration.schedule.post';
import { GenerateVideoOptionsTool } from '@postnode/nestjs-libraries/chat/tools/generate.video.options.tool';
import { VideoFunctionTool } from '@postnode/nestjs-libraries/chat/tools/video.function.tool';
import { GenerateVideoTool } from '@postnode/nestjs-libraries/chat/tools/generate.video.tool';
import { VideoStatusTool } from '@postnode/nestjs-libraries/chat/tools/video.status.tool';
import { ClippingTool } from '@postnode/nestjs-libraries/chat/tools/clipping.tool';
import { ClippingStatusTool } from '@postnode/nestjs-libraries/chat/tools/clipping.status.tool';
import { ClippingWidgetTicketTool } from '@postnode/nestjs-libraries/chat/tools/clipping.widget.ticket.tool';
import { GenerateImageTool } from '@postnode/nestjs-libraries/chat/tools/generate.image.tool';
import { IntegrationListTool } from '@postnode/nestjs-libraries/chat/tools/integration.list.tool';
import { GroupListTool } from '@postnode/nestjs-libraries/chat/tools/group.list.tool';
import { IntegrationConnectTool } from '@postnode/nestjs-libraries/chat/tools/integration.connect.tool';
import { UploadFromUrlTool } from '@postnode/nestjs-libraries/chat/tools/upload.from.url.tool';
import { MediaListTool } from '@postnode/nestjs-libraries/chat/tools/media.list.tool';
import { MediaStatusTool } from '@postnode/nestjs-libraries/chat/tools/media.status.tool';
import { PostsListTool } from '@postnode/nestjs-libraries/chat/tools/posts.list.tool';
import { PostSettingsTool } from '@postnode/nestjs-libraries/chat/tools/post.settings.tool';
import { PostAttachmentsTool } from '@postnode/nestjs-libraries/chat/tools/post.attachments.tool';
import { DeletePostTool } from '@postnode/nestjs-libraries/chat/tools/delete.post.tool';
import { IntegrationAnalyticsTool } from '@postnode/nestjs-libraries/chat/tools/integration.analytics.tool';
import { PostAnalyticsTool } from '@postnode/nestjs-libraries/chat/tools/post.analytics.tool';
import { UploadWidgetTool } from '@postnode/nestjs-libraries/chat/tools/upload.widget.tool';
import { UploadWidgetTicketTool } from '@postnode/nestjs-libraries/chat/tools/upload.widget.ticket.tool';
import { UploadWidgetStatusTool } from '@postnode/nestjs-libraries/chat/tools/upload.widget.status.tool';

export const toolList = [
  IntegrationListTool,
  GroupListTool,
  IntegrationConnectTool,
  IntegrationValidationTool,
  IntegrationTriggerTool,
  IntegrationSchedulePostTool,
  PostsListTool,
  PostSettingsTool,
  PostAttachmentsTool,
  DeletePostTool,
  IntegrationAnalyticsTool,
  PostAnalyticsTool,
  GenerateVideoOptionsTool,
  VideoFunctionTool,
  GenerateVideoTool,
  VideoStatusTool,
  ClippingTool,
  ClippingStatusTool,
  ClippingWidgetTicketTool,
  GenerateImageTool,
  UploadFromUrlTool,
  MediaListTool,
  MediaStatusTool,
  UploadWidgetTool,
  UploadWidgetTicketTool,
  UploadWidgetStatusTool,
];
