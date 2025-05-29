export interface GeminiResponse {
  content: string;
  timestamp: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export type Interaction = {
  id: string;
  type: 'click' | 'hover' | 'scroll' | 'input';
  timestamp: number;
  data?: any;
};

export type VisitInfo = {
  count: number;
  lastVisit: string;
  firstVisit: string;
};

export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  animations: boolean;
  visitInfo: VisitInfo;
  interactions: Interaction[];
};