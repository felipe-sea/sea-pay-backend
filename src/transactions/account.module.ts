import { Module } from '@nestjs/common';
import { TransactionService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionController } from './account.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [TransactionService, PrismaService],
  controllers: [TransactionController],
  imports: [AuthModule],
  exports: [TransactionService],
})
export class TransactionModule {}
