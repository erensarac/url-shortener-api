import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Delete,
  Put,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortUrl, ShortUrl as UrlModel } from 'generated/prisma/client';
import { Response } from 'express';

@Controller('')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createURL(@Body() data: { original: string }): Promise<UrlModel> {
    const code = await this.urlService.createUniqueCode();

    return this.urlService.createShortUrl({ ...data, code });
  }

  @Get('/:code')
  async getShortUrl(@Param('code') code: string, @Res() res: Response) {
    const data = await this.urlService.shortUrl({ code });

    if (data) {
      await this.urlService.incrementAccessCount(data.id);

      return res.status(302).redirect(data.original);
    }

    return res.status(404).send('Not found');
  }

  @Put('/:code')
  async updateShortUrl(@Param('code') code: string, @Body() data: ShortUrl) {
    return await this.urlService.updateShortUrl({ code }, data);
  }

  @Delete('/:id')
  async deleteShortURL(@Param('id') id: string) {
    return await this.urlService.deleteShortUrl({ id: id });
  }

  @Get('/:code/stats')
  async getShortUrlStats(@Param('code') code: string) {
    return this.urlService.getUrlStats({ code });
  }
}
