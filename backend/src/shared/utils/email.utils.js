const nodemailer = require('nodemailer');

/**
 * Cria o transportador de email baseado no ambiente
 */
const createTransporter = async () => {
  // Ambiente de desenvolvimento com teste
  if (process.env.NODE_ENV === 'development' && process.env.EMAIL_TEST_MODE === 'true') {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  // Produção ou desenvolvimento com email real
  const transporterConfig = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outros
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  // Se usar serviço específico (Gmail, Outlook, etc.)
  if (process.env.EMAIL_SERVICE) {
    transporterConfig.service = process.env.EMAIL_SERVICE;
  }

  return nodemailer.createTransporter(transporterConfig);
};

/**
 * Serviço principal de envio de email
 */
const sendEmail = async (options) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'App'}" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email enviado:', {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId
      });

      // URL de visualização para ethereal
      if (process.env.EMAIL_TEST_MODE === 'true') {
        console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw new Error(`Falha no envio de email: ${error.message}`);
  }
};

/**
 * Templates básicos de email
 */
const emailTemplates = {
  // Template básico com layout
  basic: (title, content, buttonText, buttonUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        ${content}
        
        ${buttonText && buttonUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${buttonUrl}" 
               style="background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              ${buttonText}
            </a>
          </div>
        ` : ''}
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">Atenciosamente,<br>Equipe ${process.env.APP_NAME || 'App'}</p>
      </div>
    </div>
  `
};

module.exports = {
  sendEmail,
  emailTemplates,
  createTransporter
};