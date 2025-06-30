import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

interface BlogCardProps {
  id: number;
  title: string;
  content: string;
  authorName?: string;
}

export const BlogCard: FC<BlogCardProps> = ({ id, title, content, authorName }) => {
  const navigate = useNavigate();
  const preview = content.length > 120 ? content.slice(0, 120) + '...' : content;

  return (
    <div
      className="border rounded-lg p-6 bg-gray-50 cursor-pointer hover:shadow-md transition"
      onClick={() => navigate(`/blog/${id}`)}
    >
      <h2 className="text-xl font-semibold text-black mb-2">{title}</h2>
      <p className="text-gray-700 mb-2">{preview}</p>
      <div className="text-sm text-gray-500">by {authorName || 'Anonymous'}</div>
    </div>
  );
}; 