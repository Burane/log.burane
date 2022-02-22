import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';

@Injectable()
export class CanCUDUserGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      params,
      body,
    }: { user: User; params: { id: string }; body: { role: Role } } = context
      .switchToHttp()
      .getRequest();

    if (!user || params) return false;

    if (user.id === params.id) {
      if (body?.role) {
        if (user.role === Role.ADMIN && body?.role !== Role.USER) return false;
        if (user.role === Role.SUPERADMIN && body?.role === Role.SUPERADMIN)
          return false;
      }
      return true;
    } else {
      const { role } = await this.userService.getById(params.id);
      if (user.role === Role.USER) return false;
      if (user.role === Role.ADMIN && role !== Role.USER) return false;
      if (user.role === Role.SUPERADMIN && role === Role.SUPERADMIN)
        return false;

      if (body?.role) {
        if (user.role === Role.ADMIN && body?.role !== Role.USER) return false;
        if (user.role === Role.SUPERADMIN && body?.role === Role.SUPERADMIN)
          return false;
      }
      return true;
    }
  }
}
