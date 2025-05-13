import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlService {
  getUrl(): string {
    return 'Hello from URL';
  }
}
