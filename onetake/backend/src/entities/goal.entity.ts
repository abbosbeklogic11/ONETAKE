import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';
import { FiveDayCycle } from './five-day-cycle.entity';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  deadline: string;

  @Column({ name: 'max_score', default: 100 })
  maxScore: number;

  @Column({ name: 'current_score', default: 0 })
  currentScore: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.goal)
  tasks: Task[];

  @OneToMany(() => FiveDayCycle, (fiveDayCycle) => fiveDayCycle.goal)
  fiveDayCycles: FiveDayCycle[];
}
