import { Module } from '@nestjs/common';
import { SubcriptionController } from './SubcriptionController';
import { SubscriptionsService } from './SubscriptionsService';
import { InfraModule } from './infra/InfraModule';
import { UtilsModule } from './utils/UtilsModule';

@Module({
  imports: [InfraModule, UtilsModule],
  controllers: [SubcriptionController],
  providers: [SubscriptionsService],
})
export class SubcriptionModule {}
