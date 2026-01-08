export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format YYYY-MM-DD
  endDate?: string; // Para eventos com múltiplos dias
  location: string;
  image?: string; // URL da imagem
  externalLink?: string; // Link para inscrição/mais informações
  isFeatured: boolean; // Se é evento em destaque
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
