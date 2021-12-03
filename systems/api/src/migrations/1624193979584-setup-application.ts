import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class setupApplication1624193979584 implements MigrationInterface {
  name = 'setupApplication1624193979584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            default: 'uuid_generate_v4()',
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          {
            isNullable: false,
            name: 'name',
            type: 'character varying',
          },
          {
            isNullable: false,
            name: 'server_secret_key',
            type: 'uuid[]',
          },
          {
            isNullable: false,
            name: 'client_secret_key',
            type: 'uuid[]',
          },
          {
            default: 'NOW()',
            isNullable: false,
            name: 'updated_at',
            type: 'TIMESTAMP',
          },
          {
            default: 'NOW()',
            isNullable: false,
            name: 'created_at',
            type: 'TIMESTAMP',
          },
        ],
        name: 'application',
      }),
    );
    await queryRunner.createUniqueConstraint(
      'application',
      new TableUnique({
        columnNames: ['name'],
        name: 'application-name-unique',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'application',
      'application-name-unique',
    );
    await queryRunner.dropTable('application');
  }
}
