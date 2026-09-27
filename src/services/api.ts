import { CampaignData } from '../types';

export const initialDefaultCampaign: CampaignData = {
  id: '#EP-8492',
  eventName: 'Global AI Summit 2025 - San Francisco',
  shortName: 'Global AI Summit 2025',
  orgName: 'TechPulse Media & Ventures',
  dates: 'Oct 24-26, 2025',
  location: 'Moscone Center, SF',
  fullLocation: 'Moscone Center, San Francisco, CA',
  portalSlug: 'aisummit25',
  hashtags: ['#GlobalAISummit', '#FutureOfTech', '#AISummit25', '#EventPulse'],
  socialChannels: {
    linkedin: 'https://linkedin.com/events/global-ai-summit-2025',
    twitter: 'GlobalAISummit',
    website: 'https://globalsummit.ai',
  },
  metrics: {
    totalPosts: 1428,
    estimatedReach: '342.5K',
    activeSharers: 892,
    todayGrowth: '+24%',
  },
  liveStream: [
    {
      id: 'post-1',
      author: 'Sarah M.',
      role: 'VP AI at Acme Corp',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBz90gDMVfeaby04aEYCtw5IGLmJD93HIIYvP4aw7k-w8n6ngfUnL1GL8bwScKBiwt2vDoAEo2rdxm767qS1Yd9e6lgOoQHpzoWlrNVvar9uxvsmdgwsreYJbe7Dfv-Ab-u4vsSTlKhryK042CEi9nY7R_6tcg_QudnKIvV2EdGyGz5mc5GM_jRwjleoq8b3-65tDMxOl6icQJMZHhs4SNqRPyhdgspRnN_ApzQ6dQGtpktjy9uBak0Cw',
      timestamp: '2m ago',
      category: 'Keynote Recap',
      tagColor: 'secondary-container',
      content:
        'Keynote with Sam Altmeyer revealed how agentic coordination is transforming workflows. 3 key architecture lessons learned!',
      likes: 54,
      comments: 14,
    },
    {
      id: 'post-2',
      author: 'David K.',
      role: 'DevRel Lead at VectorHub',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCDI7x8a0jab_bai-zRB1LRsxAeYVs3_MxFMx4A-lpRF63jce23IJIiOBR4_jndbH-szwU7g6uEGsN1zma9Cykr9bRnKMCm73GgaRdLeeRfavYyb81hAK3TFKGBOSGImW7OZmDK-x4s_-jK1yHrkBLvGpSXmlZ6y7IhEK4aFzhSQ3NC8QC2bOTfVsfurGs10czwwpt_SqcOxOw6EO1u0_IYTiXEr9mD8IYVY9KKCKAFVKClSsWx_CDmew',
      timestamp: '8m ago',
      category: 'Quote Insight',
      tagColor: 'primary-fixed',
      content:
        '"The future is not just models training models; it is autonomous agents coordinating reliable human workflows." Incredible energy today!',
      likes: 89,
      comments: 21,
    },
    {
      id: 'post-3',
      author: 'Elena R.',
      role: 'Founder & CEO',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCaMNLnzQum_zLTMqlDCdrE_Ef1-okYrxujcd-J0Z3PDkh3fSZ8wXQ7hkEj5fz2_cDbXsatE3BspI2uLkYIPbwwBns7TxvtppMwOIFQqOAGvPtsGDuoMr6Se2OIGj8usXzIUqc--RldL3wT1JrIldUbcUE4yIKdza-lPKmuabhMC-43-l-ErGufLCtn9XTR4ZsP-LUpMO3-lnWfLHFuvRUtFbmbHMBvI0AWOxHY6q6Y9RpArCl90N8pmA',
      timestamp: '14m ago',
      category: 'Networking',
      tagColor: 'tertiary-fixed',
      content:
        'Grateful to meet dozens of AI pioneers at Moscone Center. The enterprise readiness panel set the gold standard.',
      likes: 122,
      comments: 35,
    },
  ],
};

