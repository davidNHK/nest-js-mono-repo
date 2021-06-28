import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class applicationOrigin1624369111927 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'application',
      new TableColumn({
        isNullable: true,
        name: 'origins',
        type: 'varchar[]',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('application', 'origins');
  }
}
