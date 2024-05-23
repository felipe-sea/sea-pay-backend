import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './account.service';
import { Request, Response } from 'express';
import { PaymentTransactionDto } from './dto/paymentTransaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  async addMoneyToMyAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) body: PaymentTransactionDto,
  ) {
    return await this.transactionService.handlePaymentTransaction(
      req,
      res,
      body,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllTransactions(@Req() req: Request, @Res() res: Response) {
    return await this.transactionService.handleGetAllTransactions(req, res);
  }
}
