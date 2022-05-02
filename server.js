const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

const Todo = require('./Models/Todo')

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err))

app.get('/todos', async (req, res) => {
  const todos = await Todo.find()
  res.json(todos)
})

app.post('/todo/new', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  })

  todo.save()
  res.json(todo)
})

app.delete('/todo/delete/:id', async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id)
  res.json(result)
})

app.put('/todo/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  todo.completed = !todo.completed
  todo.save()
  res.json(todo)
})

// ------------------ Deployment ----------------------

__dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('API running')
  })
}
// ------------------ Deployment ----------------------

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
