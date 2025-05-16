import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma.service';
import { ShortUrl, Prisma } from 'generated/prisma/client';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createUniqueCode(): Promise<string> {
    const maxRetries = 26;

    for (let i = 0; i < maxRetries; i++) {
      const shortCode = nanoid(6);
      const exists = await this.prisma.shortUrl.findUnique({
        where: { shortCode },
      });
      if (!exists) return shortCode;
    }

    throw new Error('Unique code generation failed after multiple attempts');
  }

  async incrementAccessCount(id: string): Promise<ShortUrl | null> {
    return this.prisma.shortUrl.update({
      where: { id },
      data: { accessCount: { increment: 1 } },
    });
  }

  async createShortUrl(
    data: Pick<ShortUrl, 'originalUrl' | 'ownerId'>,
  ): Promise<ShortUrl> {
    const shortCode = await this.createUniqueCode();

    return await this.prisma.shortUrl.create({
      data: { ...data, shortCode },
    });
  }

  async shortUrl(code: Prisma.ShortUrlWhereUniqueInput): Promise<ShortUrl> {
    const shortUrl = await this.findShortUrl(code);

    if (!shortUrl) {
      throw new NotFoundException('No URL found for the provided short code.');
    }

    await this.incrementAccessCount(shortUrl.id);
    return shortUrl;
  }

  async findShortUrl(
    code: Prisma.ShortUrlWhereUniqueInput,
  ): Promise<ShortUrl | null> {
    return this.prisma.shortUrl.findUnique({
      where: code,
    });
  }

  async updateShortUrl(
    where: Prisma.ShortUrlWhereUniqueInput,
    data: Prisma.ShortUrlUpdateInput
  ): Promise<ShortUrl | null> {
    return this.prisma.shortUrl.update({
      where,
      data,
    });
  }

  async deleteShortUrl(
    where: Prisma.ShortUrlWhereUniqueInput,
  ): Promise<ShortUrl> {
    return this.prisma.shortUrl.delete({
      where,
    });
  }

  async getUrlStats(
    where: Prisma.ShortUrlWhereUniqueInput,
  ): Promise<ShortUrl | null> {
    return this.prisma.shortUrl.findUnique({
      where,
    });
  }
}
