const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper 
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// register
router.post(
    "/register",
    body("name")
    .isString()
    .withMessage("please enter a valid name")
    .withMessage("name should be between (10-20) character"),

    body("email").isEmail().withMessage("please enter a valid email!"),

    body("password")
      .isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        //  CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); 
        const checkingEmail = await query(
          "select * from  user where Email = ?",
          [req.body.email]
        );
        if (checkingEmail.length > 0) {
          return res.status(402).status(400).json({
            errors: [ { msg: "email already exists !"} ],
          });
        }
   
        // 3- PREPARE OBJECT USER TO -> SAVE
        const userObject = {
          name: req.body.name,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
          token: crypto.randomBytes(16).toString("hex"), 
        };
  
        // 4- INSERT USER OBJECT INTO DB
        await query("insert into user set ? ", userObject);
        delete userObject.password;
        res.status(200).json({user_created_successfully :userObject});

      }  catch (err) {
        console.log(err)
        res.status(500).json({ err: err });
      }
    }
  );


  //log in
  router.post(
    "/login",
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("password")
      .isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const user = await query("select * from user where Email = ?", [
          req.body.email,
        ]);
        if (user.length == 0) {
          return res.status(402).json({ms: "this email is not exists !" });
        }

        // 3- COMPARE HASHED PASSWORD
        const checkPassword = await bcrypt.compare( req.body.password, user[0].password );
        if (checkPassword) {
          delete user[0].password;
          res.status(200).json({data_updated_successfully:user[0]});
        } else {
         return  res.status(405).json({ms: "password is wrong "});
        }
        
      } catch (error) {
        res.status(500).json({ err: error });
      }
    }
  );

module.exports = router;