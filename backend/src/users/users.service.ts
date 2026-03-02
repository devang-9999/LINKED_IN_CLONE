import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CompleteProfileDto } from './dto/completeProfile.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async findUser(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['educations', 'experiences', 'skills'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async getMyProfile(userId: string) {
    return this.findUser(userId);
  }

  async completeProfile(userId: string, dto: CompleteProfileDto) {
    const user = await this.findUser(userId);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.findUser(userId);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async updateProfilePicture(userId: string, filename: string) {
    const user = await this.findUser(userId);
    user.profilePicture = filename;
    return this.usersRepository.save(user);
  }

  async updateCoverPicture(userId: string, filename: string) {
    const user = await this.findUser(userId);
    user.coverPicture = filename;
    return this.usersRepository.save(user);
  }

  async getPublicProfile(userId: string) {
    return this.findUser(userId);
  }
}
