import { Controller, Get, Header, Param, Redirect } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Redirect('https://www.buildnumbr.com', 301)
  async index() {}

  @Get(':projectId')
  @Header('content-type', 'text/plain')
  async increment(@Param('projectId') projectId: string) {
    return this.projectsService.incrementBuildNumber(projectId);
  }

  @Get(':projectId/get')
  @Header('content-type', 'text/plain')
  current(@Param('projectId') projectId: string) {
    return this.projectsService.getBuildNumber(projectId);
  }

  @Get(':projectId/set/:buildNumber')
  @Header('content-type', 'text/plain')
  update(
    @Param('projectId') projectId: string,
    @Param('buildNumber') buildNumber: string,
  ) {
    return this.projectsService.updateBuildNumber(projectId, +buildNumber);
  }
}
