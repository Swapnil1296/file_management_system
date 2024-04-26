const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../helpers/errorHandler");
const userModal = require("../models/user.modals");

module.exports = {
  SignUpUser: async (req, res, next) => {
    try {
      const { user_name, email, password } = req.body;
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userInfo = {
        user_name,
        email,

        password: hashedPassword,
      };

      await userModal.SignUpUser(userInfo);

      res.status(200).json({
        status: 1,
        message: "User signed up successfully",

        user: {
          name: user_name,
          email: email,
        },
      });
    } catch (error) {
      next(errorHandler(400, error.message));
    }
  },
  logInUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userModal.logInUser(email, password);
      const token = jwt.sign(
        { userId: user.id, email: email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Token expires in 1 hour
        }
      );
      if (user !== null || user !== "") {
        res.cookie("file_system", token, {
          httpOnly: false,
        });
        res.status(200).json({
          status: 1,
          message: "User logged in successfully",
          token: token,
          user: {
            name: user.user_name,
            email: user.email,
          },
        });
      } else {
        res.status(400).json({
          status: 0,
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      console.log("error while login====>", error.message);
      next(errorHandler(400, error.message));
    }
  },
};
