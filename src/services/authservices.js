const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserRepository } = require('../repository');

class AuthService {
  async register({ name, email, phone, password }) {
    const existing = await UserRepository.findByEmailOrPhone(email, phone);
    if (existing) {
      const error = new Error('Email or phone number is already registered.');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword
    });

    const token = this.generateToken(newUser.id);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      },
      token
    };
  }

  async login({ identifier, password }) {
    const user = await UserRepository.findByIdentifier(identifier);
    if (!user) {
      const error = new Error('Invalid email/phone or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email/phone or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token
    };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'jwt_secret_key', {
      expiresIn: '7d'
    });
  }
}

module.exports = AuthService;
