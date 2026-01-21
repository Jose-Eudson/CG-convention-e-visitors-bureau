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
    const { submitterName, submitterEmail, title, date } = req.body;

    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: submitterEmail,
      subject: '🎉 Evento Aprovado: ' + title,
      html: `<h2>Olá ${submitterName},</h2><h1 style="color: #10b981;">🎉 EVENTO APROVADO!</h1><p>Temos uma ótima notícia! Seu evento foi aprovado e já está disponível no site do CVB Campina Grande.</p><div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>📋 ${title}</h3><p><strong>📅 Data:</strong> ${formattedDate}</p><p style="color: #10b981; font-weight: bold;">✅ Publicado com sucesso!</p></div><p>Obrigado por contribuir com o turismo e eventos de Campina Grande!</p><p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de aprovacao enviado para:', submitterEmail);
    res.status(200).json({ success: true, message: 'Email de aprovação enviado' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
