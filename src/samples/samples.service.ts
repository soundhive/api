import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { FollowsService } from 'src/follows/follows.service';
import { User } from 'src/users/user.entity';
import { FindSampleDTO } from './dto/find-sample.dto';
import { InsertSampleDTO } from './dto/insert-sample.dto';
import { Sample } from './samples.entity';
import { InsertUpdatedSampleDTO } from './dto/insert-updated-sample.dto';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample) private sampleRepository: Repository<Sample>,
    private minioClientService: MinioClientService,
    private followsService: FollowsService,
  ) {}

  async create(
    insertSampleDTO: InsertSampleDTO,
    sampleFile: BufferedFile,
  ): Promise<Sample> {
    const sample = new Sample(insertSampleDTO);
    sample.filename = await this.uploadSampleFile(sampleFile);

    return this.sampleRepository.save(sample);
  }

  async find(): Promise<Sample[]> {
    return this.sampleRepository.find();
  }

  async findBy(params: {}): Promise<Sample[]> {
    return this.sampleRepository.find(params);
  }

  async findOne(sample: FindSampleDTO): Promise<Sample | undefined> {
    return this.sampleRepository.findOne({ id: sample.id });
  }

  async update(
    sample: FindSampleDTO,
    sampleData: InsertUpdatedSampleDTO,
    existingSample: Sample,
    sampleFile?: BufferedFile,
  ): Promise<UpdateResult> {
    if (sampleFile) {
      // Uplodad new sample
      const filename = await this.uploadSampleFile(sampleFile);
      // Delete old sample file
      this.minioClientService.delete(existingSample.filename);

      return this.sampleRepository.update(
        { id: sample.id },
        { ...sampleData, filename },
      );
    }

    return this.sampleRepository.update({ id: sample.id }, sampleData);
  }

  async delete(sampleDTO: FindSampleDTO): Promise<DeleteResult> {
    const sample = await this.sampleRepository.findOne(sampleDTO);

    if (!sample) {
      throw new BadRequestException();
    }

    this.minioClientService.delete(sample.filename);
    return this.sampleRepository.delete(sample.id);
  }

  async uploadSampleFile(sample: BufferedFile): Promise<string> {
    const subFolder = 'samples';
    const uploadSampleFile = await this.minioClientService.upload(
      sample,
      subFolder,
    );

    return uploadSampleFile.path;
  }

  async isVisibleByUser(sample: Sample, user: User): Promise<boolean> {
    if (sample.user.id === user.id) {
      // user owns the sample
      return true;
    }

    const followings = await this.followsService.findUserFollowed(user);
    if (followings.some((following) => following.id === sample.user.id)) {
      // user's followings contains the sample's author -> can access the sample
      return true;
    }

    return false;
  }
}
