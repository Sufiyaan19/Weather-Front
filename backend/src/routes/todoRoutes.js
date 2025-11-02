
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');

router.get('/', auth, getTodos);
router.post('/', auth, createTodo);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

module.exports = router;
