import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { AlbumsModule } from './albums/albums.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import * as ormconfig from './ormconfig';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { SamplesModule } from './samples/samples.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { FavoritesModule } from './favorites/favorites.module';

export function DatabaseOrmModule(): DynamicModule {
  // we could load the configuration from dotEnv here,
  // but typeORM cli would not be able to find the configuration file.

  return TypeOrmModule.forRoot(ormconfig);
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    AlbumsModule,
    TracksModule,
    TypeOrmModule.forRoot(ormconfig),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        prettyPrint: process.env.NODE_ENV !== 'production',
      },
    }),
    MinioClientModule,
    SamplesModule,
    PlaylistsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
