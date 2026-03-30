const request = require("supertest")

const server = require("./server")

let barberId;
let barberToken;
let userId;
let userToken;
let serviceId
let appointmentId
let workhoursId

//Barber Reg és Login

describe("testing /barberReg post route", () => {
    test("should return 201 status code on successful registration", async () => {
        const response = await request(server)
            .post("/barberReg")
            .send({
                email: 'testEmail',
                name: 'testName',
                password: 'testPass',
                phoneNum: 12345,
                isAdmin: 1
            })
            .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(201)
        barberId = response.body.id

    })
    test("should return 400 for missing or bad data", async () => {
        const response = await request(server)
            .post("/barberReg")
            .send({
                email: "testEmail"
            })
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(400)
    })
    test('should return 400 for duplicate email registration', async () => {
        const barberData = {
            email: 'duplicate@test.com',
            name: 'Test Name',
            password: 'password123',
            phoneNum: '12345'
        };
        await request(server).post("/barberReg").send(barberData);

        // Második regisztráció ugyanazzal az emaillel
        const response = await request(server)
            .post("/barberReg")
            .send(barberData);
    
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Mar van ilyen");
    });

    test("should return 500 on forced server error", async () => {
        const response = await request(server)
            .post("/barberReg")
            .send({
                force500: true
            })
            .set("Content-Type", "application/json")

        expect([400, 500]).toContain(response.statusCode)
    })
})



describe("testing /barberLogin post route", () => {
    test("should return 201 status code on successful login", async () => {

        const response = await request(server)
            .post("/barberLogin")
            .send({
                email: 'testEmail',
                name: 'testName',
                password: 'testPass',
                isAdmin:1   
            })
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(201)
        expect(response.body.token).toBeDefined()

        barberToken = response.body.token
    })
    test("should return 400 for missing or bad data", async () => {
        const response = await request(server)
            .post("/barberLogin")
            .send({
                email: "testEmail"
            })

        expect(response.statusCode).toBe(400)
    })
    test("should return 500 on forced server error", async () => {
        const response = await request(server)
            .post("/barberReg")
            .send({
                force500: true
            })
            .set("Content-Type", "application/json")

        expect([400, 500]).toContain(response.statusCode)
    })

})

//User Reg és Login

describe("testing /userReg post route", () => {
    test("should return 201 status code on successful registration", async () => {
        const response = await request(server)
            .post("/userReg")
            .send({
                email: 'aaaa@ssss',
                name: 'testName',
                password: "testPass",
                phoneNum: 12345
            })
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(201)
        userId = response.body.id
    })
    test("should return 400 for bad data", async () => {
        const res = await request(server)
            .post("/userReg")
            .send({
                email: "aaaa@ssss",
                name: "ggggg",
                password: "testPass",
                phoneNum: 12345
            })

        expect(res.statusCode).toBe(400)
    })
    test("should return 400 for no data", async () => {
        const res = await request(server)
            .post('/userReg')
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)

        expect([400, 500]).toContain(res.statusCode)
    })

    test("/userReg should return 500 on server error", async () => {
        const response = await request(server).post("/userReg").send(null)
        expect([400, 500]).toContain(response.statusCode)
    })
})

describe("POST /userLogin", () => {
    test("should return 200 status code on successful login", async () => {

        const response = await request(server)
            .post("/userLogin")
            .send({
                email: 'aaaa@ssss',
                name: 'testName',
                password: "testPass"
            })
            .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()

        userToken = response.body.token;
    })
    test("should return 400 for missing or bad data", async () => {
        const res = await request(server)
            .post("/userLogin")
            .send({
                email: "asd",
                nam: "testName",
                password: "testPass"
            })

        expect(res.statusCode).toBe(400)
    })
    test("should return 400 for no data", async () => {
        const res = await request(server)
            .post('/userLogin')
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)

        expect([400, 500]).toContain(res.statusCode)
    })

    test("should return 500 on forced server error", async () => {
        const response = await request(server)
            .post("/userLogin")
            .send({
                force500: true
            })
            .set("Content-Type", "application/json")

        expect([400, 500]).toContain(response.statusCode)
    })
})



//Post Testek

