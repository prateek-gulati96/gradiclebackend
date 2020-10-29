const { model } = require('mongoose')

mongoose = require('mongoose')

const blogpostSchema = new mongoose.Schema({
    blogTopic : {
        type: String,
        required: true
    },
    category :{
        type: String,
        required: true
    },
    subcategory :{
        type: String,
        required: true
    },
    dateCreated:{
        type: Date,
        required: true,
        default : Date.now
    },
    dateModified:{
        type: Date,
        required: true,
        default : Date.now
    },
    image:{
        type: String,
        required: false
    },
    videoURL:{
        type: String,
        required: false
    },
    body :{
        type : String, 
        required : true
    }

})

module.exports = mongoose.model('Blog',blogpostSchema)