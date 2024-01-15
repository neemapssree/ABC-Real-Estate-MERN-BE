var express = require('express');
const { userAuth } = require('../middlewares/authorization');
const {orders} = require('../controllers/paymentController');
require("dotenv").config();

var router = express.Router();


router.post('/orders',userAuth,orders);


module.exports = router