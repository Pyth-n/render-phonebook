const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

const PORT = 3001

let numbers = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = numbers.length > 0
        ? Math.max(...numbers.map(n => n.id))
        : 0

    return maxId + 1
}

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :raw'))

morgan.token('raw', (req, res) => JSON.stringify(req.body))

app.get('/api/persons', (req, res) => {
    res.json(numbers)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const number = numbers.find(n => n.id === id)

    if (!number) return res.status(404).end()
    res.json(number)
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body
    console.log(req)
    if (!name || !number) {
        return res.json({
            error: `missing ${name ? '' : '|name'} ${number ? '' : '|number'}`
        })
    }

    if (numbers.find(n => n.name.toLowerCase() === name.toLowerCase())) {
        return res.json({
            error: `${name} already exists`
        })
    }

    const newNumber = {
        name,
        number,
        id: generateId()
    }

    numbers.push(newNumber)

    res.status(201).json(newNumber)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    numbers = numbers.filter(n => n.id !== id)
    res.status(204).end()
})

app.get('/api/info', (req, res) => {
    res.send(
        `<p>There are ${numbers.length} in the phonebook</p>
        <p>${new Date()}</p>
        `
    )
})

app.listen(PORT, () => console.log(`running on port ${PORT}`))