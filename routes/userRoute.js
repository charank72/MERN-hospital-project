const userController=require('../controller/userController')
const auth = require('../middleware/auth')
// const auth = require('../middleware/auth')

const route= require('express').Router()

route.post(`/register`,userController.register)
route.post(`/login`,userController.login)
route.get('/logout',userController.logout)
route.get('/token',userController.authToken)
route.get('/current/user',auth,userController.currentUser)

module.exports=route