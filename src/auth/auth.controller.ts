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
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public';
import { SignUpDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signup')
  async signUp(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: SignUpDto,
  ) {
    return await this.authService.handleSignUp(res, body);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signin')
  signIn(@Res() res: Response, @Body(new ValidationPipe()) body: SignInDto) {
    return this.authService.handleSignIn(res, body);
  }

  @HttpCode(HttpStatus.OK)
  @Get('authenticated-user')
  getAuthenticatedUser(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleGetAuthenticatedUser(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh-token')
  refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleRefreshToken(req, res);
  }
}
