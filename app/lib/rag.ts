import { knowledgeBase } from './knowledge-base';
import OpenAI from 'openai';

/**
 * Enhanced RAG (Retrieval Augmented Generation) Implementation
 * 
 * This module handles:
 * 1. Converting knowledge base to searchable chunks
 * 2. Generating embeddings using OpenAI
 * 3. Performing similarity search with cosine similarity
 * 4. Retrieving relevant context for queries
 * 
 * For production scaling, consider:
 * - Vector database (Pinecone, Weaviate, Qdrant)
 * - Batch embedding generation and caching
 * - More sophisticated chunking strategies
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface KnowledgeChunk {
  id: string;
  text: string;
  type: 'ceo' | 'service' | 'company' | 'contact' | 'firm';
  metadata?: Record<string, any>;
  embedding?: number[];
}

// Cache for embeddings (in production, use a proper vector database)
let chunkEmbeddingsCache: Map<string, number[]> | null = null;
let queryEmbeddingsCache: Map<string, number[]> = new Map();

// Flag to disable embedding generation if quota is exceeded
let embeddingQuotaExceeded = false;

/**
 * Generate embeddings for a text using OpenAI (with caching)
 */
async function generateEmbedding(text: string, useCache: boolean = true): Promise<number[]> {
  // Skip embedding generation if quota is exceeded
  if (embeddingQuotaExceeded) {
    return [];
  }

  // Check cache first
  if (useCache && queryEmbeddingsCache.has(text)) {
    return queryEmbeddingsCache.get(text)!;
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // Cost-effective and performant
      input: text,
    });
    const embedding = response.data[0].embedding;
    
    // Cache the embedding
    if (useCache) {
      queryEmbeddingsCache.set(text, embedding);
      // Limit cache size to prevent memory issues
      if (queryEmbeddingsCache.size > 100) {
        const firstKey = queryEmbeddingsCache.keys().next().value;
        if (firstKey) {
          queryEmbeddingsCache.delete(firstKey);
        }
      }
    }
    
    return embedding;
  } catch (error: any) {
    // Check for quota/rate limit errors
    if (error?.status === 429 || error?.code === 'insufficient_quota' || error?.type === 'insufficient_quota') {
      console.warn('OpenAI quota exceeded, disabling embedding generation and using keyword search');
      embeddingQuotaExceeded = true;
      return [];
    }
    console.error('Embedding generation error:', error);
    // Fallback to keyword-based search if embeddings fail
    return [];
  }
}

/**
 * Generate embeddings in batch (much faster)
 */
async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  // Skip if quota is exceeded
  if (embeddingQuotaExceeded) {
    return [];
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    return response.data.map(item => item.embedding);
  } catch (error: any) {
    // Check for quota/rate limit errors
    if (error?.status === 429 || error?.code === 'insufficient_quota' || error?.type === 'insufficient_quota') {
      console.warn('OpenAI quota exceeded, disabling embedding generation and using keyword search');
      embeddingQuotaExceeded = true;
      return [];
    }
    console.error('Batch embedding generation error:', error);
    return [];
  }
}

/**
 * Calculate cosine similarity between two vectors (optimized)
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  // Optimized loop with early exit potential
  const len = a.length;
  for (let i = 0; i < len; i++) {
    const ai = a[i];
    const bi = b[i];
    dotProduct += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  
  const denominator = Math.sqrt(normA * normB);
  return denominator > 0 ? dotProduct / denominator : 0;
}

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
    const servicesText = (company as any).services ? `Services: ${(company as any).services.join(', ')}.` : '';
    const audienceText = (company as any).targetAudience ? `Target audience: ${(company as any).targetAudience}.` : '';
    
    chunks.push({
      id: `company-${index}`,
      text: `${company.name}: ${company.description} Focus: ${company.focus}. ${servicesText} ${audienceText}`,
      type: 'company',
      metadata: { 
        companyName: company.name,
        focus: company.focus,
        services: (company as any).services,
        targetAudience: (company as any).targetAudience
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

  return chunks;
}

/**
 * Generate embeddings for all chunks (with caching and batch processing)
 */
