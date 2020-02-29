const Post = require('../models/post');

function getImagePath(filename) {
    return "/images/" + filename;
}

exports.getPosts = ((req, res, next) => {
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
        .populate("createdBy")
        .then(documents => {
            fetchedPost = documents.map(post =>{
                return {
                    _id: post._id,
                    title: post.title,
                    content: post.content,
                    imagePath: post.imagePath,
                    createdBy: post.createdBy._id, 
                    createdByEmail: post.createdBy.email
                };
            })
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Post fetched successfully',
                posts: fetchedPost,
                postCount: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "get post failed"
            })
        });
});

exports.getPostById = ((req, res, next) => {
    Post.findById(req.params.id).populate("createdBy")
        .then(post => {
            if(post){
                transformedPost = {
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    imagePath: post.imagePath,
                    createdBy: post.createdBy._id,
                    createdByEmail: post.createdBy.email
                }
                res.status(200).json(transformedPost);
            }
            else{
                res.status(404).json({
                    message: 'Post not found'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "get post failed"
            })
        });
});

exports.deletePostById = ((req, res, next) => {
    Post.deleteOne({
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
        })
        .catch(error => {
            res.status(500).json({
                message: "deleting post failed"
            })
        });
});

exports.createPost = ((req, res, next) => {
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
    })
    .catch(error => {
        res.status(500).json({
            message: "creating post failed!"
        });
    });
});

exports.updatePostById = ((req, res, next) => {
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
        })
        .catch(error => {
            res.status(500).json({
                message: "Could not update post."
            });
        });
})