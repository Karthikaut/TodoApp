/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const todoController = require('../controller/todoController');
const authController = require('../controller/authController');
const authenticateJWT = require('../middleware/auth');

// eslint-disable-next-line linebreak-style

router.get('/', authenticateJWT, todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/create', authenticateJWT, todoController.createTodo);
router.put('/update/:id', authenticateJWT, todoController.updateTodo);
router.delete('/todolist/:id', authenticateJWT, todoController.deleteTodo);

router.post('/register', authController.newRegistration);
router.post('/login', authController.loginUser);

module.exports = router;