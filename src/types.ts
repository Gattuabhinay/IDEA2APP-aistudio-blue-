export type Mood = 'Ecstatic' | 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Angry';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  aiInsights?: {
    sentiment: string;
    themes: string[];
    suggestion: string;
  };
}

export interface MoodStats {
  mood: Mood;
  count: number;
}
