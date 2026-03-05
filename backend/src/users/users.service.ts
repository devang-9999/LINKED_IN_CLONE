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
    private readonly usersRepository: Repository<User>,
  ) {}

  private async findUserWithRelations(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['educations', 'experiences', 'skills'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getMyProfile(userId: string) {
    return this.findUserWithRelations(userId);
  }

  async getPublicProfile(userId: string) {
    return this.findUserWithRelations(userId);
  }

  async findById(userId: string) {
    return this.findUser(userId);
  }

  async completeProfile(
    userId: string,
    dto: CompleteProfileDto,
    profilePicture?: string,
    coverPicture?: string,
  ) {
    const user = await this.findUser(userId);

    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.headline !== undefined) user.headline = dto.headline;
    if (dto.about !== undefined) user.about = dto.about;

    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    if (coverPicture) {
      user.coverPicture = coverPicture;
    }

    return this.usersRepository.save(user);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.findUser(userId);

    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.headline !== undefined) user.headline = dto.headline;
    if (dto.about !== undefined) user.about = dto.about;
    if (dto.profilePicture !== undefined)
      user.profilePicture = dto.profilePicture;
    if (dto.coverPicture !== undefined) user.coverPicture = dto.coverPicture;

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

  async getAllUsers() {
    const users = await this.usersRepository.find({
      select: ['id', 'firstName', 'lastName', 'headline', 'profilePicture'],
    });

    return users;
  }
}
