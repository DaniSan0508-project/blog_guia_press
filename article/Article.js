const Sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../categories/Categories')

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },slug:{
        type: Sequelize.STRING,
        allowNull:false
    },body:{
        type: Sequelize.TEXT,
        allowNull:false
    }
})

Category.hasMany(Article)//UMA CATEGORIA TEM VARIOS ARTIGOS
Article.belongsTo(Category)




module.exports = Article