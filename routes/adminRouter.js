var express = require('express');
var router = express.Router();
const { addProperty, addTimeSlotData, deleteTimeSlotData, updatePropData } = require('../controllers/adminController');

const multer = require('multer');
const { adminAuth } = require('../middlewares/authorization');

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=> {        
        cb(null,'public/properties')
    },
    filename:(req,file,cb)=>{
        const originalname = file.originalname;
        // Replace spaces with hyphens in the file name
        const updatedfilename = originalname.replace(/\s+/g, '-');
        cb(null,Date.now()+"-"+updatedfilename)        
        // cb(null, file.originalname)
    }
})


const upload = multer({storage:fileStorage});

router.post('/addProperty',adminAuth,upload.single('image'), addProperty);      // before devaiting to addProeprty, will modify the image file using multer
router.post('/addTimeSlotData',adminAuth,addTimeSlotData);
router.post('/deleteTimeSlot',adminAuth,deleteTimeSlotData);
router.post('/updatePropData',adminAuth, updatePropData);
module.exports=router;