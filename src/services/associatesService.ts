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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export interface Associate {
  id?: string;
  name: string;
  category: string;
  logo: string; 
  instagram: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  razaoSocial?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  nomeResponsavel?: string;
  cpfResponsavel?: string;
  telefone?: string;
  email?: string;
  cargo?: string;
  telefoneResponsavel?: string;
  emailResponsavel?: string;
  numeroFuncionarios?: string;
}

const ASSOCIATES_COLLECTION = 'associates';

export const getApprovedAssociates = async (): Promise<Associate[]> => {
  try {
    const q = query(
      collection(db, ASSOCIATES_COLLECTION),
      where('status', '==', 'approved')
    );
    
    const snapshot = await getDocs(q);
    const associates = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Associate));
    
    return associates.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeA - timeB;
    });
  } catch (error) {
    console.error('Erro ao buscar associados aprovados:', error);
    return [];
  }
};

export const getAllAssociates = async (): Promise<Associate[]> => {
  try {
    const q = query(
      collection(db, ASSOCIATES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Associate));
  } catch (error) {
    console.error('Erro ao buscar todos os associados:', error);
    return [];
  }
};

export const getPendingAssociates = async (): Promise<Associate[]> => {
  try {
    const q = query(
      collection(db, ASSOCIATES_COLLECTION),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Associate));
  } catch (error) {
    console.error('Erro ao buscar associados pendentes:', error);
    return [];
  }
};

export const uploadAssociateLogo = async (file: File, associateName: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${associateName.replace(/\s+/g, '_')}_${timestamp}`;
    const storageRef = ref(storage, `associates/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da logo:', error);
    throw error;
  }
};

export const addAssociate = async (
  associate: Omit<Associate, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ASSOCIATES_COLLECTION), {
      ...associate,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar associado:', error);
    throw error;
  }
};

export const approveAssociate = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, ASSOCIATES_COLLECTION, id);
    await updateDoc(docRef, {
      status: 'approved',
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao aprovar associado:', error);
    throw error;
  }
};

export const rejectAssociate = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, ASSOCIATES_COLLECTION, id);
    await updateDoc(docRef, {
      status: 'rejected',
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao rejeitar associado:', error);
    throw error;
  }
};

export const deleteAssociate = async (id: string, logoUrl: string): Promise<void> => {
  try {
    if (logoUrl && logoUrl.includes('firebase')) {
      try {
        const logoRef = ref(storage, logoUrl);
        await deleteObject(logoRef);
      } catch (error) {
        console.warn('Erro ao deletar logo do storage:', error);
      }
    }
    
    await deleteDoc(doc(db, ASSOCIATES_COLLECTION, id));
  } catch (error) {
    console.error('Erro ao deletar associado:', error);
    throw error;
  }
};

export const updateAssociate = async (
  id: string,
  data: Partial<Omit<Associate, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, ASSOCIATES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Erro ao atualizar associado:', error);
    throw error;
  }
};
