import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async getNoteForUser(userId: string): Promise<Note> {
    let note = await this.noteRepository.findOne({ where: { user: { id: userId } } });
    if (!note) {
      note = this.noteRepository.create({ user: { id: userId }, content: '' });
      await this.noteRepository.save(note);
    }
    return note;
  }

  async updateNoteForUser(userId: string, content: string): Promise<Note> {
    let note = await this.noteRepository.findOne({ where: { user: { id: userId } } });
    if (!note) {
      note = this.noteRepository.create({ user: { id: userId }, content });
    } else {
      note.content = content;
      note.lastAutosave = new Date();
    }
    return this.noteRepository.save(note);
  }
}
