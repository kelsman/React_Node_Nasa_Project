
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map()
let latestFlightNumber = 100;

const launch = {
    flightNumber: 200,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer Isi',
    launchDate: new Date('December 27, 2010'),
    target: 'Kepler-442 b',
    customers: ['ZAR', 'NGN'],
    upcoming: true,
    success: true,
}
saveLaunch(launch)

async function getAllLaunches() {
    // return Array.from(launches.values())
    return await launchesDatabase.find({}, {
        "__v": 0, "_id": 0
    })
}
async function saveLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if (!planet) {
        throw new Error('no matching planet was found')
    }
    await launchesDatabase.updateOne({
        flightNumber: launch.flightNumber
    },
        launch,
        { upsert: true }
    )
}
function addNewLaunch(launch) {

    latestFlightNumber++
    launches.set(launch.flightNumber, Object.assign(launch, {
        upcoming: true,
        success: true,
        customers: ['Zero to mastery', 'NASA'],
        flightNumber: latestFlightNumber
    }))
}
function existLaunchId(launchId) {
    return launches.has(launchId)
};
function abortLaunchById(launchId) {

    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
};

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchId,
    abortLaunchById
}

