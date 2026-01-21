const { transporter } = require('./_lib/mailer');

module.exports = async (req, res) => {
  // Habilita CORS
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
    const { submitterName, submitterEmail, title, date, location } = req.body;

    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: submitterEmail,
      subject: '✅ Solicitação Recebida: ' + title,
      html: `<h2>Olá ${submitterName},</h2><p>✅ Recebemos sua solicitação de evento no CVB Campina Grande!</p><h3>📋 Evento Solicitado:</h3><ul><li><strong>Título:</strong> ${title}</li><li><strong>📅 Data:</strong> ${formattedDate}</li><li><strong>📍 Local:</strong> ${location}</li></ul><p>Nossa equipe irá revisar sua solicitação e entrar em contato em breve através do email <strong>${submitterEmail}</strong>.</p><p>Você receberá uma notificação quando sua solicitação for aprovada ou se houver alguma dúvida.</p><p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de confirmacao enviado para:', submitterEmail);
    res.status(200).json({ success: true, message: 'Email de confirmação enviado' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
