var express = require('express');
const { getAllProperties, getSinglePropData, dayWiseSlotFunction, cancelBooking } = require('../controllers/getPropsController');
const { userAuth } = require('../middlewares/authorization');
const {getMyBookingsData} = require('../controllers/userController');
var router = express.Router();

/* GET users listing. */
router.get('/getAllProperties',userAuth,getAllProperties)
router.get('/single-prop',userAuth,getSinglePropData)
router.get('/dayWiseTimeSlot',userAuth,dayWiseSlotFunction)
router.get('/getMyBookingsData',userAuth,getMyBookingsData)
router.get('/cancelBooking',userAuth,cancelBooking)

module.exports = router;
