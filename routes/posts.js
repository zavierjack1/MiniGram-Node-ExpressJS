const express = require('express');
const router = express.Router();
const multer = require('multer')
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage(
    {
        destination: (req, file, callback) => {
            const isValid = MIME_TYPE_MAP[file.mimetype];
            let error = new Error('invalid mime type');
            if (isValid){
                error = null;
            }
            callback(error, 'images') //path relative to server.js
        }, 
        filename: (req, file, callback) => {
            const name = file.originalname.toLowerCase().split(' ').join('-');
            const ext = MIME_TYPE_MAP[file.mimetype];
            callback(null, name + '-' + Date.now() + '.' + ext);
        }
    }
);

function getImagePath(filename) {
    return "/images/" + filename;
}

/*****************************
 *  router
 * **************************
 ****************************/

router.get('',(req, res, next) => {
    //param querys
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if (pageSize && currentPage){
        postQuery.
            skip(pageSize*(currentPage-1)).
            limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPost = documents
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Post fetched successfully',
                posts: fetchedPost,
                postCount: count
            });
        });
});

router.get('/:id',(req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if(post){
                res.status(200).json(post);
            }
            else{
                res.status(404).json({
                    message: 'Post not found'
                });
            }
        });
});

//protected - logged in users only
//only user who created should be able to delete
router.delete(
    '/:id',
    checkAuth, 
    (req, res, next) => {
        Post.deleteOne(
            {
                 _id: req.params.id,
                 createdBy: req.userData.userId //check that the createBy in DB = userId passed in via request. (which is added in the auth-interceptor)
            })
            .then(result => {
                if (result.n > 0){
                    res.status(200).json({
                        message: "Post deleted successfully"
                    });
                }
                else{
                    res.status(401).json({
                        message: "Not Authorized"
                    });
                }
            });
});

//protected - logged in users only
router.post("", 
    checkAuth, //dont execute function with () simply pass function
    multer({storage: storage}).single("image"), 
    (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        const post = new Post(
            {
                title: req.body.title,
                content: req.body.content,
                imagePath: url + getImagePath(req.file.filename),
                createdBy: req.userData.userId
            }
        );
        post.save().then(createdPost =>{
            res.status(201).json({
                message: "Post added successfully",
                post: {
                    id: createdPost._id,
                    title: createdPost.title,
                    content: createdPost.content,
                    imagePath: createdPost.imagePath
                }
            });
        });
});

//protected - logged in users only 
//only user who created should be able to update
router.put('/:id', 
    checkAuth, 
    multer({storage: storage}).single("image"), 
    (req, res, next) =>{
        //when we send put, if no file selected, the filePath will be a string in the body
        let imagePath = req.body.imagePath;
        //if new file uploaded, the filepath comes from the getImagePath
        if (req.file){
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + getImagePath(req.file.filename)
        }
        const post = new Post({ 
            _id: req.body.id, 
            title: req.body.title,
            content: req.body.content, 
            imagePath: imagePath, 
            createdBy: req.userData.userId
        });
        Post.updateOne(
                { 
                    _id: req.params.id, 
                    createdBy: req.userData.userId //check that the createBy in DB = userId passed in via request. (which is added in the auth-interceptor)
                }, 
                post
            )
            .then(result => {
                if (result.nModified > 0){
                    res.status(200).json({
                        message: "Post updated successfully"
                    });
                }
                else{
                    res.status(401).json({
                        message: "Not Authorized"
                    });
                }
            });
});

module.exports = router;