



## Installation

```bash
# install dependencies
$ npm install

# start postgres docker service
$ npm run postgre

# create a migration from Prisma schema, apply it to the database, trigger generators
$ prisma migrate dev

# seed the database
$ prisma db seed
```

### 
```bash
# building app with docker compose
$ docker-compose build

$ docker-compose up
```


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## More
When changing prisma schema you need to re-migrate

```bash
# create a migration from Prisma schema, apply it to the database, trigger generators
$ prisma migrate dev

# format prisma schema
$ prisma format
```
