const conn = require("../../../../config/database");
const userValidators = require("./validators")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const saltRounds = 10

const userController ={}


//Registor USER
userController.addUser = async (req, res) => {
  const { error } = userValidators.addUserSchema.validate(req.body);
  // console.log(error)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

    try {
      const { user_name, email, password } = req.body;
     
      const hashPassword = await bcrypt.hash(password, saltRounds);
      let queryString = `insert into users
        (user_name,email,password)
         values (?, ?, ?)`;
      const [result] = await conn
        .promise()
        .execute(queryString, [user_name, email, hashPassword]);
  
      res.status(201).send({
        statusCode: 201,
        message: "User added successfully",
        result,
      });
    } catch (error) {
      // console.log(error);
      res.status(500).send({
        statusCode:500,
        message: "Error while adding user",
        error,
      });
    }
  };


userController.loginUser = async (req, res) => {
  const { error } = userValidators.loginUserSchema.validate(req.body);
  // console.log(error)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { email, password } = req.body;
   
    let queryString = `SELECT email,password from users where email =? `;
    const [result] = await conn.promise().execute(queryString, [email]);
    // console.log([result]);

    if (result.length === 0) {
      res.status(404).send({
        statusCode:400,
        message: "User not found",
      });
    }
    const hashedPassword = result[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      res.status(400).send({
        statusCode:400,
        message: "Incorrect password",
      });
    }
    const token = jwt.sign({ user_id: result[0].id }, "test");
    res.status(200).send({
      statusCode:200,
      message: "Login Successfully",
      token,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      statusCode:500,
      message: "Error while getting user",
      error,
    });
  }
};



module.exports = userController
