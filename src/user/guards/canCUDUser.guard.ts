import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';
import { isEmpty } from 'lodash';

@Injectable()
export class CanCUDUserGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  canGiveRole(userRole: Role, targetRole: Role): boolean {
    switch (targetRole) {
      case Role.USER:
        return (
          userRole === Role.USER ||
          userRole === Role.ADMIN ||
          userRole === Role.SUPERADMIN
        );
      case Role.ADMIN:
        return userRole === Role.ADMIN || userRole === Role.SUPERADMIN;
      case Role.SUPERADMIN:
        return userRole === Role.SUPERADMIN;
    }
  }

  canModifyOrDeleteOther(userRole: Role, targetRole: Role): boolean {
    switch (userRole) {
      case Role.USER:
        return false;
      case Role.ADMIN:
        return targetRole === Role.USER;
      case Role.SUPERADMIN:
        return targetRole === Role.USER || targetRole === Role.ADMIN;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      params,
      body,
    }: { user: User; params: { id: string }; body: { role: Role } } = context
      .switchToHttp()
      .getRequest();

    if (!user) return false;

    // want to delete or modify a specific user
    if (!isEmpty(params)) {
      const { role: targetRole } = await this.userService.getById(params.id);

      // user want to delete or modify himself
      if (user.id === params.id) {
        // in case user want to modify his role
        if (body?.role) {
          return this.canGiveRole(user.role, body.role);
        }
        // want to delete himself
        return true;
      }
      // user want to delete or modify someone else
      else {
        // user can't modify or delete roles below him
        if (!this.canModifyOrDeleteOther(user.role, targetRole)) {
          return false;
        }
        // user want to modify other role
        if (body?.role) {
          return this.canGiveRole(user.role, body.role);
        }
        return true;
      }
    }
    // user want to create another user
    else {
      if (body?.role) {
        return this.canGiveRole(user.role, body.role);
      }
      return false;
    }
  }
}