describe('testing /servicesPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/servicesPost')
            .send({
                name: "asd" + Date.now(),
                description: "asdasd",
                duration_minutes: 10,
                price: 5000
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        serviceId = response.body.id
    })
    test("should return 401 for no token", async () => {
        const response = await request(server)
            .post('/servicesPost')
            .send({
                name: "asd"
            })

        expect(response.statusCode).toBe(401)
    })

    test("should return 400 for bad data", async () => {
        const response = await request(server)
            .post('/servicesPost')
            .send({
                duration_minutes: "asd"
            })
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(400)
    })
    test("should return 400 for no data", async () => {
        const response = await request(server)
            .post('/servicesPost')
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(400)
    })
})


describe('testing /workhoursPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/workhoursPost')
            .send({
                dayOfWeek: 3,
                start_time: "10:00",
                end_time: "16:00"
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        workhoursId = response.body.id
    })
    test("should return 401 for no token", async () => {
        const response = await request(server)
            .post('/workhoursPost')
            .send({})
        expect(response.statusCode).toBe(401)
    })

    test("should return 400 for missing data", async () => {
        const response = await request(server)
            .post('/workhoursPost')
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(400)
    })

    test("should return 400 for bad data", async () => {
        const response = await request(server)
            .post('/workhoursPost')
            .send({
                start_time: "asd"
            })
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(400)
    })
})


describe('testing /appointmentPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .post('/appointmentPost')
            .send({
                userID: userId,
                barberID: barberId,
                serviceID: serviceId,
                start_time: "2028-03-18 10:00",
                end_time: "2028-03-18 16:30",
                comment: "asd"
            })
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(200)
        appointmentId = response.body.id
    })

    test("should return 401 for no token", async () => {
        const response = await request(server)
            .post('/appointmentPost')
            .send({});
        expect(response.statusCode).toBe(401)
    })
    test("should return 400 for missing data", async () => {
        const response = await request(server)
            .post('/appointmentPost')
            .send({
                userID: userId,
                barberID: barberId,
                serviceID: serviceId,
                start_time: "2028-03-18 10:00"
            })
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(400)
    })

    test("should return 400 for bad data", async () => {
        const response = await request(server)
            .post('/appointmentPost')
            .send({
                userID: userId,
                serviceID: serviceId,
                start_time: null 
            })
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(400)
    })
})

describe('testing /appointmentUserPost post route', () => {
    test('should return 200 status code', async () => {
        const start_time = "2028-03-20 10:00"
        const end_time = "2028-03-20 11:00"
        const response = await request(server)
            .post('/appointmentUserPost')
            .send({
                barberID: barberId,
                serviceID: serviceId,
                start_time: start_time,
                end_time: end_time,
                comment: "asd",
                staus: "booked"
            })
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.body.id).toBeDefined()
        expect(response.statusCode).toBe(200)
    })
    test("should return 401 fir no token", async () => {
        const response = await request(server)
            .post('/appointmentUserPost')
            .send({})
        expect(response.statusCode).toBe(401)
    })
    test("should return 400 for missing data", async () => {
        const response = await request(server)
            .post('/appointmentUserPost')
            .send({
                userID: userId,
                barberID: barberId,
                serviceID: serviceId
            })
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.statusCode).toBe(400)
    })

    test("should return 400 for bad data", async () => {
        const response = await request(server)
            .post('/appointmentUserPost')
            .send({
                userID: userId,
                barberID: "asd",
                serviceID: serviceId,
                start_time: "2028-03-20 10:00",
                end_time: "2028-03-20 11:00",
                comment: "asd",
                staus: "booked"
            })
            .set("Authorization", `Bearer ${userToken}`)

        expect(response.statusCode).toBe(400)
    })
})

//Get testek

describe("testing /barberGet get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/barberGet').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test("401 - Unauthorized (No token)", async () => {
        const res = await request(server).get('/barberGet')
        expect(res.statusCode).toBe(401)
    })
    test("401 - Unauthorized (Invalid token)", async () => {
        const res = await request(server).get('/barberGet').set("Authorization", "Bearer hibas_token")
        expect(res.statusCode).toBe(401)
    })
})


describe("testing /userGet get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/userGet').set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
    })
    test("401 - Unauthorized (No token)", async () => {
        const res = await request(server).get('/userGet')
        expect(res.statusCode).toBe(401)
    })
    test("401 - Unauthorized (Invalid token)", async () => {
        const res = await request(server).get('/userGet').set("Authorization", "Bearer hibas_token")
        expect(res.statusCode).toBe(401)
    })
})
describe("testing /usersAll get route", () => {
    test("200 - Success (Admin check)", async () => {
        const response = await request(server)
            .get("/usersAll")
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        if (response.body.length > 0) {
            expect(response.body[0].password).toBeUndefined()
        }
    })
    test("401 - Unauthorized", async () => {
        const response = await request(server).get("/usersAll")
        expect(response.statusCode).toBe(401)
    })
})

