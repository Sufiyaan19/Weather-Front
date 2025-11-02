
const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', tag, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = { user: req.user.id };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (tag) query.tags = tag;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const todos = await Todo.find(query).sort({ [sortBy]: order === 'asc' ? 1 : -1 }).skip(skip).limit(parseInt(limit));
    const total = await Todo.countDocuments(query);
    res.json({ todos, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title, description, tags = [], dueDate = null, priority = 'low' } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const todo = new Todo({ user: req.user.id, title, description, tags, dueDate, priority });
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    const fields = ['title','description','completed','tags','dueDate','priority'];
    fields.forEach(f => { if (req.body[f] !== undefined) todo[f] = req.body[f]; });
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    await todo.remove();
    res.json({ message: 'Todo removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
