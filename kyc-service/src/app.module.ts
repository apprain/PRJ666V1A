import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KycModule } from './kyc/kyc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAppModule } from './client-app/client-app.module';
import { KycSessionModule } from './kyc-session/kyc-session.module';
import { KycDocumentModule } from './kyc-document/kyc-document.module';
import { ClientAdminModule } from './client-admin/client-admin.module';
import { ClientAdminDashboardModule } from './client-admin-dashboard/client-admin-dashboard.module';
import { SystemAdminModule } from './system-admin/system-admin.module';
import { AwsTextractModule } from './aws-textract/aws-textract.module';
import { AwsRekognitionModule } from './aws-rekognition/aws-rekognition.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    KycModule,

    ClientAppModule,

    KycSessionModule,

    KycDocumentModule,

    ClientAdminModule,

    ClientAdminDashboardModule,

    SystemAdminModule,

    AwsTextractModule,

    AwsRekognitionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }