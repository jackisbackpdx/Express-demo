const express = require('express');
const dotenv = require('dotenv');
const Joi = require('@hapi/joi');

const app = express();
app.use(express.json());

const movies = [
    { id: 1, genre: 'Horror' },
    { id: 2, genre: 'Action' },
    { id: 3, genre: 'Romance' },
    { id: 4, genre: 'Comedy' },
];

app.get('/api/movies', (req, res) => {
    res.send(movies);
});

app.post('/api/movies/', (req, res) => {
    const { error } = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: movies.length + 1,
        genre: req.body.genre
    };

    movies.push(genre);
    res.send(movies);
});

app.put('/api/movies/:id', (req, res) => {
    const { error } = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const movie = movies.find(c => c.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('The page with the id you are looking for could not be found');


    movie.genre = req.body.genre;
    res.send(movies);    
});

app.delete('/api/movies/:id', (req, res) => {

});

function validateGenres(item) {
    const schema = Joi.object({ genre: Joi.string().min(3).required() }); 
    return schema.validate(item);
}
app.listen(2000, () => console.log('listening on port 2000'));