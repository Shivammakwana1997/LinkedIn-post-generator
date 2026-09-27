export interface CampaignSocialChannels {
  linkedin: string;
  twitter: string;
  website: string;
}

export interface CampaignMetrics {
  totalPosts: number;
  estimatedReach: string;
  activeSharers: number;
  todayGrowth: string;
}

export interface PostFeedItem {
  id: string;
  author: string;
  role: string;
  avatar: string;
  timestamp: string;
  category: string;
  tagColor?: string;
  content: string;
  fullText?: string;
  likes: number;
  comments: number;
}

export interface CampaignData {
  id: string;
  eventName: string;
  shortName: string;
  orgName: string;
  dates: string;
  location: string;
  fullLocation: string;
  portalSlug: string;
  hashtags: string[];
  socialChannels: CampaignSocialChannels;
  metrics: CampaignMetrics;
  liveStream: PostFeedItem[];
}

export type ToneType = 'professional' | 'grateful' | 'takeaways';

export interface AuthorProfile {
  name: string;
  role: string;
  avatar: string;
  connectionsCount?: string;
}

export interface AttachedMedia {
  id: string;
  url: string;
  tag: string;
  alt: string;
}
