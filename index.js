require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const Person = require('./models/person');
const { ObjectId } = require('bson');

morgan.token("body", function (req, res) {
    return JSON.stringify(req.body)
});

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


app.get("/info", (request, response, next) => {
    response.contentType("html")
    Person.countDocuments({})
        .then(count => {
            response.send(`Phonebook has info for ${count} people.<br />${Date()}`)
        })
        .catch(err => next(err));
})

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(err => next(err))
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(err => next(err))

})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(err => next(err))
})


app.post("/api/persons", (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        });
    }

    Person.findOne({ "name": body.name }, "name number").then(person => {
        if (person) {
            response.status(400).json({
                error: "name must be unique"
            });
            return
        }

        person = new Person({
            name: body.name,
            number: body.number,
        });

        person.save().then(savedPerson => {
            response.json(savedPerson)
        }).catch(err => next(err))
    })
    .catch(err => next(err))


})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: "unknown endpoint" });
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})