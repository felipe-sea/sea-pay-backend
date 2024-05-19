import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async handleSignUp(res: Response, body: SignUpDto) {
    const registrationAlreadyExists =
      await this.prismaService.tb_users.findUnique({
        where: {
          registration: body.registration,
        },
      });

    if (registrationAlreadyExists) {
      return res.status(400).send({
        message: 'Registration already exists',
      });
    }

    const { password } = body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.tb_users.create({
      data: {
        account_type: body.account_type,
        email: body.email,
        name: body.name,
        password: encryptedPassword,
        registration: body.registration,
      },
    });

    return res.send(newUser);
  }

  async signIn(res: Response, body: SignInDto) {
    const userByRegistration = await this.prismaService.tb_users.findUnique({
      where: {
        registration: body.login,
      },
    });

    if (!userByRegistration) {
      return res.status(400).send({
        message: 'User not found',
      });
    }

    const { password } = body;

    const passwordEnteredMatches = await bcrypt.compare(
      password,
      userByRegistration.password,
    );

    if (!passwordEnteredMatches) {
      return res.status(400).send({
        message: 'Invalid password',
      });
    }

    const { id, registration } = userByRegistration;

    const payload = { sub: id, userRegistration: registration };
    res.setHeader(
      'Authorization',
      `Bearer ${await this.jwtService.signAsync(payload)}`,
    );

    return res.send();
  }
}
