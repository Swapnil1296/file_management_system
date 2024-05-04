const bcrypt = require("bcrypt");
const db = require("../config/dbConfig");
module.exports = {
  SignUpUser: async (userInfo) => {
   console.log(userInfo)
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the user already exists
        const existingUser = await db.query(
          "SELECT * FROM user_login WHERE email = $1 ",
          [userInfo.email]
        );

        if (existingUser.rows.length > 0) {
          throw new Error(
            "User already exists with this email address"
          );
        }

        // Insert the new user
        const newUser = await db.query(
          "INSERT INTO user_login (user_name,email,password) VALUES($1,$2,$3) RETURNING id, user_name, email ",
          [userInfo.user_name, userInfo.email, userInfo.password]
        );

        // Resolve with the newly created user
        const user = newUser.rows[0];
        resolve(user);
      } catch (error) {
        // Handle errors and reject with an appropriate message
        console.log("Error in SignUpUser=====>:", error.message);
        reject(error);
      }
    });
  },
  logInUser: async (email, password) => {

   
    return new Promise(async (resolve, reject) => {
      try {
        const userExists = await db.query(
          "SELECT * FROM user_login WHERE email = $1",
          [email]
        );

        if (userExists.rows.length === 0) {
          throw new Error("User not found");
        }

        // Compare the hashed password with the provided password using bcrypt.compare
        const isPasswordMatch = await bcrypt.compare(
          typeof password === "number" ? String(password) : password,
          userExists.rows[0].password
        );

        // If passwords match, resolve with the user details

        if (isPasswordMatch) {
          resolve(userExists.rows[0]);
        } else {
          // If passwords don't match, reject with an error
          throw new Error("Incorrect password or email");
        }
      } catch (error) {
        console.log("error in login=====>:", error.message);
        reject(error);
      }
    });
  },
};
