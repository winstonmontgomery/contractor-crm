/**
 * CONTRACTOR VERIFIED - Lead Scoring & Matching Engine
 * 
 * Lead Score Formula:
 * base_score (100) 
 * - recency_penalty (hours_old * 2)
 * + engagement_bonus (likes * 5 + comments * 3)
 * + urgency_multiplier (from service category)
 * + seasonal_bonus (if service matches current season)
 */

export interface Lead {
  id: number;
  name: string;
  location: string;
  service_needed: string;
  service_category: string;
  hours_since_post: number;
  engagement_likes: number;
  engagement_comments: number;
  urgency?: 'urgent' | 'normal' | 'flexible';
}

export interface Contractor {
  id: number;
  name: string;
  service_categories: string;
  location: string;
  service_radius_miles: number;
  verification_level: string;
  avg_rating: number;
  win_rate: number;
  response_time_hours: number;
}

// Service urgency multipliers
const URGENCY_MULTIPLIERS: Record<string, number> = {
  'HVAC': 1.5,           // Critical in extreme weather
  'Plumbing': 1.3,       // Water damage = urgent
  'Electrical': 1.2,     // Safety concern
  'Roofing': 1.4,        // Weather exposure
  'Appliance Repair': 1.2,
  'Gutters': 1.1,
  'Concrete/Driveway': 1.0,
  'Masonry': 1.0,
  'Painting': 0.8,
  'Flooring': 0.9,
  'Landscaping': 0.7,
  'Moving': 0.9,
  'General Contracting': 1.0,
};

// Seasonal peaks (month ranges)
const SEASONAL_PEAKS: Record<string, number[]> = {
  'HVAC': [5, 6, 7, 8, 12, 1, 2],  // Summer + Winter
  'Roofing': [3, 4, 5, 9, 10],     // Spring + Fall
  'Landscaping': [3, 4, 5, 6],    // Spring
  'Pool/Spa': [3, 4, 5],          // Pre-summer
  'Gutters': [9, 10, 11],         // Fall
};

/**
 * Calculate lead score (0-200 scale)
 */
export function calculateLeadScore(lead: Lead): { score: number; temperature: string; factors: string[] } {
  const factors: string[] = [];
  let score = 100; // Base score
  
  // 1. Recency penalty (-2 per hour, max -48)
  const recencyPenalty = Math.min(lead.hours_since_post * 2, 48);
  score -= recencyPenalty;
  if (lead.hours_since_post <= 2) {
    factors.push('🔥 Fresh lead (<2 hours)');
  }
  
  // 2. Engagement bonus
  const engagementBonus = (lead.engagement_likes * 5) + (lead.engagement_comments * 3);
  score += engagementBonus;
  if (engagementBonus > 20) {
    factors.push('📈 High engagement');
  }
  
  // 3. Urgency multiplier
  const urgencyMult = URGENCY_MULTIPLIERS[lead.service_category] || 1.0;
  if (urgencyMult > 1.2) {
    score *= urgencyMult;
    factors.push(`⚡ High-urgency service (${lead.service_category})`);
  }
  
  // 4. Seasonal bonus
  const currentMonth = new Date().getMonth() + 1;
  const peakMonths = SEASONAL_PEAKS[lead.service_category];
  if (peakMonths && peakMonths.includes(currentMonth)) {
    score += 15;
    factors.push('📅 Peak season demand');
  }
  
  // 5. Manual urgency override
  if (lead.urgency === 'urgent') {
    score *= 1.3;
    factors.push('🚨 Marked urgent by poster');
  }
  
  // Determine temperature
  let temperature: string;
  if (score >= 120) {
    temperature = 'hot';
  } else if (score >= 80) {
    temperature = 'warm';
  } else {
    temperature = 'cold';
  }
  
  return {
    score: Math.round(score),
    temperature,
    factors
  };
}

/**
 * Calculate match score between lead and contractor (0-100)
 */
export function calculateMatchScore(lead: Lead, contractor: Contractor): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  
  // 1. Service category match (0-40 points)
  const contractorCategories = contractor.service_categories.toLowerCase().split(',');
  const leadCategory = lead.service_category.toLowerCase();
  
  if (contractorCategories.some(cat => cat.trim() === leadCategory)) {
    score += 40;
    reasons.push('✅ Exact service match');
  } else if (contractorCategories.some(cat => leadCategory.includes(cat.trim()) || cat.trim().includes(leadCategory))) {
    score += 25;
    reasons.push('⚠️ Partial service match');
  }
  
  // 2. Location proximity (0-25 points)
  // Simple heuristic: same city = 25, same region = 15, different = 5
  const leadLoc = lead.location.toLowerCase();
  const contractorLoc = contractor.location.toLowerCase();
  
  if (leadLoc.includes(contractorLoc) || contractorLoc.includes(leadLoc)) {
    score += 25;
    reasons.push('📍 Same location');
  } else if (leadLoc.includes('austin') && contractorLoc.includes('austin')) {
    score += 25;
    reasons.push('📍 Austin area');
  } else if (leadLoc.includes('tx') || contractorLoc.includes('tx')) {
    score += 15;
    reasons.push('📍 Texas region');
  } else {
    score += 5;
  }
  
  // 3. Verification level (0-15 points)
  const verificationPoints: Record<string, number> = {
    'elite': 15,
    'pro': 12,
    'verified': 10,
    'basic': 5,
  };
  score += verificationPoints[contractor.verification_level] || 5;
  if (contractor.verification_level !== 'basic') {
    reasons.push(`🏅 ${contractor.verification_level.toUpperCase()} contractor`);
  }
  
  // 4. Rating bonus (0-10 points)
  if (contractor.avg_rating >= 4.5) {
    score += 10;
    reasons.push(`⭐ ${contractor.avg_rating} rating`);
  } else if (contractor.avg_rating >= 4.0) {
    score += 7;
  } else if (contractor.avg_rating > 0) {
    score += 3;
  }
  
  // 5. Win rate bonus (0-10 points)
  score += Math.round(contractor.win_rate * 10);
  if (contractor.win_rate >= 0.5) {
    reasons.push(`🎯 ${Math.round(contractor.win_rate * 100)}% win rate`);
  }
  
  return { score, reasons };
}

/**
 * Find best contractor matches for a lead
 */
export function findMatches(lead: Lead, contractors: Contractor[], limit: number = 3): Array<{
  contractor: Contractor;
  matchScore: number;
  reasons: string[];
}> {
  const matches = contractors
    .map(contractor => {
      const { score, reasons } = calculateMatchScore(lead, contractor);
      return { contractor, matchScore: score, reasons };
    })
    .filter(m => m.matchScore >= 40) // Minimum threshold
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
  
  return matches;
}

/**
 * Prioritize leads for outreach
 */
export function prioritizeLeads(leads: Lead[]): Lead[] {
  return leads
    .map(lead => ({
      ...lead,
      _score: calculateLeadScore(lead).score
    }))
    .sort((a, b) => (b as any)._score - (a as any)._score);
}
