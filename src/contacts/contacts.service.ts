import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddContactDto } from './dto/addContact.dto';

@Injectable()
export class ContactsService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async handleGetMyContacts(req: Request, res: Response) {
    try {
      const authenticatedUser =
        await this.authService.getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }

      const contacts = await this.prismaService.tb_contacts.findMany({
        where: {
          user_id: authenticatedUser.id,
        },
        include: {
          contact_user: {
            select: {
              id: true,
              name: true,
              account: {
                select: {
                  key: true,
                },
              },
            },
          },
        },
      });

      return res.send(contacts);
    } catch (error) {
      return res.send({
        error,
      });
    }
  }

  async handleAddContact(req: Request, res: Response, body: AddContactDto) {
    try {
      const authenticatedUser =
        await this.authService.getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }

      const { user_id } = body;

      if (authenticatedUser.id === user_id) {
        return res.status(400).send({
          message: 'You cannot add yourself as a contact',
        });
      }

      const contactAlreadyExists =
        await this.prismaService.tb_contacts.findFirst({
          where: {
            user_id: authenticatedUser.id,
            contact_id: user_id,
          },
        });

      if (contactAlreadyExists) {
        return res.status(400).send({
          message: 'Contact already vinculated',
        });
      }

      const userExists = await this.prismaService.tb_users.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!userExists) {
        return res.status(400).send({
          message: 'User not found',
        });
      }

      const newContact = await this.prismaService.tb_contacts.create({
        data: {
          user_id: authenticatedUser.id,
          contact_id: user_id,
        },
      });

      return res.send(newContact);
    } catch (error) {
      return res.status(400).send({
        message: error,
      });
    }
  }
}
