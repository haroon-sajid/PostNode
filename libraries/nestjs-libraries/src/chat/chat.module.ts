import { Global, Module } from '@nestjs/common';
import { LoadToolsService } from '@postnode/nestjs-libraries/chat/load.tools.service';
import { MastraService } from '@postnode/nestjs-libraries/chat/mastra.service';
import { toolList } from '@postnode/nestjs-libraries/chat/tools/tool.list';
import { McpRelayService } from '@postnode/nestjs-libraries/chat/mcp.relay.service';

@Global()
@Module({
  providers: [MastraService, LoadToolsService, McpRelayService, ...toolList],
  get exports() {
    return this.providers;
  },
})
export class ChatModule {}
