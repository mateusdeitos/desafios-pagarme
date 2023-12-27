import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DrizzleService } from './drizzle/drizzle.service';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ConfigModule.forRoot(), TransactionModule],
  controllers: [AppController],
  providers: [AppService, DrizzleService],
  exports: [DrizzleService],
})
export class AppModule {}
