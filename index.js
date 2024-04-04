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


app.get("/info", (request, response) => {
    response.contentType("html")
    Person.countDocuments({}).then(count => {
        response.send(`Phonebook has info for ${count} people.<br />${Date()}`)
    });
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })

})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
})


app.post("/api/persons", (request, response) => {
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
        })
    })


})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})