/* eslint-disable new-cap */
const {body, param, validationResult} = require('express-validator');
const Todo = require('../model/todoModel');
const winston = require('winston');


const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
    new winston.transports.File({filename: 'logs/combined.log'}),
  ],
});


const todoController = {
  getAllTodos: async (req, res) => {
    try {
      const data = await Todo.select().from('todolist');
      return res.status(200).json(data);
    } catch (err) {
      logger.error(`Error fetching all todos: ${err.message}`);
      return res.status(404).json({message: err.message});
    }
  },

  getTodoById: async (req, res) => {
    try {
      const id = req.params.id;
      const todo = await Todo('todolist').where({id}).first();
      if (!todo) {
        return res.status(404).json({message: 'Todo not found'});
      }
      return res.status(200).json({todo});
    } catch (err) {
      logger.error(`Error fetching all todos: ${err.message}`);
      return res.status(500).json({message: err.message});
    }
  },


  createTodo: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      try {
        await Todo('todolist').insert({
          title: req.body.title,
          description: req.body.description,
          ...(req.body.dueDate && {duedate: req.body.dueDate}),
          ...(req.body.notes && {notes: req.body.notes}),
          ...(req.body.remainder && {remainder: req.body.remainder}),
        });
        return res.status(201).json({message: 'Todo created successfully'});
      } catch (err) {
        logger.error(`Error fetching all todos: ${err.message}`);
        return res.status(500).json({message: err.message});
      }
    },
  ],

  updateTodo: [
    param('id').notEmpty().withMessage('ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      try {
        const id = req.params.id;
        await Todo('todolist')
            .where({id})
            .update({
              title: req.body.title,
              description: req.body.description,
              ...(req.body.dueDate && {duedate: req.body.dueDate}),
              ...(req.body.notes && {notes: req.body.notes}),
              ...(req.body.remainder && {remainder: req.body.remainder}),
            });
        return res.status(200).json({message: 'Todo updated successfully'});
      } catch (err) {
        logger.error(`Error fetching all todos: ${err.message}`);
        return res.status(500).json({message: err.message});
      }
    },
  ],

  deleteTodo: [
    param('id').notEmpty().withMessage('ID is required'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      try {
        const id = req.params.id;
        await Todo('todolist').where({id}).del();
        return res.status(200).json({message: 'Todo deleted successfully'});
      } catch (err) {
        logger.error(`Error fetching all todos: ${err.message}`);
        return res.status(500).json({message: err.message});
      }
    },
  ],
};

module.exports = todoController;
