import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { AuthUser, TokenPayload } from "./auth.types";

type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const token = authHeader.slice("Bearer ".length);

    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        nickname: payload.nickname,
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid bearer token");
    }
  }
}
