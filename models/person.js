const mongoose = require('mongoose');
const url = process.env.MONGO;

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;