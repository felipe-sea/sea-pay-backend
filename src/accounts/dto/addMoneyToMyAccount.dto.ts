import { IsNumber } from 'class-validator';

export class AddMoneyToMyAccount {
  @IsNumber()
  amount: number;
}
