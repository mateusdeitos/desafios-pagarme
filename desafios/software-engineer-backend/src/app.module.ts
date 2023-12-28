import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DrizzleService } from './drizzle/drizzle.service';
import { TransactionModule } from './transaction/transaction.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TransactionModule,
    BullModule.forRoot({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DrizzleService],
  exports: [DrizzleService],
})
export class AppModule {}
