
import React, { useState } from 'react';
import { TodoProvider } from '@/contexts/TodoContext';
import { Header } from '@/components/Header';
import { ListView } from '@/components/ListView';
import { KanbanView } from '@/components/KanbanView';
import { CalendarView } from '@/components/CalendarView';
import { TaskForm } from '@/components/TaskForm';
import { useTodo } from '@/contexts/TodoContext';
import { Task } from '@/types/todo';

const TodoApp = () => {
  const { viewMode } = useTodo();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'list':
        return <ListView onEditTask={handleEditTask} />;
      case 'kanban':
        return <KanbanView onEditTask={handleEditTask} />;
      case 'calendar':
        return <CalendarView onEditTask={handleEditTask} />;
      default:
        return <ListView onEditTask={handleEditTask} />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header onAddTask={handleAddTask} />
      <main className="max-w-7xl mx-auto">
        {renderCurrentView()}
      </main>
      
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        task={editingTask}
      />
    </div>
  );
};

const Index = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

export default Index;
