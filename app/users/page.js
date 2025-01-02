'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Users List</h1>
          <Link 
            href="/todos"
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Todos
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {users.map(user => (
              <div 
                key={user.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {user.name}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-medium">Company:</span> {user.company.name}
                  </p>
                  <p>
                    <span className="font-medium">Website:</span> {user.website}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {user.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 