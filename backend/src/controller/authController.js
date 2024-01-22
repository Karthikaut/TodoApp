/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable linebreak-style */
const {body, validationResult} = require('express-validator');
const Todo = require('../model/todoModel');
const winston = require('winston');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
    new winston.transports.File({filename: 'logs/combined.log'}),
  ],
});

const authController = {
  newRegistration: [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
        }

        const {username, password} = req.body;

        const existingUser = await Todo('new_table').where({username}).first();
        if (existingUser) {
          return res.status(400).json({message: 'User already exists'});
        }

        await Todo('new_table').insert({username, password});

        return res.status(201).json({message: 'Registered successfully'});
      } catch (err) {
        logger.error(`Error registration: ${err.message}`);
        return res.status(500).json({message: 'Internal server error during registration'});
      }
    },
  ],

  loginUser: [
    async (req, res) => {
      try {
        const {username, password} = req.body;

        const user = await Todo('new_table').where({username, password}).first();
        if (!user) {
          return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({userId: user.id}, secretKey, {expiresIn: '1h'});
        res.cookie('jwt', token);

        return res.status(200).json({message: 'Login successfully', token});
      } catch (err) {
        logger.error(`Error login: ${err.message}`);
        return res.status(500).json({message: 'Internal server error during login'});
      }
    },
  ],
};

module.exports = authController;
