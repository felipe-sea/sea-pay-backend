import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountController } from './accounts.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AccountService, PrismaService],
  controllers: [AccountController],
  imports: [AuthModule],
  exports: [AccountService],
})
export class AccountModule {}
