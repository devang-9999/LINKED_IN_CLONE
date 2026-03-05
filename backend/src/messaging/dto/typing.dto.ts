import { IsString } from 'class-validator';

export class TypingDto {
  @IsString()
  roomId: string;

  @IsString()
  userid: string;
}
