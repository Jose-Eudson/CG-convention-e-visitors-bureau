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
  logo: string; // URL da imagem
  instagram: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Dados adicionais do formulário
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

// Buscar todos os associados aprovados
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
    
    // Ordenar por data de criação (mais antigos primeiro - novos aparecem no final)
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

// Buscar todos os associados (para admin)
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

// Buscar associados pendentes
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

// Upload de logo
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

// Adicionar novo associado (status pendente)
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

// Aprovar associado
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

// Rejeitar associado
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

// Deletar associado
export const deleteAssociate = async (id: string, logoUrl: string): Promise<void> => {
  try {
    // Deletar logo do storage
    if (logoUrl && logoUrl.includes('firebase')) {
      try {
        const logoRef = ref(storage, logoUrl);
        await deleteObject(logoRef);
      } catch (error) {
        console.warn('Erro ao deletar logo do storage:', error);
      }
    }
    
    // Deletar documento
    await deleteDoc(doc(db, ASSOCIATES_COLLECTION, id));
  } catch (error) {
    console.error('Erro ao deletar associado:', error);
    throw error;
  }
};

// Atualizar associado
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
