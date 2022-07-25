const express= require("express")
const router= express.Router()
const middleware = require("../middleware/auth")

const userController = require("../controllers/userController")

/*********************For User**************************************************************/
router.post('/register', userController.userRegister);
router.post("/login",userController.loginUser)
router.get("/user/:userId/profile",middleware,userController.getUserProfile)






// If Invalid API requested.
router.all("/**", function (req, res) {
    res.status(400).send({
      status: false,
      message: "INVALID END-POINT: The API You requested is NOT available.",
    });
  });

module.exports = router;