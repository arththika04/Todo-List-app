const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// in-memory "database"
let todos = []; // { id, text, done } objects
let nextId = 1;

app.use(cors());
app.use(express.json());

// get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// create todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Text required' });
  }
  const todo = { id: nextId++, text: text.trim(), done: false };
  todos.unshift(todo);
  res.status(201).json(todo);
});

// toggle done
app.put('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const { done } = req.body;

  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: 'Not found' });
  }

  todo.done = !!done;
  res.json(todo);
});

// delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const lengthBefore = todos.length;
  todos = todos.filter((t) => t.id !== id);

  if (todos.length === lengthBefore) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
