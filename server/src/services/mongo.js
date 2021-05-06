const mongoose = require('mongoose');
const MONGO_URL = "mongodb+srv://kelvin22:kelvin22@nasacluster.iir5b.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once('open', () => {
    console.log('Mongo conection ready')
});

mongoose.connection.on('error', () => {
    console.error(err)
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}
module.exports = {
    mongoConnect,
    mongoDisconnect

}