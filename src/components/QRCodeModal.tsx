import React from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalUrl: string;
  eventName: string;
  orgName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  portalUrl,
  eventName,
  orgName,
}) => {
  if (!isOpen) return null;

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('event-qr-code-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EventPulse_QR_${eventName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl border border-outline-variant/60 space-y-6 text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40 text-left">
          <div>
            <h2 className="text-base font-bold text-on-surface">Digital Badge QR Code</h2>
            <p className="text-xs text-on-surface-variant">Display on stage slides, badges &amp; screens</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Printable Card Preview */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-surface-container-low to-surface-container border border-outline-variant/50 space-y-4 shadow-sm">
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-wider">
              Scan to Generate Post
            </span>
            <h3 className="text-base font-bold text-on-surface pt-1">{eventName}</h3>
            <p className="text-xs text-on-surface-variant">{orgName}</p>
          </div>

          {/* QR Code Container */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs inline-block border border-outline-variant/40">
            <svg
              id="event-qr-code-svg"
              className="w-48 h-48 text-on-surface mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13 0h1v2h-1v-2zm-3 0h2v1h-2v-1zm4 1h1v1h-1v-1zm-2 2h1v1h-1v-1zm2 1h1v2h-2v-1h1v-1zm-4-1h2v1h-2v-1zm0 2h1v1h-1v-1zm-2-4h1v1h-1v-1zm6-1h2v1h-2v-1z" />
            </svg>
          </div>

          <p className="text-xs font-mono text-primary font-semibold truncate px-2">
            {portalUrl}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleDownloadSVG}
            className="px-4 py-2.5 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download SVG</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
