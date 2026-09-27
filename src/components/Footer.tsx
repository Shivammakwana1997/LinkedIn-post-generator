import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openInfo = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
  };

  return (
    <>
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="font-bold text-on-surface">EventPulse</span>
            <span>•</span>
            <span>© 2025 EventPulse Studio. Optimized for LinkedIn Publishing.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-on-surface-variant font-medium">
            <button
              onClick={() =>
                openInfo(
                  'Content Guidelines',
                  'EventPulse promotes verified, authentic executive reflection. Posts must conform to professional networking etiquette, authentic attribution of conference speakers, and relevant hashtag usage without spamming.'
                )
              }
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              Content Guidelines
            </button>
            <button
              onClick={() =>
                openInfo(
                  'API Integrations',
                  'EventPulse integrates with modern LLM engines (@google/genai & Gemini 3.8 Flash), LinkedIn Open URL Intents, and real-time webhook ingestion for enterprise event management platforms (Eventbrite, Bizzabo, Hopin).'
                )
              }
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              API Integrations
            </button>
            <button
              onClick={() =>
                openInfo(
                  'Privacy & Terms',
                  'Your draft notes and attached photos are processed locally and securely in compliance with standard enterprise privacy protocols. No confidential conference data is shared without explicit attendee publication.'
                )
              }
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              Privacy &amp; Terms
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/60 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
              <h3 className="text-sm font-bold text-on-surface">{modalTitle}</h3>
              <button
                onClick={() => setModalTitle(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{modalContent}</p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalTitle(null)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
