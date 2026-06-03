import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const nickname = dto.nickname.toLowerCase();
    const existing = await this.users.findOne({
      where: [{ email }, { nickname }],
    });

    if (existing) {
      throw new ConflictException("Nickname or email already exists");
    }

    const rounds = Number(this.config.get("BCRYPT_ROUNDS", 12));
    const verificationCode = createSixDigitCode();
    const user = this.users.create({
      nickname,
      email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      passwordHash: await bcrypt.hash(dto.password, rounds),
      emailVerificationCodeHash: await bcrypt.hash(verificationCode, rounds),
      emailVerificationExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const saved = await this.users.save(user);

    return {
      user: toPublicUser(saved),
      verification: {
        expiresAt: saved.emailVerificationExpiresAt,
        codeDevOnly: verificationCode,
      },
    };
  }

  async login(dto: LoginDto) {
    const login = dto.login.toLowerCase();
    const user = await this.users
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :login OR user.nickname = :login", { login })
      .getOne();

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordOk) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException("Email verification required");
    }

    if (user.twoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        user: toPublicUser(user),
      };
    }

    return {
      accessToken: await this.signUser(user),
      user: toPublicUser(user),
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.users
      .createQueryBuilder("user")
      .addSelect("user.emailVerificationCodeHash")
      .where("user.email = :email", { email: dto.email.toLowerCase() })
      .getOne();

    if (!user?.emailVerificationCodeHash || !user.emailVerificationExpiresAt) {
      throw new UnauthorizedException("Verification code is invalid");
    }

    if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException("Verification code expired");
    }

    const codeOk = await bcrypt.compare(dto.code, user.emailVerificationCodeHash);

    if (!codeOk) {
      throw new UnauthorizedException("Verification code is invalid");
    }

    user.emailVerified = true;
    user.emailVerificationCodeHash = null;
    user.emailVerificationExpiresAt = null;
    const saved = await this.users.save(user);

    return {
      accessToken: await this.signUser(saved),
      user: toPublicUser(saved),
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.users.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      return { ok: true };
    }

    const rounds = Number(this.config.get("BCRYPT_ROUNDS", 12));
    const resetCode = createSixDigitCode();
    user.emailVerificationCodeHash = await bcrypt.hash(resetCode, rounds);
    user.emailVerificationExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.users.save(user);

    return {
      ok: true,
      codeDevOnly: resetCode,
    };
  }

  private signUser(user: User) {
    return this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    });
  }
}

function createSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function toPublicUser(user: User) {
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    phone: user.phone,
    birthDate: user.birthDate,
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt,
  };
}
