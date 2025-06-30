import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export const EditBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        if (!id) {
          setError('Blog ID is required');
          return;
        }

        const res = await fetch(API_ENDPOINTS.BLOG_BY_ID(id), {
          headers: {
            'Authorization': token
          }
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch blog');
        }

        setTitle(data.blog.title || '');
        setContent(data.blog.content || '');
      } catch {
        setError('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      if (!id) {
        setError('Blog ID is required');
        return;
      }

      const res = await fetch(API_ENDPOINTS.UPDATE_BLOG(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update blog');
      }

      // Navigate back to the user's blogs
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        navigate(`/blogs/user/${user.id}`);
      } else {
        navigate('/blogs');
      }
    } catch {
      setError('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Edit Blog</h1>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || saving}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              title.trim() && content.trim() && !saving
                ? 'bg-black hover:bg-gray-800'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving changes...' : 'Save changes'}
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-black bg-transparent border-none outline-none placeholder-gray-400"
            />
          </div>
          
          <div>
            <textarea
              placeholder="Tell your story..."
              value={content}
              onChange={handleContentChange}
              className="w-full min-h-[500px] text-lg text-black bg-transparent border-none outline-none resize-none placeholder-gray-400 leading-relaxed"
              style={{ 
                minHeight: '500px',
                height: 'auto',
                overflow: 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.max(500, target.scrollHeight) + 'px';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 