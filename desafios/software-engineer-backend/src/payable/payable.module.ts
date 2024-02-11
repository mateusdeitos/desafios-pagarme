import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableController } from './payable.controller';
import { FeesService } from './fees.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  controllers: [PayableController],
  providers: [FeesService, PayableService, DrizzleService],
  exports: [FeesService],
})
export class PayableModule {}
