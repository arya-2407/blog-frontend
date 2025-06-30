import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.SIGNIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // backend expects email in username field
          password: formData.password
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Signin failed');
      }
      const jwt = await response.text();
      localStorage.setItem('token', jwt);
      
      // Fetch and store user info for easy access
      try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        const userResponse = await fetch(API_ENDPOINTS.USER_INFO(payload.id), {
          headers: {
            'Authorization': jwt
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userInfo = {
            id: payload.id,
            name: userData.name || 'Anonymous'
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
      
      console.log('Login successful!');
      navigate('/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-semibold text-black mb-2 text-center">Sign in to your account</h1>
        <p className="text-gray-500 mb-8 text-center">
          Don't have an account? <Link to="/signup" className="text-gray-500 underline hover:text-gray-700">Sign up</Link>
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
              placeholder="me@example.com"
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
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};