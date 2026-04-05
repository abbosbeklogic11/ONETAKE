import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('my')
  async getMyNote(@Req() req) {
    return this.notesService.getNoteForUser(req.user.id);
  }

  @Put('my')
  async updateMyNote(@Req() req, @Body('content') content: string) {
    return this.notesService.updateNoteForUser(req.user.id, content || '');
  }
}
