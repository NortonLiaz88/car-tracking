import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { UsersModule } from 'src/users/users.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, UsersModule],
  controllers: [CarsController],
})
export class CarsModule {}
