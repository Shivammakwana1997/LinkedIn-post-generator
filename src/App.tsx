/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CampaignData, PostFeedItem } from './types';
import { fetchCampaignData, saveCampaignData, initialDefaultCampaign } from './services/api';
import { Navbar } from './components/Navbar';
import { OrganizerView } from './components/OrganizerView';
import { AttendeeView } from './components/AttendeeView';
import { AnalyticsModal } from './components/AnalyticsModal';
import { QRCodeModal } from './components/QRCodeModal';
import { InspectPostModal } from './components/InspectPostModal';
import { HelpModal } from './components/HelpModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState<'organizer' | 'attendee'>('organizer');
  const [campaign, setCampaign] = useState<CampaignData>(initialDefaultCampaign);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [inspectedPost, setInspectedPost] = useState<PostFeedItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCampaignData();
        setCampaign(data);
      } catch (err) {
        console.error('Failed to load campaign data', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleUpdateCampaign = async (updated: Partial<CampaignData>) => {
    try {
      const saved = await saveCampaignData(updated);
      setCampaign(saved);
    } catch (err) {
      console.error('Failed to save campaign', err);
    }
  };

  const handlePostGenerated = (postContent: string) => {
    // Increment post count and add to live stream
    setCampaign((prev) => {
      const total = prev.metrics.totalPosts + 1;
      const reachFloat = 342.5 + 0.3;
      const newPost: PostFeedItem = {
        id: `post-${Date.now()}`,
        author: 'Sarah Jenkins',
        role: 'VP of Product Engineering @ Datamesh',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Tgg_9QNVQ4WPSfUmhDq_xggIh-YklTfnwQbImGQJk3v2p-GX4oMJZYtmSFM5hrAiD0peW92WuppMYqGM-qivVanl0oGECpwwKNqZO_j94tbTmqT_UszYSSro7t5eWSUIsS37-91cN4g87RG97MPz90wSnz1axFFYRSM8qmf8Ry9RVb9Qm_TM6FpPJdcyyp17KsYPbVVGSBs8rRTnoi2uvKxUMJ9xW5KHpxfXkJEXtB7sIf-nqTFWsw',
        timestamp: 'Just now',
        category: 'Live Share',
        content: postContent.slice(0, 140) + '...',
        fullText: postContent,
        likes: 1,
        comments: 0,
      };

      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          totalPosts: total,
          estimatedReach: `${reachFloat.toFixed(1)}K`,
        },
        liveStream: [newPost, ...prev.liveStream],
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-on-surface-variant">Loading EventPulse Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Fixed Header */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        totalPosts={campaign.metrics.totalPosts}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1">
        {currentView === 'organizer' ? (
          <OrganizerView
            campaign={campaign}
            onUpdateCampaign={handleUpdateCampaign}
            onNavigateToAttendee={() => setCurrentView('attendee')}
            onOpenExportModal={() => setIsAnalyticsOpen(true)}
            onOpenQRModal={() => setIsQROpen(true)}
            onInspectPost={(post) => setInspectedPost(post)}
          />
        ) : (
          <AttendeeView
            campaign={campaign}
            onPostGenerated={handlePostGenerated}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        campaign={campaign}
      />

      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        portalUrl={`https://eventpulse.ai/join/${campaign.portalSlug || 'aisummit25'}`}
        eventName={campaign.shortName}
        orgName={campaign.orgName}
      />

      <InspectPostModal
        post={inspectedPost}
        onClose={() => setInspectedPost(null)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
