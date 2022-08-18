 require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const jwt_secret = process.env.SECRET_KEY;

// Create a user "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check if the user already exists
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      //  Password Hashing
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, jwt_secret);
      // send token as response
      res.json({ token });

      // res.json(user);

      //Catch errors
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error Occured");
    }
  }
);

// Login a user  POST:/api/auth/login

router.post('/login',[

  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
 
], async(req,res)=>{
   // Finds the validation errors in this request and wraps them in an object with handy functions
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   const {email,password} = req.body;
   try {
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "Please 1 try to login with correct credentials" });
    }
    
    const checkPassword = bcrypt.compare(password,user.password);

    if(!checkPassword) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    // If both credentals are correct then send the payload data
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, jwt_secret);
    res.json({token})
    
   } catch (error) {
    console.error(error.message);
      res.status(500).send("Error Occured");
   }

})



module.exports = router;
