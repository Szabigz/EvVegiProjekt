const { Sequelize, DataTypes } = require("sequelize")
const dbHandler = new Sequelize("barberShop","root","",{
    dialect: "mysql",
    host: "localhost"
})

const userTable = dbHandler.define('user',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneNum:{
      type:DataTypes.INTEGER,
        allowNull:false
    }
    

})

const barberTable = dbHandler.define('barber',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    
    
})

const appointmentsTable = dbHandler.define('appointments',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    appointment:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    barberID:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    serviceID:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    userID:{
      type:DataTypes.INTEGER,
        allowNull:false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "booked"
    },
    comment:{
        type:DataTypes.STRING,
        allowNull:false
    }
    

})

const servicesTable = dbHandler.define('services',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    duration_minutes:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    barberID:{
      type:DataTypes.INTEGER,
      allowNull:false
  }

})


const workHoursTable = dbHandler.define('workhours',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    barberID:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    dayOfWeek:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    start_time:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    end_time:{
        type:DataTypes.DATEONLY,
        allowNull:false
    }



})

const logTable = dbHandler.define('log',{
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  appointmentID: { type: DataTypes.INTEGER, allowNull: true },
  userID: { type: DataTypes.INTEGER, allowNull: false },
  barberID: { type: DataTypes.INTEGER, allowNull: false },

  cancelDate: { type: DataTypes.DATE, allowNull: false },
  activity: { type: DataTypes.STRING, allowNull: false }
});



userTable.hasMany(appointmentsTable, {foreignKey:"userID", sourceKey:"id"})
appointmentsTable.belongsTo(userTable, {foreignKey:"userID", targetKey:"id"})

barberTable.hasMany(appointmentsTable, {foreignKey:"barberID", sourceKey:"id"})
appointmentsTable.belongsTo(barberTable, {foreignKey:"barberID", targetKey:"id"})

barberTable.hasMany(servicesTable, {foreignKey:"barberID", sourceKey:"id"})
servicesTable.belongsTo(barberTable, {foreignKey:"barberID", targetKey:"id"})

barberTable.hasMany(workHoursTable, {foreignKey:"barberID", sourceKey:"id"})
workHoursTable.belongsTo(barberTable, {foreignKey:"barberID", targetKey:"id"})

barberTable.hasMany(servicesTable, {foreignKey:"barberID", sourceKey:"id"})
servicesTable.belongsTo(barberTable, {foreignKey:"barberID", targetKey:"id"})

servicesTable.hasMany(appointmentsTable, { foreignKey: "serviceID" });
appointmentsTable.belongsTo(servicesTable, { foreignKey: "serviceID" });



exports.user = userTable
exports.barber = barberTable
exports.appointments = appointmentsTable
exports.services = servicesTable
exports.workhours = workHoursTable
exports.log = logTable

