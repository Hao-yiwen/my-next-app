import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Posts({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 当页码改变时加载更多数据
    if (page > 1) {
      setLoading(true);
      fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
        .then(res => res.json())
        .then(newPosts => {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch more posts:', error);
          setLoading(false);
        });
    }
  }, [page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Head>
        <title>Blog Posts</title>
        <meta name="description" content="A list of blog posts" />
      </Head>

      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Blog Posts</h1>
          <Link 
            href="/"
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Todo List
          </Link>
        </div>

        <div className="grid gap-6">
          {posts.map(post => (
            <article 
              key={post.id} 
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {post.title}
              </h2>
              <p className="text-gray-600">
                {post.body}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Post ID: {post.id}
              </div>
            </article>
          ))}
        </div>

        {loading ? (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <button
            onClick={loadMore}
            className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-auto block"
          >
            Load More
          </button>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    // 在服务器端获取初始数据
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const initialPosts = await response.json();

    return {
      props: {
        initialPosts,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialPosts: [],
      },
    };
  }
} 