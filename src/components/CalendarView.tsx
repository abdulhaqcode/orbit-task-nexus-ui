
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/todo';
import { useTodo } from '@/contexts/TodoContext';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onEditTask }) => {
  const { filteredTasks } = useTodo();
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());

  const calendarDays = [];
  const currentCalendarDate = new Date(startOfCalendar);

  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentCalendarDate));
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
  }

  const getTasksForDate = (date: Date) => {
    return filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500',
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-600 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const tasksForDate = getTasksForDate(date);

          return (
            <Card
              key={index}
              className={cn(
                "min-h-[120px] transition-all duration-200 hover:shadow-md",
                !isCurrentMonth && "opacity-50",
                isToday && "ring-2 ring-blue-500"
              )}
            >
              <CardContent className="p-2">
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isToday && "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  )}>
                    {date.getDate()}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {tasksForDate.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1 transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <div 
                          className={cn(
                            "w-2 h-2 rounded-full",
                            priorityColors[task.priority]
                          )}
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                          {task.title}
                        </span>
                      </div>
                      {task.dueTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  ))}
                  
                  {tasksForDate.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                      +{tasksForDate.length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
