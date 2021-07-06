import { OpenIdClientCredentialsGrant } from '@api/decorators/open-id-client-credentials-grant.decorator';
import { SingleApplicationResponseDto } from '@api/modules/application/dto/responses/single-application-response.dto';
import { FindApplicationService } from '@api/modules/application/services/find-application.service';
import { ManipulateApplicationService } from '@api/modules/application/services/manipulate-application.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateApplicationBodyDto } from './dto/requests/create-application.dto';
import { FindApplicationParamsDto } from './dto/requests/find-application.dto';
import {
  UpdateApplicationBodyDto,
  UpdateApplicationParamsDto,
} from './dto/requests/update-application.dto';

@Controller('/admin/v1')
@ApiTags('Application')
export class AdminApplicationController {
  constructor(
    private manipulateApplicationService: ManipulateApplicationService,
    private findApplicationService: FindApplicationService,
  ) {}

  @OpenIdClientCredentialsGrant()
  @Get('/applications/:id')
  async findApplication(
    @Param() params: FindApplicationParamsDto,
  ): Promise<SingleApplicationResponseDto> {
    const application = await this.findApplicationService.findById(params.id);
    return new SingleApplicationResponseDto(application);
  }

  @OpenIdClientCredentialsGrant()
  @Patch('/applications/:id')
  async updateApplication(
    @Param() params: UpdateApplicationParamsDto,
    @Body() body: UpdateApplicationBodyDto,
  ): Promise<SingleApplicationResponseDto> {
    await this.manipulateApplicationService.update(params.id, body);
    const application = await this.findApplicationService.findById(params.id);
    return new SingleApplicationResponseDto(application);
  }

  @OpenIdClientCredentialsGrant()
  @Post('/applications')
  async createApplication(
    @Body() body: CreateApplicationBodyDto,
  ): Promise<SingleApplicationResponseDto> {
    const createdApplication = await this.manipulateApplicationService.create(
      body,
    );
    return new SingleApplicationResponseDto(createdApplication);
  }
}
