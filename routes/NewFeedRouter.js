const express = require('express')
const Router = express.Router()
const multer = require('multer')
const fs = require('fs')

const Newfeed = require('../models/NotificationModel')
const {validationResult} = require('express-validator')
const CheckLogin = require('../auth/CheckLogin')
const NewFeedValidator = require('./validators/addNewfeed')

const PageValidator = require('./validators/NotificationPageValidator')
const endOfDay=  require('date-fns/endOfDay')
const startOfDay = require('date-fns/startOfDay') 


Router.get('/',(req,res)=>{
    Newfeed.find()
    .then(Newfeeds =>{
        res.json({
            code:0,
            message: 'Đọc danh sách newfeed thành công',
            data:Newfeeds
        })
    })
})

Router.post('/add',CheckLogin,NewFeedValidator,(req,res)=>{
    let result = validationResult(req)
    if(result.errors.length ===0){
        let {content}= req.body
        let userCurrent = req.user.user
         	
        let newTus = new NewFeed({
            content:content,
            user:userCurrent
        })
        newTus.save()
    
        .then(()=>{
            return res.json({code:0,message:'Tạo bài đăng thành công'})    
        })
        .catch(e=>{
            return res.json({code:2,message:"Tạo bài đăng thất bại:"+ e.message})
        })     
    }
    else{
        let messages = result.mapped()
        let message = ''
        for(m in messages){
            message= messages[m].msg
            break
        }
        return res.json({code:1,message:message})
    }
})


module.exports = Router
