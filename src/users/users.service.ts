import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: { ...data },
    });
  }

  async findUser(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }
}
