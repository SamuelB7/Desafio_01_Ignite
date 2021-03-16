const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.body
  const userExists = users.some(
    (user) => user.username === username
  )
  if(userExists) {
    return response.json({error: "User already exists!"})
  }
  request.user = userExists
  return next()
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const {name, username} = request.body

  const id = uuidv4()
  users.push({
    name,
    username,
    id,
    todo: []
  })
  //console.log(users)
  return response.json("User created!")
});

app.get('/todos', (request, response) => {
  const {username} = request.headers

  const user = users.find(user => user.username === username)
  if(!user) return response.json({error: "User not found"})

  return response.json(user.todo)
});

app.post('/todos', (request, response) => {
  const {username} = request.headers
  const {title, deadline} = request.body

  const user = users.find(user => user.username === username)
  if(!user) return response.json({error: "User not found!"})

  const id = uuidv4()

  user.todo.push({
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  return response.json("todo created!")
});

app.put('/todos/:id', (request, response) => {
  const {username} = request.headers
  const {id} = request.params
  const {title, deadline} = request.body

  const user = users.find(user => user.username === username)
  if(!user) return response.json({error: "User not found!"})

  const todo = user.todo.find(todo => todo.id === id)
  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json("todo updated!")
});

app.patch('/todos/:id/done', (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', (request, response) => {
  // Complete aqui
});

module.exports = app;