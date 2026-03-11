import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Connection } from './entities/connection.entity';
import { User } from 'src/users/entities/user.entity';

import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, User])],
  providers: [ConnectionService],
  controllers: [ConnectionController],
})
export class ConnectionModule {}
