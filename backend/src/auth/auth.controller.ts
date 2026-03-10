import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, userId } = await this.authService.register(registerDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      domain: 'localhost',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Register successful',
      userId,
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, userId } = await this.authService.login(loginDto);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      domain: 'localhost',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      userId,
    };
  }

  @Post('google')
  async googleLogin(
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, userId } = await this.authService.signInWithGoogle(email);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      domain: 'localhost',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Google login successful',
      userId,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');

    return {
      message: 'Logged out successfully',
    };
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.authService.getById(id);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.authService.removeById(id);
  }
}
