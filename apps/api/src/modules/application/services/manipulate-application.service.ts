import { catchDBError } from '@api/exceptions/catchDBError';
import type { CreateApplicationBodyDto } from '@api/modules/application/dto/requests/create-application.dto';
import type { UpdateApplicationBodyDto } from '@api/modules/application/dto/requests/update-application.dto';
import { ApplicationNotFoundException } from '@api/modules/application/exceptions/ApplicationNotFoundException';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Application } from '../entities/application.entity';

@Injectable()
export class ManipulateApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(createApplication: CreateApplicationBodyDto) {
    const application = await this.applicationRepository
      .save(createApplication)
      .catch<Application>(catchDBError);
    return application;
  }

  async update(id: string, updateApplication: UpdateApplicationBodyDto) {
    const updateResult = await this.applicationRepository
      .update({ id }, updateApplication)
      .catch<UpdateResult>(catchDBError);
    if (updateResult.affected === 0)
      throw new ApplicationNotFoundException({
        errors: [`Application not found with ${id}`],
      });
  }
}
