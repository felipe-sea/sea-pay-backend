import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentTransactionDto } from './dto/paymentTransaction.dto';
import { AccountTypeEnum } from 'src/types/users';

@Injectable()
export class TransactionService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async handlePaymentTransaction(
    req: Request,
    res: Response,
    body: PaymentTransactionDto,
  ) {
    try {
      const authenticatedUser =
        await this.authService.getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }

      const { destination_user_id, value } = body;

      const destinationUser = await this.prismaService.tb_users.findUnique({
        where: {
          id: destination_user_id,
        },
        include: {
          account: true,
        },
      });

      if (!destinationUser) {
        return res.status(400).send({
          message: 'Account not found',
        });
      }

      if (authenticatedUser.id === destinationUser.id) {
        return res.status(400).send({
          message: 'You can not send money to yourself',
        });
      }

      if (authenticatedUser.account_type === AccountTypeEnum.shopkeeper) {
        return res.status(400).send({
          message: 'You can not send money as a shopkeeper',
        });
      }

      if (authenticatedUser.account.amount < value) {
        return res.status(500).send({
          message: 'Insufficient funds',
        });
      }

      const transactionStatus = this.handleGetRandomStatus();

      const transaction = await this.prismaService.tb_transactions.create({
        data: {
          origin_user_id: authenticatedUser.id,
          destination_user_id: destinationUser.id,
          value,
          destination_account_id: destinationUser.account.id,
          status: transactionStatus,
          transaction_date: new Date(),
          origin_account_id: authenticatedUser.account.id,
        },
      });

      if (transactionStatus === 'error') {
        return res.status(500).send({
          transaction,
        });
      }

      await this.prismaService.tb_accounts.update({
        where: {
          id: authenticatedUser.account.id,
        },
        data: {
          amount: authenticatedUser.account.amount - value,
        },
      });

      await this.prismaService.tb_accounts.update({
        where: {
          id: destinationUser.account.id,
        },
        data: {
          amount: destinationUser.account.amount + value,
        },
      });

      return res.send({ transaction });
    } catch (error) {
      return res.send({ error });
    }
  }

  handleGetRandomStatus(): 'success' | 'error' {
    const randomNumber = Math.random();
    return randomNumber < 0.8 ? 'success' : 'error';
  }

  async handleGetAllTransactions(req: Request, res: Response) {
    try {
      const authenticatedUser =
        await this.authService.getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }

      const {
        page = 1,
        limit = 10,
        sortBy = 'transaction_date',
        order = 'asc',
      } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const offset = (pageNumber - 1) * limitNumber;

      const allTransactions = await this.prismaService.tb_transactions.findMany(
        {
          skip: offset,
          take: limitNumber,
          orderBy: {
            [sortBy as string]: order as 'asc' | 'desc',
          },
          where: {
            OR: [
              {
                origin_user_id: authenticatedUser.id,
              },
              {
                destination_user_id: authenticatedUser.id,
              },
            ],
          },
          include: {
            tb_users: {
              select: {
                name: true,
              },
            },
            tb_accounts: {
              select: {
                account_number: true,
                key: true,
              },
            },
          },
        },
      );

      const totalCount = await this.prismaService.tb_transactions.count();

      return res.json({
        data: allTransactions,
        total: totalCount,
        page: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      });
    } catch (error) {
      return res.send({ error });
    }
  }
}
