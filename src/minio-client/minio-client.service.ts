import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as Minio from 'minio';
import * as crypto from 'crypto'
import { config } from './config'
import { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {
    constructor(
        private readonly minioService: MinioService,
    ) { }

    private readonly baseBucket = config.MINIO_BUCKET

    public get client(): Minio.Client {
        return this.minioService.client;
    }

    public async upload(file: BufferedFile, baseBucket: string = this.baseBucket): Promise<{ url: string }> {
        if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
            throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        }
        const tmpFilename = Date.now().toString()
        const hashedFileName = crypto.createHash('md5').update(tmpFilename).digest("hex");
        const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        const metaData = {
            'Content-Type': file.mimetype,
        };
        const filename = hashedFileName + ext
        const fileName = `${filename}`;
        const fileBuffer = file.buffer;
        try {
            await this.client.putObject(baseBucket, fileName, fileBuffer, metaData)
        } catch {
            throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        }

        return {
            url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`
        }
    }

    delete(objetName: string, baseBucket: string = this.baseBucket): void {
        this.client.removeObject(baseBucket, objetName, (err: Error) => {
            if (err) throw new HttpException("Oops Something wrong happend", HttpStatus.BAD_REQUEST)
        })
    }
}
