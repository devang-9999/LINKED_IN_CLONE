import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/authResponse.dto';
import { RegisterDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password } = registerDto;

    const existingUser = await this.authRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({});
    const savedUser = await this.userRepository.save(newUser);

    const newAuth = this.authRepository.create({
      email,
      password: hashedPassword,
      user: savedUser,
    });

    await this.authRepository.save(newAuth);

    const token = this.jwtService.sign({
      sub: savedUser.id,
      email: email,
    });

    return {
      accessToken: token,
      userId: savedUser.id,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const authUser = await this.authRepository.findOne({
      where: { email },
      relations: ['user'],
      select: ['id', 'email', 'password'],
    });

    if (!authUser) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, authUser.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const token = this.jwtService.sign({
      sub: authUser.user.id,
      email: authUser.email,
    });

    return {
      accessToken: token,
      userId: authUser.user.id,
    };
  }

  async getById(id: string) {
    const user = await this.authRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      userId: user.user.id,
    };
  }

  async removeById(id: string) {
    const user = await this.authRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.authRepository.remove(user);
  }

  async signInWithGoogle(userGoogleDto: LoginDto) {
    const { email, password } = userGoogleDto;
    const existingUser = await this.authRepository.findOne({
      where: { email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({});
      const savedUser = await this.userRepository.save(newUser);

      const newAuth = this.authRepository.create({
        email,
        password: hashedPassword,
        user: savedUser,
      });
      await this.authRepository.save(newAuth);
      const token = this.jwtService.sign({
        sub: savedUser.id,
        email: email,
      });

      return {
        accessToken: token,
        userId: savedUser.id,
      };
    }
  }
}
