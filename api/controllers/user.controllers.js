const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../helpers/errorHandler");
const xlsx = require("xlsx");
const userModal = require("../models/user.modals");
const db = require("../config/dbConfig");

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

      const result = await userModal.SignUpUser(userInfo);

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
  SignInViaExcel: async (req, res, next) => {
    try {
      const workbook = xlsx.readFile(req.file.path);

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      for (const row of data) {
        const email = row.email;
        const password = row.password;
        if (email === undefined || email === "" || email === null) {
          next(errorHandler(403, "Email is required !"));
        } else if (password === undefined || password === null) {
          next(errorHandler(403, "Password is required !"));
        } else {
          const result = await userModal.logInUser(email, password);

          if (result !== "") {
            const token = jwt.sign(
              { userId: result.id, email: email },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h", // Token expires in 1 hour
              }
            );
            res.cookie("file_system", token, {
              httpOnly: false,
            });
            res.status(200).json({
              status: 1,
              message: "User logged in successfully",
              token: token,
              user: {
                name: result.user_name,
                email: result.email,
              },
            });
          } else {
            res.status(400).json({
              status: 0,
              message: "Invalid email or password",
            });
          }
        }
      }
    } catch (error) {
      console.error("error while excel login====>", error.message);
      next(errorHandler(400, error.message));
    }
  },
  SignUpViaExcel: async (req, res, next) => {
    try {
      const workbook = xlsx.readFile(req.file.path);

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      for (const row of data) {
        if (row.email === null || row.email === "" || row.email === undefined) {
          next(errorHandler(403, "Email is required !"));
        } else if (
          row.user_name === null ||
          row.user_name === "" ||
          row.user_name === undefined
        ) {
          next(errorHandler(403, "username is required !"));
        } else if (
          row.password === null ||
          row.password === "" ||
          row.password === undefined
        ) {
          next(errorHandler(403, "password is required !"));
        } else if (String(row.password).length < 6) {
          next(
            errorHandler(403, "password must be atleast 6 characters long!")
          );
        } else {
          const user_name = row.user_name;
          const email = row.email;
          const password = String(row.password);
          const hashedPassword = await bcrypt.hash(password, 10);
          const userInfo = {
            user_name,
            email,

            password: hashedPassword,
          };

          const login = await userModal.SignUpUser(userInfo);
          if (login && login !== "") {
            res.status(200).json({
              status: 1,
              message: "User signed up successfully",
              login: {
                name: user_name,
                email: email,
              },
            });
          }
        }
      }
    } catch (error) {
      console.log("error while excel singup==>", error.message);
      next(errorHandler(400, error.message));
    }
  },
};
