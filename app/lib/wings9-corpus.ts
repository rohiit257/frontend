import { KnowledgeChunk } from './rag';
import fs from 'fs';
import path from 'path';

/**
 * Wings9 Q&A Corpus Loader
 * 
 * Loads the comprehensive Wings9 Q&A corpus and converts it into
 * knowledge chunks compatible with the RAG system.
 */

interface QnAPair {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  related_links: string[];
}

interface CorpusData {
  corpus_metadata: {
    title: string;
    version: string;
    created_date: string;
    description: string;
    total_questions: number;
    categories: string[];
  };
  qna_pairs: QnAPair[];
}

let cachedCorpusChunks: KnowledgeChunk[] | null = null;

/**
 * Load the Wings9 Q&A corpus from the public directory
 */
function loadCorpus(): CorpusData | null {
  try {
    const corpusPath = path.join(process.cwd(), 'public', 'wings9_qna_corpus.json');
    const corpusData = fs.readFileSync(corpusPath, 'utf-8');
    return JSON.parse(corpusData) as CorpusData;
  } catch (error) {
    console.error('Failed to load Wings9 corpus:', error);
    return null;
  }
}

/**
 * Convert Q&A pairs into knowledge chunks
 */
export function getWings9CorpusChunks(): KnowledgeChunk[] {
  // Return cached chunks if available
  if (cachedCorpusChunks) {
    return cachedCorpusChunks;
  }

  const corpus = loadCorpus();
  if (!corpus) {
    console.warn('Wings9 corpus not loaded, returning empty chunks');
    return [];
  }

  const chunks: KnowledgeChunk[] = [];

  corpus.qna_pairs.forEach((qna) => {
    // Create a comprehensive text combining question and answer
    const text = `Question: ${qna.question}\n\nAnswer: ${qna.answer}`;
    
    // Determine chunk type based on category
    let chunkType: 'ceo' | 'service' | 'company' | 'contact' | 'firm' = 'firm';
    
    if (qna.category.includes('leadership') || qna.category.includes('ceo')) {
      chunkType = 'ceo';
    } else if (qna.category.includes('service')) {
      chunkType = 'service';
    } else if (qna.category.includes('company_overview')) {
      chunkType = 'company';
    } else if (qna.category.includes('contact')) {
      chunkType = 'contact';
    }

    chunks.push({
      id: `corpus-${qna.id}`,
      text: text,
      type: chunkType,
      metadata: {
        corpusId: qna.id,
        category: qna.category,
        question: qna.question,
        answer: qna.answer,
        keywords: qna.keywords,
        relatedLinks: qna.related_links,
      },
    });
  });

  // Cache the chunks
  cachedCorpusChunks = chunks;
  
  console.log(`Loaded ${chunks.length} chunks from Wings9 corpus`);
  return chunks;
}

/**
 * Search corpus by category
 */
export function searchCorpusByCategory(category: string): KnowledgeChunk[] {
  const chunks = getWings9CorpusChunks();
  return chunks.filter((chunk) => chunk.metadata?.category === category);
}

/**
 * Search corpus by keywords
 */
export function searchCorpusByKeywords(keywords: string[]): KnowledgeChunk[] {
  const chunks = getWings9CorpusChunks();
  const keywordsLower = keywords.map((k) => k.toLowerCase());
  
  return chunks.filter((chunk) => {
    const chunkKeywords = (chunk.metadata?.keywords || []) as string[];
    return chunkKeywords.some((kw) => 
      keywordsLower.some((searchKw) => kw.toLowerCase().includes(searchKw))
    );
  });
}

/**
 * Get all available categories
 */
export function getCorpusCategories(): string[] {
  const corpus = loadCorpus();
  return corpus?.corpus_metadata.categories || [];
}

/**
 * Get corpus metadata
 */
export function getCorpusMetadata() {
  const corpus = loadCorpus();
  return corpus?.corpus_metadata || null;
}
