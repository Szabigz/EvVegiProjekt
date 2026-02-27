const { Sequelize, DataTypes } = require("sequelize");

const dbHandler = new Sequelize("barberShop", "root", "", {
  dialect: "mysql",
  port:3307,
  host: "localhost"
});

/* USERS */
const userTable = dbHandler.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNum: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

/* BARBERS */
const barberTable = dbHandler.define("barbers", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNum:{
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  email:{
    type:DataTypes.STRING,
    allowNull:false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  isAdmin:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    DefaultValue:false
  }

});

/* SERVICES */
const servicesTable = dbHandler.define("services", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  barberID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

/* WORKHOURS */
const workHoursTable = dbHandler.define("workhours", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  barberID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  }
});

/* APPOINTMENTS */
const appointmentsTable = dbHandler.define("appointments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  barberID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  serviceID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

/* LOGS */
const logTable = dbHandler.define("logs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  appointmentID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  barberID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  activity: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
appointmentsTable.belongsTo(userTable, { foreignKey: "userID" });
userTable.hasMany(appointmentsTable, { foreignKey: "userID" });

appointmentsTable.belongsTo(barberTable, { foreignKey: "barberID" });
barberTable.hasMany(appointmentsTable, { foreignKey: "barberID" });

barberTable.hasMany(servicesTable, { foreignKey: "barberID" });
servicesTable.belongsTo(barberTable, { foreignKey: "barberID" });

barberTable.hasMany(workHoursTable, { foreignKey: "barberID" });
workHoursTable.belongsTo(barberTable, { foreignKey: "barberID" });

servicesTable.hasMany(appointmentsTable, { foreignKey: "serviceID" });
appointmentsTable.belongsTo(servicesTable, { foreignKey: "serviceID" });

/* USERS ↔ LOGS */
userTable.hasMany(logTable, { foreignKey: "userID" });
logTable.belongsTo(userTable, { foreignKey: "userID" });

/* BARBERS ↔ LOGS */
barberTable.hasMany(logTable, { foreignKey: "barberID" });
logTable.belongsTo(barberTable, { foreignKey: "barberID" });

/* APPOINTMENTS ↔ LOGS */
appointmentsTable.hasMany(logTable, { foreignKey: "appointmentID" });
logTable.belongsTo(appointmentsTable, { foreignKey: "appointmentID" });


module.exports = {
    user: userTable,
    barber: barberTable,
    services: servicesTable,
    workhours: workHoursTable,
    appointments: appointmentsTable,
    log: logTable,
    db: dbHandler
  };
  