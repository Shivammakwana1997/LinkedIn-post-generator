import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// In-memory campaign state
let campaignData = {
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

// API: Get Campaign Data
app.get('/api/campaign', (_req, res) => {
  res.json({ success: true, data: campaignData });
});

// API: Update Campaign Configuration
app.post('/api/campaign', (req, res) => {
  const { eventName, orgName, hashtags, socialChannels } = req.body;
  if (eventName) {
    campaignData.eventName = eventName;
    campaignData.shortName = eventName.split(' - ')[0] || eventName;
  }
  if (orgName) campaignData.orgName = orgName;
  if (Array.isArray(hashtags)) campaignData.hashtags = hashtags;
  if (socialChannels) {
    campaignData.socialChannels = {
      ...campaignData.socialChannels,
      ...socialChannels,
    };
  }
  res.json({ success: true, data: campaignData });
});

// API: Generate Post with Gemini / Algorithmic fallback
app.post('/api/generate-post', async (req, res) => {
  try {
    const {
      highlights = '',
      tone = 'grateful',
      eventName = campaignData.shortName,
      orgName = campaignData.orgName,
      hashtags = campaignData.hashtags,
      includeHashtags = true,
      tagOrganizers = true,
      author = { name: 'Sarah Jenkins', role: 'VP of Product Engineering' },
    } = req.body;

    const orgMention = tagOrganizers ? `@${orgName.split(' ')[0] || 'TechPulse Media'}` : orgName;
    const tagsString = includeHashtags ? hashtags.join(' ') + ' #ArtificialIntelligence' : '';

    let generatedText = '';
    let bulletPoints: string[] = [];

    // Attempt Gemini Generation
    if (aiClient) {
      try {
        const toneDirectives: Record<string, string> = {
          professional: 'Authoritative, analytical, data-driven executive tone. Focus on business impact, scalable architecture, and enterprise trends.',
          grateful: 'Warm, appreciative, inspiring community tone. Express gratitude to organizers, spotlight memorable speakers, and emphasize relationship building.',
          takeaways: 'Structured, actionable bulleted executive summary. 3 numbered key learnings with bold headers and concise takeaways.',
        };

        const prompt = `You are an executive ghostwriter generating a viral, authentic, high-impact LinkedIn post for a conference attendee.
Event: ${eventName}
Organizer: ${orgName} (tag: ${orgMention})
Attendee: ${author.name}, ${author.role}
Attendee Highlights & Raw Notes: "${highlights}"
Selected Post Persona/Tone: ${tone} (${toneDirectives[tone] || toneDirectives.grateful})
Include Tag: ${tagOrganizers ? `Please tag ${orgMention}` : 'Do not tag'}
Hashtags to append at bottom: ${tagsString}

Formatting Guidelines:
1. Hook: Start with a 1-2 sentence punchy opener that stops the feed scroll (use 1 relevant emoji if fitting).
2. Context: Mention ${eventName} and thank ${orgMention}.
3. Core Insights: 3 structured bullet points numbered with 1️⃣ 2️⃣ 3️⃣. Each bullet should have a bold topic followed by a crisp insight.
4. Closing: Friendly networking call-to-action inviting fellow attendees or network peers to connect.
5. Hashtags: End with the provided hashtags on a clean final line.

Respond with ONLY the plain post text (no markdown code blocks, no backticks, no meta-explanation).`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.7,
            topP: 0.9,
          },
        });

        if (response && response.text) {
          generatedText = response.text.trim();
        }
      } catch (geminiError) {
        console.warn('Gemini generation failed, falling back to algorithmic template:', geminiError);
      }
    }

    // High-quality fallback generator if Gemini is unavailable or failed
    if (!generatedText) {
      const trimmedNotes = highlights.trim() || 'Incredible keynote sessions on the future of autonomous systems and collaborative AI!';

      if (tone === 'professional') {
        bulletPoints = [
          '**Autonomous agent frameworks** are shifting from speculative demos to mission-critical infrastructure across enterprise stacks.',
          '**Sub-100ms inference pipelines** are eliminating cognitive friction in real-time user experiences.',
          '**Responsible AI telemetry** has become a board-level imperative, separating durable products from novelty tools.',
        ];
        generatedText = `Key strategic takeaways from ${eventName} in San Francisco 📊\n\nAttending sessions hosted by ${orgMention} underscored three pivotal shifts every engineering and product leader should track:\n\n1️⃣ ${bulletPoints[0]}\n2️⃣ ${bulletPoints[1]}\n3️⃣ ${bulletPoints[2]}\n\n${trimmedNotes}\n\nEager to exchange perspectives with peers building at this frontier. How is your team approaching agent reliability this quarter?\n\n${tagsString}`;
      } else if (tone === 'takeaways') {
        bulletPoints = [
          '**Autonomous agents** are rapidly shifting from passive conversational chatbots to active collaborative teammates in product pipelines.',
          '**Low-latency edge inference** is unlocking real-time UI synthesis at true enterprise scale.',
          'The **human-in-the-loop paradigm** remains the decisive differentiator for trustworthy production adoption.',
        ];
        generatedText = `Three critical lessons that resonated deeply at ${eventName}: 💡\n\nKudos to ${orgMention} for curating an unforgettable lineup of builders and researchers. My top 3 notes from Day 2:\n\n1️⃣ ${bulletPoints[0]}\n2️⃣ ${bulletPoints[1]}\n3️⃣ ${bulletPoints[2]}\n\n${trimmedNotes}\n\nLeaving the Moscone Center inspired by the sheer velocity of the ecosystem. If you're attending, let's connect before tomorrow's sessions!\n\n${tagsString}`;
      } else {
        // Grateful Attendee (default)
        bulletPoints = [
          '**Autonomous agents** are rapidly shifting from passive conversational chatbots to active collaborative teammates in product pipelines.',
          '**Low-latency edge inference** is unlocking real-time UI synthesis at true enterprise scale.',
          'The **human-in-the-loop paradigm** remains the decisive differentiator for trustworthy production adoption.',
        ];
        generatedText = `Still buzzing from an energizing Day 2 at the ${eventName}! 🚀\n\nHuge thank you to ${orgMention} for curating such a world-class gathering. Three key takeaways that resonated deeply:\n\n1️⃣ ${bulletPoints[0]}\n2️⃣ ${bulletPoints[1]}\n3️⃣ ${bulletPoints[2]}\n\n${trimmedNotes}\n\nIncredible reconnecting with brilliant founders, data engineers, and architects in San Francisco. If you're here, let's connect before tomorrow's closing reception!\n\n${tagsString}`;
      }
    }

    // Increment post count
    campaignData.metrics.totalPosts += 1;
    const reachNum = 342.5 + 0.3;
    campaignData.metrics.estimatedReach = `${reachNum.toFixed(1)}K`;

    // Add to top of liveStream
    const newFeedItem = {
      id: `post-${Date.now()}`,
      author: author.name,
      role: author.role,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Tgg_9QNVQ4WPSfUmhDq_xggIh-YklTfnwQbImGQJk3v2p-GX4oMJZYtmSFM5hrAiD0peW92WuppMYqGM-qivVanl0oGECpwwKNqZO_j94tbTmqT_UszYSSro7t5eWSUIsS37-91cN4g87RG97MPz90wSnz1axFFYRSM8qmf8Ry9RVb9Qm_TM6FpPJdcyyp17KsYPbVVGSBs8rRTnoi2uvKxUMJ9xW5KHpxfXkJEXtB7sIf-nqTFWsw',
      timestamp: 'Just now',
      category: tone === 'grateful' ? 'Grateful Attendee' : tone === 'professional' ? 'Executive Insight' : 'Key Takeaways',
      tagColor: tone === 'grateful' ? 'tertiary-fixed' : 'primary-fixed',
      content: generatedText.slice(0, 140) + '...',
      fullText: generatedText,
      likes: 1,
      comments: 0,
    };
    campaignData.liveStream.unshift(newFeedItem);
    if (campaignData.liveStream.length > 20) {
      campaignData.liveStream.pop();
    }

    res.json({
      success: true,
      postText: generatedText,
      bulletPoints,
      hashtags,
      metrics: campaignData.metrics,
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    res.status(500).json({ success: false, error: error.message || 'Generation failed' });
  }
});

// Start server
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventPulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
