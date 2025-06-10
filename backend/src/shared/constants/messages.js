module.exports = {
  AUTH: {
    // Validação
    EMAIL_REQUIRED: 'Por favor, forneça um email',
    EMAIL_INVALID: 'Email deve ser válido',
    NAME_REQUIRED: 'Nome é obrigatório',
    PASSWORD_REQUIRED: 'Senha é obrigatória',
    NAME_PASSWORD_REQUIRED: 'Por favor, forneça nome e senha',
    EMAIL_PASSWORD_REQUIRED: 'Email e senha são obrigatórios',
    PASSWORD_TOO_SHORT: 'Senha deve ter pelo menos 6 caracteres',
    PASSWORD_WEAK: 'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número',

    // Autenticação
    INVALID_CREDENTIALS: 'Credenciais inválidas',
    EMAIL_OR_PASSWORD_INCORRECT: 'Email ou senha incorretos',
    REGISTRATION_NOT_COMPLETED: 'Complete seu registro primeiro',
    UNAUTHORIZED: 'Não autorizado. É necessário fazer login.',
    TOKEN_INVALID: 'Não autorizado. Token inválido.',
    TOKEN_EXPIRED: 'Token expirado',
    USER_NOT_FOUND: 'Usuário não encontrado',

    // Registro
    EMAIL_ALREADY_REGISTERED: 'Este email já está registrado. Faça login ou recupere sua senha.',
    REGISTRATION_EMAIL_SENT: 'Enviamos um link para seu email para completar o registro. Verifique sua caixa de entrada.',
    REGISTRATION_TOKEN_INVALID: 'Token inválido. Verifique o link ou solicite um novo.',
    REGISTRATION_TOKEN_EXPIRED: 'Link de registro expirado. Solicite um novo link.',
    REGISTRATION_ALREADY_COMPLETED: 'Este registro já foi completado. Faça login normalmente.',
    REGISTRATION_SUCCESS: 'Registro completado com sucesso!',

    // Recuperação de senha
    RESET_EMAIL_SENT: 'Email enviado com instruções para redefinir sua senha',
    RESET_TOKEN_INVALID: 'Token inválido ou expirado',
    RESET_SUCCESS: 'Senha redefinida com sucesso',
    RESET_BEFORE_COMPLETE_REGISTRATION: 'Complete seu registro primeiro antes de redefinir a senha',

    // Logout
    LOGOUT_SUCCESS: 'Logout realizado com sucesso',

    // Perfil
    PROFILE_UPDATED: 'Perfil atualizado com sucesso',

    // Google Auth
    GOOGLE_TOKEN_REQUIRED: 'Token do Google é obrigatório',
    GOOGLE_AUTH_ERROR: 'Erro na autenticação com Google'
  },

  ADMIN: {
    // Acesso
    ACCESS_DENIED: 'Acesso negado. Apenas administradores.',
    ACCESS_DENIED_ADMIN_ONLY: 'Acesso negado. Apenas administradores podem acessar esta área.',
    ACCESS_DENIED_SUPER_ADMIN: 'Acesso negado. Apenas super administradores.',
    COMPLETE_REGISTRATION_BEFORE_ADMIN: 'Complete seu registro antes de acessar o painel admin',

    // Permissões
    CANT_MODIFY_SELF: 'Você não pode alterar suas próprias permissões',
    CANT_DELETE_SELF: 'Você não pode deletar sua própria conta',
    CANT_MODIFY_SUPER_ADMIN: 'Você não pode modificar um super administrador',
    CANT_MODIFY_ADMIN: 'Você não pode modificar um administrador',

    // Ações
    USER_PROMOTED: 'Usuário promovido a administrador com sucesso',
    USER_DEMOTED: 'Usuário rebaixado de administrador com sucesso',
    USER_DELETED: 'Usuário deletado com sucesso',

    // Limpeza
    CLEANUP_SUCCESS: 'Limpeza executada com sucesso!',
    CLEANUP_ERROR: 'Erro ao executar limpeza',

    // Dashboard
    DASHBOARD_ERROR: 'Erro ao carregar dashboard',
    USERS_LIST_ERROR: 'Erro ao carregar usuários',
    USER_DETAIL_ERROR: 'Erro ao carregar usuário',
    SYSTEM_STATUS_ERROR: 'Erro ao carregar status do sistema',

    // Login Admin
    LOGIN_SUCCESS: 'Login realizado com sucesso',
    LOGIN_ERROR: 'Erro interno do servidor. Tente novamente.',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso',

    // Validação
    USER_ID_INVALID: 'ID do usuário deve ser válido',
    PAGE_INVALID: 'Página deve ser um número maior que 0',
    SEARCH_TOO_LONG: 'Busca deve ter no máximo 100 caracteres',
    FILTER_INVALID: 'Filtro deve ser: all, admin, regular ou pending'
  },

  SYSTEM: {
    SERVER_ERROR: 'Erro interno do servidor',
    SERVICE_UNAVAILABLE: 'Serviço temporariamente indisponível',
    ROUTE_NOT_FOUND: 'Rota não encontrada',
    METHOD_NOT_ALLOWED: 'Método não permitido',
    VALIDATION_ERROR: 'Dados inválidos',
    DATABASE_ERROR: 'Erro na base de dados',
    RATE_LIMIT_EXCEEDED: 'Muitas tentativas. Tente novamente mais tarde.',

    // Scheduler
    SCHEDULER_STARTED: 'Scheduler iniciado com sucesso',
    SCHEDULER_STOPPED: 'Scheduler parado com sucesso',
    SCHEDULER_RESTARTED: 'Scheduler reiniciado com sucesso',
    SCHEDULER_ERROR: 'Erro no scheduler',

    // Manutenção
    MAINTENANCE_MODE: 'Sistema em manutenção. Tente novamente mais tarde.'
  },

  EMAIL: {
    SEND_ERROR: 'Erro ao enviar email',
    SEND_SUCCESS: 'Email enviado com sucesso',
    TEMPLATE_ERROR: 'Erro no template do email',
    CONFIG_ERROR: 'Erro na configuração de email'
  }
};
