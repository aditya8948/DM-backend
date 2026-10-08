const { AuthService } = require('../services');

class AuthController {
  async signup(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields (name, email, phone, password) are required.' });
      }

      const result = await AuthService.register({ name, email, phone, password });
      return res.status(201).json({
        message: 'Account created successfully',
        ...result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Internal server error'
      });
    }
  }

  async login(req, res) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/phone and password are required.' });
      }

      const result = await AuthService.login({ identifier, password });
      return res.status(200).json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;
