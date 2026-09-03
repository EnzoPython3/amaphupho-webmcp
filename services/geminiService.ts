import { AnalysisResult, InputMethod } from '../types';
import { supabase } from './supabaseClient';
import { API_BASE } from './apiBase';

const API_ENDPOINT = `${API_BASE}/.netlify/functions/dreamApi`;

export const analyzeDream = async (
  dreamText: string,
  inputType: InputMethod,
  targetLanguage: string = 'English'
): Promise<AnalysisResult> => {
  if (!dreamText) throw new Error('No dream text provided');

  let { data: { session } } = await supabase.auth.getSession();
  if (session && !session.access_token) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshed.session) {
      throw new Error('Session expired, please sign in again.');
    }
    session = refreshed.session;
  }

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'analyze',
      payload: { dreamText, inputType, targetLanguage },
    }),
  });

  if (!response.ok) {
    let message = 'Dream interpretation failed.';
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // Keep the safe fallback message.
    }
    throw new Error(message);
  }

  const data = await response.json();
  return {
    id: data.id,
    title: data.title || 'Untitled Dream',
    text: data.text,
    groundingMetadata: data.groundingMetadata,
    timestamp: new Date().toISOString(),
  };
};
