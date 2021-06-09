const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')

const upload = multer({dest:'uploads',fileFilter:(req,file,callback)=>{
    console.log(file)
    if(file.mimetype.startsWith('image/')){
        callback(null,true)
    }else{
        callback(null,false)
    }
},limits:{fileSize:500000}})

const FacultyAccount= require('../models/FacultyAccount')
const addfacultyValidator = require('./validators/addfacultyValidator')


Router.get('/user',(req,res)=>{
    FacultyAccount.find()
    .then(FacultyAccounts =>{
        res.json({
            code:0,
            message: 'Đọc danh sách User thành công',
            data:FacultyAccounts
        })
    })
})

Router.get('/user/:id',(req,res)=>{
    let {id} = req.params
    if(!id){
        return res.json({code:1,message:"Không có thông tin user"})
    }

    FacultyAccount.findById(id)
    .then(a=>{
        if(a){
            return res.json({code:0,message:"Đã tìm thấy tài khoản user",data:a})

        }else{
            return res.json({code:2,message:"Không tìm thấy tài khoản user"})
        }
    })
    .catch(e=>{
        if(e.message.includes('Cast to Object failed')){
            return res.json({code:3,message:"Đây không phải id hợp lệ"})
        }
        return res.json({code:3,message:e.message})
    })
})

Router.post('/adduser',addfacultyValidator,(req,res)=>{
    let result = validationResult(req)
    if(result.errors.length ===0){
        let {user,password,role}= req.body
        FacultyAccount.findOne({user:user})
        .then(acc=>{
            if(acc){
                throw new Error("Khoa đã được tạo") 
            }
        })
        .then(()=>bcrypt.hash(password,10))
        .then(hashed =>{
            let userFaculty = new FacultyAccount({
                user:user,
                password:hashed,
                role:role
            })
            userFaculty.save()
        })
        .then(()=>{
            return res.json({code:0,message:'Đăng ký thành công'})    
        })
        .catch(e=>{
            return res.json({code:2,message:"Đăng ký thất bại:"+ e.message})
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


Router.delete('/user/:id',(req,res)=>{
    let {id} = req.params
    if(!id){
        return res.json({code:1,message:"Không có thông tin user"})
    }

    FacultyAccount.findByIdAndDelete(id)
    .then(a=>{
        if(a){
            return res.json({code:0,message:"Đã xóa tài khoản user",data:a})

        }else{
            return res.json({code:2,message:"Không tìm thấy tài khoản user"})
        }
    })
    .catch(e=>{
        if(e.message.includes('Cast to Object failed')){
            return res.json({code:3,message:"Đây không phải id hợp lệ"})
        }
        return res.json({code:3,message:e.message})
    })
})

Router.put("/user/:id",(req,res)=>{
    let {id} = req.params
    if(!id){
        return res.json({code:1,message:"Không có thông tin user"})
    }

    let supportedFields = ['password','Role']
    let updateData = req.body

    for (field in updateData){
        if(!supportedFields.includes(field)){
            delete updateData[field]
        }
    }

    if(!updateData){
        return res.json({code:2,message:"Không có dữ có dữ liệu cần cập nhật"})
    }

    FacultyAccount.findByIdAndUpdate(id, updateData,{new:true})
    .then(a=>{
        if(a){
            return res.json({code:0,message:"Đã cập nhật tài khoản user",data:a})

        }else{
            return res.json({code:2,message:"Không tìm thấy tài khoản user"})
        }
    })
    .catch(e=>{
        if(e.message.includes('Cast to Object failed')){
            return res.json({code:3,message:"Đây không phải id hợp lệ"})
        }
        return res.json({code:3,message:e.message})
    })
})


module.exports = Router