describe("testing /servicesGet get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/servicesGet').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })
})

describe("testing /servicesMy get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/servicesMy').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test("401 - Unauthorized (No token)", async () => {
        const res = await request(server).get('/servicesMy')
        expect(res.statusCode).toBe(401)
    })
    test("401 - Unauthorized (Invalid token)", async () => {
        const res = await request(server).get('/servicesMy').set("Authorization", "Bearer hibas_token")
        expect(res.statusCode).toBe(401)
    })
})

describe("testing /workhoursGet get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/workhoursGet').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
})

describe("testing /workhoursMy get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/workhoursMy').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test("401 - Unauthorized (No token)", async () => {
        const res = await request(server).get('/workhoursMy')
        expect(res.statusCode).toBe(401)
    })
    test("401 - Unauthorized (Invalid token)", async () => {
        const res = await request(server).get('/workhoursMy').set("Authorization", "Bearer hibas_token")
        expect(res.statusCode).toBe(401)
    })
    
})

describe("testing /appointmentMyBarber get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/appointmentMyBarber').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test("401 - Unauthorized", async () => {
        const res = await request(server).get('/appointmentMyBarber')
        expect(res.statusCode).toBe(401)
    })
})


describe("testing /appointmentMyUser get route", () => {
    test("200 - Success", async () => {
        const response = await request(server).get('/appointmentMyUser').set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
    })
    test("401 - Unauthorized (No token)", async () => {
        const res = await request(server).get('/appointmentMyUser')
        expect(res.statusCode).toBe(401)
    })
    test("401 - Unauthorized (Invalid token)", async () => {
        const res = await request(server).get('/appointmentMyUser').set("Authorization", "Bearer hibas_token")
        expect(res.statusCode).toBe(401)
    })
})


describe('GET /availableSlots/:barberID/:date', () => {

    test('should return available slots for a barber', async () => {
        const response = await request(server).get(`/availableSlots/${barberId}/2028-03-18`)
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })
    test("400/500 - bad date", async () => {
        const res = await request(server)
            .get(`/availableSlots/${barberId}/ROSSZ_DATUM`)

        expect([400, 500]).toContain(res.statusCode)
    })
})
describe("testing /barbersAll get route", () => {
    test("200 - Success (Admin access)", async () => {
        const response = await request(server)
            .get("/barbersAll")
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200);
    })
    test("403 - Forbidden (Regular user access)", async () => {
        const response = await request(server)
            .get("/barbersAll")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(403)
    })
    
})
describe("testing /logsAll get route", () => {

    test("200 - Success", async () => {
        const response = await request(server)
            .get("/logsAll")
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })

    test("should return 401 for /logsAll without token", async () => {
        const response = await request(server).get("/logsAll")
        expect(response.statusCode).toBe(401);
    })
    test("401 - Unauthorized (Invalid token)", async () => {
        const res = await request(server).get('/logsAll').set("Authorization", "Bearer hibas_token")
        expect(res.statusCode).toBe(401)
    })

    test("403 - Forbidden (Not an admin)", async () => {
        const response = await request(server)
            .get("/logsAll")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(403)
    })
})

describe("testing /logsMy get route", () => {
    test("200 - Success", async () => {
        const response = await request(server)
            .get("/logsMy")
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        if (response.body.length > 0) {
            expect(response.body[0].barberID).toBe(barberId)
        }
    })
    test("401 - Unauthorized (No token)", async () => {
        const response = await request(server).get("/logsMy")
        expect(response.statusCode).toBe(401)
    })
    test("401 - Unauthorized (Invalid token)", async () => {
        const res = await request(server).get('/logsMy').set("Authorization", "Bearer hibas_token")
        expect(res.statusCode).toBe(401)
    })
})

//Update Testek

