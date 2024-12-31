import { todos } from '../todos';

export default function handler(req, res) {
  const { id } = req.query;
  const todoId = parseInt(id);
  console.log(todoId, '====');
  
  const todo = todos ? todos.find(t => t.id === todoId) : null;
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  return res.status(200).json(todo);
} 