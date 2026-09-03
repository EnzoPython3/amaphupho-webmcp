export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  webSearchQueries?: string[];
}

export interface AnalysisResult {
  id?: number | string;
  title: string;
  text: string;
  groundingMetadata?: GroundingMetadata;
  timestamp: string;
}

export type InputMethod = 'text' | 'audio';

export interface DreamRecord {
  id: number | string;
  dream_input: string;
  dream_title?: string;
  interpretation: string;
  created_at: string;
  user_id?: string;
  is_favourite?: boolean;
}
