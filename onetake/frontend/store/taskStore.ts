import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  type: string;
  score: number;
  isCompleted: boolean;
  dueDate: string;
}

interface TaskState {
  tasks: Task[];
  fetchTasks: () => void;
  addTask: (task: Partial<Task>) => void;
  toggleTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  fetchTasks: () => {
    // API call mock
  },
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, { ...task, id: Math.random().toString(), isCompleted: false } as Task] 
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
  })),
}));
