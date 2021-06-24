
const API_URL = "https://shrouded-cove-39339.herokuapp.com"

async function httpGetPlanets() {
  try {
    const response = await fetch('/v1/planets');
    const data = await response.json()
    return data

  } catch (error) {
    console.log(error)
  }

}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  const response = await fetch(`/v1/launches`)
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  try {
    return await fetch(`/v1/launches`, {
      method: 'POST',
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": 'application/json'
      }
    })

  } catch (error) {
    return {
      ok: false
    }
  }

  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  try {
    return await fetch(`/v1/launches/${id}/`, {
      method: 'delete',
    })

  } catch (error) {
    console.log(error)
    return {
      ok: false
    }
  }
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
