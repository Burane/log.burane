import { Role } from '@prisma/client';

export const users = [
  {
    email: 'user@test.com',
    password: '$2b$10$kBsm9PcfG7rMNDqjxR9jXeXdFuvruDPie3uKTOIMXYjvbuCTm8r9C', // 12456
    role: Role.USER,
  },
  {
    email: 'admin@test.com',
    password: '$2b$10$kBsm9PcfG7rMNDqjxR9jXeXdFuvruDPie3uKTOIMXYjvbuCTm8r9C', // 12456
    role: Role.ADMIN,
  },
  {
    email: 'superadmin@test.com',
    password: '$2b$10$kBsm9PcfG7rMNDqjxR9jXeXdFuvruDPie3uKTOIMXYjvbuCTm8r9C', // 12456
    role: Role.SUPERADMIN,
  },
];
