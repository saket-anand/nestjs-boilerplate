import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterSqlDbConfigService } from '@app/config/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   name: 'MASTER_DB',
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get('MYSQL_DB_HOST'),
    //     port: configService.get('MYSQL_DB_PORT'),
    //     username: configService.get('MYSQL_DB_USERNAME'),
    //     password: configService.get('MYSQL_DB_PASSWORD'),
    //     database: configService.get('MYSQL_DB_NAME'),
    //     entities: ['dist/**/*.entity.js'],
    //     synchronize: false,
    //     autoLoadEntities: true,
    //     logging: true,
    //   }),
    // }),
    TypeOrmModule.forRootAsync({
      useClass: MasterSqlDbConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SqlConfigModule {}
