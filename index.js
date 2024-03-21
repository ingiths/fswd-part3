const express = require("express");
const app = express()

app.use(express.json())

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
    },
    {
        "id": 3,
        "name": "Don Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "numer": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "Fake",
        "numer": "-"
    }
]

app.get("/info", (request, response) => {
    response.contentType("html")
    response.send(`Phonebook has info for ${data.length} people.<br />${Date()}`)
})

app.get("/api/persons", (request, response) => {
    response.json(data)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = data.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    data = data.filter(p => p.id !== id)
    response.status(204).end()
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})