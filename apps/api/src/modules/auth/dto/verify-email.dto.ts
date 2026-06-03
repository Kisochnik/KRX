import { IsEmail, Matches } from "class-validator";

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @Matches(/^[0-9]{6}$/)
  code: string;
}