describe('testing /barberUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .put(`/barberUpdate/${barberId}`)
            .send({
                name: "asd",
                phoneNum: 123
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('should return 400 for missing data', async () => {
        const res = await request(server)
            .put(`/barberUpdate/${barberId}`)
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })
    test('barberUpdate 400 invalid id', async () => {
        const res = await request(server)
            .put(`/barberUpdate/abc`)
            .send({
                name: "test"
            })
            .set("Authorization", `Bearer ${barberToken}`)

        expect(res.statusCode).toBe(400)
    })
    test("403 - Forbidden (Regular user access)", async () => {
        const response = await request(server)
            .get("/barbersAll")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(403)
    })

    test('barberUpdate 401 no token', async () => {
        const res = await request(server)
            .put(`/barberUpdate/${barberId}`)
            .send({
                name: "test"
            })
        expect(res.statusCode).toBe(401)
    })
    test("barberUpdate - 401 (Invalid token)", async () => {
        const res = await request(server)
            .put(`/barberUpdate/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
            .send({ name: "New Name" })
        
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })

    test('barberUpdate 404 not found', async () => {
        const res = await request(server)
            .put(`/barberUpdate/999999`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})

describe('testing /userUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .put(`/userUpdate/${userId}`)
            .send({
                phoneNum: 1111111
            })
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('401 - no token', async () => {
        const res = await request(server)
            .put(`/userUpdate/${userId}`)
            .send({
                name: "test"
            })

        expect(res.statusCode).toBe(401)
    })
    test("userUpdate - 401 (Invalid token)", async () => {
        const res = await request(server)
            .put(`/userUpdate/${userId}`)
            .set("Authorization", "Bearer hibas.token.123")
            .send({ name: "New Name" })
        
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })

    test('userUpdate not found', async () => {
        const res = await request(server)
            .put(`/userUpdate/999999`)
            .set("Authorization", `Bearer ${userToken}`)

        expect([404, 500]).toContain(res.statusCode)

    })
    test("403 - Forbidden (Regular user access)", async () => {
        const response = await request(server)
            .get("/barbersAll")
            .set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(403)
    })

    test('userUpdate 400 invalid id', async () => {
        const res = await request(server)
            .put(`/userUpdate/abc`)
            .send({
                name: "test"
            })
            .set("Authorization", `Bearer ${userToken}`)

        expect(res.statusCode).toBe(400)
    })
})

describe('testing /servicesUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .put(`/servicesUpdate/${serviceId}`)
            .send({
                name: "asdasdasd",
                price: 5500
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('servicesUpdate 401 no token', async () => {
        const res = await request(server)
            .put(`/servicesUpdate/${serviceId}`)
        expect(res.statusCode).toBe(401)
    })
    test("servicesUpdate - 401 (Invalid token)", async () => {
        const res = await request(server)
            .put(`/servicesUpdate/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
            .send({ name: "New Name" })
        
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token");
    })
    test('servicesUpdate 400 invalid id', async () => {
        const res = await request(server)
            .put(`/servicesUpdate/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('servicesUpdate 404 not found', async () => {
        const res = await request(server)
            .put(`/servicesUpdate/999999`)
            .send({
                description: "ffffff"
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


describe('testing /appointmentUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .put(`/appointmentUpdate/${appointmentId}`)
            .send({
                start_time: "2028-12-10 10:00",
                end_time: "2028-12-10 11:00",
                comment: "sss"
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('appointmentUpdate 401 no token', async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/${appointmentId}`)
        expect(res.statusCode).toBe(401)
    })
    test("appointmentUpdate - 401 (Invalid token)", async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
            .send({ comment: "idk" })

        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })
    test('appointmentUpdate 400 invalid id', async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/abc`)
            .set("Authorization", `Bearer ${barberToken}`)

        expect(res.statusCode).toBe(400)
    })
    test('should return 400 for missing data', async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/${barberId}`)
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('appointmentUpdate 404 not found', async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/999999`)
            .send({
                start_time: "2028-03-10 10:00"
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


describe('testing /workhoursUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .put(`/workhoursUpdate/${workhoursId}`)
            .send({
                dayOfWeek: 3,
                end_time: "18:00"
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('workhoursUpdate 400 invalid id', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/abc`)
            .send({
                end_time: "20:00"
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('workhoursUpdate 400 no data', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/${workhoursId}`)
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('workhoursUpdate 401 no token', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/${workhoursId}`)
            .send({
                end_time: "20:00"
            })
        expect(res.statusCode).toBe(401)
    })
    test("workhoursUpdate - 401 (Invalid token)", async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
            .send({ dayOfWeek: 4 })

        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })

    test('workhoursUpdate 404 not found', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/999999`)
            .send({
                dayOfWeek: 4
            })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


//Delete Testek

describe('testing /appointmentDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .delete(`/appointmentDelete/${appointmentId}`)
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(200);
    })
    test('appointmentDelete 400 invalid id', async () => {
        const res = await request(server)
            .delete(`/appointmentDelete/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400);
    })
    test('appointmentDelete 401 no token', async () => {
        const res = await request(server)
            .delete(`/appointmentDelete/${appointmentId}`)
        expect(res.statusCode).toBe(401)
    })
    test('appointmentDelete 401 - invalid token', async () => {
        const res = await request(server)
            .delete(`/appointmentDelete/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })

    test('appointmentDelete 404 not found', async () => {
        const res = await request(server)
            .delete(`/appointmentDelete/999999`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})

describe('testing /servicesDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .delete(`/servicesDelete/${serviceId}`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('servicesDelete 401 no token', async () => {
        const res = await request(server)
            .delete(`/servicesDelete/${serviceId}`)
        expect(res.statusCode).toBe(401)
    })
    test('servicesDelete 401 - invalid token', async () => {
        const res = await request(server)
            .delete(`/servicesDelete/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })

    test('servicesDelete 400 invalid id', async () => {
        const res = await request(server)
            .delete(`/servicesDelete/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('servicesDelete 404 not found', async () => {
        const res = await request(server)
            .delete(`/servicesDelete/999999`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})




describe('testing /workhoursDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .delete(`/workhoursDelete/${workhoursId}`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('workhoursDelete 401 no token', async () => {
        const res = await request(server)
            .delete(`/workhoursDelete/${workhoursId}`)
        expect(res.statusCode).toBe(401)
    })
    test('workhoursDelete 401 - invalid token', async () => {
        const res = await request(server)
            .delete(`/workhoursDelete/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })

    test('workhoursDelete 400 invalid id', async () => {
        const res = await request(server)
            .delete(`/workhoursDelete/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('workhoursDelete 404 not found', async () => {
        const res = await request(server)
            .delete(`/workhoursDelete/999999`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})
describe("testing /logsCleanup delete route", () => {

    test("should return 200 and success message on cleanup", async () => {
        const response = await request(server)
            .delete("/logsCleanup")
            .set("Authorization", `Bearer ${barberToken}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Sikeres takarítás")
    });

    test("should return 401 if no token is provided for cleanup", async () => {
        const response = await request(server)
            .delete("/logsCleanup")
        
        expect(response.statusCode).toBe(401)
    })
    

    test("should return 200 even if there are no old logs to delete", async () => {
        const response = await request(server)
            .delete("/logsCleanup")
            .set("Authorization", `Bearer ${barberToken}`)
        
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Sikeres takarítás")
    })
})

describe('testing /userDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete(`/userDelete/${userId}`)
        .set("Authorization", `Bearer ${userToken}`) 
        
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Sikeres törlés, az időpontok lemondva")
    })

    test('userDelete 401 no token', async () => {
        const res = await request(server)
        .delete(`/userDelete/${userId}`)
        expect(res.statusCode).toBe(401)
    })
    test('userDelete 401 - invalid token', async () => {
        const res = await request(server)
            .delete(`/userDelete/${userId}`)
            .set("Authorization", "Bearer hibas.token.123")
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })

    test('userDelete 400 invalid id', async () => {
        const res = await request(server)
        .delete(`/userDelete/abc`)
        .set("Authorization", `Bearer ${userToken}`)
        expect(res.statusCode).toBe(400)
    })
    
    test('userDelete 404 not found', async () => {
        const res = await request(server)
        .delete(`/userDelete/999999`)
        .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
    
})

describe('testing /barberDelete/:id delete route', () => {
    test('barberDelete 401 no token', async () => {
        const res = await request(server)
        .delete(`/barberDelete/${barberId}`)
        expect(res.statusCode).toBe(401)
    })
    test('barberDelete 401 - invalid token', async () => {
        const res = await request(server)
            .delete(`/barberDelete/${barberId}`)
            .set("Authorization", "Bearer hibas.token.123")
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe("Invalid token")
    })
    
    test('barberDelete 400 invalid id', async () => {
        const res = await request(server)
        .delete(`/barberDelete/abc`)
        .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })
    
    test('barberDelete 404 not found', async () => {
        const res = await request(server)
        .delete(`/barberDelete/999999`)
        .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
    test('should return 200 status code', async () => {
        const response = await request(server)
            .delete(`/barberDelete/${barberId}`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
})




afterAll(async () => {
    const dbHandler = require("./dbHandler")
    await dbHandler.db.close()
})