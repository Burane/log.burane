import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CanCUDUserGuard } from './user/guards/canCUDUser.guard';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot(), UserModule],
  controllers: [AppController],
  providers: [AppService, CanCUDUserGuard],
})
export class AppModule {}
