
const request = require('supertest');
const app = require('../../app');
describe("TEST GET /LAUNCHES", () => {
    test('It should response with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

describe("TEST POST/ LAUNCH", () => {

    const completeLaunchData = {
        mission: 'Uss enterprise',
        rocket: 'Ncc 17098-U',
        target: 'Kepler-186 f',
        launchDate: 'january 13, 2030'
    }
    const launchDataWithoutDate = {
        mission: 'Uss enterprise',
        rocket: 'Ncc 17098-U',
        target: 'Kepler-186 f',
    }
    const launchDataWithInvalidDate = {
        mission: 'Uss enterprise',
        rocket: 'Ncc 17098-U',
        target: 'Kepler-186 f',
        launchDate: 'zoo'
    }
    test('it should respond with 201 created', async () => {

        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(response.body).toMatchObject(launchDataWithoutDate);
        expect(responseDate).toBe(requestDate);

    })

    test('it should catch missing required properties ', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({ error: "Missing required launch property" })
    })
    test('it should catch missing dates', async () => {

        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({ error: 'invalid launch date' })

    })
})