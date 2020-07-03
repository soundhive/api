import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { SupportsService } from 'src/supports/supports.service';
import { User } from 'src/users/user.entity';
import { FindSampleDTO } from './dto/find-sample.dto';
import { InsertSampleDTO } from './dto/insert-sample.dto';
import { UpdateSampleDTO } from './dto/update-sample.dto';
import { Sample } from './samples.entity';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRepository(Sample) private sampleRepository: Repository<Sample>,
    private minioClientService: MinioClientService,
    private supportsService: SupportsService,
  ) { }

  async create(createSampleDTO: InsertSampleDTO): Promise<Sample> {
    return this.sampleRepository.save(createSampleDTO);
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

  async update(sample: FindSampleDTO, sampleData: UpdateSampleDTO): Promise<UpdateResult> {
    return this.sampleRepository.update({ id: sample.id }, sampleData);
  }

  async delete(sample: FindSampleDTO): Promise<DeleteResult> {
    return this.sampleRepository.delete({ id: sample.id });
  }

  async uploadSampleFile(sample: BufferedFile, subFolder: string): Promise<string> {
    const uploadSampleFile = await this.minioClientService.upload(sample, subFolder)

    return uploadSampleFile.path
  }

  async isVisibleByUser(sample: Sample, user: User):Promise<boolean> {

    if (sample.user.id === user.id) {
      // user owns the sample
      return true;
    }

    const followings = await this.supportsService.findUserSupported(user);
    if (followings.some(following => following.id === sample.user.id)) {
      // user's followings contains the sample's author -> can access the sample
      return true;
    }

    return false;
  }
}
