const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

router.post("/register",userController.Register );


router.post("/login", userController.Login);

router.post("/uploadImage", userController.uploadImage);

module.exports = router;
