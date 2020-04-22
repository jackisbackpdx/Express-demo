const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const courses = [
    { id: 1, name: 'Course 1' },
    { id: 2, name: 'Course 2' },
    { id: 3, name: 'Course 3' },
];

router.get('/', (req, res) => {
    res.send(courses);
});

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return req.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(courses);
});

router.put('/:id', (req, res) => {
    // look up the course
    // if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');
    
    // if existing, validate
    // if invalid, return 400 - bad request
    const { error } = validateCourse(req.body);
    if(error) return req.status(400).send(error.details[0].message);
    
    // update course
    course.name = req.body.name;
    // return the updated course
    res.send(courses);
});

router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    res.send(courses);
});

function validateCourse(course) {
    const schema = Joi.object({ name: Joi.string().min(3).required() });
    return schema.validate(course);
}

module.exports = router;