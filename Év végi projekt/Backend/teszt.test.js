const request = require("supertest")

const server = require("./server")

//Barber Testek

/*describe("testing /barberReg post route", () =>{
    test("should return 200 status code", async()=>{
       const response = await request(server)
        .post("/barberReg")
        .send({email : 'asdaa', name : 'kkk', password : 'lll', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)

    })
})

describe("testing /barberGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/barberGet').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0MDA4MSwiZXhwIjoxNzczMTQzNjgxfQ.yEe9yTTlea2m2OE0RtkO6rw7ZsnOCyECjerAUHwnN9M")
        expect(response.statusCode).toBe(200)

    })
})


describe("testing /barberLogin post route", () =>{
    test("should return 201 status code", async()=>{
       const response = await request(server)
        .post("/barberLogin")
        .send({email : 'asdaa', name : 'kkk', password : 'lll', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(201)

    })
})


describe('testing /barberUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .put('/barberUpdate/1')
        .send({name:"GERI",  phoneNum:1111111})
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0MDA4MSwiZXhwIjoxNzczMTQzNjgxfQ.yEe9yTTlea2m2OE0RtkO6rw7ZsnOCyECjerAUHwnN9M")
        expect(response.statusCode).toBe(200)
    })
})

describe('testing /barberDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete('/barberDelete/3')
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0MDA4MSwiZXhwIjoxNzczMTQzNjgxfQ.yEe9yTTlea2m2OE0RtkO6rw7ZsnOCyECjerAUHwnN9M")
        expect(response.statusCode).toBe(200)
    })
})
//Barber Testek vege
*/

//user Testek


/*
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
        const response = await request(server).get('/userGet').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0MDA4MSwiZXhwIjoxNzczMTQzNjgxfQ.yEe9yTTlea2m2OE0RtkO6rw7ZsnOCyECjerAUHwnN9M")
        expect(response.statusCode).toBe(200)

    })
})


/*describe("testing /userLogin post route", () =>{
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
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0MDA4MSwiZXhwIjoxNzczMTQzNjgxfQ.yEe9yTTlea2m2OE0RtkO6rw7ZsnOCyECjerAUHwnN9M")
    expect(response.statusCode).toBe(200)
    })
})
    
    describe('testing /userDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete('/userDelete/7')
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0MDA4MSwiZXhwIjoxNzczMTQzNjgxfQ.yEe9yTTlea2m2OE0RtkO6rw7ZsnOCyECjerAUHwnN9M")
        expect(response.statusCode).toBe(200)
    })
})
*/

//User Testek vége


//Appoinment Testek

/*
describe('testing /appointmentPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/appointmentPost')
        .send({ serviceID : 2, userID : 3, status : "van hely", start_time:"2026-03-10 11:00",end_time:"2026-03-10 12:00",comment:"asd"})
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0NTYyOCwiZXhwIjoxNzczMTQ5MjI4fQ.8lRe_g5c35VUdr2EU1pDMOgdXrVIo2RMA8GsDycChWs")
        expect(response.statusCode).toBe(200)
    })
})

describe("testing /appointmentGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentGet').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0NTYyOCwiZXhwIjoxNzczMTQ5MjI4fQ.8lRe_g5c35VUdr2EU1pDMOgdXrVIo2RMA8GsDycChWs")
        expect(response.statusCode).toBe(200)

    })
})

describe("testing /appointmentMyBarber get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentMyBarber').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjYsImlhdCI6MTc3MzI0MzM2OCwiZXhwIjoxNzczMjQ2OTY4fQ.tAcMgsAzIHjcTpA2Tbm-9GSq736QsGZ7gDA5L27yJo0")
        expect(response.statusCode).toBe(200)
        
    })
})

describe("testing /appointmentMyUser get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentMyUser').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjExLCJpYXQiOjE3NzMzMjgzMzEsImV4cCI6MTc3MzMzMTkzMX0.myw1lEkreAhvFDeBXbeXX9iITe_95gZYJewFnQ5ax4g")
        expect(response.statusCode).toBe(200)
        
    })
})

describe('testing /appointmentUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put('/appointmentUpdate/7')
    .send({start_time:"2026-03-10 10:00",  comment:"sss"})
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0NTYyOCwiZXhwIjoxNzczMTQ5MjI4fQ.8lRe_g5c35VUdr2EU1pDMOgdXrVIo2RMA8GsDycChWs")
    expect(response.statusCode).toBe(200)
    })
})

describe('testing /appointmentDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete('/appointmentDelete/8')
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzE0NTYyOCwiZXhwIjoxNzczMTQ5MjI4fQ.8lRe_g5c35VUdr2EU1pDMOgdXrVIo2RMA8GsDycChWs")
    expect(response.statusCode).toBe(200)

    
    })
})

//Appoinment Testek vége


//Services Testek

describe('testing /servicesPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/servicesPost')
        .send({ name : "asd", description : "asdasd", duration_minutes : 10, price:5000})
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
        expect(response.statusCode).toBe(200)
    })
})


describe("testing /servicesMy get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/servicesMy').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzODk5OCwiZXhwIjoxNzczMjQyNTk4fQ.8X1H9f1WbtexPBfymG4NVMNy-f_bXZZa4z_tJP_cJcU")
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /servicesGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/servicesGet').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
        expect(response.statusCode).toBe(200)
        
    })
})


describe('testing /servicesUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put('/servicesUpdate/5')
    .send({name:"asdasdasd",  price:5500})
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
    expect(response.statusCode).toBe(200)
    })
})

describe('testing /servicesDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete('/servicesDelete/2')
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
    expect(response.statusCode).toBe(200)

    
    })
})



//Services Testek vége


//Workhours Testek

describe('testing /workhoursPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/workhoursPost')
        .send({ dayOfWeek : 3, start_time :"10:00", end_time : "16:00"})
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
        expect(response.statusCode).toBe(200)
    })
})

describe("testing /workhoursGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursGet').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
        expect(response.statusCode).toBe(200)
        
    })
})

describe("testing /workhoursMy get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursMy').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjYsImlhdCI6MTc3MzI0MzM2OCwiZXhwIjoxNzczMjQ2OTY4fQ.tAcMgsAzIHjcTpA2Tbm-9GSq736QsGZ7gDA5L27yJo0")
        expect(response.statusCode).toBe(200)
        
    })
})


describe('testing /workhoursUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put('/workhoursUpdate/2')
    .send({dayOfWeek:5,  end_time:"18:00"})
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
    expect(response.statusCode).toBe(200)
    })
})

describe('testing /workhoursDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete('/workhoursDelete/2')
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc3MzIzNzUxMiwiZXhwIjoxNzczMjQxMTEyfQ.wM5W9IdboYAiGwmQRr-Gd22sLrJv1I7evNnUcO6qyeM")
    expect(response.statusCode).toBe(200)

    
    })
})
*/

//workhours testek vége