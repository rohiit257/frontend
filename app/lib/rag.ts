import { knowledgeBase } from './knowledge-base';
import { getWings9CorpusChunks } from './wings9-corpus';

/**
 * Enhanced RAG (Retrieval Augmented Generation) Implementation
 * 
 * This module handles:
 * 1. Converting knowledge base to searchable chunks
 * 2. Performing bounded local keyword retrieval
 * 3. Retrieving relevant context for queries
 * 
 * For production scaling, consider:
 * - Vector database (Pinecone, Weaviate, Qdrant)
 * - Provider-hosted embeddings or a local embedding model
 * - More sophisticated chunking strategies
 */

export interface KnowledgeChunk {
  id: string;
  text: string;
  type: 'ceo' | 'service' | 'company' | 'contact' | 'firm';
  metadata?: Record<string, unknown>;
  embedding?: number[];
}

type CompanyWithOptionalDetails = {
  name: string;
  description: string;
  focus: string;
  services?: readonly string[];
  targetAudience?: string;
};

/**
 * Convert knowledge base into searchable text chunks with rich context
 */
export function getKnowledgeChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  // CEO Profile (expanded with comprehensive details)
  chunks.push({
    id: 'ceo-1',
    text: `${knowledgeBase.ceo.name} is the ${knowledgeBase.ceo.role} behind ${knowledgeBase.ceo.company}. ${knowledgeBase.ceo.description} ${knowledgeBase.ceo.background || ''} His approach is ${knowledgeBase.ceo.approach}. Expertise areas: ${knowledgeBase.ceo.expertise.join(', ')}.`,
    type: 'ceo',
    metadata: { 
      name: knowledgeBase.ceo.name, 
      role: knowledgeBase.ceo.role,
      focus: knowledgeBase.ceo.focus,
      approach: knowledgeBase.ceo.approach,
      achievements: knowledgeBase.ceo.achievements,
      values: knowledgeBase.ceo.values
    }
  });

  // CEO Achievements
  if (knowledgeBase.ceo.achievements) {
    chunks.push({
      id: 'ceo-achievements',
      text: `Prakash Bhambhani's key achievements: ${knowledgeBase.ceo.achievements.join('. ')}.`,
      type: 'ceo',
      metadata: { achievements: knowledgeBase.ceo.achievements }
    });
  }

  if (knowledgeBase.ceo.notableClients) {
    chunks.push({
      id: 'ceo-notable-clients',
      text: `Prakash Bhambhani has served and supported reputed companies including ${knowledgeBase.ceo.notableClients.join(', ')}.`,
      type: 'ceo',
      metadata: { notableClients: knowledgeBase.ceo.notableClients }
    });
  }

  if (knowledgeBase.ceo.expansionAreas) {
    chunks.push({
      id: 'ceo-expansion-areas',
      text: `In recent years, Prakash Bhambhani has expanded into ${knowledgeBase.ceo.expansionAreas.join(', ')}.`,
      type: 'ceo',
      metadata: { expansionAreas: knowledgeBase.ceo.expansionAreas }
    });
  }

  // CEO Values
  if (knowledgeBase.ceo.values) {
    chunks.push({
      id: 'ceo-values',
      text: `Prakash Bhambhani's core values: ${knowledgeBase.ceo.values.join('. ')}.`,
      type: 'ceo',
      metadata: { values: knowledgeBase.ceo.values }
    });
  }

  // Firm Overview (expanded)
  chunks.push({
    id: 'firm-1',
    text: `${knowledgeBase.firm.name} (${knowledgeBase.firm.fullName || knowledgeBase.firm.name}) is a ${knowledgeBase.firm.nature} operating in ${knowledgeBase.firm.markets}. We serve ${knowledgeBase.firm.clients}. ${knowledgeBase.firm.valueProposition} ${knowledgeBase.firm.approach}`,
    type: 'firm',
    metadata: {
      name: knowledgeBase.firm.name,
      nature: knowledgeBase.firm.nature,
      markets: knowledgeBase.firm.markets,
      mission: knowledgeBase.firm.mission,
      vision: knowledgeBase.firm.vision
    }
  });

  // Firm Mission and Vision
  if (knowledgeBase.firm.mission) {
    chunks.push({
      id: 'firm-mission',
      text: `Wings9 Mission: ${knowledgeBase.firm.mission}. Vision: ${knowledgeBase.firm.vision || ''}.`,
      type: 'firm',
      metadata: { mission: knowledgeBase.firm.mission, vision: knowledgeBase.firm.vision }
    });
  }

  // Firm History and Track Record
  if (knowledgeBase.firm.history) {
    chunks.push({
      id: 'firm-history',
      text: `Wings9 History: ${knowledgeBase.firm.history}. Track Record: ${knowledgeBase.firm.trackRecord || ''}.`,
      type: 'firm',
      metadata: { history: knowledgeBase.firm.history, trackRecord: knowledgeBase.firm.trackRecord }
    });
  }

  if (knowledgeBase.firm.notableClients) {
    chunks.push({
      id: 'firm-notable-clients',
      text: `Wings9 Group has supported reputed companies including ${knowledgeBase.firm.notableClients.join(', ')}.`,
      type: 'firm',
      metadata: { notableClients: knowledgeBase.firm.notableClients }
    });
  }

  // Firm Specialties
  if (knowledgeBase.firm.specialties) {
    chunks.push({
      id: 'firm-specialties',
      text: `Wings9 Specialties: ${knowledgeBase.firm.specialties.join(', ')}.`,
      type: 'firm',
      metadata: { specialties: knowledgeBase.firm.specialties }
    });
  }

  // Why Choose Wings9
  if (knowledgeBase.whyChooseWings9) {
    chunks.push({
      id: 'why-choose-wings9',
      text: `Why choose Wings9: ${knowledgeBase.whyChooseWings9.join('. ')}.`,
      type: 'firm',
      metadata: { reasons: knowledgeBase.whyChooseWings9 }
    });
  }

  // Industries Served
  if (knowledgeBase.industriesServed) {
    chunks.push({
      id: 'industries-served',
      text: `Wings9 serves clients across these industries: ${knowledgeBase.industriesServed.join(', ')}.`,
      type: 'firm',
      metadata: { industries: knowledgeBase.industriesServed }
    });
  }

  // Common Use Cases
  if (knowledgeBase.commonUseCases) {
    chunks.push({
      id: 'common-use-cases',
      text: `Common use cases for Wings9 services: ${knowledgeBase.commonUseCases.join(', ')}.`,
      type: 'firm',
      metadata: { useCases: knowledgeBase.commonUseCases }
    });
  }

  // Services (with expanded context)
  knowledgeBase.services.forEach((service) => {
    chunks.push({
      id: `service-${service.id}`,
      text: `${service.name}: ${service.description} What it does: ${service.whatItDoes} Who it's for: ${service.whoItIsFor} When to consult: ${service.whenToConsult} Key features: ${service.keyFeatures.join(', ')}.`,
      type: 'service',
      metadata: { 
        serviceId: service.id, 
        serviceName: service.name,
        whatItDoes: service.whatItDoes,
        whoItIsFor: service.whoItIsFor,
        whenToConsult: service.whenToConsult,
        relatedServices: service.relatedServices
      }
    });
  });

  // Companies (expanded with detailed information)
  knowledgeBase.companies.forEach((company, index) => {
    const companyDetails = company as CompanyWithOptionalDetails;
    const servicesText = companyDetails.services ? `Services: ${companyDetails.services.join(', ')}.` : '';
    const audienceText = companyDetails.targetAudience ? `Target audience: ${companyDetails.targetAudience}.` : '';
    
    chunks.push({
      id: `company-${index}`,
      text: `${companyDetails.name}: ${companyDetails.description} Focus: ${companyDetails.focus}. ${servicesText} ${audienceText}`,
      type: 'company',
      metadata: { 
        companyName: companyDetails.name,
        focus: companyDetails.focus,
        services: companyDetails.services,
        targetAudience: companyDetails.targetAudience
      }
    });
  });

  // Contact Information (expanded)
  chunks.push({
    id: 'contact-1',
    text: `Contact information: Phone ${knowledgeBase.contact.phone}, WhatsApp ${knowledgeBase.contact.whatsapp || knowledgeBase.contact.phone}, Email ${knowledgeBase.contact.email}. Location: ${knowledgeBase.contact.location || 'UAE'}. ${knowledgeBase.contact.consultationNote} Availability: ${knowledgeBase.contact.availability || 'Available for consultations'}. Languages supported: ${knowledgeBase.contact.languages || 'English'}.`,
    type: 'contact',
    metadata: knowledgeBase.contact
  });

  // Primary Objective
  chunks.push({
    id: 'objective-1',
    text: `Primary objective: ${knowledgeBase.primaryObjective}`,
    type: 'firm',
    metadata: {}
  });

  // Add Wings9 Corpus chunks
  try {
    const corpusChunks = getWings9CorpusChunks();
    chunks.push(...corpusChunks);
    console.log(`Integrated ${corpusChunks.length} Wings9 corpus chunks into knowledge base`);
  } catch (error) {
    console.error('Failed to load Wings9 corpus chunks:', error);
  }

  return chunks;
}

