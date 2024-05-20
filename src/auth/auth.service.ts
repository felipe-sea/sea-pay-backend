import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

type JwtPayloadType = {
  userRegistration: string;
};

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

    delete newUser.password;

    return res.status(201).send(newUser);
  }

  async handleSignIn(res: Response, body: SignInDto) {
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

  async handleGetAuthenticatedUser(req: Request, res: Response) {
    const token = this.handleExtractTokenFromHeader(req);
    const payload = await this.handleRecoveryTokenData(token);

    if (!payload) {
      throw new UnauthorizedException();
    }

    const { userRegistration } = payload;

    const user = await this.prismaService.tb_users.findUnique({
      where: {
        registration: userRegistration,
      },
      select: {
        id: true,
        name: true,
        email: true,
        registration: true,
        account_type: true,
      },
    });

    if (!user) {
      return res.status(400).send({
        message: 'User not found',
      });
    }

    return res.send(user);
  }

  handleExtractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async handleRecoveryTokenData(token: string): Promise<JwtPayloadType | null> {
    try {
      const payload: JwtPayloadType = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      return payload;
    } catch (error) {
      return null;
    }
  }
}
