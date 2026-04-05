import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll(@Req() req) {
    return this.goalsService.findAllForUser(req.user.id);
  }

  @Post()
  create(@Req() req, @Body() createDto: any) {
    return this.goalsService.create(req.user.id, createDto);
  }

  @Put(':id/progress')
  updateProgress(@Req() req, @Param('id') id: string, @Body('progress') progress: number) {
    return this.goalsService.updateProgress(id, req.user.id, progress);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.goalsService.remove(id, req.user.id);
  }

  @Post(':id/five-day-cycles')
  createFiveDayCycle(@Req() req, @Param('id') id: string, @Body() createDto: any) {
    return this.goalsService.createFiveDayCycle(id, req.user.id, createDto);
  }
}
