const bCrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const User=require('../model/userModel')
require('dotenv').config()

exports.registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      userName,
      password,
      userType
    } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({
        message: "All required fields needed"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bCrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
      userType
    });

    await newUser.save();

    res.status(200).json({
      message: `${userType} registered successfully`,
      data: {
        id: newUser._id,
        firstName: newUser.firstName,
        email: newUser.email
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.loginUser=async(req,res)=>{
    try{
       const {email,userName,password}=req.body
       const user=await User.findOne({email})
       if(!user){
   return res.status(400).json({message:'User not found'})
       }
       const isMatch=await bCrypt.compare(password,user.password)
                                //  users password    hashed pasword from server
            if(!isMatch){
                return res.status(400).json({message:'Invalid password'})
            }        
            const token=jwt.sign({
                id:user._id,username:userName,usertype:user.userType,email:user.email
            },process.env.secretKey)     
            res.cookie('token',token)

            const safeUser={
              id:user._id,username:userName,email:email,userType:user.userType  //THIS METHOD IS USED FOR SHOWING USER INFO
            }

            return res.status(200).json({message:'Login success',token,user:safeUser})       //AND ADD USER:SAFEUSER FOR PRINTING
    }
    catch(err){
res.status(500).json({message:err.message})
    }
}


exports.getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "Not Authenticated" });
  }

  const { _id, username, email, usertype } = req.user;

  return res.status(200).json({
    message: "Success",
    user: {
      id: _id,
      username,
      email,
      usertype,
    },
  });
};


// is admin || !
exports.adminDashboard=(req,res)=>{
res.json({message:`Welcome admin, ${req.user.username}`})
}

// Common dashBoard
exports.commonDashboard=(req,res)=>{
res.json({message:`Welcome user,${req.user.username}---- I am a ${req.user.usertype}`})
}

// student Dashboard
exports.studentDashboard=(req,res)=>{
res.json({message:`Welcome user,${req.user.username}---- I am a ${req.user.usertype}`})
}

// logged out
exports.logoutUser=(req,res)=>{
res.clearCookie('token')
res.status(200).json({message:'Logged out successfully'})
}