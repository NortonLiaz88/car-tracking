import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { CarTransactionsModule } from './car-transactions/car-transactions.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/product-tracking'),
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    CoreModule,
    CarTransactionsModule,
    CarsModule,
  ],
})
export class AppModule {}
