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
import { AccountService } from './account.service';
import { Request, Response } from 'express';
import { AddMoneyToMyAccount } from './dto/addMoneyToMyAccount.dto';

@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @HttpCode(HttpStatus.OK)
  @Get('my-account')
  async signUp(@Req() req: Request, @Res() res: Response) {
    return await this.accountService.handleGetMyAccount(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('add-money-to-my-account')
  async addMoneyToMyAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) body: AddMoneyToMyAccount,
  ) {
    return await this.accountService.handleAddMoneytoMyAccount(req, res, body);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':accountIdentifyer')
  async getAccount(@Req() req: Request, @Res() res: Response) {
    return await this.accountService.handleGetAccount(req, res);
  }
}
