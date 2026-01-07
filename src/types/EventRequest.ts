export interface EventRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  image?: string;
  externalLink?: string;
  category: 'conference' | 'workshop' | 'seminar' | 'exhibition' | 'networking' | 'cultural' | 'sports' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  
  // Informações do solicitante
  submittedBy: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
  };
  
  // Metadados
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}
