import { ApplicationNotFoundException } from '@api/modules/application/exceptions/ApplicationNotFoundException';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository as IRepository } from 'typeorm';
import typeorm from 'typeorm';

import { Application } from '../entities/application.entity';

const { Raw } = typeorm;

@Injectable()
export class FindApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: IRepository<Application>,
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

  async findByOrigin(origin: string) {
    const results = await this.applicationRepository.find({
      where: {
        origins: Raw(
          alias => `${alias} @> ARRAY[:origin]::character varying[]`,
          { origin },
        ),
      },
    });
    return results;
  }
}
