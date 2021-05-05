
const PORT = process.env.PORT || 8000;
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { getaHabitablePlanets } = require('./models/planets.model');

const server = http.createServer(app);
const MONGO_URL = "mongodb+srv://kelvin22:kelvin22@nasacluster.iir5b.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once('open', () => {
    console.log('Mongo conection ready')
});
mongoose.connection.on('error', (err) => {
    console.error(err)
})
async function startServer() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    await getaHabitablePlanets();

    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    });

}
startServer()

