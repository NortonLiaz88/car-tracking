import { Module } from '@nestjs/common';
import { CarTransactionsController } from './car-transactions.controller';
import { CoreModule } from 'src/core/core.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [CoreModule, UsersModule],
  controllers: [CarTransactionsController],
})
export class CarTransactionsModule {}
