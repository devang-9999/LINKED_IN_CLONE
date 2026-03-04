// auth/auth.controller.ts

import { Body, Controller, Post, Get, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/signup.dto';
import { AuthResponseDto } from './dto/authResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('google')
  googleLogin(@Body('email') email: string) {
    return this.authService.signInWithGoogle(email);
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
