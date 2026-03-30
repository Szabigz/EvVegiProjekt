require('dotenv').config();
const { Sequelize, DataTypes } = require("sequelize");

const dbHandler = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    timezone: '+01:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  }
);

//USERS
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

//BARBERS
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
    type: DataTypes.STRING,
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profile_image: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  isAdmin:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  }

});

//SERVICES
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

//WORKHOURS
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

//APPOINTMENTS
const appointmentsTable = dbHandler.define("appointments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: true
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
    allowNull: false,
    defaultValue:"booked"
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

//LOGS
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
    allowNull: false,
    defaultValue: dbHandler.Sequelize.NOW
  },
  activity: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
userTable.hasMany(appointmentsTable, { foreignKey: "userID" });
appointmentsTable.belongsTo(userTable, { foreignKey: "userID" });

barberTable.hasMany(appointmentsTable, { foreignKey: "barberID" });
appointmentsTable.belongsTo(barberTable, { foreignKey: "barberID" });

barberTable.hasMany(servicesTable, { foreignKey: "barberID" });
servicesTable.belongsTo(barberTable, { foreignKey: "barberID" });

barberTable.hasMany(workHoursTable, { foreignKey: "barberID" });
workHoursTable.belongsTo(barberTable, { foreignKey: "barberID" });

servicesTable.hasMany(appointmentsTable, { foreignKey: "serviceID" });
appointmentsTable.belongsTo(servicesTable, { foreignKey: "serviceID" });

//USERS LOGS
userTable.hasMany(logTable, { foreignKey: "userID" });
logTable.belongsTo(userTable, { foreignKey: "userID" });

//BARBERS LOGS
barberTable.hasMany(logTable, { foreignKey: "barberID" });
logTable.belongsTo(barberTable, { foreignKey: "barberID" });

//APPOINTMENTS LOGS
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
  