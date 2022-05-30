import { PrismaClient, LogLevels } from '@prisma/client';
import { users } from './users';

const prisma = new PrismaClient();

const LogLevelArray: LogLevels[] = [
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
  'FATAL',
];

type LogLevelType = 'DEBUG' |
  'INFO' |
  'WARN' |
  'ERROR' |
  'FATAL'

async function main() {
  for (const user of users) {
    const u = await prisma.user.create({ data: user });

    for (let i = 0; i < 30; i++) {
      const logMsgs = [];
      for (let j = 0; j < 150; j++) {
        const logLevel = LogLevelArray[Math.floor(Math.random() * LogLevelArray.length)];

        const date = Date.now() + j * 1000;

        logMsgs.push({
          message: `${date.toString()} - Log ${logLevel}`,
          date: new Date(date),
          level: logLevel,
        });

      }
      await prisma.application.create({
        data: {
          userId: u.id,
          name: `Application ${i}`,
          description: `Application ${i} for user ${u.username}`,
          logMessages: {
            create: logMsgs
          }
        },
      });
    }

  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
