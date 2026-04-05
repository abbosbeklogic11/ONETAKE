import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findAllForUser(userId: string) {
    return this.taskRepo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }

  async create(userId: string, createDto: { title: string; type?: string; dueDate?: string; fiveDayCycleId?: string; goalId?: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const task = this.taskRepo.create({
      title: createDto.title,
      type: createDto.type || 'Boshqa',
      dueDate: createDto.dueDate,
      fiveDayCycle: createDto.fiveDayCycleId ? { id: createDto.fiveDayCycleId } as any : undefined,
      goal: createDto.goalId ? { id: createDto.goalId } as any : undefined,
      user: user,
    });
    
    return this.taskRepo.save(task);
    return this.taskRepo.save(task);
  }

  async toggleCompletion(id: string, userId: string) {
    const task = await this.taskRepo.findOne({ where: { id, user: { id: userId } }, relations: ['user'] });
    if (!task) throw new NotFoundException('Vazifa topilmadi');
    
    task.isCompleted = !task.isCompleted;
    
    if (task.isCompleted) {
       task.user.coinsBalance += 5; // Har bir vazifa 5 tanga
    } else {
       task.user.coinsBalance = Math.max(0, task.user.coinsBalance - 5);
    }
    
    await this.userRepo.save(task.user);
    return this.taskRepo.save(task);
  }

  async remove(id: string, userId: string) {
    const task = await this.taskRepo.findOne({ where: { id, user: { id: userId } } });
    if (!task) throw new NotFoundException('Vazifa topilmadi');
    return this.taskRepo.remove(task);
  }
}
