import React from 'react';
import { PostFeedItem } from '../types';

interface InspectPostModalProps {
  post: PostFeedItem | null;
  onClose: () => void;
}

export const InspectPostModal: React.FC<InspectPostModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/60 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-outline-variant/40">
          <div className="flex items-center gap-3">
            <img
              alt={post.author}
              className="w-12 h-12 rounded-full object-cover ring-1 ring-outline-variant/60"
              src={post.avatar}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-on-surface">{post.author}</h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-semibold">
                  {post.category}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{post.role}</p>
              <p className="text-[11px] text-outline">{post.timestamp} on LinkedIn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Post Text */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
          {post.fullText || post.content}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">thumb_up</span>
              {post.likes} reactions
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary-container">comment</span>
              {post.comments} comments
            </span>
          </div>
          <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span> Verified Event Pulse Attribution
          </span>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2 border-t border-outline-variant/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
