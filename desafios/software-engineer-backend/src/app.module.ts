import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleService } from './drizzle/drizzle.service';
import { PayableModule } from './payable/payable.module';
import { EncryptionService } from './shared/encryption.service';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    TransactionModule,
    PayableModule,
  ],
  controllers: [AppController],
  providers: [AppService, DrizzleService, EncryptionService],
  exports: [DrizzleService, EncryptionService],
})
export class AppModule {}
