
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Task, Category, Filter, Priority, TaskStatus, RecurrenceType } from '@/types/todo';
import { taskAPI, categoryAPI } from '@/lib/api';

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
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
    const fetchTasks = async () => {
      if (user) {
        try {
          const { tasks: fetchedTasks } = await taskAPI.getTasks();
          const transformedTasks = fetchedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.created_at),
            updatedAt: new Date(task.updated_at),
            dueDate: task.due_date ? new Date(task.due_date) : undefined,
            category: task.category_name || '',
          }));
          setTasks(transformedTasks);
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      }
    };
    fetchTasks();
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (user) {
        try {
          const { categories: fetchedCategories } = await categoryAPI.getCategories();
          const transformedCategories = fetchedCategories.map((cat: any) => ({
            ...cat,
            createdAt: new Date(cat.created_at),
            updatedAt: new Date(cat.updated_at),
          }));
          setCategories(transformedCategories);
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          setCategories(defaultCategories);
        }
      }
    };
    fetchCategories();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { task: newTask } = await taskAPI.createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        category_name: taskData.category,
        tags: taskData.tags,
        due_date: taskData.dueDate?.toISOString(),
        due_time: taskData.dueTime,
        status: taskData.status,
        recurrence: taskData.recurrence,
        custom_recurrence: taskData.customRecurrence,
        reminder_time: taskData.reminderTime,
        completed: taskData.completed,
      });
      
      const transformedTask: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        completed: newTask.completed,
        priority: newTask.priority,
        category: newTask.category_name || '',
        tags: newTask.tags || [],
        dueDate: newTask.due_date ? new Date(newTask.due_date) : undefined,
        dueTime: newTask.due_time,
        status: newTask.status,
        subtasks: (newTask.subtasks || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          completed: s.completed,
          createdAt: new Date(s.created_at),
        })),
        recurrence: newTask.recurrence,
        customRecurrence: newTask.custom_recurrence,
        createdAt: new Date(newTask.created_at),
        updatedAt: new Date(newTask.updated_at),
        reminderTime: newTask.reminder_time,
      };
      setTasks(prev => [...prev, transformedTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { task: updatedTask } = await taskAPI.updateTask(id, {
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        category_name: updates.category,
        tags: updates.tags,
        due_date: updates.dueDate?.toISOString(),
        due_time: updates.dueTime,
        status: updates.status,
        recurrence: updates.recurrence,
        custom_recurrence: updates.customRecurrence,
        reminder_time: updates.reminderTime,
        completed: updates.completed,
      });
      
      const transformedTask: Task = {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed,
        priority: updatedTask.priority,
        category: updatedTask.category_name || '',
        tags: updatedTask.tags || [],
        dueDate: updatedTask.due_date ? new Date(updatedTask.due_date) : undefined,
        dueTime: updatedTask.due_time,
        status: updatedTask.status,
        subtasks: (updatedTask.subtasks || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          completed: s.completed,
          createdAt: new Date(s.created_at),
        })),
        recurrence: updatedTask.recurrence,
        customRecurrence: updatedTask.custom_recurrence,
        createdAt: new Date(updatedTask.created_at),
        updatedAt: new Date(updatedTask.updated_at),
        reminderTime: updatedTask.reminder_time,
      };
      
      setTasks(prev => prev.map(task => task.id === id ? transformedTask : task));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
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

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const { category: newCategory } = await categoryAPI.createCategory({
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
      });
      
      const transformedCategory = {
        ...newCategory,
        createdAt: new Date(newCategory.created_at),
        updatedAt: new Date(newCategory.updated_at),
      };
      setCategories(prev => [...prev, transformedCategory]);
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
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
