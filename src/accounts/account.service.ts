import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMoneyToMyAccount } from './dto/addMoneyToMyAccount.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}
  async handleGetMyAccount(req: Request, res: Response) {
    const authenticatedUser = await this.authService.getAuthenticatedUser(req);

    if (!authenticatedUser) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    const account = authenticatedUser.account;

    return res.send(account);
  }

  async handleAddMoneytoMyAccount(
    req: Request,
    res: Response,
    body: AddMoneyToMyAccount,
  ) {
    const authenticatedUser = await this.authService.getAuthenticatedUser(req);

    if (!authenticatedUser) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    if (body.amount <= 0) {
      return res.status(400).send({
        message: 'Amount must be greater than 0',
      });
    }

    const amountRounded = Number(body.amount.toFixed(2));

    const accountUpdated = await this.prismaService.tb_accounts.update({
      where: {
        id: authenticatedUser.account.id,
      },
      data: {
        amount: authenticatedUser.account.amount + amountRounded,
      },
    });

    return res.send(accountUpdated);
  }

  async handleGetAccount(req: Request, res: Response) {
    try {
      const { accountIdentifyer } = req.params;

      let searchParams = {} as Prisma.tb_accountsWhereUniqueInput;

      switch (accountIdentifyer.length) {
        case 4:
          searchParams = {
            account_number: accountIdentifyer,
          };
          break;
        default:
          searchParams = {
            key: accountIdentifyer,
          };
          break;
      }

      const account = await this.prismaService.tb_accounts.findUnique({
        where: searchParams,
      });

      if (!account) {
        return res.status(400).send({
          message: 'Account not found',
        });
      }

      return res.send(account);
    } catch (error) {
      return res.send('Error: ' + error.message);
    }
  }
}
