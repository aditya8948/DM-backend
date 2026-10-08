const { User, Sequelize } = require('../models');
const { Op } = Sequelize;

class UserRepository {
  async findByEmailOrPhone(email, phone) {
    return await User.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase().trim() },
          { phone: phone.trim() }
        ]
      }
    });
  }

  async findByIdentifier(identifier) {
    const cleanId = identifier.trim().toLowerCase();
    return await User.findOne({
      where: {
        [Op.or]: [
          { email: cleanId },
          { phone: identifier.trim() }
        ]
      }
    });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }
}

module.exports = UserRepository;
