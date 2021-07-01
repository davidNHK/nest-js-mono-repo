import { ApplicationNotFoundException } from '@api/modules/application/exceptions/ApplicationNotFoundException';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from '../entities/application.entity';

@Injectable()
export class FindApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async findByName(name: string) {
    const application = await this.applicationRepository
      .findOneOrFail({
        name,
      })
      .catch(e => {
        throw new ApplicationNotFoundException({
          debugDetails: { err: e },
          errors: [`Application not found with ${name}`],
          meta: { name },
        });
      });
    return application;
  }

  async findById(id: string) {
    const application = await this.applicationRepository
      .findOneOrFail({
        id,
      })
      .catch(e => {
        throw new ApplicationNotFoundException({
          debugDetails: { err: e },
          errors: [`Application not found with ${id}`],
          meta: { id },
        });
      });
    return application;
  }
}
