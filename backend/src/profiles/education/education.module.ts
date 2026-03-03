import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { Auth } from 'src/auth/entities/auth.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, Auth, User])],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
