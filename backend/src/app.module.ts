import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './database/data-source/data-source';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { EducationModule } from './profiles/education/education.module';
import { MessageModule } from './messaging/message.module';
import { PostsModule } from './posts/posts.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { CommentsModule } from './comments/comments.module';
import { CommentLikesModule } from './comment-likes/comment-likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    ProfilesModule,
    EducationModule,
    MessageModule,
    PostsModule,
    PostLikesModule,
    CommentsModule,
    CommentLikesModule,
  ],
})
export class AppModule {}
