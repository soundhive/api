import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Listening } from 'src/listenings/listening.entity';
import { ListeningsService } from 'src/listenings/listenings.service';

import { UpdateResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { ValidatedJWTReq } from 'src/auth/dto/validated-jwt-req';
import { CreateSampleDTO } from './dto/create-sample.dto';
import { FindSampleDTO } from './dto/find-sample.dto';
import { UpdateSampleDTO } from './dto/update-sample.dto';
import { Sample } from './samples.entity';
import { SamplesService } from './samples.service';

@Controller('samples')
export class SamplesController {
  constructor(
    private readonly samplesService: SamplesService,
    private readonly listeningsService: ListeningsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('sampleFile'))
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createSampleDTO: CreateSampleDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Sample> {
    if (!file) {
      throw new BadRequestException('Missing sample file');
    }

    if (
      ![
        'audio/flac',
        'audio/mpeg',
        'audio/ogg',
        'audio/wav',
        'audio/wave',
      ].includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `Invalid sample file media type: ${file.mimetype}`,
      );
    }

    const filename: string = await this.samplesService.uploadSampleFile(
      file,
      'samples',
    );

    return new Sample(
      await this.samplesService.create({
        ...createSampleDTO,
        downloadable: createSampleDTO.downloadable === 'true',
        user: req.user,
        filename,
      }),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('sampleFile'))
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findSampleDTO: FindSampleDTO,
    @Body() sampleData: UpdateSampleDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Sample> {
    const existingSample = await this.samplesService.findOne(findSampleDTO);

    if (!existingSample) {
      throw new BadRequestException('Could not find sample');
    }

    if (existingSample.user.id !== req.user.id) {
      throw new ForbiddenException();
    }

    let filename: string;
    if (file) {
      filename = await this.samplesService.uploadSampleFile(file, 'samples');
    } else {
      filename = existingSample.filename;
    }

    const result: UpdateResult = await this.samplesService.update(
      findSampleDTO,
      {
        ...sampleData,
        filename,
      },
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Could not update sample.');
    }

    // Fetch updated sample
    const updatedSample = await this.samplesService.findOne(findSampleDTO);

    if (!updatedSample) {
      throw new BadRequestException('Could not find sample');
    }

    return updatedSample;
  }

  @Get()
  async find(): Promise<Sample[]> {
    return this.samplesService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param() findSampleDTO: FindSampleDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<Sample> {
    const sample: Sample | undefined = await this.samplesService.findOne(
      findSampleDTO,
    );

    if (!sample) {
      throw new NotFoundException();
    }

    if (await this.samplesService.isVisibleByUser(sample, req.user)) {
      return sample;
    }

    throw new UnauthorizedException();
  }

  // @Get(':id/stats')
  // async findStats(@Param() findSampleDTO: FindSampleDTO, @Query() findListeningsDTO: FindListeningsDTO): Promise<SampleListeningsResponseDTO> {
  //   return this.listeningsService.findForSample({ ...findSampleDTO, ...findListeningsDTO })
  // }

  // @Get(':id/stats/last/:count/:period')
  // async findLastStats(@Param() findLastListeningsForSampleDTO: FindLastListeningsForSampleDTO): Promise<SampleListeningsResponseDTO> {
  //   return this.listeningsService.findLastForSample(findLastListeningsForSampleDTO)
  // }

  @UseGuards(JwtAuthGuard)
  @Post(':id/listen')
  async listen(
    @Param() findSampleDTO: FindSampleDTO,
    @Request() req: ValidatedJWTReq,
  ): Promise<void> {
    const sample = await this.samplesService.findOne(findSampleDTO);
    const listening = new Listening({ user: req.user, sample });
    await this.listeningsService.create(listening);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() sample: FindSampleDTO): Promise<void> {
    await this.samplesService.delete(sample);
  }
}
