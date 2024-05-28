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
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
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
  providers: [
    AppService,
    {
      useClass: AuthGuard,
      provide: 'APP_GUARD',
    },
  ],
})
export class AppModule {}
