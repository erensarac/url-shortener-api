import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Delete,
  Put,
  NotFoundException,
  Req,
  UseGuards
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortUrl, ShortUrl as UrlModel } from 'generated/prisma/client';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/auth.type';

@Controller('')
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
  async getShortUrl(@Param('code') shortCode: string, @Res() res: Response) {
    const data = await this.urlService.shortUrl({ shortCode });

    if (data) {
      await this.urlService.incrementAccessCount(data.id);

      return res.status(302).redirect(data.original);
    }

    throw new NotFoundException("No URL found for the provided short code.")
  }

  @Put('/:code')
  async updateShortUrl(@Param('code') shortCode: string, @Body() data: ShortUrl) {
    return await this.urlService.updateShortUrl({ shortCode }, data);
  }

  @Delete('/:id')
  async deleteShortURL(@Param('id') id: string) {
    return await this.urlService.deleteShortUrl({ id: id });
  }

  @Get('/:code/stats')
  async getShortUrlStats(@Param('code') shortCode: string) {
    return this.urlService.getUrlStats({ shortCode });
  }
}
