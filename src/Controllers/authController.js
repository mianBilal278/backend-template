// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  const {name, email, password} = req.body;

  try {
    let user = await User.findOne({email});
    if (user) {
      return res.status(400).json({message: 'User already exists'});
    }

    user = new User({name, email, password});
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});
  }
};

exports.loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server error'});
  }
};
