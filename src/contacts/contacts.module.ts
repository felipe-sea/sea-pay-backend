import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';

@Module({
  providers: [ContactsService, PrismaService],
  controllers: [ContactsController],
  imports: [AuthModule],
  exports: [ContactsService],
})
export class ContactsModule {}
