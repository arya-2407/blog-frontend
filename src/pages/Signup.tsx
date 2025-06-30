import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // backend expects email in username field
          password: formData.password,
          name: formData.name || undefined // only send if not empty
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Signup failed');
      }

      const jwt = await response.text();
      localStorage.setItem('token', jwt);
      
      // Store user info for easy access
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const userInfo = {
        id: payload.id,
        name: formData.name || 'Anonymous'
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      navigate('/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left side - Sign up form - Pure White */}
      <div className="w-1/2 bg-white flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold text-black mb-2">Create an account</h1>
          <p className="text-gray-500 mb-8">
            Already have an account? <Link to="/signin" className="text-gray-500 underline hover:text-gray-700">Login</Link>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0"
                placeholder="m@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                Name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="off"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Quote - Light Gray Background */}
      <div className="w-1/2 bg-slate-100 flex items-center justify-center px-8">
        <div className="max-w-md">
          <blockquote className="text-xl font-bold text-black mb-6 leading-relaxed">
            "The customer service I received was exceptional. The support team went above and beyond to address my concerns."
          </blockquote>
          <div>
            <p className="font-semibold text-black">Jules Winnfield</p>
            <p className="text-gray-500 text-sm">CEO, Acme Inc</p>
          </div>
        </div>
      </div>
    </div>
  );
};