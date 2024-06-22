import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'admin',
    database: 'nest',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};

export default typeOrmConfig;
