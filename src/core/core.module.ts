import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockSchema } from './repository/mongo/block';
import { BlockService } from './services/block.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Blocks', schema: BlockSchema }]),
  ],
  providers: [BlockService],
  exports: [BlockService],
})
export class CoreModule {}
