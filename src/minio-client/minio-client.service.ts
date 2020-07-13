import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as Minio from 'minio';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';
import { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {
  constructor(private readonly minioService: MinioService) {}

  private readonly baseBucket = config.MINIO_BUCKET;

  public get client(): Minio.Client {
    return this.minioService.client;
  }

  public async upload(
    file: BufferedFile,
    subFolder: string,
  ): Promise<{ path: string }> {
    const hashedFileName = crypto
      .createHash('md5')
      .update(Date.now().toString())
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const fileName = hashedFileName + ext;
    const filePath = `${subFolder}/${fileName}`;

    const metaData = {
      'Content-Type': file.mimetype,
    };

    try {
      await this.client.putObject(
        this.baseBucket,
        filePath,
        file.buffer,
        metaData,
      );
    } catch (e) {
      throw new HttpException(
        `Error uploading file: ${e.code}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      path: filePath,
    };
  }

  delete(objetName: string, baseBucket: string = this.baseBucket): void {
    try {
      this.client.removeObject(baseBucket, objetName);
    } catch {
      throw new HttpException(
        'Error deleting file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async download(
    downloadPath: string,
    objetName: string,
    baseBucket: string = this.baseBucket,
  ): Promise<void> {
    try {
      const basedir = path.dirname(downloadPath);
      fs.mkdirSync(basedir, {
        recursive: true,
      });

      return this.client.fGetObject(baseBucket, objetName, downloadPath);
    } catch {
      throw new HttpException(
        'Error getting file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
