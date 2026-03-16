const bcrypt = require("bcrypt");
const server = require("./server");

let barberToken;
let userToken;


const request = require("supertest")
//Barber Testek

describe("testing /barberReg post route", () =>{
    test("should return 200 status code", async()=>{
       const response = await request(server)
        .post("/barberReg")
        .send({email : 'asdaaaaa', name : 'kkk', password : 'lll', phoneNum : 1234567, isAdmin : 0})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    test("should return 400 status code", async()=>{
       const response = await request(server)
        .post("/barberReg")
        .send({trigger: 'error400'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(400);
    });

    test("should return 500 status code", async()=>{
       const response = await request(server)
        .post("/barberReg")
        .send({trigger: 'error500'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(500);
    });
});

// --- Hasonlóan a többi barber route-hoz ---
describe("Barber login és token mentése", () => {
    test("barber should login and get token", async () => {
      const response = await request(server)
        .post("/barberLogin")
        .send({ email: "asdaaaaa", password: "lll" })
        .set("Content-Type", "application/json");
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
  
      barberToken = response.body.token;
    });

    test("should return 500 status code", async()=>{
       const response = await request(server)
        .post("/barberLogin")
        .send({trigger: 'error500'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(500);
    });
});

describe("testing /barberGet get route", () =>{
    test("should return 200 status code", async()=>{
        const response = await request(server).get('/barberGet').set("Authorization", "Bearer fakeToken123")
        expect(response.statusCode).toBe(200)

    })
})




/*
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
    test("should return 200 status code", async()=>{
       const hashedPassword = await bcrypt.hash("123456", 10);
       const response = await request(server)
        .post("/userReg")
        .send({email : 'asdaaaa', name : 'kksk', password : hashedPassword, phoneNum : 1234567})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    test("should return 400 status code", async()=>{
       const response = await request(server)
        .post("/userReg")
        .send({trigger: 'error400'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(400);
    });

    test("should return 500 status code", async()=>{
       const response = await request(server)
        .post("/userReg")
        .send({trigger: 'error500'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(500);
    });
});

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
        .send({email : 'user@example.com', password : '123456'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(200);
    });

    test("should return 400 status code", async()=>{
       const response = await request(server)
        .post("/userLogin")
        .send({trigger: 'error400'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(400);
    });

    test("should return 500 status code", async()=>{
       const response = await request(server)
        .post("/userLogin")
        .send({trigger: 'error500'})
        .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(500);
    });
});


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


// APPOINTMENT TESTEK

describe('testing /appointmentPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).post('/appointmentPost')
        .send({ serviceID: 2, userID: 3, status: "van hely", start_time:"2026-03-10 11:00", end_time:"2026-03-10 12:00", comment:"asd"})
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test('should return 400 status code', async () => {
        const response = await request(server).post('/appointmentPost')
        .send({ trigger: 'error400' })
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(400);
    });

    test('should return 500 status code', async () => {
        const response = await request(server).post('/appointmentPost')
        .send({ trigger: 'error500' })
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(500);
    });

    test('should return 401 status code', async () => {
        const response = await request(server).post('/appointmentPost'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});

describe('testing /appointmentGet get route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).get('/appointmentGet')
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test('should return 401 status code', async () => {
        const response = await request(server).get('/appointmentGet'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});

describe('testing /appointmentMyBarber get route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).get('/appointmentMyBarber')
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test('should return 401 status code', async () => {
        const response = await request(server).get('/appointmentMyBarber'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});

describe('testing /appointmentMyUser get route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).get('/appointmentMyUser')
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test('should return 401 status code', async () => {
        const response = await request(server).get('/appointmentMyUser'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});

describe('testing /appointmentUpdate/:id put route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server).put('/appointmentUpdate/7')
        .send({ start_time:"2026-03-10 10:00", comment:"sss" })
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test('should return 400 status code', async () => {
        const response = await request(server).put('/appointmentUpdate/7')
        .send({ trigger: 'error400' })
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(400);
    });

    test('should return 500 status code', async () => {
        const response = await request(server).put('/appointmentUpdate/7')
        .send({ trigger: 'error500' })
        .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(500);
    });

    test('should return 401 status code', async () => {
        const response = await request(server).put('/appointmentUpdate/7'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});

describe('testing /appointmentDelete/:id delete route', () => {
    test('should return 200 status code', async () => {
      const response = await request(server)
        .delete('/appointmentDelete/1')
        .set("Authorization", "Bearer fakeToken123");
      expect(response.statusCode).toBe(200);
    });
  
    test('should return 400 status code', async () => {
      const response = await request(server)
        .delete('/appointmentDelete/1')
        .set("Authorization", "Bearer fakeToken123")
        .send({ trigger: 'error400' });
      expect(response.statusCode).toBe(400);
    });
  
    test('should return 500 status code', async () => {
      const response = await request(server)
        .delete('/appointmentDelete/1')
        .set("Authorization", "Bearer fakeToken123")
        .send({ trigger: 'error500' });
      expect(response.statusCode).toBe(500);
    });
  
    test('should return 401 status code', async () => {
      const response = await request(server)
        .delete('/appointmentDelete/1'); // nincs auth header
      expect(response.statusCode).toBe(401);
    });
  });

//Appoinment Testek vége


//Services Testek

describe('testing /servicesPost post route', () => {

    test('should return 200 status code', async () => {
        const response = await request(server)
            .post('/servicesPost')
            .set("Authorization", "Bearer fakeToken123")
            .send({ name: "asd", description: "asdasd", duration_minutes: 10, price: 5000 });
        expect(response.statusCode).toBe(200);
    });

    test('should return 400 status code', async () => {
        const response = await request(server)
            .post('/servicesPost')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error400' });
        expect(response.statusCode).toBe(400);
    });

    test('should return 500 status code', async () => {
        const response = await request(server)
            .post('/servicesPost')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error500' });
        expect(response.statusCode).toBe(500);
    });

    test('should return 401 status code', async () => {
        const response = await request(server)
            .post('/servicesPost'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });

});

describe("testing /servicesMy get route", () => {
    
    test("should return 200 status code", async () => {
        const response = await request(server)
            .get('/servicesMy')
            .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test("should return 401 status code", async () => {
        const response = await request(server)
            .get('/servicesMy'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });

});

describe("testing /servicesGet get route", () => {
    
    test("should return 200 status code", async () => {
        const response = await request(server)
            .get('/servicesGet')
            .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test("should return 401 status code", async () => {
        const response = await request(server)
            .get('/servicesGet'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });

});


describe('testing /servicesUpdate/:id put route', () => {

    test('should return 200 status code', async () => {
        const response = await request(server)
            .put('/servicesUpdate/5')
            .set("Authorization", "Bearer fakeToken123")
            .send({ name: "asdasdasd", price: 5500 }); // normál request
        expect(response.statusCode).toBe(200);
    });

    test('should return 400 status code', async () => {
        const response = await request(server)
            .put('/servicesUpdate/5')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error400' }); // trigger 400
        expect(response.statusCode).toBe(400);
    });

    test('should return 500 status code', async () => {
        const response = await request(server)
            .put('/servicesUpdate/5')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error500' }); // trigger 500
        expect(response.statusCode).toBe(500);
    });

    test('should return 401 status code', async () => {
        const response = await request(server)
            .put('/servicesUpdate/5'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });

});

describe('testing /servicesDelete/:id delete route', () => {

    test('should return 200 status code', async () => {
        const response = await request(server)
            .delete('/servicesDelete/1')
            .set("Authorization", "Bearer fakeToken123")
            .send({}); // üres body, trigger nélkül
        expect(response.statusCode).toBe(200);
    });

    test('should return 400 status code', async () => {
        const response = await request(server)
            .delete('/servicesDelete/1')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error400' }); // trigger 400
        expect(response.statusCode).toBe(400);
    });

    test('should return 500 status code', async () => {
        const response = await request(server)
            .delete('/servicesDelete/1')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error500' }); // trigger 500
        expect(response.statusCode).toBe(500);
    });

    test('should return 401 status code', async () => {
        const response = await request(server)
            .delete('/servicesDelete/1'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });

});
//Services Testek vége


//Workhours Testek

describe('testing /workhoursPost post route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .post('/workhoursPost')
            .set("Authorization", "Bearer fakeToken123")
            .send({ dayOfWeek: 3, start_time: "10:00", end_time: "16:00" });
        expect(response.statusCode).toBe(200);
    });

    test('should return 400 status code', async () => {
        const response = await request(server)
            .post('/workhoursPost')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error400' });
        expect(response.statusCode).toBe(400);
    });

    test('should return 500 status code', async () => {
        const response = await request(server)
            .post('/workhoursPost')
            .set("Authorization", "Bearer fakeToken123")
            .send({ trigger: 'error500' });
        expect(response.statusCode).toBe(500);
    });

    test('should return 401 status code', async () => {
        const response = await request(server)
            .post('/workhoursPost'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});


describe('testing /workhoursGet get route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .get('/workhoursGet')
            .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test('should return 401 status code', async () => {
        const response = await request(server)
            .get('/workhoursGet'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});


describe('testing /workhoursMy get route', () => {
    test('should return 200 status code', async () => {
        const response = await request(server)
            .get('/workhoursMy')
            .set("Authorization", "Bearer fakeToken123");
        expect(response.statusCode).toBe(200);
    });

    test('should return 401 status code', async () => {
        const response = await request(server)
            .get('/workhoursMy'); // nincs auth header
        expect(response.statusCode).toBe(401);
    });
});


describe('testing /workhoursUpdate/:id put route', () => {

    test('should return 200 status code', async () => {
      const response = await request(server)
        .put('/workhoursUpdate/1')
        .set("Authorization", "Bearer fakeToken123")
        .send({ dayOfWeek: 3, start_time: "10:00", end_time: "16:00" });
      expect(response.statusCode).toBe(200);
    });
  
    test('should return 400 status code', async () => {
      const response = await request(server)
        .put('/workhoursUpdate/1')
        .set("Authorization", "Bearer fakeToken123") 
        .send({ trigger: 'error400' });
      expect(response.statusCode).toBe(400);
    });
  
    test('should return 500 status code', async () => {
      const response = await request(server)
        .put('/workhoursUpdate/1')
        .set("Authorization", "Bearer fakeToken123") 
        .send({ trigger: 'error500' });
      expect(response.statusCode).toBe(500);
    });
  
    test('should return 401 status code', async () => {
        const response = await request(server)
          .put('/workhoursUpdate/1')
          .send({});
        expect(response.statusCode).toBe(401);
    });
  
  });

describe('testing /workhoursDelete/:id delete route', () => {

    test('should return 200 status code', async () => {
      const response = await request(server)
        .delete('/workhoursDelete/1')
        .set("Authorization", "Bearer fakeToken123")
        .send({}); // üres body, trigger nélkül
      expect(response.statusCode).toBe(200);
    });
  
    test('should return 400 status code', async () => {
      const response = await request(server)
        .delete('/workhoursDelete/1')
        .set("Authorization", "Bearer fakeToken123")
        .send({ trigger: 'error400' });
      expect(response.statusCode).toBe(400);
    });
  
    test('should return 500 status code', async () => {
      const response = await request(server)
        .delete('/workhoursDelete/1')
        .set("Authorization", "Bearer fakeToken123")
        .send({ trigger: 'error500' });
      expect(response.statusCode).toBe(500);
    });
  
    test('should return 401 status code', async () => {
      const response = await request(server)
        .delete('/workhoursDelete/1');
      expect(response.statusCode).toBe(401);
    });
});


//workhours testek vége*/