import { Application, Prisma } from '@prisma/client';

export type appWithStats = {
  logMessagesCount: (Prisma.PickArray<Prisma.LogMessageGroupByOutputType, "level"[]> & {_count: number})[],
  _count: {
    "logMessages" : number
  }
} & Application
