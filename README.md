<p align="center">
  <a href="#" target="blank"><img src="assets/logo.png" width="150" alt="Soundhive Logo" /></a>
</p>

<p align="center">Soundhive is a free music and community streaming service allowing independent artists to share their music and others to discover and identify music thanks to fingerprinting.</p>

## Description

This repository contains the API of Soundhive.

## Installation

```bash
npm install
```

## Database setup

```sh
npm run db:reset
```

## Minio setup

```sh
docker-compose up -d
```

Install the [Minio client](https://github.com/minio/mc/blob/master/docs/minio-client-complete-guide.md#policy).

On macOS:

```sh
brew install minio/stable/mc
```

Configure a local host:

```sh
mc config host add local http://127.0.0.1:9000 miniokey miniosecret --api S3v4
```

Create a bucket and make it publicly readable:

```sh
➜  ~ mc mb local/soundhive
Bucket created successfully `local/soundhive`.
➜  ~ mc policy set public local/soundhive
Access permission for `local/soundhive` is set to `public`
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Documentation

An OpenAPI documentation is available trough swagger on the `/doc` routes.

- When running locally: [localhost:3000/doc/](http://localhost:3000/doc/)
- Deployed version: [soundhive-api-staging.herokuapp.com/doc/](https://soundhive-api-staging.herokuapp.com/doc/)

For reference here the Module used or provided by the API:

- `PassportModule`
- `TypeOrmModule`
- `LoggerModule`
- `MinioModule`
- `JwtModule`
- `ConfigHostModule`
- `LoggerCoreModule`
- `MinioClientModule`
- `ConfigModule`
- `TypeOrmCoreModule`
- `TypeOrmModule`
- `FollowsModule`
- `FavoritesModule`
- `ListeningsModule`
- `AuthModule`
- `TicketsModule`
- `AdminModule`
- `AppModule`
- `AlbumsModule`
- `PlaylistsModule`
- `UsersModule`
- `SamplesModule`
- `TracksModule`

Controllers:

- `AppController`
- `UsersController`
- `TracksController`
- `AlbumsController`
- `SamplesController`
- `PlaylistsController`
- `AdminController`
- `TicketsController`

Routes:

| Method   | path                                         |
| -------- | -------------------------------------------- |
| `POST`   | `/auth/login`                                |
| `GET`    | `/profile`                                   |
| `GET`    | `/`                                          |
| `POST`   | `/users`                                     |
| `PUT`    | `/users/:username`                           |
| `GET`    | `/users`                                     |
| `GET`    | `/users/:username`                           |
| `GET`    | `/users/:username/tracks`                    |
| `GET`    | `/users/:username/albums`                    |
| `GET`    | `/users/:username/stats`                     |
| `GET`    | `/users/:username/stats/last/:count/:period` |
| `GET`    | `/users/:username/samples`                   |
| `GET`    | `/users/:username/followings`                |
| `GET`    | `/users/:username/followings/tracks`         |
| `GET`    | `/users/:username/followings/albums`         |
| `GET`    | `/users/:username/followers`                 |
| `POST`   | `/users/:username/follow`                    |
| `DELETE` | `/users/:username/follow`                    |
| `GET`    | `/users/:username/favorites`                 |
| `GET`    | `/users/:username/history`                   |
| `GET`    | `/users/:username/playlists`                 |
| `POST`   | `/tracks`                                    |
| `PUT`    | `/tracks/:id`                                |
| `GET`    | `/tracks`                                    |
| `GET`    | `/tracks/charts`                             |
| `GET`    | `/tracks/:id`                                |
| `GET`    | `/tracks/:id/stats`                          |
| `GET`    | `/tracks/:id/stats/last/:count/:period`      |
| `POST`   | `/tracks/:id/listen`                         |
| `DELETE` | `/tracks/:id`                                |
| `POST`   | `/tracks/:id/favorite`                       |
| `DELETE` | `/tracks/:id/favorite`                       |
| `GET`    | `/tracks/:id/isfavorited`                    |
| `GET`    | `/tracks/:id/favoriters`                     |
| `POST`   | `/albums`                                    |
| `GET`    | `/albums`                                    |
| `GET`    | `/albums/:id`                                |
| `GET`    | `/albums/:id/tracks`                         |
| `PUT`    | `/albums/:id`                                |
| `DELETE` | `/albums/:id`                                |
| `POST`   | `/samples`                                   |
| `PUT`    | `/samples/:id`                               |
| `GET`    | `/samples`                                   |
| `GET`    | `/samples/:id`                               |
| `POST`   | `/samples/:id/listen`                        |
| `DELETE` | `/samples/:id`                               |
| `POST`   | `/playlists`                                 |
| `GET`    | `/playlists`                                 |
| `GET`    | `/playlists/:id`                             |
| `GET`    | `/playlists/:id/tracks`                      |
| `PUT`    | `/playlists/:id`                             |
| `DELETE` | `/playlists/:id`                             |
| `POST`   | `/playlists/:id/add-track`                   |
| `POST`   | `/admin/album`                               |
| `PUT`    | `/admin/album/:id`                           |
| `DELETE` | `/admin/album/:id`                           |
| `POST`   | `/admin/playlist`                            |
| `PUT`    | `/admin/playlist/:id`                        |
| `DELETE` | `/admin/playlist/:id`                        |
| `POST`   | `/admin/sample`                              |
| `PUT`    | `/admin/sample/:id`                          |
| `DELETE` | `/admin/sample/:id`                          |
| `POST`   | `/admin/track`                               |
| `PUT`    | `/admin/track/:id`                           |
| `DELETE` | `/admin/track/:id`                           |
| `PUT`    | `/admin/user/:username`                      |
| `DELETE` | `/admin/user/:username`                      |
| `POST`   | `/admin/ticket/:id/comment`                  |
| `POST`   | `/admin/ticket/:id/assign`                   |
| `POST`   | `/admin/ticket/:id/close`                    |
| `POST`   | `/tickets`                                   |
| `GET`    | `/tickets`                                   |
| `GET`    | `/tickets/:id`                               |
| `POST`   | `/tickets/:id/comment`                       |

Details for routes such as input/output properties and types are detailed in the doc mentioned beforehand.

### Admin

The admin functionality is still limited but you can still toggle the `isAdmin` column for your user in the database to access the `/admin` routes.
