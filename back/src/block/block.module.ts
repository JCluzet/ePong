import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { EBlock } from './interface/bock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EBlock]), UsersModule],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}
