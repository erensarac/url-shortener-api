import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { ValidatedUser } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<ValidatedUser | null> {
    const user = await this.usersService.findUser(username);

    if (user) {
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          return { id: user.id, username: user.username };
        }

        throw new UnauthorizedException('Invalid password');
      } catch (err) {
        throw err || new InternalServerErrorException();
      }
    }

    return null;
  }

  async login(user: Prisma.UserWhereUniqueInput) {
    const payload = { username: user.username, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(data: Prisma.UserCreateInput) {
    if (!data.username || !data.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.usersService.findUser(data.username);

    if (!user) {
      try {
        const { id, username } = await this.usersService.createUser({
          username: data.username,
          password: await bcrypt.hash(data.password, 12),
        });

        return { id, username };
      } catch (err) {
        throw new InternalServerErrorException();
      }
    }

    throw new ConflictException('Username is already taken');
  }
}
