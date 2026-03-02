/**
 * Ayrshare Social Media Integration
 * 
 * Features:
 * - Create user profiles for contractors
 * - Generate social linking URLs (SSO)
 * - Fetch DMs from Facebook/Instagram/X
 * - Post on behalf of contractors
 * - Get analytics
 */

const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY || '';
const AYRSHARE_BASE_URL = 'https://api.ayrshare.com';

interface AyrshareResponse {
  status?: string;
  profileKey?: string;
  title?: string;
  url?: string;
  id?: string;
  errors?: any[];
}

interface CreateProfileParams {
  title: string;  // Contractor name
  refId?: string; // Our contractor ID
}

interface PostParams {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduleDate?: string;
  profileKey?: string;
}

interface Message {
  id: string;
  platform: string;
  correspondent: {
    id: string;
    name: string;
    username?: string;
  };
  message: string;
  timestamp: string;
  direction: 'sent' | 'received';
}

// Helper for API calls
async function ayrshareRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  profileKey?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
  };
  
  if (profileKey) {
    headers['Profile-Key'] = profileKey;
  }
  
  const response = await fetch(`${AYRSHARE_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return response.json();
}

/**
 * Create a user profile for a contractor
 * Each contractor gets their own Ayrshare profile
 */
export async function createContractorProfile(params: CreateProfileParams): Promise<AyrshareResponse> {
  return ayrshareRequest('/api/profiles/profile', 'POST', {
    title: params.title,
    refId: params.refId,
  });
}

/**
 * Get all user profiles
 */
export async function getProfiles(): Promise<any[]> {
  const response = await ayrshareRequest('/api/profiles');
  return response.profiles || [];
}

/**
 * Generate a JWT URL for a contractor to link their social accounts
 * This creates a secure SSO link
 */
export async function generateSocialLinkUrl(profileKey: string): Promise<string> {
  const response = await ayrshareRequest('/api/profiles/generateJWT', 'POST', {
    profileKey,
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'contractorverifiedatx.com',
  });
  
  return response.url || '';
}

/**
 * Get linked social accounts for a profile
 */
export async function getLinkedAccounts(profileKey: string): Promise<any> {
  return ayrshareRequest('/api/user', 'GET', undefined, profileKey);
}

/**
 * Post to social media on behalf of a contractor
 */
export async function postToSocial(params: PostParams): Promise<AyrshareResponse> {
  return ayrshareRequest('/api/post', 'POST', {
    post: params.post,
    platforms: params.platforms,
    mediaUrls: params.mediaUrls,
    scheduleDate: params.scheduleDate,
  }, params.profileKey);
}

/**
 * Get DMs/Messages for a contractor's linked accounts
 * Supports: Facebook, Instagram, X
 */
export async function getMessages(profileKey: string, platform?: string): Promise<Message[]> {
  const params = new URLSearchParams();
  if (platform) params.append('platform', platform);
  
  const response = await ayrshareRequest(
    `/api/messages${params.toString() ? '?' + params.toString() : ''}`,
    'GET',
    undefined,
    profileKey
  );
  
  return response.messages || [];
}

/**
 * Get all conversations for a profile
 */
export async function getConversations(profileKey: string): Promise<any[]> {
  const response = await ayrshareRequest('/api/messages/conversations', 'GET', undefined, profileKey);
  return response.conversations || [];
}

/**
 * Send a DM on behalf of a contractor
 */
export async function sendMessage(
  profileKey: string,
  platform: string,
  correspondentId: string,
  message: string
): Promise<AyrshareResponse> {
  return ayrshareRequest('/api/messages', 'POST', {
    platform,
    correspondentId,
    message,
  }, profileKey);
}

/**
 * Get analytics for a contractor's social accounts
 */
export async function getAnalytics(profileKey: string, platform?: string): Promise<any> {
  const params = new URLSearchParams();
  if (platform) params.append('platform', platform);
  
  return ayrshareRequest(
    `/api/analytics/social${params.toString() ? '?' + params.toString() : ''}`,
    'GET',
    undefined,
    profileKey
  );
}

/**
 * Get post history for a contractor
 */
export async function getPostHistory(profileKey: string): Promise<any[]> {
  const response = await ayrshareRequest('/api/history', 'GET', undefined, profileKey);
  return response.history || [];
}

/**
 * Mine leads from DMs
 * Analyzes messages to extract potential leads
 */
export async function mineLeadsFromDMs(profileKey: string): Promise<any[]> {
  const messages = await getMessages(profileKey);
  
  // Filter for received messages that look like leads
  const leadKeywords = [
    'quote', 'estimate', 'price', 'cost', 'available', 'hire', 
    'need', 'looking for', 'service', 'help', 'job', 'project',
    'when can', 'how much', 'do you do'
  ];
  
  const potentialLeads = messages
    .filter(m => m.direction === 'received')
    .filter(m => {
      const msgLower = m.message.toLowerCase();
      return leadKeywords.some(kw => msgLower.includes(kw));
    })
    .map(m => ({
      source: `${m.platform}_dm`,
      correspondent: m.correspondent,
      message: m.message,
      timestamp: m.timestamp,
      platform: m.platform,
    }));
  
  return potentialLeads;
}

/**
 * Set up webhook for real-time message notifications
 */
export async function registerMessageWebhook(webhookUrl: string): Promise<AyrshareResponse> {
  return ayrshareRequest('/api/webhooks', 'POST', {
    action: 'messages',
    url: webhookUrl,
  });
}

export default {
  createContractorProfile,
  getProfiles,
  generateSocialLinkUrl,
  getLinkedAccounts,
  postToSocial,
  getMessages,
  getConversations,
  sendMessage,
  getAnalytics,
  getPostHistory,
  mineLeadsFromDMs,
  registerMessageWebhook,
};
