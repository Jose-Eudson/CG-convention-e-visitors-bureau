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
  
  submittedBy: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
  };
  
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}
