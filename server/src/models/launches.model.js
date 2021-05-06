
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const launches = new Map()

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values())
    return await launchesDatabase.find({}, {
        "__v": 0, "_id": 0
    })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}
async function getLatestFlightNumber() {

    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function saveLaunch(launch) {

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
        launch,
        { upsert: true }
    )

}


async function populateLaunches() {

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
    if (response.status !== 200) {
        console.log('problem in downloading launch data')
    }
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
        console.log(`${launch.rocket} ${launch.rocket}`)

        // TODO populate launch collection 
        await saveLaunch(launch);
    }

}
async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if (firstLaunch) {
        console.log('launch data already loaded')
        return;
    }
    await populateLaunches()

}
async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if (!planet) {
        throw new Error('no matching planet was found')
    }
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

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter)
}
async function existLaunchId(launchId) {
    return await findLaunch({ flightNumber: launchId })
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

