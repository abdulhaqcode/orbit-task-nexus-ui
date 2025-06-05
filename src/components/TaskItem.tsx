
import React, { useState } from 'react';
import { Calendar, Clock, Tag, MoreHorizontal, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task, Priority } from '@/types/todo';
import { useTodo } from '@/contexts/TodoContext';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, isDragging = false }) => {
  const { toggleTask, deleteTask, categories } = useTodo();
  const [showSubtasks, setShowSubtasks] = useState(false);

  const category = categories.find(c => c.name === task.category);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;

  const formatDueDate = (date: Date, time?: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today${time ? ` at ${time}` : ''}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow${time ? ` at ${time}` : ''}`;
    } else {
      return `${date.toLocaleDateString()}${time ? ` at ${time}` : ''}`;
    }
  };

  return (
    <Card 
      className={cn(
        "group transition-all duration-200 hover:shadow-md animate-fade-in",
        isDragging && "opacity-50 rotate-2",
        task.completed && "opacity-75",
        isOverdue && "border-l-4 border-l-red-500"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="w-5 h-5"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn(
                "font-medium text-gray-900 dark:text-white truncate",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              
              <Badge className={statusColors[task.status]}>
                {task.status.replace('-', ' ')}
              </Badge>

              {category && (
                <Badge variant="outline" style={{ borderColor: category.color }}>
                  {category.icon} {category.name}
                </Badge>
              )}

              {task.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center space-x-1",
                    isOverdue && "text-red-600 dark:text-red-400 font-medium"
                  )}>
                    <Calendar className="h-4 w-4" />
                    <span>{formatDueDate(new Date(task.dueDate), task.dueTime)}</span>
                  </div>
                )}

                {task.subtasks.length > 0 && (
                  <div 
                    className="flex items-center space-x-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => setShowSubtasks(!showSubtasks)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{completedSubtasks}/{task.subtasks.length}</span>
                  </div>
                )}

                {task.recurrence !== 'none' && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{task.recurrence}</span>
                  </div>
                )}
              </div>
            </div>

            {showSubtasks && task.subtasks.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center space-x-2 py-1">
                    <Circle className="h-3 w-3 text-gray-400" />
                    <span className={cn(
                      "text-sm",
                      subtask.completed && "line-through text-gray-500"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
