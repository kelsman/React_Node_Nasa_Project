
const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path');
const morgan = require('morgan')
const planetRouter = require('./routes/planets/planet.router');
const launchesRouter = require('./routes/launches/launches.router');
// middlewres
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}));
if (process.env.NODE_ENV !== "production") {
    app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname, '..', 'public')))
// routes
app.use('/planets', planetRouter)
app.use('/launches', launchesRouter)

app.get('/*', (req, res) => {
    return res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app;