import { Module } from '@nestjs/common';
import { Page } from './Page';

@Module({
  providers: [Page],
  exports: [Page],
})
export class UtilsModule {}
