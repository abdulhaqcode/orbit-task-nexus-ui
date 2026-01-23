import { Response } from 'express';
import { query } from '../database/db';
import { AuthRequest, Task, Subtask } from '../types';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await query(
      `SELECT t.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'title', s.title,
              'completed', s.completed,
              'created_at', s.created_at,
              'updated_at', s.updated_at
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) as subtasks
       FROM tasks t
       LEFT JOIN subtasks s ON t.id = s.task_id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );

    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await query(
      `SELECT t.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'title', s.title,
              'completed', s.completed,
              'created_at', s.created_at,
              'updated_at', s.updated_at
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) as subtasks
       FROM tasks t
       LEFT JOIN subtasks s ON t.id = s.task_id
       WHERE t.id = $1 AND t.user_id = $2
       GROUP BY t.id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      priority,
      category_name,
      tags,
      due_date,
      due_time,
      status,
      recurrence,
      custom_recurrence,
      reminder_time,
      subtasks,
    } = req.body;

    const taskResult = await query(
      `INSERT INTO tasks (
        user_id, title, description, priority, category_name, tags,
        due_date, due_time, status, recurrence, custom_recurrence, reminder_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        req.user.id,
        title,
        description || null,
        priority,
        category_name || null,
        tags || [],
        due_date || null,
        due_time || null,
        status || 'todo',
        recurrence || 'none',
        custom_recurrence || null,
        reminder_time || null,
      ]
    );

    const task = taskResult.rows[0];

    if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
      const subtaskPromises = subtasks.map((subtask: any) =>
        query(
          'INSERT INTO subtasks (task_id, title, completed) VALUES ($1, $2, $3) RETURNING *',
          [task.id, subtask.title, subtask.completed || false]
        )
      );

      const subtaskResults = await Promise.all(subtaskPromises);
      task.subtasks = subtaskResults.map((r) => r.rows[0]);
    } else {
      task.subtasks = [];
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const {
      title,
      description,
      completed,
      priority,
      category_name,
      tags,
      due_date,
      due_time,
      status,
      recurrence,
      custom_recurrence,
      reminder_time,
    } = req.body;

    const checkResult = await query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [
      id,
      req.user.id,
    ]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const result = await query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        completed = COALESCE($3, completed),
        priority = COALESCE($4, priority),
        category_name = COALESCE($5, category_name),
        tags = COALESCE($6, tags),
        due_date = COALESCE($7, due_date),
        due_time = COALESCE($8, due_time),
        status = COALESCE($9, status),
        recurrence = COALESCE($10, recurrence),
        custom_recurrence = COALESCE($11, custom_recurrence),
        reminder_time = COALESCE($12, reminder_time)
       WHERE id = $13 AND user_id = $14
       RETURNING *`,
      [
        title,
        description,
        completed,
        priority,
        category_name,
        tags,
        due_date,
        due_time,
        status,
        recurrence,
        custom_recurrence,
        reminder_time,
        id,
        req.user.id,
      ]
    );

    const subtasksResult = await query('SELECT * FROM subtasks WHERE task_id = $1', [id]);

    const task = { ...result.rows[0], subtasks: subtasksResult.rows };

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [
      id,
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addSubtask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { taskId } = req.params;
    const { title, completed } = req.body;

    const taskCheck = await query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [
      taskId,
      req.user.id,
    ]);

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const result = await query(
      'INSERT INTO subtasks (task_id, title, completed) VALUES ($1, $2, $3) RETURNING *',
      [taskId, title, completed || false]
    );

    res.status(201).json({ message: 'Subtask added successfully', subtask: result.rows[0] });
  } catch (error) {
    console.error('Add subtask error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSubtask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { taskId, subtaskId } = req.params;
    const { title, completed } = req.body;

    const taskCheck = await query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [
      taskId,
      req.user.id,
    ]);

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const result = await query(
      `UPDATE subtasks SET
        title = COALESCE($1, title),
        completed = COALESCE($2, completed)
       WHERE id = $3 AND task_id = $4
       RETURNING *`,
      [title, completed, subtaskId, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    res.json({ message: 'Subtask updated successfully', subtask: result.rows[0] });
  } catch (error) {
    console.error('Update subtask error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSubtask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { taskId, subtaskId } = req.params;

    const taskCheck = await query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [
      taskId,
      req.user.id,
    ]);

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const result = await query(
      'DELETE FROM subtasks WHERE id = $1 AND task_id = $2 RETURNING id',
      [subtaskId, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    res.json({ message: 'Subtask deleted successfully' });
  } catch (error) {
    console.error('Delete subtask error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
