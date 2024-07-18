const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const authorized = require("../middleware/authorize");
const util = require("util"); // helper 


router.get(
    "/byCategoryName",authorized,
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const sort = await query("select * from category c join task t on c.id=t.category_id where  t.user_id=?",[res.locals.user.id]);
  
          if ( !sort[0]) {
            return res.status(401).json({
              errors: [ 
                {
                  msg: " no match !",
                },
              ],
            });
          }
          let result=[];
          result=sort;
  result.sort((a,b)=>{
    if(a.cat_name<b.cat_name) return -1;
    if(a.cat_name>b.cat_name) return 1;
    return 0;

  })
          return res.status(200).json(result);
      }  catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
      }
    }
  );



  router.get(
    "/bySharedOption",authorized,
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const sort = await query("select * from category c join task t on c.id=t.category_id where t.user_id=?",[res.locals.user.id]);
  
          if ( !sort[0]) {
            return res.status(401).json({
              errors: [ 
                {
                  msg: " no match !",
                },
              ],
            });
          }
          let result=[];
          result=sort;
  result.sort((a,b)=>{
    if(a.shared_option<b.shared_option) return -1;
    if(a.shared_option>b.shared_option) return 1;
    return 0;

  })
          return res.status(200).json(result);
      }  catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
      }
    }
  );
  
module.exports = router;