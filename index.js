const { response, request } = require('express');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/person');

morgan.token('body', function getBody(request) {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend.</h1>');
});

app.get('/info', (request, response) => {
    let date = new Date();
    Person.countDocuments({}, (error, count) => {
        response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
    });

});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(err => next(err));
});

// TODO: Make frontend work with it.
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => { response.status(204).end(); })
        .catch(err => next(err));
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number are missing'
        });
    }

    // const isExist = persons.find(p => p.name === body.name);

    // if (isExist) {
    //     return response.status(400).json({
    //         error: `${isExist.name} allready exists`
    //     });
    // }

    const newPerson = new Person({
        //id: generateId(),
        name: body.name,
        number: body.number
    });

    //persons = persons.concat(newPerson);
    //response.json(newPerson);

    newPerson.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});