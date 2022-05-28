import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME } from "src/constants";

export const TypeormConfig: TypeOrmModuleOptions = {
  host: DATABASE_HOST,
  database: DATABASE_NAME,
  port: DATABASE_PORT,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  entities: [__dirname + './../**/*.model{.ts,.js}'],
  type: 'postgres',
  synchronize: true,
}