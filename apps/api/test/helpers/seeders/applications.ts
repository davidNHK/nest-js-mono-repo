import { Application } from '@api/modules/application/entities/application.entity';
import type { TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Connection } from 'typeorm';

export async function createApplicationInDB(
  testingModule: TestingModule,
  applications: Partial<Application>[],
) {
  const conn = testingModule.get<Connection>(Connection);
  const createdApplications = await conn
    .createQueryBuilder()
    .insert()
    .into(Application)
    .values(applications)
    .output('*')
    .execute();
  return createdApplications.raw;
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
