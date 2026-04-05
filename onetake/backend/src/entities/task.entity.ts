import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Goal } from './goal.entity';
import { FiveDayCycle } from './five-day-cycle.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Goal, (goal) => goal.tasks, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'goal_id' })
  goal: Goal;

  @ManyToOne(() => FiveDayCycle, (fiveDayCycle) => fiveDayCycle.tasks, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'five_day_cycle_id' })
  fiveDayCycle: FiveDayCycle;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 50, nullable: true })
  type: string;

  @Column({ default: 0 })
  score: number;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
