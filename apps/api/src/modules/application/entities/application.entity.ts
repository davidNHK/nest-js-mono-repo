import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['name'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid', {
    array: true,
  })
  serverSecretKey: string[];

  @Column('uuid', {
    array: true,
  })
  clientSecretKey: string[];

  @Column('varchar', {
    array: true,
    nullable: true,
  })
  origins?: string[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
