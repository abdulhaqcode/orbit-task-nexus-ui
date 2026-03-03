import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider: string;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category_id?: string;
  category_name?: string;
  tags: string[];
  due_date?: string;
  due_time?: string;
  status: 'todo' | 'in-progress' | 'done';
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  custom_recurrence?: number;
  reminder_time?: number;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: { full_name?: string; avatar_url?: string; username?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { current_password: string; new_password: string }) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  },

  deleteAccount: async (data: { password: string }) => {
    const response = await api.delete('/auth/me', { data });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};

export const taskAPI = {
  getTasks: async (): Promise<{ tasks: Task[] }> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getTaskById: async (id: string): Promise<{ task: Task }> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: Partial<Task>): Promise<{ task: Task }> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<{ task: Task }> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  addSubtask: async (taskId: string, data: { title: string; completed?: boolean }): Promise<{ subtask: Subtask }> => {
    const response = await api.post(`/tasks/${taskId}/subtasks`, data);
    return response.data;
  },

  updateSubtask: async (taskId: string, subtaskId: string, data: { title?: string; completed?: boolean }): Promise<{ subtask: Subtask }> => {
    const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
    return response.data;
  },

  deleteSubtask: async (taskId: string, subtaskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  },
};

export const categoryAPI = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (data: { name: string; color: string; icon?: string }): Promise<{ category: Category }> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name?: string; color?: string; icon?: string }): Promise<{ category: Category }> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export default api;
