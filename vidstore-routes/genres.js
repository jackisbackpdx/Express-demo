const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const movies = [
    { id: 1, genre: 'Horror' },
    { id: 2, genre: 'Action' },
    { id: 3, genre: 'Romance' },
    { id: 4, genre: 'Comedy' },
];

router.get('/', (req, res) => {
    res.send(movies);
});

router.post('/', (req, res) => {
    const { error } = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: movies.length + 1,
        genre: req.body.genre
    };

    movies.push(genre);
    res.send(movies);
});

router.put('/:id', (req, res) => {
    const { error } = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const movie = movies.find(c => c.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('The page with the id you are looking for could not be found');


    movie.genre = req.body.genre;
    res.send(movies);    
});

router.delete('/:id', (req, res) => {
    const movie = movies.find(c => c.id === parseInt(req.params.id));
    if(!movie) return res.status(404).send('The page with the id you are looking for could not be found');

    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    
    res.send(movies);
});

function validateGenres(item) {
    const schema = Joi.object({ genre: Joi.string().min(3).required() }); 
    return schema.validate(item);
}

module.exports = router;