require('dotenv').config()
//initialise
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const blogpost = require('../schema/blogpostSchema')
const multer = require('multer')
const fs = require('fs');



const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null, './uploads/')
  },
  filename : (req,file,cb)=>{
    cb(null,Date.now()+file.originalname)
  }
});

const upload = multer({storage : storage ,
  fileFilter : (req,file,cb)=> {
    if (file.mimetype =='image/png' || file.mimetype =='image/jpg'|| file.mimetype =='image/jpeg') {
      cb(null,true)
    } else{
      cb(new Error('only png,jpeg and jpg format allowed'), false)
    }
} ,
  limits : {fileSize : 1024* 1024 *5}
})

//export rrouter to server
module.exports = router
blogPost=require('../schema/blogpostSchema')

//login
router.post ('/login', (req, res)=>{
  var username = req.body.username
  var password = req.body.password
  if (username == "parth" && password == "parth") {
    let token = jwt.sign({name : username}, "tokenIdentity", {expiresIn: "1h"})
    res.json({
      message: "Login Successful",
      token
    })
    return res.send();
  } else {
    res.json({
      message: "Login Unsuccessful",
    })
    return res.status(404).send();
  }
})


// Getting all blog posts
router.get('/', async(req, res) => {
    try {
      const blogs = await blogpost.find()
      res.json(blogs)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  })
  
// Getting One blogpost
  router.get('/:id', getBlogpost  ,(req, res) => {
    res.json(res.blog)
  })

// Getting One blogpost based on category
  router.get('/blog/category/:category', getBlogpostbyCategory  ,(req, res) => {
    res.json(res.blog)
  })

// Getting One blogpost based on subcategory
  router.get('/blog/subCat/:subcategory', getBlogpostbysubCategory  ,(req, res) => {
    res.json(res.blog)
  })

// Creating post
  router.post('/', upload.single('blogImage'),async (req, res) => {
        blog = new blogpost({
          blogTopic : req.body.blogTopic,
          category : req.body.category,
          subcategory :req.body.subcategory,
          date : req.body.date,
          body : req.body.body,
          videoURL: req.body.videoURL,
          image : req.file.path,
          dateCreated : req.body.dateCreated

    })
    try {
      const newBlogpost = await blog.save()
      res.status(201).json(newBlogpost)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  })

  // Updating post based on parameter
  router.patch('/:id', getBlogpost, async (req, res) => {
    if(req.body.category!= null){res.blog.category=req.body.category}
    if(req.body.blogTopic!= null){res.blog.blogTopic=req.body.blogTopic}
    if(req.body.subcategory!= null){res.blog.subcategory=req.body.subcategory}
    if(req.body.body!= null){res.blog.body=req.body.body}
    if(req.body.videoURL!= null){res.blog.videoURL=req.body.videoURL}
    res.blog.dateCreated = req.body.dateCreated
    res.blog.dateModified = Date.now()
    try {
      const updatedBlogPost = await res.blog.save()
      res.json({ message : "Sucessfully Updated blog"})
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
    
  })
  
  // Deleting One post
  router.delete('/:id', getBlogpost,async (req, res) => {
    try {
      
      fs.unlink('./'+res.blog.image, function (error) {
        // if (error) res.status(500).json({ message: error.message });
        // if no error, file has been deleted successfully
        
    });
      await res.blog.remove()
      res.status(200).json({ message: 'Deleted Blog Post!' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  //middleware to get blogPosts
  async function getBlogpost(req, res, next) {
    let blog
    try {
       blog= await blogpost.findById(req.params.id)
       console.log(blog)
      if (blog== null) {
        return res.status(404).json({ message: 'Cannot find subscriber' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.blog = blog
    next()
  }
  //middleware to get blogPosts by category
  async function getBlogpostbyCategory(req, res, next) {
    let blog
    try {
       blog= await blogpost.find({category : req.params.category})
       
      if (blog== null) {
        return res.status(404).json({ message: 'Cannot find subscriber' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.blog = blog
    next()
  }

  //middlewaere to get blog post based on subcategory
  async function getBlogpostbysubCategory(req, res, next){
    let blog
    try {
       blog= await blogpost.find({subcategory : req.params.subcategory})
       
      if (blog== null) {
        return res.status(404).json({ message: 'Cannot find subscriber' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.blog = blog
    next()
  }
