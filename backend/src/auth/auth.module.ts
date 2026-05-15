import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [

    UsersModule,
    PassportModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
         secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
           expiresIn: '1h' as const,
        },
       }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy
  ],
})
export class AuthModule {}