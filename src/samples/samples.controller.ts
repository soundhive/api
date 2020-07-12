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
  Query,
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
import { BadRequestResponse } from 'src/shared/dto/bad-request-response.dto';
import { UnauthorizedResponse } from 'src/auth/dto/unothorized-response.dto';
import { PaginationQuery } from 'src/shared/dto/pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateSampleDTO } from './dto/create-sample.dto';
import { FindSampleDTO } from './dto/find-sample.dto';
import { UpdateSampleDTO } from './dto/update-sample.dto';
import { Sample } from './samples.entity';
import { SamplesService } from './samples.service';
import { CreateSampleAPIBody } from './dto/create-sample-api-body.dto';
import { UpdateSampleAPIBody } from './dto/update-sample-api-body.dto';
import { SamplePagination } from './dto/pagination-response.dto';

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
  @UseInterceptors(FileInterceptor('sample_file'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createSampleDTO: CreateSampleDTO,
    @UploadedFile() sampleFile: BufferedFile,
  ): Promise<Sample> {
    if (!sampleFile) {
      throw new BadRequestException('Missing sample file');
    }

    return new Sample(
      await this.samplesService.create(
        {
          ...createSampleDTO,
          downloadable: createSampleDTO.downloadable === 'true',
          user: req.user,
        },
        sampleFile,
      ),
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
  @UseInterceptors(FileInterceptor('sample_file'))
  @Put(':id')
  async update(
    @Request() req: ValidatedJWTReq,
    @Param() findSampleDTO: FindSampleDTO,
    @Body() sampleData: UpdateSampleDTO,
    @UploadedFile() sampleFile: BufferedFile,
  ): Promise<Sample> {
    const existingSample = await this.samplesService.findOne(findSampleDTO);

    if (!existingSample) {
      throw new BadRequestException('Could not find sample');
    }

    if (existingSample.user.id !== req.user.id) {
      throw new ForbiddenException();
    }

    const result: UpdateResult = await this.samplesService.update(
      findSampleDTO,
      sampleData,
      existingSample,
      sampleFile,
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
  @ApiOkResponse({ type: [SamplePagination], description: 'Sample objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Sample>> {
    return this.samplesService.paginate({
      page: paginationQuery.page ? paginationQuery.page : 1,
      limit: paginationQuery.limit ? paginationQuery.limit : 10,
      route: '/tracks',
    });
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
