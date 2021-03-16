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
  console.log(users)
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
  const user = users.find(user => user.username === username)

});

app.put('/todos/:id', (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', (request, response) => {
  // Complete aqui
});

module.exports = app;