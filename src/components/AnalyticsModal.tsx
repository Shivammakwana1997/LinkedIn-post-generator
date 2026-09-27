import React from 'react';
import { CampaignData } from '../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, campaign }) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Event Name', `"${campaign.eventName}"`],
      ['Organizer', `"${campaign.orgName}"`],
      ['Total Posts Generated', campaign.metrics.totalPosts],
      ['Estimated Feed Reach', campaign.metrics.estimatedReach],
      ['Active Sharers', campaign.metrics.activeSharers],
      ['Daily Growth Rate', campaign.metrics.todayGrowth],
      ['Campaign Hashtags', `"${campaign.hashtags.join(', ')}"`],
      ['Avg Reactions Per Post', 48],
      ['Avg Comments Per Post', 12],
      ['Top Persona', 'Grateful Attendee (52%)'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EventPulse_Analytics_${campaign.portalSlug || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-outline-variant/60 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-container text-on-primary">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">Campaign Social Analytics</h2>
              <p className="text-xs text-on-surface-variant">Live metrics &amp; executive reach breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <span className="text-[11px] text-on-surface-variant uppercase font-medium">Total Posts</span>
            <p className="text-xl font-bold text-on-surface mt-1">{campaign.metrics.totalPosts.toLocaleString()}</p>
            <span className="text-[10px] text-tertiary font-semibold">{campaign.metrics.todayGrowth} today</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <span className="text-[11px] text-on-surface-variant uppercase font-medium">Estimated Reach</span>
            <p className="text-xl font-bold text-on-surface mt-1">{campaign.metrics.estimatedReach}</p>
            <span className="text-[10px] text-primary font-semibold">LinkedIn Feed</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <span className="text-[11px] text-on-surface-variant uppercase font-medium">Active Sharers</span>
            <p className="text-xl font-bold text-on-surface mt-1">{campaign.metrics.activeSharers}</p>
            <span className="text-[10px] text-on-surface-variant">Attendees &amp; VIPs</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <span className="text-[11px] text-on-surface-variant uppercase font-medium">Avg Engagement</span>
            <p className="text-xl font-bold text-tertiary-container mt-1">8.4%</p>
            <span className="text-[10px] text-tertiary font-semibold">4x platform avg</span>
          </div>
        </div>

        {/* Tone Distribution */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wide">Post Persona Breakdown</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Grateful Attendee</span>
                <span className="text-primary-container font-semibold">52% (742 posts)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div className="h-full bg-primary-container rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Professional &amp; Strategic</span>
                <span className="text-secondary font-semibold">31% (443 posts)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '31%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Key Takeaways &amp; Bullets</span>
                <span className="text-tertiary font-semibold">17% (243 posts)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Hashtag Performance */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wide">Top Hashtag Performance</h3>
          <div className="border border-outline-variant/40 rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-surface-container-low p-2.5 font-semibold text-on-surface">
              <span>Hashtag</span>
              <span>Posts Injected</span>
              <span className="text-right">Impressions</span>
            </div>
            {campaign.hashtags.map((tag, i) => (
              <div key={tag} className="grid grid-cols-3 p-2.5 border-t border-outline-variant/30 text-on-surface-variant">
                <span className="font-semibold text-primary">{tag}</span>
                <span>{(1428 - i * 180).toLocaleString()}</span>
                <span className="text-right font-medium">{(342 - i * 45).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-lg bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
