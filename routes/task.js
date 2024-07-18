const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper 
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const authorized = require("../middleware/authorize");


// create task
router.post(
   "", authorized,
    body("descriprion")
    .isString()
    .withMessage(" descriprion  should be a string "),
  
    body("shared_option")
    .isString()
    .withMessage(" shared option should be a string "),

    body("type")
    .isString()
    .withMessage(" type should be a string "),

    body("category_name")
    .isString()
    .withMessage(" category_name should be a string "),
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const query = util.promisify(conn.query).bind(conn);
        const categoryObj=await query("select * from category where cat_name=? and user_id=?",[req.body.category_name ,res.locals.user.id]);
        if (!categoryObj[0]) {
          return res.status(404).json({ ms: " you doesnot have category with this name enter a valid category name " });
        }     
        
        // 3- PREPARE taskObject object
        const taskObject = {
         task_body:req.body.descriprion,
         shared_option:req.body.shared_option,
         type:req.body.type,
         user_id:res.locals.user.id ,
         category_id:categoryObj[0].id
      };
    // 4 - INSERT taskO INTO DB
   
    await query("insert into task set ? ",  taskObject);
   return res.status(200).json({ms:" task created successfully !"});
      } catch (err) {
       
        res.status(500).json(err);
      }});
  //-------------------------------------------------------
//     // UPDATE task 
router.put(
  "/:id", // params
  authorized,
  body("descriprion")
  .isString()
  .withMessage(" descriprion  should be a string "),

  body("shared_option")
  .isString()
  .withMessage(" shared option should be a string "),

  body("type")
  .isString()
  .withMessage(" type should be a string "),

  body("category_name")
  .isString()
  .withMessage(" category_name should be a string "),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF task EXISTS OR NOT
      const task = await query("select * from task where id = ?", [
        req.params.id,
      ]);
      if (!task[0]) {
        return res.status(404).json({ ms: "task not found !" });
      }     
      const categoryObj=await query("select * from category where cat_name=? and user_id=?",[req.body.category_name ,res.locals.user.id]);
      if (!categoryObj[0]) {
        return res.status(404).json({ ms: " you doesnot have category with this name enter a valid category name " });
      }  
      // 3- PREPARE task OBJECT
      const taskObject = {
        task_body:req.body.descriprion,
        shared_option:req.body.shared_option,
        type:req.body.type,
        user_id:res.locals.user.id ,
        category_id:categoryObj[0].id
     };

      // 4- UPDATE task
      await query("update task set ? where id = ?", [taskObject, req.params.id]);
      res.status(200).json({msg: "task updated successfully"});
    } catch (err) {
    console.log(err);
      res.status(500).json(err);
    }
  })
;
// //-------------------------------------------------------------------
// DELETE category
router.delete(
  "/:id", // params
  authorized,
  async (req, res) => {
    try {
      // 1- CHECK IF category EXISTS OR NOT
      const query = util.promisify(conn.query).bind(conn);
      const task = await query("select * from task where id = ?", [
        req.params.id,
      ]);
      if (!task[0]) {
        res.status(404).json({ ms: "task not found !" });
      }
      // 2- REMOVE category 
      await query("delete from task where id = ?", [task[0].id]);
      res.status(200).json({msg: "task delete successfully"});
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
//--------------------------------------------
// LIST  [ADMIN, USER]
router.get("",authorized, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const task = await query(`select * from task `);
  if (!task[0]) {
    return res.status(401).json({
   msg: "you doesnot cccccreate any task!"});
  }
  const result=[];
  task.forEach(element => {
    if(element.shared_option==="public"||element.user_id ===res.locals.user.id )
     result.push(element);  
  });

  return res.status(200).json(result);
});


module.exports = router;