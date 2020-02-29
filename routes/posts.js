const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/extract-file');
const postsController = require('../controller/posts');

router.get('', postsController.getPosts);
router.get('/:id', postsController.getPostById);

//protected - logged in users only
//only user who created should be able to delete
router.delete('/:id', checkAuth, postsController.deletePostById);

//protected - logged in users only
router.post("", checkAuth, extractFile, postsController.createPost);

//protected - logged in users only 
router.put('/:id', checkAuth, extractFile, postsController.updatePostById);

module.exports = router;