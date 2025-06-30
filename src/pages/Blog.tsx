import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface Blog {
  id: number;
  title: string;
  content: string;
  authorName?: string;
}

export const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) {
          setError('Blog ID is required');
          return;
        }
        
        const token = localStorage.getItem('token');
        const res = await fetch(API_ENDPOINTS.BLOG_BY_ID(id), {
          headers: {
            'Authorization': token ? `${token}` : ''
          }
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.msg || 'Failed to fetch blog');
        }

        // The backend now returns { blog: blogWithAuthorName }
        const blogData = data.blog;
        setBlog({
          id: blogData.id,
          title: blogData.title,
          content: blogData.content,
          authorName: blogData.authorName,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!blog) return <div className="text-center py-12 text-gray-500">Blog not found.</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-black mb-4">{blog.title}</h1>
        <div className="text-gray-500 mb-8">by {blog.authorName || 'Anonymous'}</div>
        <div className="text-lg text-gray-800 whitespace-pre-line">{blog.content}</div>
      </div>
    </div>
  );
};