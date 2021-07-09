import { RedemptionState } from '@api/modules/redemption/states/redemption-stateus';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class setupRedemption1625843318804 implements MigrationInterface {
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
            name: 'customer_id',
            type: 'character varying',
          },
          {
            isNullable: false,
            name: 'tracking_id',
            type: 'character varying',
          },
          {
            isNullable: false,
            name: 'order_id',
            type: 'character varying',
          },
          {
            isNullable: false,
            name: 'coupon_code',
            type: 'character varying',
          },
          {
            enum: [
              RedemptionState.FulFilled,
              RedemptionState.PendingApprove,
              RedemptionState.PendingFulFill,
            ],
            isNullable: false,
            name: 'status',
            type: 'enum',
          },
          {
            default: "'{}'",
            name: 'metadata',
            type: 'json',
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
        name: 'redemption',
      }),
    );
    await queryRunner.createForeignKey(
      'redemption',
      new TableForeignKey({
        columnNames: ['coupon_code'],
        referencedColumnNames: ['code'],
        referencedTableName: 'coupon',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('redemption');
  }
}
