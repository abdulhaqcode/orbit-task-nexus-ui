
import React from 'react';
import { TaskItem } from './TaskItem';
import { Task } from '@/types/todo';
import { useTodo } from '@/contexts/TodoContext';

interface ListViewProps {
  onEditTask: (task: Task) => void;
}

export const ListView: React.FC<ListViewProps> = ({ onEditTask }) => {
  const { filteredTasks } = useTodo();

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by completed status first (incomplete tasks first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Start by creating your first task or adjust your filters to see existing tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {sortedTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
};
