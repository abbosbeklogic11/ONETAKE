import { create } from 'zustand';

interface NoteState {
  noteContent: string;
  autosaveStatus: 'saved' | 'saving' | 'error';
  loadNote: () => void;
  saveNote: (content: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  noteContent: '',
  autosaveStatus: 'saved',
  loadNote: () => {
    // API mock
  },
  saveNote: (content) => {
    set({ noteContent: content, autosaveStatus: 'saving' });
    setTimeout(() => {
      set({ autosaveStatus: 'saved' });
    }, 1000);
  },
}));
