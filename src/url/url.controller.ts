import { Controller, Post, Body, Get, Param, Res, Redirect, } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortUrl as UrlModel } from 'generated/prisma/client';
import { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('/:code')
  async getShortenURL(@Param('code') code: string, @Res() res: Response) {
    const data = await this.urlService.getShortenURL({ code });

    if (data) {
      return res.status(302).redirect(data.original)
    }

    return res.status(404).send('Not found')
  }

  @Post()
  async createURL(@Body() data: { original: string }): Promise<UrlModel> {
    const code = await this.urlService.createUniqueCode();

    return this.urlService.createShortenURL({ ...data, code });
  }
}
