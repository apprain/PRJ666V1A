import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {

    const existingUser =
      await this.usersService.findByEmail(email);

    if (existingUser) {
      return {
        message: 'User already exists',
      };
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    return await this.usersService.createUser(
      email,
      hashedPassword,
    );
  }

    async corpregister(email: string, password: string, organizationname: string) {

    const existingUser =
      await this.usersService.findByEmail(email);

    if (existingUser) {
      return {
        message: 'User already exists',
      };
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    return await this.usersService.createCorpUser(
      email,
      hashedPassword,
      organizationname,
    );
  }

  async login(email: string, password: string) {

    const user =
      await this.usersService.findByEmail(email);

    if (!user) {
      return {
        message: 'Invalid email',
      };
    }

    const passwordMatched =
      await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        return {
          message: 'Invalid password',
        };
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };

      return {
        access_token:
          await this.jwtService.signAsync(payload),
      };
  }

  async corplogin(email: string, password: string) {

    const user =
      await this.usersService.findByEmail(email);

    if (!user) {
      return {
        message: 'Invalid email',
      };
    }

    const passwordMatched =
      await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return {
        message: 'Invalid password',
      };
    }
    if (!user.organizationname) {
      return {
        message: 'Organization login is requited to download statement.',
      };
    }

    //console.log(user.organizationname);
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),
    };
  }
}