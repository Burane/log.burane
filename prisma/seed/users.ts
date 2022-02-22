import { Role } from '@prisma/client';

export const users = [
  {
    email: 'admin@test.com',
    password: '$2b$10$kBsm9PcfG7rMNDqjxR9jXeXdFuvruDPie3uKTOIMXYjvbuCTm8r9C', // 12456
    role: Role.SUPERADMIN,
  },
];
