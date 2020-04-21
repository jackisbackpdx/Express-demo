const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('@hapi/joi');
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./custom-middleware/logger');
const authenticate = require('./custom-middleware/authenticate');
const app = express();

const envStatus = app.get('env');
console.log(envStatus);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

const applicationName = `Application Name: ${config.get('name')}`;
const mailServer = `Mail Server: ${config.get('mail.host')}`;
const mailPassword = `Mail Password: ${config.get('mail.password')}`;
console.log(applicationName);
console.log(mailServer);
console.log(mailPassword);

if(envStatus === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan Enabled');
}

dotenv.config();

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

app.use(logger);
app.use(authenticate);

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