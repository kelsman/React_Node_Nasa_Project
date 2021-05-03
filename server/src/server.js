
const PORT = process.env.PORT || 8000;
const http = require('http');
const app = require('./app');
const { getaHabitablePlanets } = require('./models/planets.model');

const server = http.createServer(app);


async function startServer() {
    await getaHabitablePlanets();

    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    });

}
startServer()

