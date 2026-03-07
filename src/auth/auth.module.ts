// TODO resolve eslint

import { Global, Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CookieAuthGuard } from './guards/cookie-auth.guard.js';
import { HeaderAuthGuard } from './guards/header-auth.guard.js';
import { RoleGuard } from './guards/role.guard.js';
import { JwtStrategy } from './jwt/jwt.strategy.js';

@Global()
@Module({
  imports: [
    JwtModule.register({
      publicKey: undefined,
      signOptions: { algorithm: 'RS256' },
    }),
  ],
  providers: [JwtStrategy, HeaderAuthGuard, CookieAuthGuard, RoleGuard, Reflector, JwtService],
  exports: [HeaderAuthGuard, CookieAuthGuard, RoleGuard, JwtService],
})
export class AuthModule {}
