
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ViewMode = 'list' | 'kanban' | 'calendar';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  tags: string[];
  dueDate?: Date;
  dueTime?: string;
  status: TaskStatus;
  subtasks: Subtask[];
  recurrence: RecurrenceType;
  customRecurrence?: number;
  createdAt: Date;
  updatedAt: Date;
  reminderTime?: number; // minutes before due date
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Filter {
  search: string;
  priority: Priority | 'all';
  category: string | 'all';
  status: TaskStatus | 'all';
  tags: string[];
  dueDateRange?: {
    start: Date;
    end: Date;
  };
}
