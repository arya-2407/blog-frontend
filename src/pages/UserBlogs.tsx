import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BlogCard } from '../components/BlogCard';
import accountIcon from '../assets/account.webp';
import editIcon from '../assets/edit-icon.png';
import { API_ENDPOINTS } from '../config/api';

interface Blog {
  id: number;
  title: string;
  content: string;
  authorId?: number;
  authorName?: string;
}

export const UserBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        if (!userId) {
          setError('User ID is required');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const res = await fetch(API_ENDPOINTS.BLOGS_BY_USER(userId), {
          headers: {
            'Authorization': token
          }
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch user blogs');
        }

        setBlogs(data.blogs || []);
        
        // Set user name from the first blog's author name, or use a default
        if (data.blogs && data.blogs.length > 0) {
          setUserName(data.blogs[0].authorName);
        } else {
          setUserName('User');
        }
      } catch {
        setError('Failed to fetch user blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchUserBlogs();
  }, [userId, navigate]);

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
        <h1 className="text-2xl font-bold text-black">{userName}'s Blogs</h1>
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
          <div className="text-center text-gray-500">No blogs found for this user.</div>
        ) : (
          <div className="space-y-6">
            {blogs.map(blog => (
              <div key={blog.id} className="relative">
                <BlogCard {...blog} />
                <button
                  onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <img src={editIcon} alt="Edit" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 