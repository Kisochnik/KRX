import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,32}$/)
  nickname: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+0-9\s()-]{7,24}$/)
  phone?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsDateString()
  birthDate: string;
}
