import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/60 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">help</span>
            <h2 className="text-base font-bold text-on-surface">EventPulse User Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 text-xs text-on-surface-variant leading-relaxed">
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
            <h4 className="font-bold text-on-surface text-xs">For Organizers:</h4>
            <p>
              Set up your event title, official hashtags, and corporate pages in the <strong>Organizer Control Center</strong>. Share the <strong>Attendee Generator URL</strong> or project the <strong>Digital Badge QR code</strong> on keynote screens and conference lanyards.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
            <h4 className="font-bold text-on-surface text-xs">For Attendees:</h4>
            <p>
              Input what caught your attention in the <strong>Key Highlights</strong> box or use the <strong>Insert Keynote Quote</strong> helper. Pick a tone (e.g. Grateful Attendee or Executive Insight), attach your stage photos, and click <strong>Generate LinkedIn Post</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
            <h4 className="font-bold text-on-surface text-xs">Publishing to LinkedIn:</h4>
            <p>
              Review the live mockup preview. Click <strong>Copy Post Text</strong> or <strong>Open LinkedIn</strong> to paste directly into your LinkedIn feed with verified tags and hashtags intact.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-outline-variant/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary cursor-pointer transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
