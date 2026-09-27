import React, { useState, useRef } from 'react';
import { CampaignData, ToneType, AuthorProfile } from '../types';
import { LinkedInMockup } from './LinkedInMockup';
import { generatePostAPI } from '../services/api';

interface AttendeeViewProps {
  campaign: CampaignData;
  onPostGenerated: (postText: string) => void;
}

export const AttendeeView: React.FC<AttendeeViewProps> = ({ campaign, onPostGenerated }) => {
  const [highlights, setHighlights] = useState(
    'Incredible keynote by Sam on the future of autonomous agent architecture! Blown away by the live demo of collaborative AI tooling. Great reconnecting with old colleagues and meeting new founders during the robotics showcase.'
  );
  const [tone, setTone] = useState<ToneType>('grateful');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [tagOrganizers, setTagOrganizers] = useState(true);

  // Author details (customizable)
  const [author] = useState<AuthorProfile>({
    name: 'Sarah Jenkins',
    role: 'VP of Product Engineering @ Datamesh | AI Systems & Cloud Architecture',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Tgg_9QNVQ4WPSfUmhDq_xggIh-YklTfnwQbImGQJk3v2p-GX4oMJZYtmSFM5hrAiD0peW92WuppMYqGM-qivVanl0oGECpwwKNqZO_j94tbTmqT_UszYSSro7t5eWSUIsS37-91cN4g87RG97MPz90wSnz1axFFYRSM8qmf8Ry9RVb9Qm_TM6FpPJdcyyp17KsYPbVVGSBs8rRTnoi2uvKxUMJ9xW5KHpxfXkJEXtB7sIf-nqTFWsw',
  });

  // Attached images list
  const [attachedPhotos, setAttachedPhotos] = useState<
    Array<{ id: string; url: string; tag: string; isSelected: boolean }>
  >([
    {
      id: 'photo-1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOCBxLGghdPPAnLOF-4siBSXvuIAe3LNegaOqN1tPfkl67IzUuRSdRuWLkgppE_XtDPgsmDbl_iLdGEQ5ce5S8q6mL5pdGgAOZFkMKH6WXcYsxwMiwe8UmIxlgVrxbtFVrlQV5UXfpwPGX_bs05SebNJgjQ1208nHvUHtWz3FbjizaNji8JbBHbIqcUuiKKIaPad7ze0xOAUZyaM9ZgnkIlhxsk8QpCaaKyQteookrkgxDn10PjRRZLg',
      tag: 'Keynote',
      isSelected: true,
    },
    {
      id: 'photo-2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqRzMSv_MkVXQH_35bq0q2UL2P_CZmo_6d9Y60AAggOiJjE8HFnyh5OF4wGL8BNGC5477BKapBHVs7wDPqxP4PWkPOYI9s18CcsTgZ-JvT5hkHOqzwhmcl8cNXqrYXUmR7E3PBvOcr5PYh9q4cu4VKX7F7r4DCsgs4XuHySOhWQsRLlYzrjDdlz0y0xkX9mprBFNJhpX6N_J_UNNbcK0Yx26uOyekXly3B3sfgeznwvzOxZ_mSAd54ZA',
      tag: 'Badge',
      isSelected: false,
    },
  ]);

  const [activePhotoUrl, setActivePhotoUrl] = useState(attachedPhotos[0].url);

  // Post text in live preview
  const defaultPostText = `Still buzzing from an energizing Day 2 at the ${campaign.shortName}! 🚀\n\nHuge thank you to @${campaign.orgName.split(' ')[0]} for curating such a world-class gathering. Three key takeaways that resonated deeply:\n\n1️⃣ **Autonomous agents** are rapidly shifting from passive conversational chatbots to active collaborative teammates in product pipelines.\n2️⃣ **Low-latency edge inference** is unlocking real-time UI synthesis at true enterprise scale.\n3️⃣ The **human-in-the-loop paradigm** remains the decisive differentiator for trustworthy production adoption.\n\nIncredible reconnecting with brilliant founders, data engineers, and architects in San Francisco. If you're here, let's connect before tomorrow's closing reception!\n\n${campaign.hashtags.join(' ')} #ArtificialIntelligence`;

  const [postText, setPostText] = useState(defaultPostText);
  const [isGenerating, setIsGenerating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keynote quotes repository
  const keynoteQuotes = [
    '\n\n"The future is not just models training models; it is autonomous agents coordinating reliable human workflows." - Sam Altmeyer, Opening Keynote',
    '\n\n"Latency is the new frontier for user trust in AI interfaces." - Dr. Aris Thorne, AI Systems Panel',
    '\n\n"The winners in enterprise AI will be defined by their feedback loops, not their parameter counts." - Elena Rostova, Fireside Chat',
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleInsertQuote = () => {
    const quote = keynoteQuotes[quoteIndex % keynoteQuotes.length];
    setHighlights((prev) => prev.trim() + quote);
    setQuoteIndex((prev) => prev + 1);
  };

  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = attachedPhotos.filter((p) => p.id !== id);
    setAttachedPhotos(remaining);
    if (activePhotoUrl === attachedPhotos.find((p) => p.id === id)?.url) {
      setActivePhotoUrl(remaining[0]?.url || '');
    }
  };

  const handleSelectPhoto = (url: string) => {
    setActivePhotoUrl(url);
    setAttachedPhotos((prev) =>
      prev.map((p) => ({ ...p, isSelected: p.url === url }))
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newPhoto = {
          id: `photo-${Date.now()}`,
          url: reader.result,
          tag: 'Photo',
          isSelected: true,
        };
        setAttachedPhotos((prev) => [newPhoto, ...prev]);
        setActivePhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generatePostAPI({
        highlights,
        tone,
        eventName: campaign.shortName,
        orgName: campaign.orgName,
        hashtags: campaign.hashtags,
        includeHashtags,
        tagOrganizers,
        author: { name: author.name, role: author.role },
      });

      if (res && res.postText) {
        setPostText(res.postText);
        onPostGenerated(res.postText);
      }
    } catch (err) {
      console.error('Generation error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Event Banner */}
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-outline-variant/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container text-xs font-semibold tracking-wide border border-tertiary-container/20">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Official Attendee Portal • Verified Partner
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
              Day 2 of 3 Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            {campaign.shortName}
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary-container">location_on</span>
            Hosted by <strong className="text-on-surface font-semibold">{campaign.orgName}</strong> • {campaign.fullLocation}
          </p>
        </div>

        {/* Social & Event Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {campaign.hashtags.map((tag) => (
            <a
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold transition-colors border border-outline-variant/30"
              href={`https://www.linkedin.com/feed/hashtag/?keywords=${encodeURIComponent(tag.replace('#', ''))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{tag}</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          ))}
          <a
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container/10 hover:bg-primary-container/15 text-primary-container text-xs font-bold transition-colors border border-primary-container/20"
            href={campaign.socialChannels.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[16px]">business</span>
            <span>@{campaign.orgName.split('&')[0].trim()}</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </section>

      {/* Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (~45% / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-7 shadow-xs border border-outline-variant/50 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">Craft Your Event Story</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-medium border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px] text-primary-container">psychology</span>
                  AI Enhanced
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Tell your professional network what resonated most today in San Francisco.
              </p>
            </div>

            {/* Photo Upload Dropzone */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface">Add Photos &amp; Media</label>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  {attachedPhotos.length} uploaded • Max 10MB
                </span>
              </div>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center justify-center text-center cursor-pointer group border-2 border-dashed border-outline-variant/60"
                id="dropzone"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary-container group-hover:scale-105 transition-transform mb-2 shadow-2xs">
                  <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
                </div>
                <p className="text-xs font-semibold text-on-surface">
                  Drag &amp; drop event photos here, or <span className="text-primary underline">browse files</span>
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Keynote slides, stage shots, networking moments • PNG, JPG
                </p>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {attachedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => handleSelectPhoto(photo.url)}
                    className={`relative group rounded-lg overflow-hidden h-20 bg-surface-container shadow-2xs cursor-pointer border-2 transition-all ${
                      activePhotoUrl === photo.url ? 'border-primary-container ring-2 ring-primary-container/20' : 'border-transparent'
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      alt={photo.tag}
                      src={photo.url}
                    />
                    <div className="absolute inset-0 bg-on-surface/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => handleRemovePhoto(photo.id, e)}
                        className="w-6 h-6 rounded-full bg-surface-container-lowest text-on-surface hover:text-error flex items-center justify-center shadow cursor-pointer"
                        title="Remove image"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-on-surface/75 text-on-primary font-medium text-[10px]">
                      {photo.tag}
                    </span>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex flex-col items-center justify-center gap-1 transition-all border border-outline-variant/40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                  <span className="text-[11px] font-semibold">+ Add more</span>
                </button>
              </div>
            </div>

            {/* Key Highlights Textarea */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface" htmlFor="takeaway-input">
                  Key Highlights / Takeaways
                </label>
                <button
                  onClick={handleInsertQuote}
                  className="text-xs text-primary hover:text-on-primary-fixed-variant flex items-center gap-0.5 font-medium cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">format_quote</span>
                  <span>Insert Keynote Quote</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  id="takeaway-input"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  maxLength={3000}
                  rows={5}
                  placeholder="What talk moved you? What statistic surprised your team?"
                  className="w-full rounded-xl bg-surface-container-low focus:bg-surface-container-lowest text-on-surface p-3.5 text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/50 transition-all leading-relaxed"
                />
                <div className="flex items-center justify-between px-1 pt-1.5 text-on-surface-variant">
                  <span className="text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-tertiary-container">lightbulb</span>
                    Tip: Mention your favorite talk, speaker, or partner booth.
                  </span>
                  <span className="text-[11px] font-mono font-medium">
                    {highlights.length} / 3,000
                  </span>
                </div>
              </div>
            </div>

            {/* Tone Selector Chips */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface">Post Persona &amp; Tone</label>
                <span className="text-[11px] text-on-surface-variant font-medium">Select 1 style</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTone('professional')}
                  className={`px-3 py-2.5 rounded-lg flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    tone === 'professional'
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-2xs font-semibold'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium border border-outline-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">business_center</span>
                  <span className="text-xs">Professional</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTone('grateful')}
                  className={`px-3 py-2.5 rounded-lg flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    tone === 'grateful'
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-2xs font-semibold'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium border border-outline-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="text-xs">Grateful Attendee</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTone('takeaways')}
                  className={`px-3 py-2.5 rounded-lg flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    tone === 'takeaways'
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-2xs font-semibold'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium border border-outline-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                  <span className="text-xs">Key Takeaways</span>
                </button>
              </div>

              {/* Sub-options toggles */}
              <div className="mt-2 pt-3 flex flex-col gap-2.5 bg-surface-container-low/70 p-3 rounded-lg border border-outline-variant/30">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <span className="text-xs text-on-surface flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary">tag</span>
                    Include event hashtags automatically
                  </span>
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-container focus:ring-primary accent-primary cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none">
                  <span className="text-xs text-on-surface flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary">person_add</span>
                    Tag organizers &amp; keynote speakers
                  </span>
                  <input
                    type="checkbox"
                    checked={tagOrganizers}
                    onChange={(e) => setTagOrganizers(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-container focus:ring-primary accent-primary cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-lg bg-primary-container hover:bg-on-primary-fixed-variant text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none"
              >
                <span className={`material-symbols-outlined text-[20px] ${isGenerating ? 'animate-spin' : 'animate-pulse'}`}>
                  {isGenerating ? 'refresh' : 'auto_awesome'}
                </span>
                <span>{isGenerating ? 'Synthesizing Post...' : 'Generate LinkedIn Post'}</span>
              </button>
              <p className="text-center text-[11px] text-on-surface-variant mt-2 font-medium">
                Powered by EventPulse AI Model v4.2 • Tailored for engagement algorithms
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview (~55% / 7 cols) */}
        <div className="lg:col-span-7">
          <LinkedInMockup
            postText={postText}
            onPostTextChange={setPostText}
            attachedImageUrl={activePhotoUrl}
            eventName={campaign.shortName}
            orgName={campaign.orgName}
            author={author}
            onRegenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};
