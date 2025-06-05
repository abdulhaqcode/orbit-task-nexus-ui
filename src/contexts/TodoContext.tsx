
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task, Category, Filter, Priority, TaskStatus, RecurrenceType } from '@/types/todo';

interface TodoContextType {
  tasks: Task[];
  categories: Category[];
  filter: Filter;
  viewMode: 'list' | 'kanban' | 'calendar';
  isDarkMode: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  setFilter: (filter: Partial<Filter>) => void;
  setViewMode: (mode: 'list' | 'kanban' | 'calendar') => void;
  toggleDarkMode: () => void;
  filteredTasks: Task[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: '1', name: 'Work', color: '#3b82f6', icon: '💼' },
  { id: '2', name: 'Personal', color: '#10b981', icon: '🏠' },
  { id: '3', name: 'Health', color: '#f59e0b', icon: '💪' },
  { id: '4', name: 'Learning', color: '#8b5cf6', icon: '📚' },
];

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and submit the Q4 project proposal',
    completed: false,
    priority: 'high',
    category: 'Work',
    tags: ['urgent', 'deadline'],
    dueDate: new Date(Date.now() + 86400000 * 2),
    dueTime: '14:00',
    status: 'in-progress',
    subtasks: [
      { id: 's1', title: 'Research requirements', completed: true, createdAt: new Date() },
      { id: 's2', title: 'Draft outline', completed: false, createdAt: new Date() },
    ],
    recurrence: 'none',
    createdAt: new Date(),
    updatedAt: new Date(),
    reminderTime: 30,
  },
  {
    id: '2',
    title: 'Morning workout',
    description: '30 minutes cardio and strength training',
    completed: false,
    priority: 'medium',
    category: 'Health',
    tags: ['routine', 'fitness'],
    dueDate: new Date(),
    dueTime: '07:00',
    status: 'todo',
    subtasks: [],
    recurrence: 'daily',
    createdAt: new Date(),
    updatedAt: new Date(),
    reminderTime: 15,
  },
];

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [filter, setFilterState] = useState<Filter>({
    search: '',
    priority: 'all',
    category: 'all',
    status: 'all',
    tags: [],
  });

  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar'>('list');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            status: !task.completed ? 'done' : 'todo',
            updatedAt: new Date() 
          }
        : task
    ));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const setFilter = (newFilter: Partial<Filter>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false;
    }
    if (filter.category !== 'all' && task.category !== filter.category) {
      return false;
    }
    if (filter.status !== 'all' && task.status !== filter.status) {
      return false;
    }
    if (filter.tags.length > 0 && !filter.tags.some(tag => task.tags.includes(tag))) {
      return false;
    }
    return true;
  });

  return (
    <TodoContext.Provider value={{
      tasks,
      categories,
      filter,
      viewMode,
      isDarkMode,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addCategory,
      setFilter,
      setViewMode,
      toggleDarkMode,
      filteredTasks,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
