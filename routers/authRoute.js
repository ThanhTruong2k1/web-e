const express = require('express')
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
    createUser, 
    loginUserCrl, 
    getallUser, 
    getUser, 
    deleteUser, 
    updateUser,
    loginAdmin,
    handleRefreshToken,
    logout,
}= require('../controller/userCtrl')
router.post('/register',createUser);
router.post('/login',loginUserCrl);
router.get('/logout',logout);
router.get("/refresh", handleRefreshToken);
router.post('/loginAdmin',loginAdmin);

router.put('/:id',authMiddleware,isAdmin,updateUser);
router.get('/all-user',authMiddleware,isAdmin,getallUser);

router.get('/:id',authMiddleware,isAdmin, getUser);
router.delete('/:id',deleteUser);

module.exports=router;