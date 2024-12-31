import React, { Component } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

class TodoList extends Component {
  static headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  };

  static async getInitialProps() {
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        headers: TodoList.headers
      });
      const initialTodos = await response.json();
      return { initialTodos };
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      return { initialTodos: [] };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      todos: props.initialTodos,
      newTodo: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({ newTodo: e.target.value });
  }

  addTodo = async (e) => {
    e.preventDefault();
    if (!this.state.newTodo.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: TodoList.headers,
        body: JSON.stringify({ text: this.state.newTodo }),
      });
      const data = await response.json();
      this.setState(prevState => ({
        todos: [...prevState.todos, data],
        newTodo: ''
      }));
      toast.success('Todo added successfully!');
    } catch (error) {
      toast.error('Failed to add todo');
    }
  }

  toggleTodo = async (id, completed) => {
    try {
      await fetch('/api/todos', {
        method: 'PUT',
        headers: TodoList.headers,
        body: JSON.stringify({ id, completed }),
      });
      this.setState(prevState => ({
        todos: prevState.todos.map(todo =>
          todo.id === id ? { ...todo, completed } : todo
        )
      }));
    } catch (error) {
      toast.error('Failed to update todo');
    }
  }

  deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
        headers: TodoList.headers,
      });
      this.setState(prevState => ({
        todos: prevState.todos.filter(todo => todo.id !== id)
      }));
      toast.success('Todo deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  }

  render() {
    const { todos, newTodo } = this.state;

    return (
      <>
        <Head>
          <title>Todo List</title>
          <meta name="description" content="Todo list page" />
        </Head>
        <main className="max-w-3xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Todo App
          </h1>
          
          <form onSubmit={this.addTodo} className="flex gap-4 mb-8">
            <input
              type="text"
              value={newTodo}
              onChange={this.handleInputChange}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Todo
            </button>
          </form>

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => this.toggleTodo(todo.id, e.target.checked)}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <Link 
                  href={ROUTES.TODO_DETAIL(todo.id)}
                  className="flex-1 px-2 py-1 hover:bg-gray-50 rounded-md"
                >
                  <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                    {todo.text}
                  </span>
                </Link>
                <button
                  onClick={() => this.deleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <Link 
            href="/posts" 
            className="text-blue-500 hover:text-blue-600 ml-4"
          >
            View Blog Posts
          </Link>
        </main>
      </>
    );
  }
}

export default TodoList; 