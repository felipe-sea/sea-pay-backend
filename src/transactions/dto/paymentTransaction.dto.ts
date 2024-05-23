import { IsNumber } from 'class-validator';

export class PaymentTransactionDto {
  @IsNumber()
  value: number;

  // @IsIn(['success', 'error'], {
  //   message: 'status must be either success or error',
  // })
  // status: string;
  // @IsString()
  // transaction_date: string;
  // @IsNumber()
  // origin_account_id: number;

  // @IsNumber()
  // origin_user_id: number;

  // @IsNumber()
  // destination_account_id: number;
  @IsNumber()
  destination_user_id: number;
}
