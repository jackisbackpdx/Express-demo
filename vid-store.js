const express = require('express');
const genres = require('./vidstore-routes/genres');
const app = express();

app.use(express.json());
app.use('/api/movies/', genres);


app.listen(2000, () => console.log('listening on port 2000'));