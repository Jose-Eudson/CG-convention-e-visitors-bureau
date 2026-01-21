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
    const { submitterName, submitterEmail, title, rejectionReason } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: submitterEmail,
      subject: 'Sobre sua solicitação: ' + title,
      html: `<h2>Olá ${submitterName},</h2><p>Agradecemos seu interesse em cadastrar o evento <strong>"${title}"</strong> no CVB Campina Grande.</p><p>Após análise, não foi possível aprovar sua solicitação no momento.</p><div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>📝 Motivo:</h3><p>${rejectionReason}</p></div><p>Se tiver dúvidas ou quiser mais informações, entre em contato conosco respondendo este email.</p><p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de rejeicao enviado para:', submitterEmail);
    res.status(200).json({ success: true, message: 'Email de rejeição enviado' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
