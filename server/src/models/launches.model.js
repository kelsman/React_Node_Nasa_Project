
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

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values())
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

