import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAllForUser(req.user.id);
  }

  @Post()
  create(@Req() req, @Body() createDto: any) {
    return this.tasksService.create(req.user.id, createDto);
  }

  @Put(':id/toggle')
  toggleCompletion(@Req() req, @Param('id') id: string) {
    return this.tasksService.toggleCompletion(id, req.user.id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(id, req.user.id);
  }
}
