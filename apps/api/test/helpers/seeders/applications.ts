import { Application } from '@api/modules/application/entities/application.entity';
import type { TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Connection } from 'typeorm';

export async function createApplicationInDB(
  testingModule: TestingModule,
  applications: Partial<Application>[],
): Promise<Application[]> {
  const conn = testingModule.get<Connection>(Connection);
  const createdApplications = await conn
    .getRepository(Application)
    .save(applications);
  return createdApplications;
}

export function applicationBuilder(
  override?: Partial<Application>,
): Partial<Application> {
  const result = {
    clientSecretKey: [randomUUID()],
    serverSecretKey: [randomUUID()],
    ...override,
  };
  return result;
}
