const express = require('express');
const router = express.Router();

const {AuthController} = require('../../controller.js');

router.post('/signup', (req, res)=>{
    AuthController.signup(req, res);
})

router.post('/login', (req, res) => AuthController.login(req, res));

module.exports = router;