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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5433),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'onetake'),
        entities: [User, Goal, Task, CoinTransaction, FiveDayCycle, Note],
        synchronize: true,
      }),
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
