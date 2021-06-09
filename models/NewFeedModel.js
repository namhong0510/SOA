const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewFeedSchema = new Schema({
    content:String,
    image:String,
    user:Array,
    likecount:Integer,
    likelist:Array,
    commentcount:Integer,
    commentlist:Array,
    linkyoutube:String,
    date:{type: Date, default: Date.now}
})

module.exports = mongoose.model('NewFeed',NewFeedSchema)
