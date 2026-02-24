
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
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
};

const statusColors = {
  todo: 'bg-secondary text-secondary-foreground',
  'in-progress': 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
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
        "group transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 animate-fade-in border-border/50",
        isDragging && "opacity-50 rotate-2 shadow-glow-lg",
        task.completed && "opacity-60",
        isOverdue && "border-l-4 border-l-destructive"
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
                "font-medium text-foreground truncate",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
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

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center space-x-1",
                    isOverdue && "text-destructive font-medium"
                  )}>
                    <Calendar className="h-4 w-4" />
                    <span>{formatDueDate(new Date(task.dueDate), task.dueTime)}</span>
                  </div>
                )}

                {task.subtasks.length > 0 && (
                  <div 
                    className="flex items-center space-x-1 cursor-pointer hover:text-foreground"
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
              <div className="mt-3 pl-4 border-l-2 border-border">
                {task.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center space-x-2 py-1">
                    <Circle className="h-3 w-3 text-muted-foreground" />
                    <span className={cn(
                      "text-sm",
                      subtask.completed && "line-through text-muted-foreground"
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
