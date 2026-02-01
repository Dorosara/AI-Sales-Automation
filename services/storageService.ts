import { HistoryItem, LeadData } from '../types';

const STORAGE_KEY = 'sales_agent_history';
const DRAFT_KEY = 'sales_agent_draft';

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error reading history', error);
    return [];
  }
};

export const saveItem = (item: HistoryItem): HistoryItem[] => {
  const history = getHistory();
  // Add to top, limit to 50 items
  const newHistory = [item, ...history].slice(0, 50); 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  return newHistory;
};

export const deleteItem = (id: string): HistoryItem[] => {
  const history = getHistory();
  const newHistory = history.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  return newHistory;
};

export const clearHistory = (): HistoryItem[] => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};

export const saveDraft = (data: LeadData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
};
  
export const getDraft = (): LeadData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(DRAFT_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
};