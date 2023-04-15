const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {};

User.init({
  nonce: {
    allowNull: false,
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: () => Math.floor(Math.random() * 1000000) // Initialize with a random nonce
  },
  publicAddress: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: { isLowercase: true }
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  isProvider:{
   type: DataTypes.BOOLEAN,
   defaultValue:false,
  },
 credits:{
   type: DataTypes.DOUBLE,
   defaultValue:0,
  }
}, {
  sequelize,
  modelName: 'user',
})

module.exports = User;