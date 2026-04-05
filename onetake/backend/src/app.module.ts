import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User } from './entities/user.entity';
import { Goal } from './entities/goal.entity';
import { Task } from './entities/task.entity';
import { CoinTransaction } from './entities/coin-transaction.entity';
import { FiveDayCycle } from './entities/five-day-cycle.entity';
import { Note } from './entities/note.entity';
import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';
import { TasksModule } from './tasks/tasks.module';

import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url,
          host: !url ? configService.get<string>('DB_HOST', 'localhost') : undefined,
          port: !url ? configService.get<number>('DB_PORT', 5433) : undefined,
          username: !url ? configService.get<string>('DB_USERNAME', 'postgres') : undefined,
          password: !url ? configService.get<string>('DB_PASSWORD', 'postgres') : undefined,
          database: !url ? configService.get<string>('DB_DATABASE', 'onetake') : undefined,
          entities: [User, Goal, Task, CoinTransaction, FiveDayCycle, Note],
          synchronize: true,
          ssl: url ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    GoalsModule,
    TasksModule,
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
