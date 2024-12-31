import React, { Component } from 'react';
import Head from 'next/head';
import Link from 'next/link';

class TodoService {
  static headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  };

  static async getTodos() {
    const response = await fetch('http://localhost:3000/api/todos', {
      headers: this.headers
    });
    const todos = await response.json();
    return todos;
  }

  static async getTodoById(id) {
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
      headers: this.headers
    });
    const todo = await response.json();
    return todo;
  }
}

class TodoDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: props.todo
    };
  }

  render() {
    const { todo } = this.state;

    if (!todo) {
      return <div className="text-center p-8 text-gray-500">Todo not found</div>;
    }

    return (
      <>
        <Head>
          <title>Todo Detail - {todo.text}</title>
          <meta name="description" content={`Detail page for todo: ${todo.text}`} />
        </Head>
        <main className="min-h-screen p-8 flex justify-center">
          <div className="max-w-2xl w-full">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Todo Detail
            </h1>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {todo.text}
              </h2>
              <p className="text-gray-600 mb-2">
                Status: <span className={todo.completed ? 'text-green-500' : 'text-yellow-500'}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </p>
              <p className="text-gray-600">
                Created at: {new Date(todo.id).toLocaleString()}
              </p>
            </div>
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to List
            </Link>
          </div>
        </main>
      </>
    );
  }
}

export async function getStaticPaths() {
  const todos = await TodoService.getTodos();
  
  return {
    paths: todos.map(todo => ({
      params: { id: todo.id.toString() }
    })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  try {
    const todo = await TodoService.getTodoById(params.id);
    
    if (!todo) {
      return { notFound: true };
    }

    return {
      props: { todo },
      revalidate: 10
    };
  } catch (error) {
    return { notFound: true };
  }
}

export default TodoDetail; 