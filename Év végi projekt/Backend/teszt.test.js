const request = require("supertest")

const server = require("./server")

let barberId; 
let barberToken;
let userId;
let userToken;
let serviceId;
let appointmentId;  

//Barber Reg és Login

describe("testing /barberReg post route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server)
        .post("/barberReg")
        .send({email : 'valamiemail', name : 'nev', password : 'asd', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(201    )
        barberId = response.body.id; 
        
    })
    test("should return 400 for missing fields", async () => {
        const response = await request(server)
            .post("/barberReg")
            .send({ email: "valamiemail" }) 
            .set('Content-Type', 'application/json');

        expect(response.statusCode).toBe(400);
    });

    test("should return 500 on server error", async () => {
        const response = await request(server)
            .post("/barberReg")
            .send(null) 
            .set('Content-Type', 'application/json');

        expect([500, 400]).toContain(response.statusCode); 
    });
})



describe("testing /barberLogin post route", () =>{
    test("should return 201 status code", async()=>{
        const response = await request(server)
        .post("/barberLogin")
        .send({email : 'valamiemail', name : 'nev', password : 'asd', })
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(201)
        expect(response.body.token).toBeDefined();
        console.log("BARBER TOKEN IN TEST:", barberToken);
        barberToken = response.body.token;
        
    })
    test("/barberLogin should return 400 on missing fields", async () => {
        const res = await request(server)
            .post("/barberLogin")
            .send({ email: "valamiemail" });
        expect(res.statusCode).toBe(400);
    });
    
})

//User Reg és Login

describe("testing /userReg post route", () =>{
    test("should return 200 status code", async()=>{
       const response = await request(server)
        .post("/userReg")
        .send({email : 'asdaaaa', name : 'kksk', password : "asd", phoneNum : 1234567})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(201)
        userId = response.body.id; 

    })
    test("/userReg should return 400 on missing fields", async () => {
        const res = await request(server)
            .post("/userReg")
            .send({ email: "ssss" });
        expect(res.statusCode).toBe(400);
    });

    test("/userReg should return 500 on server error", async () => {
        const res = await request(server).post("/userReg").send(null);
        expect([500, 400]).toContain(res.statusCode);
    });
})

describe("testing /userLogin post route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server)
        .post("/userLogin")
        .send({email : 'asdaaaa', name : 'kksk', password : "asd"})
        .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined();
        console.log("USER TOKEN IN TEST:", userToken);
        userToken = response.body.token;
    })
    test("/userLogin should return 401 on missing fields", async () => {
        const res = await request(server)
            .post("/userLogin")
            .send({ email: "asdaaaa" });
        expect(res.statusCode).toBe(401);
    });

    test("/userLogin should return 500 on server error", async () => {
        const res = await request(server).post("/userLogin").send(null);
        expect([500, 400]).toContain(res.statusCode);
    });
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
            .post('/appointmentPost')
            .send({
                userID: userId,
                barberID: barberId,
                serviceID: serviceId,
                start_time: "2026-03-18 10:00",
                end_time: "2026-03-18 16:30",
                comment: "asd"
            })
            .set("Authorization", `Bearer ${barberToken}`);

        expect(response.statusCode).toBe(200);
        appointmentId = response.body.id;
    });
});

describe('testing /appointmentUserPost post route', () => {
    test('should return 200 status code', async () => {
        const start_time = "2026-03-20 10:00"
        const end_time = "2026-03-20 11:00"
        const response = await request(server)
            .post('/appointmentUserPost') // <<< itt a helyes endpoint
            .send({ 
                barberID:barberId,
                serviceID: serviceId, 
                start_time: start_time, 
                end_time: end_time, 
                comment: "asd",
                staus:"booked"
            })
            .set("Authorization", `Bearer ${userToken}`);

        console.log("APPOINTMENT POST RESPONSE:", response.body);
        expect(response.body.id).toBeDefined();  // biztos, hogy van ID
        appointmentId = response.body.id;         // eltároljuk a későbbi tesztekhez
        expect(response.statusCode).toBe(200);
    });
});;

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

