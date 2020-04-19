const Joi = require('@hapi/joi');
const express = require('express');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());
dotenv.config();

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' },
];

app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return req.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found.');
    res.send(course);
    
});

app.put('/api/courses/:id', (req, res) => {
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

function validateCourse(course) {
    const schema = Joi.object({ name: Joi.string().min(3).required() });
    return schema.validate(course);
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found.');
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(courses);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));