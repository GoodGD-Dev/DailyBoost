const User = require('../auth/auth.model');

/**
 * Serviços administrativos
 */
class AdminService {

  /**
   * Obter estatísticas do dashboard
   */
  static async getDashboardStats() {
    try {
      const stats = {
        totalUsers: await User.countDocuments(),
        adminUsers: await User.countDocuments({ isAdmin: true }),
        regularUsers: await User.countDocuments({ isAdmin: false }),
        pendingRegistrations: await User.countDocuments({
          registrationToken: { $exists: true }
        }),
        completedRegistrations: await User.countDocuments({
          name: { $exists: true },
          password: { $exists: true }
        }),
        recentUsers: await User.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select('name email isAdmin createdAt')
      };

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  /**
   * Listar usuários com filtros e paginação
   */
  static async getUsers(filters = {}) {
    try {
      const { page = 1, limit = 20, search = '', filter = 'all' } = filters;
      const skip = (page - 1) * limit;

      // Construir query de filtro
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      if (filter === 'admin') query.isAdmin = true;
      if (filter === 'regular') query.isAdmin = false;
      if (filter === 'pending') query.registrationToken = { $exists: true };

      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name email isAdmin role createdAt registrationToken');

      const total = await User.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: { search, filter }
      };
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  /**
   * Obter usuário por ID
   */
  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error('Usuário não encontrado');
        error.statusCode = 404;
        throw error;
      }
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        const castError = new Error('ID de usuário inválido');
        castError.statusCode = 400;
        throw castError;
      }
      throw error;
    }
  }

  /**
   * Alterar status de admin do usuário
   */
  static async toggleUserAdmin(userId, currentUserId) {
    try {
      const targetUser = await this.getUserById(userId);

      // Não permitir alterar o próprio usuário
      if (targetUser._id.toString() === currentUserId.toString()) {
        const error = new Error('Você não pode alterar suas próprias permissões');
        error.statusCode = 400;
        throw error;
      }

      targetUser.isAdmin = !targetUser.isAdmin;
      targetUser.role = targetUser.isAdmin ? 'admin' : 'user';
      await targetUser.save();

      return {
        user: targetUser,
        action: targetUser.isAdmin ? 'promovido a' : 'rebaixado de'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletar usuário
   */
  static async deleteUser(userId, currentUserId) {
    try {
      const targetUser = await this.getUserById(userId);

      // Não permitir deletar o próprio usuário
      if (targetUser._id.toString() === currentUserId.toString()) {
        const error = new Error('Você não pode deletar sua própria conta');
        error.statusCode = 400;
        throw error;
      }

      await User.findByIdAndDelete(userId);
      return targetUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obter status do sistema
   */
  static getSystemStats() {
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = AdminService;