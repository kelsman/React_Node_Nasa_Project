
const PORT = process.env.PORT || 8000;
const http = require('http');
const app = require('./app');
const { mongoConnect } = require('./services/mongo')
const { getaHabitablePlanets } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await getaHabitablePlanets();
    await loadLaunchData()

    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    });

}
startServer()

