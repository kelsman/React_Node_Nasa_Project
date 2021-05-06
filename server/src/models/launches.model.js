
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const launches = new Map()

const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
    flightNumber: 200,   //flight_number
    mission: 'Kepler Exploration X', //name
    rocket: 'Explorer Isi',  // rocket.name
    launchDate: new Date('December 27, 2010'), //date_local
    target: 'Kepler-442 b', // not applicable
    customers: ['ZAR', 'NGN'],
    upcoming: true,  //upcoming
    success: true,   // success
}
saveLaunch(launch)

async function getAllLaunches() {
    // return Array.from(launches.values())
    return await launchesDatabase.find({}, {
        "__v": 0, "_id": 0
    })
}
async function getLatestFlightNumber() {

    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function saveLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if (!planet) {
        throw new Error('no matching planet was found')
    }
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
        launch,
        { upsert: true }
    )

}

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query'
async function loadLaunchData() {
    console.log('downloading launch data')
    const response = await axios.post(SPACE_X_API_URL, {
        query: {},
        options: {
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });
    const launchDocs = response.data.docs;

    for (let launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        });
        console.log(launchDoc['name'])
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }
        console.log(`${launch.rocket}`)
    }
}
async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to mastery', 'NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch);
}
// function addNewLaunch(launch) {

//     latestFlightNumber++
//     launches.set(launch.flightNumber, Object.assign(launch, {
//         upcoming: true,
//         success: true,
//         customers: ['Zero to mastery', 'NASA'],
//         flightNumber: latestFlightNumber
//     }))
// }
async function existLaunchId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
};
async function abortLaunchById(launchId) {

    const aborted = await launchesDatabase.updateOne({ flightNumber: launchId }, {
        upcoming: false,
        success: false
    });

    return aborted.ok === 1 && aborted.nModified === 1;

    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;


};

module.exports = {
    loadLaunchData,
    getAllLaunches,
    existLaunchId,
    scheduleNewLaunch,
    abortLaunchById
}

