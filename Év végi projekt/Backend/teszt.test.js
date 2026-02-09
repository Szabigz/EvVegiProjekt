const teest = require("supertest")

const server = require("./server")


describe("regisztráció", () =>{
    test("helyes statuscode sikeres regisztracional", async()=>{
        await teest(server)
        .post("/reg")
        .send({email : 'asdasd@asd.com', name : 'kkk', password : 'lll', phoneNum : 1234567})
        .set('Accept', 'application/json')
        .expect(200)

    })
})