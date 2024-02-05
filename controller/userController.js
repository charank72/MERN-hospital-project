const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const comparePassword = require("../utility/comparepass");
const createAccessToken = require("../utility/token");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, mobile, password, role } = req.body;

      //email
      const extEmail = await User.findOne({ email });
      const extMobile = await User.findOne({ mobile });

      //points the duplicate,any server reseponse erroe 409
      if (extEmail)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${email} already exsists`, success: false });

      if (extMobile)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${mobile} already exsists`, success: false });

      const encPass = await bcrypt.hash(password, 10); //encrypts the password into hash

      let data = await User.create({
        name,
        email,
        mobile,
        role,
        password: encPass,
      });
      //email subject
      // let subject="registration completed"
      // let msg="success"

      // let confirm_template=confirm_temp(name,email.subject,msg)

      // let emailRes=await mailConfig(email,subject,confirm_template)
      res
        .status(StatusCodes.ACCEPTED)
        .json({
          msg: "New user registered succesfully",
          user: data,
          success: true,
        });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message, success: false });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      //if login through email
      if (email) {
        let extEmail = await User.findOne({ email });
        if (!extEmail)
          return res
            .status(StatusCodes.CONFLICT)
            .json({ msg: `${email} is not registered`, success: false });

        //comparing the password(string,hash)
        let isMatch = await comparePassword(password, extEmail.password);
        if (!isMatch)
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: `password not matched`, success: false });

        let authToken = createAccessToken({ id: extEmail._id });
        //set the token in cookies one
        //TOKEN
        res.cookie("loginToken", authToken, {
          httpOnly: true,
          signed: true,
          path: "/api/user/token",
          maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res
          .status(StatusCodes.OK)
          .json({ msg: `login success(with email)`, success: true,authToken });
      }
      //if login through mobile
      // if (mobile) {
      //   let extMobile = await User.findOne({ mobile });
      //   if (!extMobile)
      //     return res
      //       .status(StatusCodes.CONFLICT)
      //       .json({ msg: `${mobile} number doesnt exsist`, success: false });

      //   //compare the password
      //   let isMatch = await comparePassword(password, extMobile.password);
      //   if (!isMatch)
      //     return res
      //       .status(StatusCodes.UNAUTHORIZED)
      //       .json({ msg: `passwords not matched`, success: false });
      //   let authToken = createAccessToken({ id: extMobile._id });
      //   //set the token in cookies user

      //   res.cookie("loginToken", authToken, {
      //     httpOnly: true,
      //     signed: true,
      //     path: "/api/user/token",
      //     maxAge: 1 * 24 * 60 * 60 * 1000,
      //   });

      //   res.status(StatusCodes.OK).json({
      //     msg: `login success(with mobile)`,
      //     success: true,
      //     authToken,
      //   });
      // }
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message, success: false });
    }
  },
  logout:async(req,res)=>{
    try{
      res.clearCookie("loginToken",{path:"/api/user/token"})
      /* 
           res.clearCookie("loginToken", { path: `/api/auth/token` });

      res
        .status(StatusCodes.OK)
        .json({ msg: `logout succesfull`, success: true });      
      */
      res.status(StatusCodes.OK).json({msg:'logout succesfull'})
    }catch(err){
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: err.message, success: false });
    }
  },
  authToken: async (req, res) => {
    try {
      //need to read to read login token from signed cookie
      const rToken = req.signedCookies.loginToken;

      if (!rToken)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: `token not available`, success: false });

      //validate user id or not

      jwt.verify(rToken, process.env.ACCESS_SECRET, (err, user) => {
        if (err)
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: `Unauthorized login`, success: false });

        //if valid
        res.status(StatusCodes.OK).json({ authToken: rToken, success: true });
      });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message, success: false });
    }
  },
  currentUser:async (req,res)=>{
    try{
      let single=await  User.findById({_id:req.userId}).select("-password");
      if(!single)
         return res.status(StatusCodes.NOT_FOUND)
         .json({msg:`user info not found`,success:false});
      res.status(StatusCodes.ACCEPTED).json({user:single,success:true})
    }catch(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message,success:false})
    }
  }
};
module.exports = userController;
