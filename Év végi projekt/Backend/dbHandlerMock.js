const bcrypt = require("bcrypt");

const modelMock = {
  sync: jest.fn(),
  create: jest.fn((data) => Promise.resolve({ id: 1, ...data })),
  findAll: jest.fn(() => Promise.resolve([{ id: 1 }])),
  findOne: jest.fn((query) => {
    const where = query?.where || {};
    // Ha van id vagy email, visszaadjuk a "létező" objektumot
    if (where.id || where.email) {
      return Promise.resolve({
        id: where.id || 1,
        name: "Test",
        email: where.email || "test@test.com",
        password: bcrypt.hashSync("123456", 9),
        phoneNum: 1234567,
        barberID: 1,
        userID: 1,
        serviceID: 1,
        start_time: new Date(),
        end_time: new Date(),
        status: "available",
        comment: "asd",
        update: jest.fn(),
      });
    }
    return Promise.resolve(null);
  }),
  update: jest.fn(() => Promise.resolve([1])),
  destroy: jest.fn(() => Promise.resolve(1)),
};

module.exports = {
  user: { ...modelMock },
  barber: { ...modelMock },
  services: { ...modelMock },
  workhours: { ...modelMock },
  appointments: { ...modelMock },
  log: { ...modelMock },
  db: {},
};