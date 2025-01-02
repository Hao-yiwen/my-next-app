import { cors } from '@/lib/cors';

let todos = [];

export default async function handler(req, res) {
  // 处理 CORS
  if (cors(req, res)) return;

  switch (req.method) {
    case 'GET':
      return res.status(200).json(todos);
    
    case 'POST':
      const newTodo = {
        id: Date.now(),
        text: req.body.text,
        completed: false
      };
      todos.push(newTodo);
      return res.status(201).json(newTodo);
    
    case 'PUT':
      const { id, completed } = req.body;
      todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      );
      return res.status(200).json({ success: true });
    
    case 'DELETE':
      const todoId = parseInt(req.query.id);
      todos = todos.filter(todo => todo.id !== todoId);
      return res.status(200).json({ success: true });
    
    default:
      return res.status(405).end();
  }
} 