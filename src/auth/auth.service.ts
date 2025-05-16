import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Prisma } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