export async function fetchCampaignData(): Promise<CampaignData> {
  try {
    const res = await fetch('/api/campaign');
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('API call to /api/campaign failed, using storage/default', e);
  }

  const stored = localStorage.getItem('eventpulse_campaign');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return initialDefaultCampaign;
}

export async function saveCampaignData(data: Partial<CampaignData>): Promise<CampaignData> {
  try {
    const res = await fetch('/api/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        localStorage.setItem('eventpulse_campaign', JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (e) {
    console.warn('API call to /api/campaign save failed, using storage', e);
  }

  const current = await fetchCampaignData();
  const updated = { ...current, ...data };
  localStorage.setItem('eventpulse_campaign', JSON.stringify(updated));
  return updated;
}

export async function generatePostAPI(params: {
  highlights: string;
  tone: string;
  eventName: string;
  orgName: string;
  hashtags: string[];
  includeHashtags: boolean;
  tagOrganizers: boolean;
  author: { name: string; role: string };
}): Promise<{ postText: string; bulletPoints: string[]; metrics?: any }> {
  try {
    const res = await fetch('/api/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.postText) {
        return json;
      }
    }
  } catch (e) {
    console.warn('API post generation failed, using local generator', e);
  }

  // Client-side fallback generator
  const { eventName, orgName, hashtags, includeHashtags, tagOrganizers, tone, highlights } = params;
  const orgTag = tagOrganizers ? `@${orgName.split(' ')[0] || 'TechPulse Media'}` : orgName;
  const tagsStr = includeHashtags ? hashtags.join(' ') + ' #ArtificialIntelligence' : '';

  let bulletPoints = [
    'Autonomous agents are rapidly shifting from passive conversational chatbots to active collaborative teammates in product pipelines.',
    'Low-latency edge inference is unlocking real-time UI synthesis at true enterprise scale.',
    'The human-in-the-loop paradigm remains the decisive differentiator for trustworthy production adoption.',
  ];

  let postText = '';
  if (tone === 'professional') {
    postText = `Key strategic takeaways from ${eventName} in San Francisco 📊\n\nAttending sessions hosted by ${orgTag} highlighted three defining trends shaping the upcoming year:\n\n1️⃣ Autonomous agent frameworks are rapidly shifting from passive conversational chatbots to active collaborative teammates in product pipelines.\n2️⃣ Low-latency edge inference is unlocking real-time UI synthesis at true enterprise scale.\n3️⃣ The human-in-the-loop paradigm remains the decisive differentiator for trustworthy production adoption.\n\n${highlights}\n\nEager to exchange perspectives with engineering and product leaders. What is your team's priority for Q4?\n\n${tagsStr}`;
  } else if (tone === 'takeaways') {
    postText = `Three critical takeaways from ${eventName} Day 2: 💡\n\nHuge thank you to ${orgTag} for organizing an incredible conference. The key points that stood out:\n\n1️⃣ Autonomous agents are rapidly shifting from passive conversational chatbots to active collaborative teammates in product pipelines.\n2️⃣ Low-latency edge inference is unlocking real-time UI synthesis at true enterprise scale.\n3️⃣ The human-in-the-loop paradigm remains the decisive differentiator for trustworthy production adoption.\n\n${highlights}\n\nLooking forward to tomorrow's panels. If you're around Moscone Center, let's grab coffee!\n\n${tagsStr}`;
  } else {
    // Grateful Attendee
    postText = `Still buzzing from an energizing Day 2 at the ${eventName}! 🚀\n\nHuge thank you to ${orgTag} for curating such a world-class gathering. Three key takeaways that resonated deeply:\n\n1️⃣ Autonomous agents are rapidly shifting from passive conversational chatbots to active collaborative teammates in product pipelines.\n2️⃣ Low-latency edge inference is unlocking real-time UI synthesis at true enterprise scale.\n3️⃣ The human-in-the-loop paradigm remains the decisive differentiator for trustworthy production adoption.\n\n${highlights}\n\nIncredible reconnecting with brilliant founders, data engineers, and architects in San Francisco. If you're here, let's connect before tomorrow's closing reception!\n\n${tagsStr}`;
  }

  return { postText, bulletPoints };
}
