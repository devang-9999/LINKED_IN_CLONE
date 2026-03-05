import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  roomId: string;

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  text: string;
}
