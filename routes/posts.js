const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const postsController = require('../controller/posts');
const multer = require('multer')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

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

router.get('', postsController.getPosts);
router.get('/:id', postsController.getPostById);

//protected - logged in users only
//only user who created should be able to delete
router.delete('/:id', checkAuth, postsController.deletePostById);

//protected - logged in users only
router.post("", 
    checkAuth, 
    multer({storage: storage}).single("image"), 
    postsController.createPost
);

//protected - logged in users only 
//only user who created should be able to update
router.put('/:id', 
    checkAuth, 
    multer({storage: storage}).single("image"), 
    postsController.updatePostById
);

module.exports = router;