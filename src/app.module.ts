import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brands/brand.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, //  turn off
        migrationsRun: true, //  auto-run migrations
        migrations: ['dist/migrations/*.js'],
      }),
      
    }),
    AuthModule,
    BrandModule,
    
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
