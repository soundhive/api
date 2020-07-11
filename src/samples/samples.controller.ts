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
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from 'src/dto/bad-request-response.dto';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { AudioFileMediaType } from 'src/media-types';
import { CreateSampleDTO } from './dto/create-sample.dto';
import { FindSampleDTO } from './dto/find-sample.dto';
import { UpdateSampleDTO } from './dto/update-sample.dto';
import { Sample } from './samples.entity';
import { SamplesService } from './samples.service';
import { CreateSampleAPIBody } from './dto/create-sample-api-body.dto';
import { UpdateSampleAPIBody } from './dto/update-sample-api-body.dto';

@Controller('samples')
export class SamplesController {
  constructor(
    private readonly samplesService: SamplesService,
    private readonly listeningsService: ListeningsService,
  ) {}

  @ApiOperation({ summary: 'Create a sample' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSampleAPIBody })
  @ApiCreatedResponse({ type: Sample, description: 'Sample object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('sampleFile'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createSampleDTO: CreateSampleDTO,
    @UploadedFile() file: BufferedFile,
  ): Promise<Sample> {
    if (!file) {
      throw new BadRequestException('Missing sample file');
    }

    if (!Object.values(AudioFileMediaType).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid sample file media type: ${file.mimetype}`,
      );
    }

    const filename: string = await this.samplesService.uploadSampleFile(file);

    return new Sample(
      await this.samplesService.create({
        ...createSampleDTO,
        downloadable: createSampleDTO.downloadable === 'true',
        user: req.user,
        filename,
      }),
    );
  }

  @ApiOperation({ summary: 'Update a sample' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateSampleAPIBody })
  @ApiOkResponse({ type: Sample, description: 'Sample object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('sampleFile'))
  @Put(':id')
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
      filename = await this.samplesService.uploadSampleFile(file);
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

  @ApiOperation({ summary: 'Get all samples' })
  @ApiOkResponse({ type: [Sample], description: 'Sample objects' })
  @Get()
  async find(): Promise<Sample[]> {
    return this.samplesService.find();
  }

  @ApiOperation({ summary: 'Get a sample' })
  @ApiOkResponse({ type: Sample, description: 'Sample object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Increment listening count' })
  @ApiCreatedResponse({
    description: 'Success',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Delete sample' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async delete(
    @Request() req: ValidatedJWTReq,
    @Param() sample: FindSampleDTO,
  ): Promise<void> {
    const sampleToDelete = await this.samplesService.findOne(sample);

    if (sampleToDelete?.user.id !== req.user.id) {
      throw new ForbiddenException(['You do not own this sample.']);
    }

    await this.samplesService.delete(sample);
  }
}