export async function generateChunkEmbeddings(chunks: KnowledgeChunk[]): Promise<Map<string, number[]>> {
  if (chunkEmbeddingsCache) {
    return chunkEmbeddingsCache;
  }

  const embeddings = new Map<string, number[]>();
  
  // Batch process embeddings for faster generation (process in batches of 20)
  const batchSize = 20;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const texts = batch.map(chunk => chunk.text);
    
    try {
      const batchEmbeddings = await generateEmbeddingsBatch(texts);
      batch.forEach((chunk, index) => {
        if (batchEmbeddings[index] && batchEmbeddings[index].length > 0) {
          embeddings.set(chunk.id, batchEmbeddings[index]);
        }
      });
    } catch (error) {
      console.error('Batch embedding error, falling back to individual:', error);
      // Fallback to individual if batch fails
      for (const chunk of batch) {
        const embedding = await generateEmbedding(chunk.text, false);
        if (embedding.length > 0) {
          embeddings.set(chunk.id, embedding);
        }
      }
    }
  }

  chunkEmbeddingsCache = embeddings;
  return embeddings;
}

/**
 * Find relevant chunks using OpenAI embeddings and cosine similarity (optimized)
 */
export async function findRelevantChunks(
  query: string,
  chunks: KnowledgeChunk[],
  topK: number = 3
): Promise<KnowledgeChunk[]> {
  try {
    // If quota is exceeded, use keyword search directly
    if (embeddingQuotaExceeded) {
      return findRelevantChunksKeyword(query, chunks, topK);
    }

    // Quick keyword pre-filter to reduce embedding computation
    const keywordFiltered = findRelevantChunksKeyword(query, chunks, topK * 3);
    const chunksToSearch = keywordFiltered.length > 0 ? keywordFiltered : chunks;

    // Generate query embedding (with cache)
    const queryEmbedding = await generateEmbedding(query);
    
    if (queryEmbedding.length === 0) {
      // Fallback to keyword-based search if embeddings fail
      return keywordFiltered.length > 0 ? keywordFiltered.slice(0, topK) : findRelevantChunksKeyword(query, chunks, topK);
    }

    // Generate or retrieve chunk embeddings (cached after first call)
    const chunkEmbeddings = await generateChunkEmbeddings(chunksToSearch);

    // If no chunk embeddings available (quota exceeded during generation), use keyword search
    if (chunkEmbeddings.size === 0) {
      return keywordFiltered.length > 0 ? keywordFiltered.slice(0, topK) : findRelevantChunksKeyword(query, chunks, topK);
    }

    // Calculate similarity scores (optimized)
    const scoredChunks = chunksToSearch
      .map((chunk) => {
        const chunkEmbedding = chunkEmbeddings.get(chunk.id);
        if (!chunkEmbedding) {
          return { chunk, score: 0 };
        }
        const score = cosineSimilarity(queryEmbedding, chunkEmbedding);
        return { chunk, score };
      })
      .filter((item) => item.score > 0.25) // Lower threshold for better recall
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    // If we got good results, return them; otherwise fallback to keyword
    if (scoredChunks.length > 0) {
      return scoredChunks.map((item) => item.chunk);
    }

    return keywordFiltered.length > 0 ? keywordFiltered.slice(0, topK) : findRelevantChunksKeyword(query, chunks, topK);
  } catch (error) {
    console.error('Embedding-based search error, falling back to keyword search:', error);
    return findRelevantChunksKeyword(query, chunks, topK);
  }
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
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  const scoredChunks = chunks.map((chunk) => {
    const chunkLower = chunk.text.toLowerCase();
    let score = 0;

    // Exact phrase match (higher weight)
    if (chunkLower.includes(queryLower)) {
      score += 10;
    }

    // Word matches
    queryWords.forEach((word) => {
      const count = (chunkLower.match(new RegExp(word, 'g')) || []).length;
      score += count;
    });

    // Service name matches
    if (chunk.type === 'service' && chunk.metadata?.serviceName) {
      const serviceName = chunk.metadata.serviceName.toLowerCase();
      if (queryLower.includes(serviceName) || serviceName.includes(queryLower)) {
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
    .filter((item) => item.score > 0)
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
