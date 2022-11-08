const User = require('../Models/User.Model')
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// User Registration
exports.addUser = async (req, res) => {
    try {
      const findEmail = await User.find({
        Email: req.body.Email,
      });
      const findUserName = await User.find({ Username: req.body.Username });
  
      const validationSchema = Joi.object({
        Username: Joi.string().min(5).required(),
        Firstname: Joi.string().min(3).required(),
        Lastname: Joi.string().required(),
        Email: Joi.string().min(8).required().email(),
        Password: Joi.string()
          .min(6)
          .required()
          .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      });
  
      const { error } = validationSchema.validate(req.body);
      if (error) return res.status(400).send({ message: error });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.Password, salt);
  
      if (findEmail.length >= 1 && findUserName.length >= 1) {
        return res
          .status(403)
          .send({ message: "Email And Username is already existed " });
      } else if (findEmail.length >= 1) {
        return res.status(403).send({ message: "Email is already existed" });
      } else if (findUserName.length >= 1) {
        return res.status(403).send({ message: "Username is already existed" });
      } else {
        const user = new User({
          Username: req.body.Username,
          Firstname: req.body.Firstname,
          Lastname: req.body.Lastname,
          Email: req.body.Email,
          Password: hashedPassword,
        });
  
        const saveUser = await user.save();
        return res.status(200).send(saveUser);
      }
    } catch (err) {
      return res.status(400).send(err.message);
    }
  };


// User Login and it will give you a token.

exports.userLogin = async (req, res) => {
    try {
      const validationLogin = Joi.object({
        Email: Joi.string().min(6).required(),
        Password: Joi.string().min(6).required(),
      });
  
      // Request Validations
      const { error } = validationLogin.validate(req.body);
      if (error)
        return res.status(400).send({
          message: error.details[0].message,
          status: "none",
          statusCode: 400,
        });
  
      // Check if username exists
      const user = await User.findOne({
        Email: req.body.Email,
      });
      if (!user)
        return res.status(409).send({
          message: `"Username or Password is wrong"`,
          status: "none",
          statusCode: 409,
        });
      const validPass = await bcrypt.compare(
        req.body.Password,
        user.Password
      );
      if (!validPass)
        return res.status(403).send({
          message: `"Invalid Password or Email"`,
          status: "none",
          statusCode: 403,
        });
  
      // Create and assign token
      const payload = {
        _id: user._id,
        Email: user.Email,
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).header("auth-token", token).send({
        token: token,
        _id: user._id,
        logged_in: "Yes",
        message: `User verified`,
        status: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, status: 400 });
    }
  };