const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, personalAccessToken } = require('../models');

const UserController = {
  // REGISTER
  create: async (request, response) => {
    try {
      const { fullname, username, password } = request.body;

      // Check if username already exists
      const existingUser = await User.findOne({ where: { username } });

      if (existingUser) {
        return response.status(400).json({ message: "Username already taken" });
      }

      // Create the user
      const user = await User.create({
        fullname,
        username,
        password: await bcrypt.hash(password, 10),
      });

      return response.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
        }
      });
    } catch (error) {
      console.error("Error Creating:", error);
      return response.status(500).json({ message: "Server error" });
    }
  },

  // LOGIN
  login: async (request, response) => {
    try {
      const { username, password } = request.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return response.status(404).json({ message: "Unknown User" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(401).json({ message: "Invalid credentials" });
      }

      // Delete Current Token
      await personalAccessToken.destroy({
        where: { userId: user.id }
      });

      // Generate tokens
      const tokenId = crypto.randomUUID();
      const rawToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const hashedToken = await bcrypt.hash(rawToken, 10);

      // Store token
      await personalAccessToken.create({
        token_id: tokenId,
        token: hashedToken,
        userId: user.id,
        name: 'Login token',
        abilities: 'access-api',
        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      });

      const finalToken = `${tokenId}|${rawToken}`;

      return response.status(200).json({
        message: "Login successful",
        token: finalToken
      });

    } catch (error) {
      console.error("Login Error:", error);
      return response.status(500).json({ message: "Server error" });
    }
  },

  // Logout
  logout: async (request, response) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({ message: "No token provided" });
      }

      const fullToken = authHeader.split(' ')[1];
      const [tokenId] = fullToken.split('|');

      if (!tokenId) {
        return response.status(400).json({ message: "Invalid token format" });
      }

      const deleted = await personalAccessToken.destroy({
        where: { token_id: tokenId }
      });

      if (!deleted) {
        return response.status(404).json({ message: "Token not found or already revoked" });
      }

      return response.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
      console.error("Logout Error:", error);
      return response.status(500).json({ message: "Server error" });
    }
  }


};

module.exports = UserController;
