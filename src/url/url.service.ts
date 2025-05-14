import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma.service';
import { ShortUrl, Prisma } from 'generated/prisma/client';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createUniqueCode(): Promise<string> {
    const maxRetries = 26;
    
    for (let i = 0; i < maxRetries; i++) {
      const code = nanoid(6);
      const exists = await this.prisma.shortUrl.findUnique({ where: { code } });
      if (!exists) return code;
    }
    
    throw new Error('Unique code generation failed after multiple attempts');
  }

  async incrementAccessCount(id: string): Promise<ShortUrl | null> {
    return this.prisma.shortUrl.update({
      where: { id },
      data: { accessCount: { increment: 1 } },
    });
  }

  async createShortenURL(data: Prisma.ShortUrlCreateInput): Promise<ShortUrl> {
    return this.prisma.shortUrl.create({
      data: { ...data },
    });
  }

  async getShortenURL(
    code: Prisma.ShortUrlWhereUniqueInput,
  ): Promise<ShortUrl | null> {
    const data = await this.prisma.shortUrl.findUnique({
      where: code,
    });

    if (data) {
      this.incrementAccessCount(data.id);
    }

    return data;
  }

}
