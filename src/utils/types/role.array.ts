import { Role } from '@prisma/client';

export const roleArray: string[] = Object.values(Role)
  .filter((value) => typeof value === 'string')
  .map((value) => value as string);

export type RoleArray = typeof roleArray[number];
