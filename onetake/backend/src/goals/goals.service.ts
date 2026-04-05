import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { User } from '../entities/user.entity';
import { FiveDayCycle } from '../entities/five-day-cycle.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalRepo: Repository<Goal>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(FiveDayCycle) private fiveDayCycleRepo: Repository<FiveDayCycle>,
  ) {}

  async findAllForUser(userId: string) {
    return this.goalRepo.find({ 
      where: { user: { id: userId } }, 
      relations: ['fiveDayCycles', 'fiveDayCycles.tasks'],
      order: { createdAt: 'DESC' } 
    });
  }

  async create(userId: string, createDto: { title: string; description?: string; deadline: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const goal = this.goalRepo.create({
      title: createDto.title,
      description: createDto.description,
      deadline: createDto.deadline,
      user: user,
    });
    
    return this.goalRepo.save(goal);
  }

  async updateProgress(id: string, userId: string, score: number) {
    const goal = await this.goalRepo.findOne({ where: { id, user: { id: userId } } });
    if (!goal) throw new NotFoundException('Maqsad topilmadi');
    
    goal.currentScore = score;
    return this.goalRepo.save(goal);
  }

  async remove(id: string, userId: string) {
    const goal = await this.goalRepo.findOne({ where: { id, user: { id: userId } } });
    if (!goal) throw new NotFoundException('Maqsad topilmadi');
    return this.goalRepo.remove(goal);
  }

  // --- Five Day Cycles ---
  async createFiveDayCycle(goalId: string, userId: string, createDto: { description: string, startDate: string, endDate: string }) {
    const goal = await this.goalRepo.findOne({ where: { id: goalId, user: { id: userId } } });
    if (!goal) throw new NotFoundException('Maqsad topilmadi');

    const cycle = this.fiveDayCycleRepo.create({
      description: createDto.description,
      startDate: createDto.startDate,
      endDate: createDto.endDate,
      user: { id: userId } as any,
      goal: goal,
    });
    return this.fiveDayCycleRepo.save(cycle);
  }
}
