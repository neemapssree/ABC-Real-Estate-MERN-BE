const USERS = require('./Models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const doSignUp = async (req,res) => {
    const users = await USERS.findOne({email:req.body.email}) 
        if (users) {
            res.status(200).json({message:'email already exist'}); 
            return //the code below it will not work if email already exist           
        }

    console.log('sign up data', req.body);
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        console.log(hash);
        USERS({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            country:req.body.country,
            gender:req.body.gender,
            password:hash
        }).save().then((response)=> {
            res.status(200).json({message:'signup successfull'});
        });
      });    
}

const doLogin = async (req,res) => {
    console.log(req.body, "step 1");
    const user = await USERS.findOne({email:req.body.email}).maxTimeMS(30000);
    console.log(user,"step 2");
    if(user){
        bcrypt.compare(req.body.password,user.password, (err,hashRes)=>{
            console.log(hashRes,"step 3");
            if(hashRes){
                console.log('Password correct - step 4');
                const token = jwt.sign({userId:user._id,name:user.name,email:user.email,role:user?.role},process.env.JWT_PASSWORD ?? "realestateapp",{expiresIn:'2d'});
                console.log(process.env.JWT_PASSWORD);
                //console.log('Token value:', token, );
                res.status(200).json({message:'Logged in successfully',token:token});
            }
            else{                
                res.status(200).json({message:'Enter the correct password',token:null});
            }
        });        

    }else {
        res.status(200).json({message:'User not found',token:null});
    }
}

module.exports = {doSignUp, doLogin};