import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { taskValidation, validateRequest } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', taskValidation, validateRequest, createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.post('/:taskId/subtasks', addSubtask);
router.put('/:taskId/subtasks/:subtaskId', updateSubtask);
router.delete('/:taskId/subtasks/:subtaskId', deleteSubtask);

export default router;
