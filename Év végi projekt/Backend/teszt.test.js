const request = require("supertest")

const server = require("./server")




//Barber Reg és Login

describe("testing /barberReg post route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server)
        .post("/barberReg")
        .send({email : 'valamiemail', name : 'nev', password : 'asd', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)
        barberId = response.body.id; 
        
    })
})



describe("testing /barberLogin post route", () =>{
    test("should return 201 status code", async()=>{
        const response = await request(server)
        .post("/barberLogin")
        .send({email : 'valamiemail', name : 'nev', password : 'asd', })
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(201)
        expect(response.body.token).toBeDefined();

        barberToken = response.body.token;
        
    })
})

//User Reg és Login

describe("testing /userReg post route", () =>{
    test("should return 200 status code", async()=>{
       const response = await request(server)
        .post("/userReg")
        .send({email : 'asdaaaa', name : 'kksk', password : "asd", phoneNum : 1234567})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)
        userId = response.body.id; 

    })
})

describe("testing /userLogin post route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server)
        .post("/userLogin")
        .send({email : 'asdaaaa', name : 'kksk', password : "asd"})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined();

        userToken = response.body.token;
    })
})



//Post Testek

describe('testing /servicesPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/servicesPost')
        .send({ name : "asd", description : "asdasd", duration_minutes : 10, price:5000})
        .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        serviceId = response.body.id;
    })
})


describe('testing /workhoursPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/workhoursPost')
        .send({ dayOfWeek : 3, start_time :"10:00", end_time : "16:00"})
        .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        workhoursId = response.body.id;
    })
})


describe('testing /appointmentPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .post('/appointmentPost') // <<< itt a helyes endpoint
            .send({ 
                serviceID: serviceId, 
                userID: userId, 
                start_time: "2026-03-16 10:00", 
                end_time: "2026-03-16 10:30", 
                comment: "asd" 
            })
            .set("Authorization", `Bearer ${barberToken}`);

        console.log("APPOINTMENT POST RESPONSE:", response.body);
        expect(response.body.id).toBeDefined();  // biztos, hogy van ID
        appointmentId = response.body.id;         // eltároljuk a későbbi tesztekhez
        expect(response.statusCode).toBe(200);
    });
});

//Get testek

describe("testing /barberGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/barberGet').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)

    })
})


describe("testing /userGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/userGet').set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /servicesGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/servicesGet').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /servicesMy get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/servicesMy').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})



describe("testing /workhoursGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursGet').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /appointmentMyBarber get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentMyBarber').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /appointmentMyUser get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/appointmentMyUser').set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /workhoursGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursGet').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})


describe("testing /workhoursMy get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursMy').set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
        
    })
})

//Update Testek

describe('testing /barberUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .put(`/barberUpdate/${barberId}`)
        .send({name:"asd",  phoneNum:123})
        .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
})

describe('testing /userUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put(`/userUpdate/${userId}`)
    .send({name:"GERI",  phoneNum:1111111})
    .set("Authorization", `Bearer ${userToken}`)
    expect(response.statusCode).toBe(200)
    })
})

describe('testing /servicesUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put(`/servicesUpdate/${serviceId}`)
    .send({name:"asdasdasd",  price:5500})
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)
    })
})


describe('testing /appointmentUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put(`/appointmentUpdate/${appointmentId}`)
    .send({start_time:"2026-03-10 10:00",  comment:"sss"})
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)
    })
})


describe('testing /workhoursUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put(`/workhoursUpdate/${workhoursId}`)
    .send({dayOfWeek:5,  end_time:"18:00"})
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)
    })
})


//Delete Testek

describe('testing /servicesDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete(`/servicesDelete/${serviceId}`)
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)

    
    })
})


/*describe('testing /appointmentDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete(`/appointmentDelete/${appointmentId}`)
        .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
})

describe('testing /workhoursDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete(`/workhoursDelete/${workhoursId}`)
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)

    
    })
})


describe('testing /barberDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete(`/barberDelete/${barberId}`)
        .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
})


describe('testing /userDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete(`/userDelete/${userId}`)
        .set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
    })
})*/
