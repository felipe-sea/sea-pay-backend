import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { jwtConstants } from './constants';
import { KeyService } from 'src/key/key.service';
import * as bcrypt from 'bcryptjs';

type JwtPayloadType = {
  userRegistration: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private keyService: KeyService,
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

    const accountKey = this.keyService.generateKey();

    const newUser = await this.prismaService.tb_users.create({
      data: {
        account_type: body.account_type,
        email: body.email,
        name: body.name,
        password: encryptedPassword,
        registration: body.registration,
        account: {
          create: {
            amount: 1000.0,
            key: accountKey,
          },
        },
      },
      include: {
        account: true,
      },
    });

    const updatedAccount = await this.prismaService.tb_accounts.update({
      where: {
        id: newUser.account.id,
      },
      data: {
        ...newUser.account,
        account_number: newUser.account.id.toString().padStart(4, '0'),
      },
    });

    delete newUser.password;
    newUser.account = updatedAccount;

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

  async handleRefreshToken(req: Request, res: Response) {
    try {
      const authenticatedUser = await this.getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }

      delete authenticatedUser.password;

      const sub = authenticatedUser.id;

      const payload = { sub, userRegistration: authenticatedUser.registration };
      res.setHeader(
        'Authorization',
        `Bearer ${await this.jwtService.signAsync(payload)}`,
      );

      return res.send();
    } catch (error) {
      return res.status(401).send({
        error,
      });
    }
  }

  async handleGetAuthenticatedUser(req: Request, res: Response) {
    const authenticatedUser = await this.getAuthenticatedUser(req);

    if (!authenticatedUser) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    delete authenticatedUser.password;

    return res.send(authenticatedUser);
  }

  async getAuthenticatedUser(req: Request) {
    const token = this.extractTokenFromHeader(req);
    const payload = await this.recoveryTokenData(token);

    if (!payload) {
      throw new UnauthorizedException();
    }

    const { userRegistration } = payload;

    const user = await this.prismaService.tb_users.findUnique({
      where: {
        registration: userRegistration,
      },
      include: {
        account: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async recoveryTokenData(token: string): Promise<JwtPayloadType | null> {
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
