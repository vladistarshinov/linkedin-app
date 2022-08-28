import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {getOrmConfig} from "./config/orm.config";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getOrmConfig
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
