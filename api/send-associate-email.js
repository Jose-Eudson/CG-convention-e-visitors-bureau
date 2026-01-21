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
    const { associate, action } = req.body;
    
    if (action === 'new') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const adminUrl = `${frontendUrl}/admin/associados`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: '🤝 Nova Solicitação de Associado: ' + associate.name,
        html: `
          <h2>🤝 NOVA SOLICITAÇÃO DE ASSOCIADO</h2>
          
          <h3>Dados da Empresa:</h3>
          <ul>
            <li><strong>📋 Nome Fantasia:</strong> ${associate.name}</li>
            <li><strong>🏢 Razão Social:</strong> ${associate.razaoSocial || '-'}</li>
            <li><strong>🏷️ Categoria:</strong> ${associate.category}</li>
            <li><strong>📄 CNPJ:</strong> ${associate.cnpj || '-'}</li>
            ${associate.inscricaoEstadual ? `<li><strong>Inscrição Estadual:</strong> ${associate.inscricaoEstadual}</li>` : ''}
            ${associate.inscricaoMunicipal ? `<li><strong>Inscrição Municipal:</strong> ${associate.inscricaoMunicipal}</li>` : ''}
          </ul>

          <h3>📍 Endereço:</h3>
          <ul>
            <li><strong>Rua:</strong> ${associate.endereco || '-'}</li>
            <li><strong>Bairro:</strong> ${associate.bairro || '-'}</li>
            <li><strong>CEP:</strong> ${associate.cep || '-'}</li>
          </ul>

          <h3>👤 Responsável:</h3>
          <ul>
            <li><strong>Nome:</strong> ${associate.nomeResponsavel || '-'}</li>
            <li><strong>CPF:</strong> ${associate.cpfResponsavel || '-'}</li>
            ${associate.cargo ? `<li><strong>Cargo:</strong> ${associate.cargo}</li>` : ''}
            ${associate.telefoneResponsavel ? `<li><strong>Telefone do Responsável:</strong> ${associate.telefoneResponsavel}</li>` : ''}
            ${associate.emailResponsavel ? `<li><strong>Email do Responsável:</strong> ${associate.emailResponsavel}</li>` : ''}
          </ul>

          ${associate.numeroFuncionarios ? `
          <h3>👥 Informações Adicionais:</h3>
          <ul>
            <li><strong>Número de Funcionários:</strong> ${associate.numeroFuncionarios}</li>
          </ul>
          ` : ''}

          <h3>📞 Contato:</h3>
          <ul>
            <li><strong>Telefone:</strong> ${associate.telefone || '-'}</li>
            <li><strong>Email:</strong> ${associate.email || '-'}</li>
            ${associate.instagram ? `<li><strong>Instagram/Site:</strong> <a href="${associate.instagram}">${associate.instagram}</a></li>` : ''}
          </ul>

          <p>Acesse o painel de administração para revisar e aprovar/rejeitar esta solicitação.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${adminUrl}" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              📋 Ver Solicitações Pendentes
            </a>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email de nova solicitação de associado enviado para admin');
      return res.status(200).json({ success: true, message: 'Email enviado para admin' });
    }

    if (action === 'approved') {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: associate.email,
        subject: '🎉 Associação Aprovada - CVB Campina Grande',
        html: `
          <h2>Olá ${associate.nomeResponsavel || associate.name},</h2>
          
          <h1 style="color: #10b981;">🎉 PARABÉNS! ASSOCIAÇÃO APROVADA!</h1>
          
          <p>Temos uma ótima notícia! Sua empresa <strong>${associate.name}</strong> foi aprovada como associada do CVB Campina Grande!</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🏢 ${associate.name}</h3>
            <p><strong>🏷️ Categoria:</strong> ${associate.category}</p>
            <p style="color: #10b981; font-weight: bold;">✅ Agora você faz parte da rede CVB!</p>
          </div>

          <p>Sua empresa já está visível na página de associados do nosso site.</p>
          
          <p>Em breve, entraremos em contato com mais informações sobre os benefícios e eventos exclusivos para associados.</p>

          <p>Bem-vindo(a) ao CVB Campina Grande!</p>

          <p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email de aprovação de associado enviado para:', associate.email);
      return res.status(200).json({ success: true, message: 'Email de aprovação enviado' });
    }

    if (action === 'rejected') {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: associate.email,
        subject: 'Sobre sua solicitação de associação - CVB Campina Grande',
        html: `
          <h2>Olá ${associate.nomeResponsavel || associate.name},</h2>
          
          <p>Agradecemos seu interesse em se associar ao CVB Campina Grande.</p>
          
          <p>Após análise, não foi possível aprovar a solicitação de associação da empresa <strong>"${associate.name}"</strong> no momento.</p>
          
          ${associate.rejectionReason ? `
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Motivo:</h3>
            <p>${associate.rejectionReason}</p>
          </div>
          ` : ''}

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🏢 Empresa:</h3>
            <p><strong>${associate.name}</strong></p>
            <p><strong>Categoria:</strong> ${associate.category}</p>
          </div>

          <p>Se tiver dúvidas ou quiser mais informações sobre os critérios de associação, entre em contato conosco respondendo este email.</p>

          <p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email de rejeição de associado enviado para:', associate.email);
      return res.status(200).json({ success: true, message: 'Email de rejeição enviado' });
    }

    res.status(400).json({ success: false, error: 'Ação inválida' });
  } catch (error) {
    console.error('Erro ao enviar email de associado:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
