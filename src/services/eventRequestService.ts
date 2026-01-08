import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  where,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { EventRequest } from '../types/EventRequest';
import { createEvent } from './eventsService';

const requestsRef = collection(db, 'eventRequests');

export const createEventRequest = async (
  requestData: Omit<EventRequest, 'id' | 'status' | 'submittedAt'>
): Promise<string | null> => {
  try {
    const docRef = await addDoc(requestsRef, {
      ...requestData,
      status: 'pending',
      submittedAt: Timestamp.now()
    });
    console.log('✅ Solicitação criada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao criar solicitação:', error);
    return null;
  }
};

export const getPendingRequests = async (): Promise<EventRequest[]> => {
  try {
    console.log('🔍 Buscando solicitações pendentes no Firestore...');
    const q = query(requestsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    
    console.log('📊 Documentos encontrados:', querySnapshot.size);
    
    const requests = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('📄 Documento:', doc.id, data);
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      } as EventRequest;
    });
    
    requests.sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return dateB - dateA; 
    });
    
    console.log('✅ Solicitações processadas e ordenadas:', requests);
    return requests;
  } catch (error) {
    console.error('❌ Erro ao buscar solicitações pendentes:', error);
    return [];
  }
};

export const getAllRequests = async (): Promise<EventRequest[]> => {
  try {
    const querySnapshot = await getDocs(requestsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      reviewedAt: doc.data().reviewedAt?.toDate?.()?.toISOString()
    } as EventRequest));
  } catch (error) {
    console.error('❌ Erro ao buscar solicitações:', error);
    return [];
  }
};

export const approveEventRequest = async (requestId: string): Promise<boolean> => {
  try {
    const requestDoc = doc(db, 'eventRequests', requestId);
    const querySnapshot = await getDocs(query(requestsRef, where('__name__', '==', requestId)));
    
    if (querySnapshot.empty) {
      console.error('Solicitação não encontrada');
      return false;
    }
    
    const requestData = querySnapshot.docs[0].data() as EventRequest;
    
    const eventData: any = {
      title: requestData.title,
      description: requestData.description,
      date: requestData.date,
      location: requestData.location,
      image: requestData.image,
      isFeatured: false, 
      category: requestData.category,
      status: 'open' as const
    };
    
    if (requestData.endDate) {
      eventData.endDate = requestData.endDate;
    }
    if (requestData.externalLink) {
      eventData.externalLink = requestData.externalLink;
    }
    
    const eventId = await createEvent(eventData);
    
    if (eventId) {
      await updateDoc(requestDoc, {
        status: 'approved',
        reviewedAt: Timestamp.now()
      });
      
      console.log('✅ Solicitação aprovada e evento criado:', eventId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erro ao aprovar solicitação:', error);
    return false;
  }
};

export const rejectEventRequest = async (
  requestId: string, 
  reason: string
): Promise<boolean> => {
  try {
    const requestDoc = doc(db, 'eventRequests', requestId);
    
    await updateDoc(requestDoc, {
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: Timestamp.now()
    });
    
    console.log('✅ Solicitação rejeitada');
    return true;
  } catch (error) {
    console.error('❌ Erro ao rejeitar solicitação:', error);
    return false;
  }
};

export const deleteEventRequest = async (requestId: string): Promise<boolean> => {
  try {
    const requestDoc = doc(db, 'eventRequests', requestId);
    await deleteDoc(requestDoc);
    console.log('✅ Solicitação deletada');
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar solicitação:', error);
    return false;
  }
};
