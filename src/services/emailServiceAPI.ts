const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Envia notificação para o admin quando há nova solicitação
 */
export const sendAdminNotification = async (requestData: {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  submitterOrganization?: string;
}): Promise<boolean> => {
  try {
    console.log('📧 Enviando notificação para admins...');
    
    // Pega a URL atual do front-end para o botão do e-mail
    const frontendUrl = window.location.origin;
    
    // Pega lista de emails de admin do .env
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS || '';
    
    const response = await fetch(`${API_URL}/api/send-admin-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestData,
        frontendUrl, // Adiciona a URL do front-end
        adminEmails, // Adiciona lista de emails de admin
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Emails enviados para admins');
      return true;
    } else {
      console.error('❌ Erro:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
};

/**
 * Envia confirmação para o solicitante
 */
export const sendConfirmationEmail = async (requestData: {
  submitterName: string;
  submitterEmail: string;
  title: string;
  date: string;
  location: string;
}): Promise<boolean> => {
  try {
    console.log(`📧 Enviando confirmação para ${requestData.submitterEmail}...`);
    const response = await fetch(`${API_URL}/api/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Email de confirmação enviado para ${requestData.submitterEmail}`);
      return true;
    } else {
      console.error('❌ Erro:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
};

/**
 * Envia email quando solicitação é aprovada
 */
export const sendApprovalEmail = async (requestData: {
  submitterName: string;
  submitterEmail: string;
  title: string;
  date: string;
}): Promise<boolean> => {
  try {
    console.log(`📧 Enviando email de aprovação para ${requestData.submitterEmail}...`);
    const response = await fetch(`${API_URL}/api/send-approval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Email de aprovação enviado para ${requestData.submitterEmail}`);
      return true;
    } else {
      console.error('❌ Erro:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
};

/**
 * Envia email quando solicitação é rejeitada
 */
export const sendRejectionEmail = async (requestData: {
  submitterName: string;
  submitterEmail: string;
  title: string;
  rejectionReason: string;
}): Promise<boolean> => {
  try {
    console.log(`📧 Enviando email de rejeição para ${requestData.submitterEmail}...`);
    const response = await fetch(`${API_URL}/api/send-rejection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Email de rejeição enviado para ${requestData.submitterEmail}`);
      return true;
    } else {
      console.error('❌ Erro:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
};
