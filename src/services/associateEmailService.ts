import type { Associate } from './associatesService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AssociateEmailData {
  associate: Associate;
  action: 'new' | 'approved' | 'rejected';
}

export const sendAssociateNotification = async (data: AssociateEmailData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/send-associate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar email');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar notificação de associado:', error);
    throw error;
  }
};

export const sendNewAssociateEmail = async (associate: Associate): Promise<void> => {
  return sendAssociateNotification({
    associate,
    action: 'new'
  });
};

export const sendApprovalEmail = async (associate: Associate): Promise<void> => {
  return sendAssociateNotification({
    associate,
    action: 'approved'
  });
};

export const sendRejectionEmail = async (associate: Associate & { rejectionReason?: string }): Promise<void> => {
  return sendAssociateNotification({
    associate,
    action: 'rejected'
  });
};
