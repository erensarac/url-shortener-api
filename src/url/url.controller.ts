import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortUrl, ShortUrl as UrlModel } from 'generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/auth.type';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createURL(
    @Req() req: AuthenticatedRequest,
    @Body() data: { originalUrl: string },
  ): Promise<UrlModel> {
    return this.urlService.createShortUrl({ ...data, ownerId: req.user.id });
  }

  @Get('/:code')
  @Redirect()
  async getShortUrl(@Param('code') shortCode: string) {
    const { originalUrl } = await this.urlService.shortUrl({ shortCode });

    return { url: originalUrl };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:code')
  async updateShortUrl(@Param('code') shortCode: string, @Body() data: ShortUrl) {
    return await this.urlService.updateShortUrl({ shortCode }, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteShortURL(@Param('id') id: string) {
    return await this.urlService.deleteShortUrl({ id: id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:code/stats')
  async getShortUrlStats(@Param('code') shortCode: string) {
    return this.urlService.getUrlStats({ shortCode });
  }
}
