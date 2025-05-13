import { Module } from '@nestjs/common';
import { UrlModule } from './url/url.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UrlModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
