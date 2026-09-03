import { analyzeDream } from './geminiService';
import { supabase } from './supabaseClient';
import dreamSymbols, { DreamSymbol } from '../data/dreamSymbols';
import { DreamRecord } from '../types';

type ToolDefinition = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (args: any) => Promise<unknown> | unknown;
};

type ModelContext = {
  registerTool: (definition: ToolDefinition) => Promise<void>;
};

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
}

const SUPPORTED_LANGUAGES = ['English', 'isiZulu', 'Sesotho'] as const;

const normalise = (value: string) => value.trim().toLowerCase();

const scoreSymbol = (symbol: DreamSymbol, query: string) => {
  const q = normalise(query);
  if (!q) return 0;

  const english = normalise(symbol.english);
  const zulu = normalise(symbol.zulu);
  const slug = normalise(symbol.slug.replace(/-/g, ' '));
  const meaning = normalise(symbol.meaning);
  const expanded = normalise(symbol.expanded);

  if (english === q || zulu === q || slug === q) return 100;
  if (english.startsWith(q) || zulu.startsWith(q) || slug.startsWith(q)) return 80;
  if (english.includes(q) || zulu.includes(q) || slug.includes(q)) return 60;
  if (meaning.includes(q)) return 30;
  if (expanded.includes(q)) return 10;
  return 0;
};

const jsonResult = (value: Record<string, unknown>) => JSON.stringify(value, null, 2);

const showAgentCompletion = (title: string) => {
  window.dispatchEvent(
    new CustomEvent('amaphupho:webmcp-complete', {
      detail: { title },
    })
  );
};

const registerInterpretDream = async (modelContext: ModelContext) => {
  await modelContext.registerTool({
    name: 'interpret_dream',
    title: 'Interpret a dream with Amaphupho',
    description:
      "Interpret a dream using Amaphupho's African cultural dream interpretation service. Requires an Amaphupho sign in. This action consumes one normal interpretation credit and saves the completed interpretation to the user's private dream journal.",
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        dream: {
          type: 'string',
          minLength: 1,
          maxLength: 5000,
          description: "The dream to interpret, in the dreamer's own words.",
        },
        language: {
          type: 'string',
          enum: SUPPORTED_LANGUAGES,
          description: 'Language for the interpretation output. Defaults to English.',
        },
      },
      required: ['dream'],
    },
    annotations: {
      readOnlyHint: false,
      untrustedContentHint: true,
    },
    async execute(args: { dream: string; language?: string }) {
      const dream = args.dream?.trim();
      if (!dream) return jsonResult({ error: 'A dream is required.' });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        return jsonResult({
          error: 'Sign in to Amaphupho before requesting an interpretation.',
          requiresSignIn: true,
        });
      }

      const language = SUPPORTED_LANGUAGES.includes(args.language as (typeof SUPPORTED_LANGUAGES)[number])
        ? args.language!
        : 'English';

      const result = await analyzeDream(dream, 'text', language);
      showAgentCompletion(result.title);

      return jsonResult({
        id: result.id,
        title: result.title,
        interpretation: result.text,
        savedToJournal: Boolean(result.id),
        timestamp: result.timestamp,
        groundingMetadata: result.groundingMetadata,
      });
    },
  });
};

const registerSearchSymbols = async (modelContext: ModelContext) => {
  await modelContext.registerTool({
    name: 'search_dream_symbols',
    title: 'Search African dream symbols',
    description:
      "Search Amaphupho's curated African dream symbol glossary for culturally grounded meanings, Zulu names, related symbols and glossary pages. Use this for symbol research without creating or saving a dream interpretation.",
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        query: {
          type: 'string',
          minLength: 1,
          maxLength: 120,
          description: 'A dream symbol or concept, for example snake, water, ancestors or amadlozi.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 10,
          default: 5,
          description: 'Maximum number of matching symbols to return.',
        },
      },
      required: ['query'],
    },
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: false,
    },
    execute(args: { query: string; limit?: number }) {
      const query = args.query?.trim() ?? '';
      if (!query) return jsonResult({ query, matches: [] });

      const limit = Math.max(1, Math.min(args.limit ?? 5, 10));
      const matches = dreamSymbols
        .map((symbol) => ({ symbol, score: scoreSymbol(symbol, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.symbol.english.localeCompare(b.symbol.english))
        .slice(0, limit)
        .map(({ symbol }) => ({
          english: symbol.english,
          zulu: symbol.zulu,
          meaning: symbol.meaning,
          category: symbol.category,
          related: symbol.related,
          url: `https://www.amaphupho.co.za/dream-meaning/${symbol.slug}`,
        }));

      return jsonResult({ query, matches });
    },
  });
};

const registerDreamHistory = async (modelContext: ModelContext) => {
  await modelContext.registerTool({
    name: 'search_dream_journal',
    title: 'Search my Amaphupho dream journal',
    description:
      "Search the signed in user's private Amaphupho dream journal. Returns only that user's dreams and never changes, publishes or deletes journal entries.",
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        query: {
          type: 'string',
          maxLength: 200,
          description: 'Optional text to match against the dream, title or interpretation. Omit to return recent dreams.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 20,
          default: 10,
          description: 'Maximum number of journal entries to return.',
        },
      },
    },
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
    async execute(args: { query?: string; limit?: number }) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        return jsonResult({
          authenticated: false,
          error: 'Sign in to Amaphupho to search your private dream journal.',
          dreams: [],
        });
      }

      const limit = Math.max(1, Math.min(args.limit ?? 10, 20));
      const { data, error } = await supabase
        .from('dreams')
        .select('id, dream_input, dream_title, interpretation, created_at, is_favourite')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const q = normalise(args.query ?? '');
      const dreams = ((data ?? []) as DreamRecord[])
        .filter((dream) => {
          if (!q) return true;
          return [dream.dream_input, dream.dream_title ?? '', dream.interpretation]
            .some((value) => normalise(value ?? '').includes(q));
        })
        .slice(0, limit)
        .map((dream) => ({
          id: dream.id,
          title: dream.dream_title || 'Untitled Dream',
          dream: dream.dream_input,
          interpretation: dream.interpretation,
          createdAt: dream.created_at,
          isFavourite: Boolean(dream.is_favourite),
        }));

      return jsonResult({
        authenticated: true,
        query: args.query ?? null,
        dreams,
      });
    },
  });
};

let registered = false;

export const registerWebMcpTools = async () => {
  if (registered || typeof document === 'undefined' || !document.modelContext) return false;

  await registerInterpretDream(document.modelContext);
  await registerSearchSymbols(document.modelContext);
  await registerDreamHistory(document.modelContext);
  registered = true;
  return true;
};
