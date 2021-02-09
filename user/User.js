
const Sequelize = require('sequelize')
const connection = require( '../database/database')

const User = connection.define('user',{
    email:{
        type: Sequelize.STRING,
        allowNul: false
    },password:{
        type: Sequelize.STRING,
        allowNull:false
    }
})



module.exports =  User