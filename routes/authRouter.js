var express = require('express');
const { doSignUp, doLogin } = require('../controllers/authController');
var router = express.Router();

router.post('/sign-up', doSignUp);
router.post('/login', doLogin);

module.exports=router;