const { transporter } = require('./_lib/mailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, description, date, location, category, submitterName, submitterEmail, submitterPhone, submitterOrganization, frontendUrl } = req.body;
    
    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const adminUrl = frontendUrl ? `${frontendUrl}/admin/solicitacoes` : 'http://localhost:5173/admin/solicitacoes';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🎉 Nova Solicitação de Evento: ' + title,
      html: `<h2>🎉 NOVA SOLICITAÇÃO DE EVENTO</h2><h3>Detalhes do Evento:</h3><ul><li><strong>📋 Evento:</strong> ${title}</li><li><strong>📅 Data:</strong> ${formattedDate}</li><li><strong>📍 Local:</strong> ${location}</li><li><strong>🏷️ Categoria:</strong> ${category}</li></ul><h3>Descrição:</h3><p>${description}</p><h3>👤 Informações do Solicitante:</h3><ul><li><strong>Nome:</strong> ${submitterName}</li><li><strong>Email:</strong> ${submitterEmail}</li>${submitterPhone ? `<li><strong>Telefone:</strong> ${submitterPhone}</li>` : ''}${submitterOrganization ? `<li><strong>Organização:</strong> ${submitterOrganization}</li>` : ''}</ul><p>Acesse o painel de administração para revisar e aprovar/rejeitar esta solicitação.</p><div style="text-align: center; margin: 30px 0;"><a href="${adminUrl}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">📋 Ver Solicitações Pendentes</a></div>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado para admin:', process.env.ADMIN_EMAIL);
    res.status(200).json({ success: true, message: 'Email enviado para admin' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
