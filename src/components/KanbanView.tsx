
import React from 'react';
import { TaskItem } from './TaskItem';
import { Task, TaskStatus } from '@/types/todo';
import { useTodo } from '@/contexts/TodoContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KanbanViewProps {
  onEditTask: (task: Task) => void;
}

const statusConfig = {
  todo: {
    title: 'To Do',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    bgColor: 'bg-gray-50 dark:bg-gray-900'
  },
  'in-progress': {
    title: 'In Progress',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  done: {
    title: 'Done',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    bgColor: 'bg-green-50 dark:bg-green-950'
  }
};

export const KanbanView: React.FC<KanbanViewProps> = ({ onEditTask }) => {
  const { filteredTasks, updateTask } = useTodo();

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    done: filteredTasks.filter(task => task.status === 'done')
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const task = filteredTasks.find(t => t.id === taskId);
    
    if (task && task.status !== newStatus) {
      updateTask(taskId, { 
        status: newStatus,
        completed: newStatus === 'done'
      });
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
        {Object.entries(statusConfig).map(([status, config]) => (
          <Card 
            key={status}
            className={`${config.bgColor} border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status as TaskStatus)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {config.title}
                </CardTitle>
                <Badge className={config.color}>
                  {tasksByStatus[status as TaskStatus].length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus[status as TaskStatus].map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="cursor-move transition-transform hover:scale-105"
                >
                  <TaskItem
                    task={task}
                    onEdit={onEditTask}
                  />
                </div>
              ))}
              
              {tasksByStatus[status as TaskStatus].length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-sm">Drop tasks here</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
