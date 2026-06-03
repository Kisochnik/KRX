import { IsUUID, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
  @IsUUID()
  recipientId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body: string;
}
