import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Goal } from './goal.entity';
import { Task } from './task.entity';

@Entity('five_day_cycles')
export class FiveDayCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Goal, (goal) => goal.fiveDayCycles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'goal_id' })
  goal: Goal;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ nullable: true })
  percentage: number;

  @Column({ name: 'total_tasks', nullable: true })
  totalTasks: number;

  @Column({ name: 'completed_tasks', nullable: true })
  completedTasks: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.fiveDayCycle)
  tasks: Task[];
}
