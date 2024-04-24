import { Module } from '@nestjs/common';
import { HelperService } from './services/helper/helper.service';
import { DateTimeService } from './services/date-time/date-time.service';

@Module({
  providers: [HelperService,DateTimeService],
  exports: [HelperService,DateTimeService],
})
export class CommonModule {}
