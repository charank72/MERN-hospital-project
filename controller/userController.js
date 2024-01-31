const { StatusCodes } = require("http-status-codes");
const bcrypt = require('bcryptjs');
const User = require("../model/userModel");
const comparePassword = require("../utility/comparepass");



const userController={

  register: async (req, res) => {
    try {
      const { name, email, mobile, password } = req.body;

      //email
      const extEmail = await User.findOne({ email });
      const extMobile = await User.findOne({ mobile });

      //points the duplicate,any server reseponse erroe 409
      if (extEmail)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${email} already exsists`,success:false });

      if (extMobile)
        return res
          .status(StatusCodes.CONFLICT)
          .json({ msg: `${mobile} already exsists` ,success:false});

      const encPass = await bcrypt.hash(password, 10); //encrypts the password into hash

      let data = await User.create({
        name,
        email,
        mobile,
        password: encPass,
      });
      //email subject
      // let subject="registration completed"
      // let msg="success"

      // let confirm_template=confirm_temp(name,email.subject,msg)

      // let emailRes=await mailConfig(email,subject,confirm_template)
      res
        .status(StatusCodes.ACCEPTED)
        .json({ msg: "New user registered succesfully", user: data ,success:true});
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: err.message,success:false });
    }
  },
  
  login:async(req,res)=>{
    try{
      const {email,mobile,password}=req.body

      //email
      if(email){
        let extEmail=await User.findOne({email})
        if(!extEmail)
         return res.status(StatusCodes.UNAUTHORIZED).json({msg:`${extEmail} is not registered`})
      //comparing pass
        let isMatch=await comparePassword(password,extEmail.password)
        if(!isMatch)
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: `password not matched`,success:false  });
      res.status(StatusCodes.ACCEPTED).json({msg:'login succesfull with email'})

      }
    }catch(err){
      return res.json({msg:err.message})
    }
  }
}
module.exports=userController
