import React from 'react';

export interface LeadData {
  name: string;
  role: string;
  company: string;
  industry: string;
  painPoint: string;
  productDescription: string;
  tone: 'Friendly' | 'Professional' | 'Confident' | 'Direct' | 'Warm';
  language: string;
  channel: string;
  daysAgo: string;
}

export type ScriptType = 'video' | 'voice' | 'whatsapp' | 'followup' | 'variations' | 'optout';

export interface GeneratedContent {
  type: ScriptType;
  data: any; // Dynamic JSON based on type
  timestamp: string;
}

export interface ScriptTemplate {
  id: ScriptType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export interface HistoryItem {
  id: string;
  leadData: LeadData;
  generatedContent: GeneratedContent;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_pro: boolean;
  usage_count: number;
}
