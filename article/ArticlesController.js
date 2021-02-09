const express = require('express')
const router = express.Router()
const Category = require('../categories/Categories')
const Articles = require('../article/Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles',adminAuth,(req,res)=>{
    Articles.findAll({
        include:[{model:Category}]
    }).then(articles=>{
        res.render('admin/articles/index',{articles:articles})
    })
})

router.get('/admin/articles/new',adminAuth,(req,res)=>{//Rota Cadastro de novo artigo
    Category.findAll().then(category=>{
        res.render('admin/articles/new',{category:category})
    })
    
})

router.post('/articles/save',adminAuth,(req,res)=>{//salvar
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Articles.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:category
    }).then(()=>{
        res.redirect('/admin/articles')
    })

})

router.post('/articles/delete',adminAuth,(req,res)=>{//deletar
    let id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Articles.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/articles')
            })

        }else{//NOT A NUMBER
            res.redirect('/admin/articles')
        }
    }else{//NULL
        res.redirect('/admin/articles')
    }
})

router.get('/admin/articles/edit/:id',adminAuth,(req,res)=>{
    let id = req.params.id

    Articles.findByPk(id).then(article=>{
        if(article != undefined){


            Category.findAll().then(category=>{
                res.render('admin/articles/edit',{category:category,article:article})
            })
            
        }else{
            res.redirect('/')
        }

    }).catch(err=>{
        res.redirect('/')
    })
})

router.post('/articles/update',adminAuth,(req,res)=>{
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Articles.update({title:title,body:body,categoryId:category,slug:slugify(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect('/admin/articles')
    }).catch(err=>{
        console.log(`Aconteceu o seguinte erro`+err)
        res.redirect('/')
    })
    
})

router.get('/articles/page/:num',adminAuth,(req,res)=>{
    let page = req.params.num
    let offset = 0

    if(isNaN(page) || page ==1){
        offset = 0
    }else{
        offset = (parseInt(page)-1) * 4
    }
    Articles.findAndCountAll({limit:2,offset:offset, order:[
        ['id','DESC']
    ]}).then(articles=>{

        let next
        if(offset + 4 >= articles.count){
            next=true
        }else{
            next=false
        }

        let result ={
            page: parseInt(page),
            next:next,
            articles:articles

        }

        Category.findAll().then(categories=>[
            res.render("admin/articles/page",{result:result,categories:categories})
        ])

        res.json(article)
    })
})

module.exports = router