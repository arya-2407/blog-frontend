import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BlogCard } from '../components/BlogCard';
import accountIcon from '../assets/account.webp';
import { API_ENDPOINTS } from '../config/api';

interface Blog {
  id: number;
  title: string;
  content: string;
  authorId?: number;
  authorName?: string;
}

export const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API_ENDPOINTS.BLOGS_BULK, {
          headers: {
            'Authorization': token ? `${token}` : ''
          }
        });
        const data = await res.json();
        setBlogs(data.blogs || []);
        console.log(data.blogs);
      } catch {
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/signin');
  };

  const handleMyBlogs = () => {
    // Get current user's ID and navigate to their blogs
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      navigate(`/blogs/user/${user.id}`);
    }
    setShowAccountDropdown(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center px-8 py-6 border-b">
        <h1 className="text-2xl font-bold text-black">Blogs</h1>
        <div className="flex items-center space-x-8 mr-8">
          <Link to="/blogs/publish" className="text-black hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
          <div className="relative">
            <button
              onMouseEnter={() => setShowAccountDropdown(true)}
              className="focus:outline-none bg-transparent border-none p-0"
            >
              <img src={accountIcon} alt="Account" className="w-8 h-8" />
            </button>
            
            {showAccountDropdown && (
              <div 
                className="absolute right-0 mt-2 w-32 bg-white border border-black rounded-lg z-50"
                onMouseEnter={() => setShowAccountDropdown(true)}
                onMouseLeave={() => setShowAccountDropdown(false)}
              >
                <div className="py-1">
                  <button
                    onClick={handleMyBlogs}
                    className="block w-full text-center px-4 py-2 text-sm text-black bg-transparent border-none"
                  >
                    My Blogs
                  </button>
                  <div className="border-t border-black mx-2"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 text-sm text-black bg-transparent border-none"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto py-8 px-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading blogs...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500">No blogs found.</div>
        ) : (
          <div className="space-y-6">
            {blogs.map(blog => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 