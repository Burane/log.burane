import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserOwnAppGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      params,
    }: { user: User; params: { appId: string } } = context
      .switchToHttp()
      .getRequest();

    if (!user) return false;

    if (isEmpty(params)) {
      return false;
    }

    let app = await this.prisma.application.findUnique({ where: { id: params.appId } });

    if (!app || app.userId !== user.id) {
      return false;
    }

    return true;

  }
}
