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
  } from '@nestjs/common';
  import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Listening } from 'src/listenings/listening.entity';
  import { ListeningsService } from 'src/listenings/listenings.service';
  import { UsersService } from 'src/users/users.service';

  import { UpdateResult } from 'typeorm';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { BufferedFile } from 'src/minio-client/file.model';
  import { CreateSampleDTO } from './dto/create-sample.dto';
  import { FindSampleDTO } from './dto/find-sample.dto';
  import { UpdateSampleDTO } from './dto/update-sample.dto';
  import { Sample } from './samples.entity';
  import { SamplesService } from './samples.service';

  @Controller('samples')
  export class SamplesController {
    constructor(
      private readonly samplesService: SamplesService,
      private readonly usersService: UsersService,
      private readonly listeningsService: ListeningsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('sampleFile'))
    async create(
      @Request() req: { user: AuthenticatedUserDTO },
      @Body() createSampleDTO: CreateSampleDTO,
      @UploadedFile() file: BufferedFile
    ): Promise<Sample> {
      if (!file) {
        throw new BadRequestException("Missing sample file")
      }

      if (!([
        'audio/flac',
        'audio/mpeg',
        'audio/ogg',
        'audio/wav',
        'audio/wave',
      ].includes(file.mimetype))) {
        throw new BadRequestException(`Invalid sample file media type: ${file.mimetype}`)
      }

      const user = await this.usersService.findOne(req.user);

      if (!user) {
        throw new UnauthorizedException("Invalid user");
      }

      const filename: string = await this.samplesService.uploadSampleFile(file, 'samples')

      return new Sample(await this.samplesService.create({
        ...createSampleDTO,
        user,
        filename
      }));
    }

    @Get()
    async find(): Promise<Sample[]> {
      return this.samplesService.find();
    }

    @Get(':id')
    async findOne(@Param() findSampleDTO: FindSampleDTO): Promise<Sample> {
      const sample: Sample | undefined = await this.samplesService.findOne(findSampleDTO);

      if (!sample) {
        throw NotFoundException;
      }

      return sample;
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
    @Put(':id')
    async update(@Param() findSampleDTO: FindSampleDTO, @Body() sampleData: UpdateSampleDTO): Promise<Sample> {
      const result: UpdateResult = await this.samplesService.update(findSampleDTO, sampleData);

      if (!result.affected || result.affected === 0) {
        throw BadRequestException;
      }

      const sample: Sample | undefined = await this.samplesService.findOne(findSampleDTO);

      if (!sample) {
        throw BadRequestException;
      }

      return sample;
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/listen')
    async listen(@Param() findSampleDTO: FindSampleDTO, @Request() req: { user: AuthenticatedUserDTO }): Promise<void> {
      const user = await this.usersService.findOne(req.user);
      const sample = await this.samplesService.findOne(findSampleDTO);
      const listening = new Listening({ user, sample })
      await this.listeningsService.create(listening);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param() sample: FindSampleDTO): void {
      this.samplesService.delete(sample).then();
    }
  }
