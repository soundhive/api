import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as Minio from 'minio';
import * as crypto from 'crypto';
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
        // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
        //     throw new HttpException('Invalid file type', HttpStatus.BAD_REQUEST)
        // }

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
        } catch {
            throw new HttpException(
                'Error uploading file',
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
}
