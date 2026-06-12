import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminUser } from './admin-user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [
    AdminAuthService,
    JwtAuthGuard,
  ],
  exports: [
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AdminAuthModule { }