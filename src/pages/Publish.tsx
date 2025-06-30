import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export const Publish = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [authorName, setAuthorName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Get author name from localStorage on component mount
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setAuthorName(user.name || 'Anonymous');
      } else {
        setAuthorName('Anonymous');
      }
    } catch (err) {
      console.error('Failed to get user info:', err);
      setAuthorName('Anonymous');
    }
  }, []);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Show 'Saving changes' while typing, revert after 500ms of inactivity
  useEffect(() => {
    if (title || content) {
      setIsSaving(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setIsSaving(false), 500);
    } else {
      setIsSaving(false);
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [title, content]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please add a title and content before publishing');
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CREATE_BLOG, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `${token}` : ''
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to publish blog');
      }

      const data = await response.json();
      console.log('Blog published successfully:', data);
      navigate('/blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish blog');
    } finally {
      setIsPublishing(false);
    }
  };

  const canPublish = title.trim() && content.trim() && !isSaving;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-8 py-16">
      {/* Author name at top left */}
      <div className="w-full max-w-4xl mb-4">
        <div className="text-sm text-gray-500 font-bold">{authorName}</div>
      </div>

      {/* Title and Publish button at the same level */}
      <div className="w-full flex justify-between items-center mb-8 max-w-4xl">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="text-3xl font-semibold text-black border-0 focus:outline-none bg-white flex-1 mr-12 text-center py-2"
        />
        <button
          onClick={handlePublish}
          disabled={!canPublish || isPublishing}
          className={
            !canPublish || isPublishing
              ? 'bg-gray-200 text-gray-500 px-6 py-2 rounded-md text-base font-medium shadow-none cursor-not-allowed transition-colors'
              : 'bg-black text-white px-6 py-2 rounded-md text-base font-medium shadow hover:bg-gray-800 transition-colors'
          }
        >
          {isPublishing ? 'Publishing...' : isSaving ? 'Saving changes' : 'Publish'}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="w-full max-w-4xl mb-4">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      {/* Content textarea below title, increased width */}
      <div className="w-full flex justify-center mb-16">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind..."
          className="w-full max-w-4xl p-4 border-0 text-black bg-white focus:outline-none focus:border-0 resize-none text-base shadow-none rounded-none min-h-[3rem]"
          rows={1}
        />
      </div>
    </div>
  );
}; 