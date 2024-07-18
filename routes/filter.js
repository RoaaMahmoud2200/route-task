const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const authorized = require("../middleware/authorize");
const util = require("util"); // helper 

//search with word    
router.get(
  "/byCategoryName",authorized,
  body("keyword")
  .isString()
  .withMessage("please enter a valid search"),

  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
      const filtering = await query("select * from category c join task t on c.id=t.category_id where cat_name = ? and t.user_id=?",[req.body.keyword,res.locals.user.id]);

        if ( !filtering[0]) {
          return res.status(401).json({
            errors: [ 
              {
                msg: " no match !",
              },
            ],
          });
        }
        return res.status(200).json(filtering);
    }  catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
);

router.get(
    "/bySharedOption",authorized,
    body("shared_option")
    .isString()
    .withMessage("please enter a valid search"),
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const filtering = await query("select * from category c join task t on c.id=t.category_id where shared_option = ? and t.user_id=?",[req.body.shared_option,res.locals.user.id]);
  
          if ( !filtering[0]) {
            return res.status(401).json({
              errors: [ 
                {
                  msg: " no match !",
                },
              ],
            });
          }
        
          return res.status(200).json(filtering);
      }  catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
      }
    }
  );
module.exports = router;