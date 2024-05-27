import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './accounts/account.module';
import { KeyModule } from './key/key.module';
import { TransactionModule } from './transactions/account.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    AccountModule,
    KeyModule,
    TransactionModule,
    ContactsModule,
  ],
  exports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
