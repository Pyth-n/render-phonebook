const express = require('express')
const app = express()
const cors = require('cors')

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]

const generateId = () => {
  const id = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0

  return id + 1
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.get('/', (req, res ) => res.send('<h1>lol</h1>'))

app.get('/api/notes', (req, res) => res.json(notes))

app.get('/api/notes/:id', (req, res ) => {
  const id =  Number(req.params.id)
  const note = notes.find(n => n.id === id)
  return note ? res.json(note) : res.status(404).end()
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  notes.push(note)
  res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(n => n.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
