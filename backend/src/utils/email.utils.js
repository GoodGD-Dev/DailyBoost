const nodemailer = require('nodemailer');

/**
 * Serviço de envio de email
 * Função utilitária para enviar emails de verificação, recuperação de senha, etc.
 *
 * @param {Object} options - Configurações do email
 * @param {string} options.to - Destinatário do email
 * @param {string} options.subject - Assunto do email
 * @param {string} options.html - Conteúdo HTML do email
 * @returns {Object} - Informações sobre o envio do email
 */
const sendEmail = async (options) => {
  // Declaração da variável que armazenará o objeto de transporte
  let transporter;

  // Verifica se está em ambiente de desenvolvimento e se o modo de teste está ativo
  if (process.env.NODE_ENV === 'development' && process.env.EMAIL_TEST_MODE === 'true') {
    // Configuração para ambiente de teste usando Ethereal Email
    const testAccount = await nodemailer.createTestAccount();

    // Cria o transportador de email com as credenciais de teste
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',  // Servidor SMTP do Ethereal
      port: 587,                    // Porta padrão para SMTP com TLS
      secure: false,                // Não usa SSL/TLS imediato (usa STARTTLS)
      auth: {
        user: testAccount.user,     // Usuário gerado automaticamente
        pass: testAccount.pass      // Senha gerada automaticamente
      }
    });
  } else {
    // Configuração para ambiente de produção usando as variáveis de ambiente
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Define as opções do email a ser enviado
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  // Envia o email e aguarda a conclusão
  const info = await transporter.sendMail(mailOptions);


  // Se estiver em modo de teste, exibe a URL para visualizar o email enviado
  if (process.env.NODE_ENV === 'development' && process.env.EMAIL_TEST_MODE === 'true') {
    console.log('URL de visualização do email:', nodemailer.getTestMessageUrl(info));
  }

  // Retorna as informações do envio (ID da mensagem, status, etc.)
  return info;
};

module.exports = { sendEmail };