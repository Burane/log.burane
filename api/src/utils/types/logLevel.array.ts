import { LogLevels } from '@prisma/client';

export const logLevelArray: string[] = Object.values(LogLevels)
  .filter((value) => typeof value === 'string')
  .map((value) => value as string);

export type LogLevelArray = typeof logLevelArray[number];
