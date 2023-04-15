const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Job extends Model {};

Job.init({
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
    unique: false
  },
  id:{
   type: DataTypes.INTEGER,
   defaultValue:false,
  unique:true
  },
 credits:{
   type: DataTypes.DOUBLE,
   defaultValue:0,
  },
  skills:{
   type: DataTypes.STRING,
   defaultValue:0,
  }
}, {
  sequelize,
  modelName: 'job',
})

module.exports = Job;