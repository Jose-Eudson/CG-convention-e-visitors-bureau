const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'CVB API rodando!' });
});

app.post('/api/send-admin-notification', async (req, res) => {
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
      subject: '\u{1F389} Nova Solicita\u00E7\u00E3o de Evento: ' + title,
      html: '<h2>\u{1F389} NOVA SOLICITA\u00C7\u00C3O DE EVENTO</h2><h3>Detalhes do Evento:</h3><ul><li><strong>\u{1F4CB} Evento:</strong> ' + title + '</li><li><strong>\u{1F4C5} Data:</strong> ' + formattedDate + '</li><li><strong>\u{1F4CD} Local:</strong> ' + location + '</li><li><strong>\u{1F3F7}\uFE0F Categoria:</strong> ' + category + '</li></ul><h3>Descri\u00E7\u00E3o:</h3><p>' + description + '</p><h3>\u{1F464} Informa\u00E7\u00F5es do Solicitante:</h3><ul><li><strong>Nome:</strong> ' + submitterName + '</li><li><strong>Email:</strong> ' + submitterEmail + '</li>' + (submitterPhone ? '<li><strong>Telefone:</strong> ' + submitterPhone + '</li>' : '') + (submitterOrganization ? '<li><strong>Organiza\u00E7\u00E3o:</strong> ' + submitterOrganization + '</li>' : '') + '</ul><p>Acesse o painel de administra\u00E7\u00E3o para revisar e aprovar/rejeitar esta solicita\u00E7\u00E3o.</p><div style="text-align: center; margin: 30px 0;"><a href="' + adminUrl + '" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">\u{1F4CB} Ver Solicita\u00E7\u00F5es Pendentes</a></div>'
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado para admin:', process.env.ADMIN_EMAIL);
    res.json({ success: true, message: 'Email enviado para admin' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/send-confirmation', async (req, res) => {
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
      subject: '\u2705 Solicita\u00E7\u00E3o Recebida: ' + title,
      html: '<h2>Ol\u00E1 ' + submitterName + ',</h2><p>\u2705 Recebemos sua solicita\u00E7\u00E3o de evento no CVB Campina Grande!</p><h3>\u{1F4CB} Evento Solicitado:</h3><ul><li><strong>T\u00EDtulo:</strong> ' + title + '</li><li><strong>\u{1F4C5} Data:</strong> ' + formattedDate + '</li><li><strong>\u{1F4CD} Local:</strong> ' + location + '</li></ul><p>Nossa equipe ir\u00E1 revisar sua solicita\u00E7\u00E3o e entrar em contato em breve atrav\u00E9s do email <strong>' + submitterEmail + '</strong>.</p><p>Voc\u00EA receber\u00E1 uma notifica\u00E7\u00E3o quando sua solicita\u00E7\u00E3o for aprovada ou se houver alguma d\u00FAvida.</p><p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>'
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de confirmacao enviado para:', submitterEmail);
    res.json({ success: true, message: 'Email de confirmação enviado' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/send-approval', async (req, res) => {
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
      subject: '\u{1F389} Evento Aprovado: ' + title,
      html: '<h2>Ol\u00E1 ' + submitterName + ',</h2><h1 style="color: #10b981;">\u{1F389} EVENTO APROVADO!</h1><p>Temos uma \u00F3tima not\u00EDcia! Seu evento foi aprovado e j\u00E1 est\u00E1 dispon\u00EDvel no site do CVB Campina Grande.</p><div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>\u{1F4CB} ' + title + '</h3><p><strong>\u{1F4C5} Data:</strong> ' + formattedDate + '</p><p style="color: #10b981; font-weight: bold;">\u2705 Publicado com sucesso!</p></div><p>Obrigado por contribuir com o turismo e eventos de Campina Grande!</p><p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>'
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de aprovacao enviado para:', submitterEmail);
    res.json({ success: true, message: 'Email de aprovação enviado' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/send-rejection', async (req, res) => {
  try {
    const { submitterName, submitterEmail, title, rejectionReason } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: submitterEmail,
      subject: 'Sobre sua solicita\u00E7\u00E3o: ' + title,
      html: '<h2>Ol\u00E1 ' + submitterName + ',</h2><p>Agradecemos seu interesse em cadastrar o evento <strong>"' + title + '"</strong> no CVB Campina Grande.</p><p>Ap\u00F3s an\u00E1lise, n\u00E3o foi poss\u00EDvel aprovar sua solicita\u00E7\u00E3o no momento.</p><div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3>\u{1F4DD} Motivo:</h3><p>' + rejectionReason + '</p></div><p>Se tiver d\u00FAvidas ou quiser mais informa\u00E7\u00F5es, entre em contato conosco respondendo este email.</p><p>Atenciosamente,<br><strong>Equipe CVB Campina Grande</strong></p>'
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de rejeicao enviado para:', submitterEmail);
    res.json({ success: true, message: 'Email de rejeição enviado' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta', PORT);
});