describe("testing /workhoursMy get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/workhoursMy').set("Authorization", `Bearer ${barberToken}`)
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


describe('GET /availableSlots/:barberID/:date', () => {
    let barberID; 
    let workhoursDate;

    beforeAll(async () => {
        barberID = barberId; 
        workhoursDate = "2026-03-18";
    });

    test('should return available slots for a barber', async () => {
        const response = await request(server)
            .get(`/availableSlots/${barberID}/${workhoursDate}`);

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        // Minden slot érvényes dátum
        response.body.forEach(slot => {
            expect(!isNaN(new Date(slot).getTime())).toBe(true);
        });

        const hasTenOClock = response.body.some(slot => {
            const d = new Date(slot);
            return d.getHours() === 10;
        });

        expect(hasTenOClock).toBe(true);
    });
});


//Update Testek

describe('testing /barberUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .put(`/barberUpdate/${barberId}`)
        .send({name:"asd",  phoneNum:123})
        .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('400 - no data', async () => {
        const res = await request(server)
            .put(`/barberUpdate/${barberId}`)
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('401 - no token', async () => {
        const res = await request(server)
            .put(`/barberUpdate/${barberId}`)
            .send({ name: "test" })
        expect(res.statusCode).toBe(401)
    })

    test('404 - barber not found', async () => {
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
    .send({name:"GERI",  phoneNum:1111111})
    .set("Authorization", `Bearer ${userToken}`)
    expect(response.statusCode).toBe(200)
    })
    test('401 - no token', async () => {
        const res = await request(server)
            .put(`/userUpdate/${userId}`)
            .send({ name: "test" })
    
        expect(res.statusCode).toBe(401)
    })
    
    test('404 - user not found', async () => {
        const res = await request(server)
            .put(`/userUpdate/999999`)
            .set("Authorization", `Bearer ${userToken}`)
    
        expect(res.statusCode).toBe(404)
    })
    
    test('400 - invalid id', async () => {
        const res = await request(server)
            .put(`/userUpdate/abc`)
            .send({ name: "test" })
            .set("Authorization", `Bearer ${userToken}`)
    
        expect(res.statusCode).toBe(400)
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
    test('401 - no token', async () => {
        const res = await request(server)
        .put(`/servicesUpdate/${workhoursId}`)
        expect(res.statusCode).toBe(401)
    })

    test('400 - invalid id', async () => {
        const res = await request(server)
            .put(`/servicesUpdate/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('404 - not found', async () => {
        const res = await request(server)
            .put(`/servicesUpdate/999999`)
            .send({ description: "ffffff" })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


describe('testing /appointmentUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put(`/appointmentUpdate/${appointmentId}`)
    .send({start_time:"2026-03-10 10:00", end_time:"2026-03-10 11:00", comment:"sss"})
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)
    })
    test('401 - no token', async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/${appointmentId}`)
        expect(res.statusCode).toBe(401)
    })

    test('400 - invalid id', async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('404 - not found', async () => {
        const res = await request(server)
            .put(`/appointmentUpdate/999999`)
            .send({ start_time: "2026-03-10 10:00" })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


describe('testing /workhoursUpdate/:id put route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .put(`/workhoursUpdate/${workhoursId}`)
    .send({dayOfWeek:3,  end_time:"18:00"})
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)
    })
    test('400 - invalid id', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/abc`)
            .send({ end_time: "20:00" })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('400 - no data', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/${workhoursId}`)
            .send({})
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('401 - no token', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/${workhoursId}`)
            .send({ end_time: "20:00" })
        expect(res.statusCode).toBe(401)
    })

    test('404 - not found', async () => {
        const res = await request(server)
            .put(`/workhoursUpdate/999999`)
            .send({ dayOfWeek: 4 })
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


//Delete Testek

describe('testing /appointmentDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .delete(`/appointmentDelete/${appointmentId}`)
            .set("Authorization", `Bearer ${barberToken}`); // vagy barberToken

        expect(response.statusCode).toBe(200);
    })
    test('400 - invalid id', async () => {
        const res = await request(server)
            .delete(`/appointmentDelete/abc`)
            .set("Authorization", `Bearer ${barberToken}`);
        console.log("Test response:", res.body);
        expect(res.statusCode).toBe(400);
    });
    test('401 - no token', async () => {
        const res = await request(server)
            .delete(`/appointmentDelete/${appointmentId}`)
        expect(res.statusCode).toBe(401)
    })

    test('404 - not found', async () => {
        const res = await request(server)
            .delete(`/appointmentDelete/999999`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
});

describe('testing /servicesDelete/:id delete route', () => {
test('should return 200 status code', async () => {
    const response = await request(server)
    .delete(`/servicesDelete/${serviceId}`)
    .set("Authorization", `Bearer ${barberToken}`)
    expect(response.statusCode).toBe(200)
    })
    test('401 - no token', async () => {
        const res = await request(server)
            .delete(`/servicesDelete/${serviceId}`)
        expect(res.statusCode).toBe(401)
    })

    test('400 - invalid id', async () => {
        const res = await request(server)
            .delete(`/servicesDelete/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('404 - not found', async () => {
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
    test('401 - no token', async () => {
        const res = await request(server)
            .delete(`/workhoursDelete/${workhoursId}`)
        expect(res.statusCode).toBe(401)
    })

    test('400 - invalid id', async () => {
        const res = await request(server)
            .delete(`/workhoursDelete/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('404 - not found', async () => {
        const res = await request(server)
            .delete(`/workhoursDelete/999999`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


describe('testing /barberDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete(`/barberDelete/${barberId}`)
        .set("Authorization", `Bearer ${barberToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('401 - no token', async () => {
        const res = await request(server)
            .delete(`/barberDelete/${barberId}`)
        expect(res.statusCode).toBe(401)
    })

    test('400 - invalid id', async () => {
        const res = await request(server)
            .delete(`/barberDelete/abc`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('404 - barber not found', async () => {
        const res = await request(server)
            .delete(`/barberDelete/999999`)
            .set("Authorization", `Bearer ${barberToken}`)
        expect(res.statusCode).toBe(404)
    })
})


describe('testing /userDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
        .delete(`/userDelete/${userId}`)
        .set("Authorization", `Bearer ${userToken}`)
        expect(response.statusCode).toBe(200)
    })
    test('401 - no token', async () => {
        const res = await request(server)
            .delete(`/userDelete/${userId}`)
        expect(res.statusCode).toBe(401)
    })

    test('400 - invalid id', async () => {
        const res = await request(server)
            .delete(`/userDelete/abc`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(res.statusCode).toBe(400)
    })

    test('404 - user not found', async () => {
        const res = await request(server)
            .delete(`/userDelete/999999`)
            .set("Authorization", `Bearer ${userToken}`)
        expect(res.statusCode).toBe(404)
    })
})