import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Express } from 'express';

@Injectable()
export class MinioService {
  private client: Minio.Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('MINIO_BUCKET') || 'kyc-private';

    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: Number(this.configService.get<string>('MINIO_PORT') || 9000),
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') || 'admin',
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY') || 'password123',
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const safeFileName = file.originalname.replace(/\s+/g, '-');
    const objectName = `${folder}/${Date.now()}-${safeFileName}`;

    const bucketExists = await this.client.bucketExists(this.bucket);

    if (!bucketExists) {
      await this.client.makeBucket(this.bucket, 'us-east-1');
    }

    await this.client.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return {
      bucket: this.bucket,
      objectName,
      url: `${this.bucket}/${objectName}`,
    };
  }

  async putObject(
    bucket: string,
    objectKey: string,
    buffer: Buffer,
    size: number,
    metaData: Record<string, string>,
  ) {
    return this.client.putObject(
      bucket,
      objectKey,
      buffer,
      size,
      metaData,
    );
  }

  async getSignedUrl(
    objectKey: string,
    expirySeconds = 60 * 10,
  ) {
    return this.client.presignedGetObject(
      process.env.MINIO_BUCKET || 'kyc-private',
      objectKey,
      expirySeconds,
    );
  } 

  async getObjectBuffer(objectKey: string): Promise<Buffer> {
    const stream = await this.client.getObject(
      process.env.MINIO_BUCKET || "kyc-private",
      objectKey,
    );

    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }
}