import { Module } from '@nestjs/common';
import { KeyService } from './key.service';

@Module({
  exports: [KeyService],
  providers: [KeyService],
})
export class KeyModule {}
