/**
 * Middleware global de tratamento de erros
 * Captura erros em toda a aplicação e fornece respostas consistentes
 *
 * @param {Error} err - Objeto de erro capturado
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar para o próximo middleware (não utilizada aqui)
 */
const errorHandler = (err, req, res, next) => {
  // Registra o stack trace completo do erro no console do servidor
  // Útil para debugging e monitoramento de erros no ambiente de servidor
  console.error(err.stack);

  // Define o código de status HTTP da resposta
  // Usa o statusCode do erro se disponível, ou 500 (Erro Interno do Servidor) como fallback
  // Isso permite que os serviços definam códigos específicos (400, 401, 404, etc.)
  const statusCode = err.statusCode || 500;

  // Define a mensagem de erro a ser retornada
  // Usa a mensagem do erro se disponível, ou uma mensagem genérica como fallback
  const message = err.message || 'Erro no servidor';

  // Envia a resposta de erro com o status e formato JSON padronizados
  res.status(statusCode).json({
    success: false,         // Indica falha na operação
    message,                // Mensagem descritiva do erro
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
    // Inclui o stack trace completo em ambientes de desenvolvimento
    // Omite em produção por razões de segurança e tamanho da resposta
  });
};

module.exports = errorHandler;