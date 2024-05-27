import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddContactDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
