export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; 
  endDate?: string; 
  location: string;
  image?: string; 
  externalLink?: string; 
  isFeatured: boolean; 
  category: 'conference' | 'workshop' | 'seminar' | 'exhibition' | 'networking' | 'cultural' | 'sports' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'open';
}

export interface EventsByMonth {
  [month: string]: Event[];
}

export interface EventFilter {
  search?: string;
  category?: Event['category'];
  month?: string;
}
