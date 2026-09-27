import React, { useState } from 'react';
import { CampaignData, PostFeedItem } from '../types';

interface OrganizerViewProps {
  campaign: CampaignData;
  onUpdateCampaign: (updated: Partial<CampaignData>) => Promise<void>;
  onNavigateToAttendee: () => void;
  onOpenExportModal: () => void;
  onOpenQRModal: () => void;
  onInspectPost: (post: PostFeedItem) => void;
}

export const OrganizerView: React.FC<OrganizerViewProps> = ({
  campaign,
  onUpdateCampaign,
  onNavigateToAttendee,
  onOpenExportModal,
  onOpenQRModal,
  onInspectPost,
}) => {
  const [eventName, setEventName] = useState(campaign.eventName);
  const [orgName, setOrgName] = useState(campaign.orgName);
  const [hashtags, setHashtags] = useState<string[]>(campaign.hashtags);
  const [newTagInput, setNewTagInput] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState(campaign.socialChannels.linkedin);
  const [twitterHandle, setTwitterHandle] = useState(campaign.socialChannels.twitter);
  const [websiteUrl, setWebsiteUrl] = useState(campaign.socialChannels.website);

  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Portal URL
  const portalUrl = `https://eventpulse.ai/join/${campaign.portalSlug || 'aisummit25'}`;

  const handleAddTag = () => {
    const clean = newTagInput.trim().replace(/^#/, '');
    if (!clean) return;
    const formatted = `#${clean}`;
    if (!hashtags.includes(formatted)) {
      setHashtags([...hashtags, formatted]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateCampaign({
      eventName,
      orgName,
      hashtags,
      socialChannels: {
        linkedin: linkedinUrl,
        twitter: twitterHandle,
        website: websiteUrl,
      },
    });
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  const handleReset = () => {
    setEventName(campaign.eventName);
    setOrgName(campaign.orgName);
    setHashtags(campaign.hashtags);
    setLinkedinUrl(campaign.socialChannels.linkedin);
    setTwitterHandle(campaign.socialChannels.twitter);
    setWebsiteUrl(campaign.socialChannels.website);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Campaign Management</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Live Campaign
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Organizer Control Center</h1>
          <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Configure your event social campaign, track attendee engagement, and distribute real-time generator links.
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={onNavigateToAttendee}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-all shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
            <span>Preview Attendee Portal</span>
          </button>
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-semibold text-sm transition-all shadow-xs border border-outline-variant/60 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">download</span>
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create / Edit Event Form Card (lg:col-span-6 xl:col-span-7) */}
        <div className="lg:col-span-6 xl:col-span-7 bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-xs border border-outline-variant/50 space-y-6">
          {/* Section Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary-container text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[24px] text-primary-container">tune</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-on-surface">Event Configuration</h2>
                <p className="text-xs text-on-surface-variant">Define event parameters and default prompts for attendees.</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary font-mono text-xs font-semibold border border-outline-variant/40">
              ID: {campaign.id}
            </span>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* Event Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface" htmlFor="eventName">
                Event Name
              </label>
              <div className="relative">
                <input
                  id="eventName"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Global AI Summit 2025 - San Francisco"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant/50 focus:bg-surface-container-lowest focus:border-primary-container focus:outline-none transition-all placeholder:text-outline"
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-[20px] pointer-events-none">
                  calendar_today
                </span>
              </div>
            </div>

            {/* Organizer / Organization Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface" htmlFor="orgName">
                Organizer / Organization Name
              </label>
              <div className="relative">
                <input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. TechPulse Media & Ventures"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant/50 focus:bg-surface-container-lowest focus:border-primary-container focus:outline-none transition-all placeholder:text-outline"
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-[20px] pointer-events-none">
                  corporate_fare
                </span>
              </div>
            </div>

            {/* Campaign Hashtags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-on-surface">
                  Campaign Hashtags (Injected into drafts)
                </label>
                <span className="text-xs text-on-surface-variant font-medium">{hashtags.length} Active</span>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 min-h-[50px] items-center">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold group shadow-2xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-error transition-colors cursor-pointer"
                      title={`Remove ${tag}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tag Input Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-on-surface-variant">#</span>
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add custom tag (press enter)"
                    className="w-full pl-8 pr-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline-variant/50 focus:bg-surface-container-lowest focus:border-primary-container focus:outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-lg bg-secondary-container hover:bg-surface-container-high text-on-secondary-fixed text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Add tag</span>
                </button>
              </div>
            </div>

            {/* Social Links Subsection */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-on-surface flex items-center gap-2 uppercase tracking-wide">
                <span className="material-symbols-outlined text-primary-container text-[18px]">share</span>
                Social Amplification Channels
              </h3>

              {/* LinkedIn URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-on-surface-variant" htmlFor="linkedinUrl">
                  LinkedIn Event / Company Page
                </label>
                <div className="flex items-center rounded-lg bg-surface-container-low border border-outline-variant/50 overflow-hidden focus-within:bg-surface-container-lowest focus-within:border-primary-container transition-all">
                  <div className="px-3.5 py-2.5 bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                    in
                  </div>
                  <input
                    id="linkedinUrl"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/events/..."
                    className="w-full px-3 py-2 bg-transparent text-on-surface text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Twitter / X Handle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-on-surface-variant" htmlFor="twitterHandle">
                  X / Twitter Handle
                </label>
                <div className="flex items-center rounded-lg bg-surface-container-low border border-outline-variant/50 overflow-hidden focus-within:bg-surface-container-lowest focus-within:border-primary-container transition-all">
                  <div className="px-3.5 py-2.5 bg-inverse-surface text-on-primary flex items-center justify-center font-bold text-xs">
                    @
                  </div>
                  <input
                    id="twitterHandle"
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="EventHandle"
                    className="w-full px-3 py-2 bg-transparent text-on-surface text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Official Website URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-on-surface-variant" htmlFor="websiteUrl">
                  Official Website URL
                </label>
                <div className="flex items-center rounded-lg bg-surface-container-low border border-outline-variant/50 overflow-hidden focus-within:bg-surface-container-lowest focus-within:border-primary-container transition-all">
                  <div className="px-3.5 py-2.5 bg-surface-container text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">language</span>
                  </div>
                  <input
                    id="websiteUrl"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourconference.com"
                    className="w-full px-3 py-2 bg-transparent text-on-surface text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-outline-variant/40">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSaving ? 'refresh' : 'check_circle'}
                </span>
                <span>{isSaving ? 'Updating...' : 'Save & Update Event'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs transition-all border border-outline-variant/40 cursor-pointer"
              >
                Reset Fields
              </button>

              {isSaved && (
                <span className="text-xs text-tertiary inline-flex items-center gap-1 sm:ml-auto font-medium animate-in fade-in">
                  <span className="material-symbols-outlined text-[16px]">done_all</span> All changes saved
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Event Overview Card & Post Metrics (lg:col-span-6 xl:col-span-5) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          {/* Event Overview Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-outline-variant/50 space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-container to-secondary p-5 text-on-primary shadow-sm">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-xs font-medium">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Hosted by {campaign.orgName.split('&')[0]}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-on-primary leading-tight">
                  {campaign.shortName}
                </h3>
                <p className="text-xs text-primary-fixed flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  {campaign.dates} • {campaign.location}
                </p>
              </div>
              {/* Decorative circle overlay */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
            </div>

            {/* Shareable Attendee Portal Box */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">link</span>
                  Attendee Generator URL
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono font-medium">
                  Public Access
                </span>
              </div>

              {/* Link Box */}
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 shadow-2xs">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] ml-2">captive_portal</span>
                <input
                  id="portalUrl"
                  readOnly
                  value={portalUrl}
                  className="w-full bg-transparent text-primary text-xs font-mono truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-md bg-primary-container hover:bg-primary text-on-primary text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* QR Code Section */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest p-1 shadow-2xs border border-outline-variant/50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13 0h1v2h-1v-2zm-3 0h2v1h-2v-1zm4 1h1v1h-1v-1zm-2 2h1v1h-1v-1zm2 1h1v2h-2v-1h1v-1zm-4-1h2v1h-2v-1zm0 2h1v1h-1v-1zm-2-4h1v1h-1v-1zm6-1h2v1h-2v-1z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Digital Badge QR Code</div>
                    <div className="text-[11px] text-on-surface-variant">Place on stage slides &amp; lanyards</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenQRModal}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium flex items-center gap-1 transition-all border border-outline-variant/40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>Download QR</span>
                </button>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Live Campaign Velocity</h4>
                <span className="text-xs text-tertiary font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> Real-time Sync
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Stat 1: Generated Posts */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="text-[11px] uppercase tracking-wide font-medium">Total Posts</span>
                    <span className="material-symbols-outlined text-[16px] text-primary">post_add</span>
                  </div>
                  <div className="text-xl font-bold text-on-surface">{campaign.metrics.totalPosts.toLocaleString()}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-tertiary font-semibold">{campaign.metrics.todayGrowth} today</span>
                    {/* Mini sparkline SVG */}
                    <svg className="w-12 h-4 text-tertiary" fill="none" viewBox="0 0 48 16">
                      <path d="M2 14L10 11L18 13L26 8L34 9L46 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Stat 2: LinkedIn Reach */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="text-[11px] uppercase tracking-wide font-medium">Estimated Reach</span>
                    <span className="material-symbols-outlined text-[16px] text-primary-container">groups</span>
                  </div>
                  <div className="text-xl font-bold text-on-surface">{campaign.metrics.estimatedReach}</div>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-semibold">
                      LinkedIn Feed
                    </span>
                  </div>
                </div>

                {/* Stat 3: Active Sharers */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="text-[11px] uppercase tracking-wide font-medium">Active Sharers</span>
                    <span className="material-symbols-outlined text-[16px] text-tertiary">how_to_reg</span>
                  </div>
                  <div className="text-xl font-bold text-on-surface">{campaign.metrics.activeSharers}</div>
                  {/* Avatar pile */}
                  <div className="flex -space-x-1.5 overflow-hidden pt-0.5">
                    <img
                      alt="Attendee"
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-surface-container-low object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBir5OSkig9F3S6U0CzPfcQO5TGLyit4dsPUBL9OyQaRX2LU-HV9y5rB0QHbabiSV_x33-aAl-oqVQty4lRnFebdoZ51ezI_dEJthW7jUjT5Nv87-DYf_NLsAVNZK_ZOpBIMQBVi8toCyWZw_aEA8IjTff7XM4B3o_yJIMLpj0Kr5Qlci-5zXd6PZ9JMudI4ZhEC9v0gZdJA4UYlqr1vafJ_D2C6mT-c_fmsMt_fMqVzgihLlmOPpm8kQ"
                    />
                    <img
                      alt="Attendee"
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-surface-container-low object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA31UvEjU0qb6cs3a_pwBDlrIILYiFyWxbhikFDeeRlsM4utXzfp1tkxL05j0w2xqGB27PWFCkcYMADcHFaaZK4yE6-1PlrSvVlJ275a3QsZKTaA0CuH1hd26AIIRHE5a78LFo7w1Ixv8LaBLjqJngeqx-pJQqeeiykZLWuBqGcRbQumMEOmfg7gJTKQGJMvVS3FuPMx-zyAq8Kukbk1ixtAi1AeT23RkRMgjQsqRc7jekfLwb5OMqvw"
                    />
                    <img
                      alt="Attendee"
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-surface-container-low object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWM6EIMnJx1UW7GXMTCNfDkG2AcMVxRrCYu08wz7ByQF-lTpfPuxedeh1YR0pnRP-4OzBNSb5QdLrbFZN-RC0ww4osUXVdtnR-NaGpHprw0Pm6_aMcx70dy-SlJk2x2XXW0MMsCKuQ5azuLGkYjveLhLQjXqcMsgRZwu5S7yVVOymlAb7WCodKGDARTkhK4c92sgLwXnHhjoBOetSlZEqsTQHhf56YEi7PRGcXHQE_heQQUcIanolwWg"
                    />
                    <div className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-secondary text-on-secondary text-[9px] font-bold ring-2 ring-surface-container-low">
                      +889
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Attendee Activity */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px] text-primary">dynamic_feed</span>
                  Live Posts Stream
                </h4>
                <span className="text-xs text-on-surface-variant font-medium">Auto-updating</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {campaign.liveStream.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        alt={item.author}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/50"
                        src={item.avatar}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-on-surface truncate">{item.author}</div>
                        <div className="text-[11px] text-on-surface-variant truncate">
                          {item.role} • {item.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-medium">
                        {item.category}
                      </span>
                      <button
                        onClick={() => onInspectPost(item)}
                        className="text-primary hover:text-primary-container p-1 rounded hover:bg-surface-container-high transition-colors cursor-pointer"
                        title="Inspect Post"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Guidelines Banner */}
            <div className="p-3.5 rounded-xl bg-surface-container flex items-start gap-3 border border-outline-variant/40">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">tips_and_updates</span>
              <div className="space-y-0.5 text-xs">
                <div className="font-semibold text-on-surface">Hashtag Amplification Tip</div>
                <p className="text-on-surface-variant leading-relaxed">
                  Posts utilizing 3-4 event hashtags receive up to 68% higher organic executive feed distribution on LinkedIn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
