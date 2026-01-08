import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Event } from '../types/Event';

const eventsRef = collection(db, 'events');

const mapFirestoreToEvent = (id: string, data: any): Event => {
  return {
    id,
    title: data.title,
    description: data.description,
    date: data.date,
    endDate: data.endDate,
    location: data.location,
    image: data.image,
    externalLink: data.externalLink,
    isFeatured: data.isFeatured,
    category: data.category,
    status: data.status
  };
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => mapFirestoreToEvent(doc.id, doc.data()));
    return events;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
};

export const getFeaturedEvents = async (): Promise<Event[]> => {
  try {
    console.log('📡 Buscando eventos em destaque no Firestore...');
    const q = query(
      eventsRef, 
      where('isFeatured', '==', true)
    );
    const querySnapshot = await getDocs(q);
    console.log('📦 Documentos encontrados:', querySnapshot.size);
    
    const events = querySnapshot.docs.map(doc => {
      console.log('📄 Evento:', doc.id, doc.data());
      return mapFirestoreToEvent(doc.id, doc.data());
    });
    
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log('✅ Eventos em destaque processados:', events.length);
    return events;
  } catch (error) {
    console.error('❌ Erro ao buscar eventos em destaque:', error);
    return [];
  }
};

export const getRegularEvents = async (): Promise<Event[]> => {
  try {
    const q = query(
      eventsRef,
      where('isFeatured', '==', false)
    );
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => mapFirestoreToEvent(doc.id, doc.data()));
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return events;
  } catch (error) {
    console.error('Erro ao buscar eventos regulares:', error);
    return [];
  }
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return null;
  }
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<boolean> => {
  try {
    const eventDoc = doc(db, 'events', id);
    await updateDoc(eventDoc, {
      ...eventData,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return false;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    const eventDoc = doc(db, 'events', id);
    await deleteDoc(eventDoc);
    return true;
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return false;
  }
};

export const getEventsByCategory = async (category: Event['category']): Promise<Event[]> => {
  try {
    const q = query(
      eventsRef,
      where('category', '==', category),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapFirestoreToEvent(doc.id, doc.data()));
  } catch (error) {
    console.error('Erro ao buscar eventos por categoria:', error);
    return [];
  }
};

export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<Event[]> => {
  try {
    const q = query(
      eventsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapFirestoreToEvent(doc.id, doc.data()));
  } catch (error) {
    console.error('Erro ao buscar eventos por período:', error);
    return [];
  }
};
