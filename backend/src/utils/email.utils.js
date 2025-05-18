const nodemailer = require('nodemailer');

/**
 * Serviço de envio de email
 */
const sendEmail = async (options) => {
  // Configuração para ambiente de desenvolvimento ou produção
  let transporter;

  if (process.env.NODE_ENV === 'development' && process.env.EMAIL_TEST_MODE === 'true') {
    // Configuração para ambiente de teste (ethereal)
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } else {
    // Configuração real
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Login App'}" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  const info = await transporter.sendMail(mailOptions);

  // Logging para ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development' && process.env.EMAIL_TEST_MODE === 'true') {
    console.log('URL de visualização do email:', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

module.exports = { sendEmail };