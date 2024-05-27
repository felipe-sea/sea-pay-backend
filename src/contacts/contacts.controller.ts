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

import { Request, Response } from 'express';
import { ContactsService } from './contacts.service';
import { AddContactDto } from './dto/addContact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getMyContacts(@Req() req: Request, @Res() res: Response) {
    return await this.contactsService.handleGetMyContacts(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('')
  async addContact(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) body: AddContactDto,
  ) {
    return await this.contactsService.handleAddContact(req, res, body);
  }
}
