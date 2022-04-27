import { Module } from '@nestjs/common';
import { GitlabClient, gitlabClient } from 'app/libs/gitlab/client';

@Module({
  providers: [{ provide: GitlabClient, useValue: gitlabClient }],
  exports: [{ provide: GitlabClient, useValue: gitlabClient }],
})
export class GitlabModule {}
