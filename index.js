const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./article/ArticlesController')
const usersController = require('./user/UserController')
const User = require('./user/User')
const session = require('express-session')
const Categories = require('./categories/Categories')
const Article = require('./article/Article')
const PORT = 3030

//View engine
app.set('view engine','ejs')
//Sessions
app.use(session({
    secret: "textoqualquer",cookie:{maxAge:3000000}
}))

//permitir arquivos estaticos, buscar na pasta public
app.use(express.static('public'))
//Body Parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())




//Conexão com a database , utilizando database/sequelize
connection.authenticate()
    .then(()=>{
        console.log('Mysql conectado')
    }).catch(err=>{
        console.log(err)
    })

//Rotas
app.get('/',(req,res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:4
    }).then(articles=>{
        Categories.findAll().then(categories=>{
            res.render('index',{articles:articles,categories:categories})
        })
    })
})

//Rotas em outro diretorio, Router do express
app.use('/',categoriesController)
app.use('/',articlesController)
app.use('/',usersController)



app.get('/:slug',(req,res)=>{
    let slug = req.params.slug
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(articles=>{
        if(articles != undefined){
            Categories.findAll().then(categories=>{
                res.render('articles',{articles:articles,categories:categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(err=>{
        redirect('/')
    })
})

app.get('/category/:slug',(req,res)=>{
    let slug = req.params.slug
    Categories.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]   
    }).then(category=>{
        
        if(category != undefined){  
            Categories.findAll().then(categories=>{
                res.render('index',{articles:category.articles,categories:categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(err=>{
        res.redirect('/')
    })
})

    
app.listen(PORT,()=>{
    console.log(`Servidor inicado na porta ${PORT}`)//2 passo , inicar o servidor
})