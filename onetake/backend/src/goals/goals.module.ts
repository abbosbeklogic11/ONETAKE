import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { Goal } from '../entities/goal.entity';
import { User } from '../entities/user.entity';
import { FiveDayCycle } from '../entities/five-day-cycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, User, FiveDayCycle])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
