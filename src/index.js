const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers

  const user = users.find(user => user.username === username)
  if(!user) return response.status(404).json({error: "User not found"})

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body

  const user = users.find(user => user.username === username)
  if(user) return response.status(400).json({error: "User already exists!"})

  const id = uuidv4()
  users.push({
    name,
    username,
    id,
    todos: []
  })
  
  return response.status(201).json({id, name, username, todos:[]})
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers
  const {user} = request
  const todos = user.todos

  return response.json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers
  const {title, deadline} = request.body
  const {user} = request

  const id = uuidv4()

  user.todos.push({
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  return response.status(201).json({id, title, done: false, deadline, created_at: new Date()})
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers
  const {id} = request.params
  const {title, deadline} = request.body
  const {user} = request

  const todo = user.todos.find(todos => todos.id === id)
  if(!todo) return response.status(404).json({error:"Todo does not exists"})

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers
  const {id} = request.params
  const {user} = request

  const todo = user.todos.find(todos => todos.id === id)
  if(!todo) return response.status(404).json({error:"Todo does not exists"})
  todo.done = true
  
  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers
  const {id} = request.params
  const {user} = request

  const todo = user.todos.find(todos => todos.id === id)
  if(!todo) return response.status(404).json({error:"Todo does not exists"})
  user.todos.splice(todo, 1)
  
  return response.status(204)
});

module.exports = app;