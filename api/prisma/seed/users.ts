import { Role, User } from '@prisma/client';

export const users: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'refreshToken'>[] = [
  {
    email: 'user@test.com',
    password: '$2b$10$kBsm9PcfG7rMNDqjxR9jXeXdFuvruDPie3uKTOIMXYjvbuCTm8r9C', // 12456
    role: Role.USER,
    username: 'user',
  },
  {
    email: 'admin@test.com',
    password: '$2b$10$kBsm9PcfG7rMNDqjxR9jXeXdFuvruDPie3uKTOIMXYjvbuCTm8r9C', // 12456
    role: Role.ADMIN,
    username: 'admin',
  },
  {
    email: 'superadmin@test.com',
    password: '$2b$10$kBsm9PcfG7rMNDqjxR9jXeXdFuvruDPie3uKTOIMXYjvbuCTm8r9C', // 12456
    role: Role.SUPERADMIN,
    username: 'superadmin',
  },
];
