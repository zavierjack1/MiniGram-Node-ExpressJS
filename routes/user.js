const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
/*****************************
 *  router
 * **************************
 ****************************/

router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);
router.get('/:id', userController.getUserById);
module.exports = router;
