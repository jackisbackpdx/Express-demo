const app = express();
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticate');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const courses = require('./routes/courses');
const homePage = require('./routes/render-home');

const envStatus = app.get('env');
console.log(envStatus);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/api/courses/', courses);
app.use('/', homePage);

const applicationName = `Application Name: ${config.get('name')}`;
const mailServer = `Mail Server: ${config.get('mail.host')}`;
const mailPassword = `Mail Password: ${config.get('mail.password')}`;
console.log(applicationName);
console.log(mailServer);
console.log(mailPassword);

if(envStatus === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

dbDebugger('Connected to the database...');

dotenv.config();

app.use(logger);
app.use(authenticate);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));