/**
 * Find relevant chunks with local keyword scoring.
 */
export async function findRelevantChunks(
  query: string,
  chunks: KnowledgeChunk[],
  topK: number = 3
): Promise<KnowledgeChunk[]> {
  return findRelevantChunksKeyword(query, chunks, topK);
}

/**
 * Fallback keyword-based similarity search
 */
function findRelevantChunksKeyword(
  query: string,
  chunks: KnowledgeChunk[],
  topK: number = 3
): KnowledgeChunk[] {
  const queryLower = query.toLowerCase();
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'you', 'your', 'are', 'can', 'could', 'would',
    'what', 'when', 'where', 'which', 'who', 'why', 'how', 'about', 'tell',
    'give', 'need', 'want', 'does', 'have', 'from', 'that', 'this', 'there',
    'like', 'into', 'than', 'then', 'they', 'them', 'their', 'please'
  ]);
  const queryWords = queryLower
    .split(/[^a-z0-9+]+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (queryWords.length === 0) {
    return [];
  }

  const scoredChunks = chunks.map((chunk) => {
    const chunkLower = chunk.text.toLowerCase();
    let score = 0;

    // Exact phrase match (higher weight)
    if (queryLower.length > 4 && chunkLower.includes(queryLower)) {
      score += 10;
    }

    // Word matches
    queryWords.forEach((word) => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const count = (chunkLower.match(new RegExp(`\\b${escapedWord}\\b`, 'g')) || []).length;
      score += count;
    });

    // Service name matches
    if (chunk.type === 'service' && chunk.metadata?.serviceName) {
      const serviceName =
        typeof chunk.metadata.serviceName === 'string'
          ? chunk.metadata.serviceName.toLowerCase()
          : '';
      if (serviceName && (queryLower.includes(serviceName) || serviceName.includes(queryLower))) {
        score += 5;
      }
    }

    // Metadata matches
    if (chunk.metadata) {
      Object.values(chunk.metadata).forEach((value) => {
        if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
          score += 3;
        }
      });
    }

    return { chunk, score };
  });

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score >= 2)
    .slice(0, topK)
    .map((item) => item.chunk);
}

/**
 * Check if query is business-related
 */
export function isBusinessRelated(query: string): boolean {
  const businessKeywords = [
    'service', 'services', 'business', 'consulting', 'consultation',
    'real estate', 'property', 'marketing', 'accounting', 'tax',
    'legal', 'embassy', 'rental', 'dispute', 'venture', 'launch',
    'sez', 'economic zone', 'vat', 'poa', 'power of attorney',
    'company', 'companies', 'wings9', 'prakash', 'bhambhani',
    'help', 'information', 'about', 'what', 'how', 'where', 'when', 'why',
    'contact', 'phone', 'email', 'book', 'schedule', 'appointment',
    'advisory', 'advisors', 'guidance', 'support', 'assistance',
    'investment', 'investor', 'entrepreneur', 'startup', 'sme'
  ];

  const queryLower = query.toLowerCase();
  return businessKeywords.some((keyword) => queryLower.includes(keyword));
}

/**
 * Build context string from relevant chunks
 */
export function buildContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) {
    return '';
  }

  const contextParts = chunks.map((chunk) => {
    return `[${chunk.type.toUpperCase()}] ${chunk.text}`;
  });

  return contextParts.join('\n\n');
}
