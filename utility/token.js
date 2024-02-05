/* const jwt=require('jsonwebtoken')

//to generate login token

const createAccessToken =(userid)=>{

//jwt.sign(id,secret,optionals) expires =
  return jwt.sign(userid,process.env.ACCESS_SECRET,{expiresIn:'1d'})
}

module.exports =createAccessToken */

const jwt = require("jsonwebtoken");

const createAccessToken = (userid) => {
  return jwt.sign(userid, process.env.ACCESS_SECRET, { expiresIn: "1d" });
};

module.exports = createAccessToken;
