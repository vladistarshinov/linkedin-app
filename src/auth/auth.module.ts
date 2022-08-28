import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './services/jwt-auth/jwt-auth.service';
import { UserAuthService } from './services/user-auth/user-auth.service';
import {User as UserEntity} from '../user/user.entity';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getJwtConfig} from "../config/jwt.config";
import {JwtStrategy} from "./strategy/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    })
  ],
  controllers: [AuthController],
  providers: [JwtAuthService, UserAuthService, JwtStrategy],
  exports: [JwtAuthService, UserAuthService]
})
export class AuthModule {}
