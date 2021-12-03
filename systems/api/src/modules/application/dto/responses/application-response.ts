import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ApplicationResponse {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  serverSecretKey!: string[];

  @Expose()
  clientSecretKey!: string[];

  @Expose()
  origins?: string[];
}
