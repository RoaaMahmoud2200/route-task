const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper 
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const authorized = require("../middleware/authorize");


// create category
router.post(
   "", authorized,
    body("name")
    .isString()
    .withMessage(" category name should be a string "),
  
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
     
        // 3- PREPARE TRIP object
        const categoryObject = {
          cat_name:req.body.name ,
            user_id:res.locals.user.id };
    // 4 - INSERT tript INTO DB
    const query = util.promisify(conn.query).bind(conn);
    await query("insert into category set ? ",  categoryObject);
   return res.status(200).json({ms:" category created successfully !"});
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  );
  //-------------------------------------------------------
    // UPDATE category 
router.put(
  "/:id", // params
  authorized,
  body("name")
 .isString()
  .withMessage("please enter a valid name"),

  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF category EXISTS OR NOT
      
      const category = await query("select * from category where id = ?", [
        req.params.id,
      ]);
      if (!category[0]) {
        return res.status(404).json({ ms: "category not found !" });
      }     
      // 3- PREPARE job OBJECT
      const categoryObject = {
          cat_name:req.body.name ,
          user_id:res.locals.user.id };

      // 4- UPDATE category
      await query("update category set ? where id = ?", [categoryObject, req.params.id]);
      res.status(200).json({msg: "category  updated successfully"});
    } catch (err) {
      res.status(500).json(err);
    }
  })
;
//-------------------------------------------------------------------
// DELETE category
router.delete(
  "/:id", // params
  authorized,
  async (req, res) => {
    try {
      // 1- CHECK IF category EXISTS OR NOT
      const query = util.promisify(conn.query).bind(conn);
      const category = await query("select * from category where id = ?", [
        req.params.id,
      ]);
      if (!category[0]) {
        res.status(404).json({ ms: "category not found !" });
      }
      // 2- REMOVE category 
      await query("delete from category where id = ?", [category[0].id]);
      res.status(200).json({msg: "category delete successfully"});
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
//--------------------------------------------
// LIST  [ADMIN, USER]
router.get("",authorized, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const category = await query(`select * from category where user_id=?`,res.locals.user.id );

  if (!category[0]) {
    return res.status(401).json({
      errors: [{msg: "you doesnot create any category!"}] });
  }
  res.status(200).json(category);
});


module.exports = router;