

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(() => ({ uid: 1 }))
}));

jest.mock("bcrypt", () => ({
    hash: jest.fn(() => Promise.resolve("hashedPassword")),
    compare: jest.fn(() => Promise.resolve(true))
  }))
  
  jest.mock('./dbHandler', () => {
    const modelMock = {
        sync: jest.fn(),
        create: jest.fn(() => Promise.resolve({ id: 1 })),
        findAll: jest.fn(() => Promise.resolve([
            { id:1, barberID:1, userID:1, serviceID:1, start_time: new Date(), end_time: new Date(), status:"available", comment:"asd", name:"Teszt", email:"test@test.com", phoneNum:1234567 }
        ])),
        findOne: jest.fn(({ where }) => {
            // egyszerű logika: ha id vagy email/barberID/userID egyezik, ad vissza objektumot
            const match = where.id === 1 || where.barberID === 1 || where.userID === 1 || where.email?.includes("test");
            if (match) {
                return Promise.resolve({
                    id:1,
                    barberID:1,
                    userID:1,
                    serviceID:1,
                    start_time: new Date(),
                    end_time: new Date(),
                    status:"available",
                    comment:"asd",
                    name:"Teszt",
                    email:"test@test.com",
                    phoneNum:1234567,
                    password: "$2b$09$hashedpasswordexample", // bcrypt hash
                    update: jest.fn(() => Promise.resolve([1]))
                })
            }
            return Promise.resolve(null)
        }),
        update: jest.fn(() => Promise.resolve([1])),
        destroy: jest.fn(() => Promise.resolve(1))
    };

    return {
        barber: { ...modelMock },
        user: { ...modelMock },
        services: { ...modelMock },
        workhours: { ...modelMock },
        appointments: { ...modelMock },
        log: { ...modelMock },
        db: {} // opcionális, ha valami hivatkozik rá
    }
});
  
  // Mockoljuk a jwt-t, hogy minden token valid legyen
  jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(() => ({ uid: 1 })) // mindig visszaadja az uid-t
  }));
  
  // Mockoljuk a bcrypt-et
  jest.mock("bcrypt", () => ({
    hash: jest.fn(() => Promise.resolve("hashedPassword")),
    compare: jest.fn(() => Promise.resolve(true))
  }));
const request = require("supertest")
const dbHandler = require("./dbHandler")
const server = require("./server")
const token = "Bearer fakeToken123"
//Barber Testek

describe("testing /barberReg post route", () =>{
    test("should return 200 status code", async()=>{
       const response = await request(server)
        .post("/barberReg")
        .send({email : 'asdaaaaa', name : 'kkk', password : 'lll', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)

    })
})

describe("testing /barberGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/barberGet').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)

    })
})


describe("testing /barberLogin post route", () =>{
    test("should return 201 status code", async()=>{
       const response = await request(server)
        .post("/barberLogin")
        .send({email : 'asdaaaaa', name : 'kkk', password : 'lll', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(201)

    })
})


describe('testing /barberUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .put('/barberUpdate/1')
        .send({name:"GERI",  phoneNum:1111111})
        .set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
    })
})

describe('testing /barberDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete('/barberDelete/3')
        .set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
    })
})
//Barber Testek vege


//user Testek



describe("testing /userReg post route", () =>{
    const bcrypt = require("bcrypt");
    test("should return 200 status code", async()=>{
    const hashedPassword = await bcrypt.hash("123456", 10);
       const response = await request(server)
        .post("/userReg")
        .send({email : 'asdaaaa', name : 'kksk', password : hashedPassword, phoneNum : 1234567})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)

    })
})

describe("testing /userGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/userGet').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)

    })
})


describe("testing /userLogin post route", () =>{
    test("should return 200 status code", async()=>{
       const response = await request(server)
        .post("/userLogin")
        .send({email : 'asdaa', name : 'kkk', password : 'lll', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)

    })
})


describe('testing /userUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put('/userUpdate/7')
    .send({name:"GERI",  phoneNum:1111111})
    .set("Authorization", "Bearer fakeToken123")
    expect(response.statusCode).toBe(200)
    })
})
    
    describe('testing /userDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete('/userDelete/7')
        .set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
    })
})


//User Testek vége


//Appoinment Testek


describe('testing /appointmentPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/appointmentPost')
        .send({ serviceID : 2, userID : 3, status : "van hely", start_time:"2026-03-10 11:00",end_time:"2026-03-10 12:00",comment:"asd"})
        .set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
    })
})

describe("testing /appointmentGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentGet').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)

    })
})

describe("testing /appointmentMyBarber get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentMyBarber').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
        
    })
})

describe("testing /appointmentMyUser get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentMyUser').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
        
    })
})

describe('testing /appointmentUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put('/appointmentUpdate/7')
    .send({start_time:"2026-03-10 10:00",  comment:"sss"})
    .set("Authorization", "Bearer fakeToken123")
    expect(response.statusCode).toBe(200)
    })
})

describe('testing /appointmentDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete('/appointmentDelete/8')
    .set("Authorization", "Bearer fakeToken123")
    expect(response.statusCode).toBe(200)

    
    })
})

//Appoinment Testek vége


//Services Testek

describe('testing /servicesPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/servicesPost')
        .send({ name : "asd", description : "asdasd", duration_minutes : 10, price:5000})
        .set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
    })
})


describe("testing /servicesMy get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/servicesMy').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /servicesGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/servicesGet').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
        
    })
})


describe('testing /servicesUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put('/servicesUpdate/5')
    .send({name:"asdasdasd",  price:5500})
    .set("Authorization", "Bearer fakeToken123")
    expect(response.statusCode).toBe(200)
    })
})

describe('testing /servicesDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete('/servicesDelete/2')
    .set("Authorization", "Bearer fakeToken123")
    expect(response.statusCode).toBe(200)

    
    })
})



//Services Testek vége


//Workhours Testek

describe('testing /workhoursPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/workhoursPost')
        .send({ dayOfWeek : 3, start_time :"10:00", end_time : "16:00"})
        .set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
    })
})

describe("testing /workhoursGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursGet').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
        
    })
})

describe("testing /workhoursMy get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursMy').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)
        
    })
})


describe('testing /workhoursUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put('/workhoursUpdate/2')
    .send({dayOfWeek:5,  end_time:"18:00"})
    .set("Authorization", "Bearer fakeToken123")
    expect(response.statusCode).toBe(200)
    })
})

describe('testing /workhoursDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete('/workhoursDelete/2')
    .set("Authorization", "Bearer fakeToken123")
    expect(response.statusCode).toBe(200)

    
    })
})


//workhours testek vége