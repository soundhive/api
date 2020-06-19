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

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
