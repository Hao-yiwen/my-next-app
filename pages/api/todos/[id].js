import { cors } from '@/lib/cors';
import { todos } from '../todos';

export default async function handler(req, res) {
  // 处理 CORS
  if (cors(req, res)) return;

  const { id } = req.query;
  const todoId = parseInt(id);
  
  const todo = todos ? todos.find(t => t.id === todoId) : null;
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json(todo);
} 