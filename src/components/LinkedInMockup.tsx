import React, { useState } from 'react';
import { AuthorProfile } from '../types';

interface LinkedInMockupProps {
  postText: string;
  onPostTextChange: (newText: string) => void;
  attachedImageUrl: string;
  eventName: string;
  orgName: string;
  author: AuthorProfile;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const LinkedInMockup: React.FC<LinkedInMockupProps> = ({
  postText,
  onPostTextChange,
  attachedImageUrl,
  eventName,
  orgName,
  author,
  onRegenerate,
  isGenerating,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [isEditingInPlace, setIsEditingInPlace] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(48);
  const [showToast, setShowToast] = useState(false);

  const handleToggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postText).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    });
  };

  const handleOpenLinkedIn = () => {
    // Open LinkedIn feed or share intent
    const encoded = encodeURIComponent(postText);
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Render text with highlight for mentions and hashtags
  const renderFormattedContent = () => {
    if (isEditingInPlace) {
      return (
        <textarea
          value={postText}
          onChange={(e) => onPostTextChange(e.target.value)}
          rows={12}
          className="w-full p-2 text-xs sm:text-sm font-sans text-on-surface bg-surface-container-low border border-primary-container rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-container leading-relaxed"
        />
      );
    }

    const paragraphs = postText.split('\n\n');
    return (
      <div className="space-y-3">
        {paragraphs.map((para, i) => {
          // If paragraph has hashtags
          if (para.startsWith('#') || para.includes(' #')) {
            const tags = para.split(/\s+/).filter(Boolean);
            return (
              <p key={i} className="text-primary-container font-medium text-xs sm:text-sm flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="hover:underline cursor-pointer transition-colors hover:text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            );
          }

          // Check if paragraph is numbered bullet points
          if (para.includes('1️⃣') || para.includes('2️⃣') || para.includes('3️⃣')) {
            const lines = para.split('\n');
            return (
              <ul key={i} className="space-y-1.5 pl-1 text-xs sm:text-sm text-on-surface leading-relaxed">
                {lines.map((line, lIdx) => {
                  // Replace markdown bold **text**
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  return (
                    <li key={lIdx} className="flex items-start gap-2">
                      {parts.map((p, pIdx) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return <strong key={pIdx} className="text-on-surface font-semibold">{p.slice(2, -2)}</strong>;
                        }
                        return <span key={pIdx}>{p}</span>;
                      })}
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Normal paragraph with @mention highlights
          const parts = para.split(/(@\w+(?:\s+\w+)?)/g);
          return (
            <p key={i} className="text-xs sm:text-sm text-on-surface leading-relaxed">
              {parts.map((part, pIdx) => {
                if (part.startsWith('@')) {
                  return (
                    <span key={pIdx} className="text-primary-container font-medium hover:underline cursor-pointer">
                      {part}
                    </span>
                  );
                }
                // Handle bolding in standard paragraphs
                const subParts = part.split(/(\*\*.*?\*\*)/g);
                return (
                  <React.Fragment key={pIdx}>
                    {subParts.map((sp, sIdx) => {
                      if (sp.startsWith('**') && sp.endsWith('**')) {
                        return <strong key={sIdx} className="text-on-surface font-semibold">{sp.slice(2, -2)}</strong>;
                      }
                      return sp;
                    })}
                  </React.Fragment>
                );
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 sticky top-20">
      {/* Header / Viewport Bar */}
      <div className="flex items-center justify-between bg-surface-container-lowest p-3 px-4 rounded-xl shadow-xs border border-outline-variant/50">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-on-surface">LinkedIn Live Preview</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold">
            Live Mockup
          </span>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              deviceView === 'desktop'
                ? 'bg-surface-container-lowest text-on-surface shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              deviceView === 'mobile'
                ? 'bg-surface-container-lowest text-on-surface shadow-2xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Realistic LinkedIn Post Card Mockup */}
      <div
        className="transition-all duration-300 w-full mx-auto"
        style={{ maxWidth: deviceView === 'desktop' ? '560px' : '375px' }}
      >
        <article className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 overflow-hidden">
          {/* Author Header */}
          <div className="p-4 pb-2 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <img
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover shadow-2xs ring-1 ring-outline-variant/40"
                src={author.avatar}
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold text-on-surface">{author.name}</span>
                  <span className="text-xs text-on-surface-variant font-medium">• 1st</span>
                </div>
                <p className="text-[12px] text-on-surface-variant line-clamp-1 leading-snug">
                  {author.role}
                </p>
                <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span>Just now</span>
                  <span>• Edited •</span>
                  <span className="material-symbols-outlined text-[13px]">public</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container cursor-pointer transition-colors"
                type="button"
                title="Post Options"
              >
                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
              </button>
            </div>
          </div>

          {/* Post Body Content */}
          <div className="px-4 py-2">
            {renderFormattedContent()}
          </div>

          {/* Embedded Media Preview */}
          {attachedImageUrl && (
            <div className="w-full bg-surface-container-high relative overflow-hidden mt-2">
              <img
                alt="Conference highlight"
                className="w-full max-h-[380px] object-cover transition-transform duration-300"
                src={attachedImageUrl}
              />
              <div className="absolute bottom-2 right-2 bg-on-surface/80 text-on-primary text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm shadow-2xs">
                TechPulse AI 2025
              </div>
            </div>
          )}

          {/* Reaction Counter Bar */}
          <div className="px-4 py-2 flex items-center justify-between text-on-surface-variant text-xs bg-surface-container-lowest border-b border-outline-variant/30">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px]">
                  <span className="material-symbols-outlined text-[10px]">thumb_up</span>
                </span>
                <span className="w-4 h-4 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center text-[10px]">
                  <span className="material-symbols-outlined text-[10px]">celebration</span>
                </span>
                <span className="w-4 h-4 rounded-full bg-error text-on-error flex items-center justify-center text-[10px]">
                  <span className="material-symbols-outlined text-[10px]">favorite</span>
                </span>
              </div>
              <span className="font-medium">{likesCount} reactions</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span>12 comments</span>
              <span>•</span>
              <span>4 reposts</span>
            </div>
          </div>

          {/* Interaction Buttons Bar */}
          <div className="px-2 py-1 grid grid-cols-4 gap-1 bg-surface-container-lowest">
            <button
              onClick={handleToggleLike}
              className={`py-2 rounded-lg hover:bg-surface-container-low flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                hasLiked ? 'text-primary-container font-semibold' : 'text-on-surface-variant'
              }`}
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${hasLiked ? 'fill-current' : ''}`}>
                thumb_up
              </span>
              <span className="text-xs font-semibold">Like</span>
            </button>
            <button
              className="py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary-container flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">comment</span>
              <span className="text-xs font-semibold">Comment</span>
            </button>
            <button
              className="py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary-container flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">repeat</span>
              <span className="text-xs font-semibold">Repost</span>
            </button>
            <button
              className="py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary-container flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span className="text-xs font-semibold">Send</span>
            </button>
          </div>
        </article>
      </div>

      {/* Action Footer Below Mockup */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-primary-container hover:bg-on-primary-fixed-variant text-on-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Copy Post Text</span>
          </button>
          <button
            onClick={handleOpenLinkedIn}
            className="px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary-container text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-outline-variant/40 cursor-pointer"
            type="button"
          >
            <span>Open LinkedIn</span>
            <span className="material-symbols-outlined text-[16px]">launch</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>
              cached
            </span>
            <span>{isGenerating ? 'Regenerating...' : 'Regenerate Variation'}</span>
          </button>
          <button
            onClick={() => setIsEditingInPlace(!isEditingInPlace)}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              isEditingInPlace
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>{isEditingInPlace ? 'Done Editing' : 'Edit in Place'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {showToast && (
        <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-lg shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">check_circle</span>
            <span className="text-xs">Post text and hashtags copied to your clipboard!</span>
          </div>
          <span className="text-xs text-primary-fixed font-semibold">Ready to paste</span>
        </div>
      )}
    </div>
  );
};
