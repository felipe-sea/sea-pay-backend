import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class SignUpDto implements Prisma.tb_usersCreateInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsIn(['shopkeeper', 'standard'], {
    message: 'account_type must be either shopkeeper or standard',
  })
  account_type: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  registration: string;
}
